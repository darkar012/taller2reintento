import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc, addDoc, collection,deleteDoc

} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const cartSection = document.getElementById("cart");
const totalSection = document.getElementById("total");

const checkoutForm = document.getElementById("checkout");


let total = 0;
let cart = [];
let userLogged = {};

const getMyCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

//const cart = getMyCart()

const addProductsToCart = async (products) => {
    await setDoc(doc(db, "cart", userLogged.uid), {
        products,
    });
};

const removeProduct = async (productId) => {
    if (userLogged) {

        const newCart = cart.filter(product => product.id !== productId);
        addProductsToCart(newCart);
        const result = await getFirebaseCart(userLogged.uid);
        cart = result.products;
        renderMyCar(cart);
    } else {
        const cart = getMyCart()
        const newCart = cart.filter(product => product.id !== productId);
        localStorage.setItem("cart", JSON.stringify(newCart));
        renderMyCar(newCart);
    }

}



const renderMyProduct = (product) => {
    const newProduct = document.createElement("li");
    newProduct.className = "productCart";
    newProduct.innerHTML = `
    <img src="${product.image}" alt="" class="productCart__thumbnail">
            <div class="productCart__info">
            <div class="productCart__nameDescription">
                <h2 class="productCart__name">${product.name}</h2>
                <h2 class="productCart__description">${product.description}</h2>
                </div>
                <h3 class="productCart__price">${formatCurrency(product.price)}</h3>
            </div>
            <input type="number" name="quantity" class="productCart__quantity" id="quantity" min="1" value="1">
            <button class="productCart__remove">X<button>
    `
    cartSection.appendChild(newProduct);


    newProduct.addEventListener("click", e => {
        if (e.target.tagName == "BUTTON") {
            removeProduct(product.id);
        }
    })
}

const getFirebaseCart = async (userId) => {
    const docRef = doc(db, "cart", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : { products: [] };
};

const renderMyCar = (cart) => {
    
    //const cart = getMyCart();
    cartSection.innerHTML = "";
    total = 0;
    cart.forEach(product => {
        total += product.price;
        renderMyProduct(product);
    })
    totalSection.innerHTML = `${formatCurrency(total)}`
}

const deleteCart = async()=>{
    try {
        await deleteDoc(doc(db, "cart", userLogged.uid));
        renderMyCart([]);
        total = 0;
        console.log("Carrito de compras actualizado...");
    } catch(e) {
        console.log(e);
    }
};

const createOrder = async (userFields) => {
    try {
        const order = await addDoc(collection(db, "orders"), {
            ...userFields,
            products: cart,
            total,
            email: userLogged.email,
            status: "pending"
        });
        alert(`Thanks for choice us, yout order with ID:${order.id} has been registered`);
        deleteCart();
    } catch (e) {
        console.log(e)
    }

};

checkoutForm.addEventListener("click", e => {
    e.preventDefault;
    if (e.target.tagName == "BUTTON") {
        const name = checkoutForm.name.value;
        const city = checkoutForm.city.value;
        const address = checkoutForm.address.value;
        const description = checkoutForm.description.value;
        const payment = checkoutForm.payment.value;

        const userFields = {
            name, city, address, description,payment
        }
        if (cart.length) {
            createOrder(userFields);
        } else {
            alert("Choice some products...")
        }

    }

});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const result = await getFirebaseCart(user.uid);
        cart = result.products;
        renderMyCar(cart)
        userLogged = user;
    } else {
        cart = getMyCart();
        renderMyCar(cart)
    }


});