import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const productSection = document.getElementById("productGallery");
let products = [];
let userLogged = null;
let cart = [];

let isFav = false;


const getAllProducts = async () => {
    const collectionRef = collection(db, "products");
    const { docs } = await getDocs(collectionRef);

    const firebaseProducts = docs.map((doc) => {
        return {
            ...doc.data(),
            id: doc.id,
        };
    });
    firebaseProducts.forEach((product) => {
        productTemplate(product);
    });
    products = firebaseProducts;
};

const getMyCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

const addProductsToCart = async (products) => {
    await setDoc(doc(db, "cart", userLogged.uid), {
        products,
    });
};

const getFirebaseCart = async (userId) => {
    const docRef = doc(db, "cart", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {
        products: []
    };
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const result = await getFirebaseCart(user.uid);
        cart = result.products;

        userLogged = user;
    } else {
        cart = getMyCart();
    }
    getAllProducts();
    AOS.init({
        delay:500,
        duration:2000,
        mirror:true,
        anchorPlacement:"top"
    });
});



const productTemplate = (item) => {
    const productDiv = document.createElement("div");
    const product = document.createElement("a");

    let tagHtmlDiscount;
    let tagHtmlStock;
    let addedToCart;
    let isAdded;

    productDiv.className = "productDiv";
    
    productDiv.setAttribute ("data-aos","fade-up");

    if (cart !== undefined) {
        isAdded = cart.find((productCart) => productCart.id === item.id);
    } else {
        cart = getMyCart();
        isAdded = cart.find((productCart) => productCart.id === item.id);
    }

    if (item.is10discount) {
        tagHtmlDiscount = `<span class="product__tag product__tag--discount">10% OFF</span>`;
    } else if (item.is20discount) {
        tagHtmlDiscount = `<span class="product__tag product__tag--discount">20% OFF</span>`;
    } else if (item.is50discount) {
        tagHtmlDiscount = `<span class="product__tag product__tag--discount">50% OFF</span>`;
    } else {
        tagHtmlDiscount = `<span></span>`;
    }

    if (!item.isStock) {
        tagHtmlStock = `<span class="product__tag product__tag--NoStock">NO STOCK</span>`;
    } else {
        tagHtmlStock = `<span></span>`;
    }

    if (isAdded) {
        addedToCart = `<img src="./images/add.png" class="addCart" id=${"s" + item.relevance
            }>`;
    } else {
        addedToCart = `<img src="./images/notAdd.png" class="addCart" id=${"s" + item.relevance
            }>`;
    }

    if (item.isLarge) {
        product.className = "productLarge products";
        product.setAttribute("href", `./product.html?id=${item.id}"`);
        product.innerHTML = `
        <img src=${item.image} alt="" class="productLarge__image">
        <h5 class="productLarge__title">${item.name}</h5>
        
        <img src="./images/noFav.png" class="productLarge__favorite" id=${item.name
            }>
        <p class="productLarge__description">${item.description}</p>
        <h5 class="productLarge__price">${formatCurrency(item.price)}</h5>
    `;
        productDiv.innerHTML = `${addedToCart}`;
    } else {
        product.className = "product products";
        product.setAttribute("href", `./product.html?id=${item.id}"`);
        product.innerHTML = `
        <img src=${item.image} alt="" class="product__image">     
        ${tagHtmlDiscount}
        ${tagHtmlStock}
        <img src="./images/noFav.png" class="product__favorite" id=${item.name}>
        <h5 class="product__title">${item.name}</h5>
        <p class="product__description">${item.description}</p>
        <h5 class="product__price">${formatCurrency(item.price)}</h5>
    `;
        productDiv.innerHTML = `${addedToCart}`;
    }

    productDiv.appendChild(product);
    productSection.appendChild(productDiv);

    const productCarButton = productDiv.querySelector(".addCart");

    productCarButton.addEventListener("click", (e) => {
        e.preventDefault();
        const added = cart.find((productCart) => productCart.id === item.id);
        if (added) {

            if (userLogged) {
                addProductsToCart(cart);
            } else {
                cart = getMyCart();
                const newCart = cart.filter((product) => product.id !== item.id);
                localStorage.setItem("cart", JSON.stringify(newCart));
            }
            productCarButton.src = "./images/notAdd.png";
            productCarButton.setAttribute("disabled", false);
        } else {
            const productAdded = {
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                description: item.description,
            };
            if (userLogged) {
                cart.push(productAdded);
                addProductsToCart(cart);
            } else {
                cart = getMyCart();
                cart.push(productAdded)
                localStorage.setItem("cart", JSON.stringify(cart));
            }

            productCarButton.src = "./images/add.png";
            productCarButton.setAttribute("disabled", true);
        }
    });
};

const arrow1 = document.getElementById("arrow1");
const arrow2 = document.getElementById("arrow2");
const arrow3 = document.getElementById("arrow3");
const filterByDiscount = document.getElementById("discounts");
const filterByType = document.getElementById("type");

filterByDiscount.addEventListener("click", () => {
    arrow2.style.transform = "rotate(+135deg)";
    arrow2.style.top = "1px";
});

filterByDiscount.addEventListener("change", (e) => {
    loadProducts();
    discountFirst += 1;
});

filterByType.addEventListener("click", () => {
    arrow1.style.transform = "rotate(+135deg)";
    arrow1.style.top = "1px";
});

filterByType.addEventListener("change", (e) => {
    loadProducts();
});

const orderBySelect = document.getElementById("orderBy");

orderBySelect.addEventListener("change", (e) => {
    loadProducts();
});

const cartShop = document.getElementsByClassName("addCart");

const loadProducts = () => {
    const type = filterByType.value || "";
    const order = orderBySelect.value || "";

    const discount = filterByDiscount.value || "";

    productSection.innerHTML = "";

    let filteredProductsByType = products;

    if (type === "All products" || type === "") {
        filteredProductsByType;
    } else {
        filteredProductsByType = products.filter(
            (product) => product.type === type
        );
    }

    if (discount === "All products" || discount === "") {
        filteredProductsByType;
    } else {
        if (discount === "Stock" || discount === "noStock") {
            filteredProductsByType = filteredProductsByType.filter(
                (product) => product.stock === discount
            );
        } else {
            filteredProductsByType = filteredProductsByType.filter(
                (product) => product.discount === discount
            );
        }
    }

    if (order === "PriceLow") {
        filteredProductsByType = filteredProductsByType.sort(
            (a, b) => a.price - b.price
        );
    } else if (order === "PriceHigh") {
        filteredProductsByType = filteredProductsByType.sort(
            (a, b) => b.price - a.price
        );
    } else if (order === "AlfabeticD") {
        filteredProductsByType = filteredProductsByType.sort(function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    } else if (order === "AlfabeticA") {
        filteredProductsByType = filteredProductsByType.sort(function (a, b) {
            if (a.name > b.name) {
                return -1;
            }
            if (a.name < b.name) {
                return 1;
            }
            return 0;
        });
    } else {
        filteredProductsByType = filteredProductsByType.sort(
            (a, b) => a.relevance - b.relevance
        );
    }

    filteredProductsByType.forEach((product) => {
        productTemplate(product);
    });

    for (let i = 0; i < cartShop.length; i++) {
        const element = cartShop[i];
        addSelection(element);
    }

};

const favProducts = document.getElementsByClassName("product__favorite");
const favProductsLarge = document.getElementsByClassName(
    "productLarge__favorite"
);

const favoriteSelection = (element) => {
    element.addEventListener("click", () => {
        if (isFav) {
            element.src = "./images/noFav.png";
            isFav = false;
        } else {
            element.src = "./images/fav.png";
            isFav = true;
        }
    });
};

for (let i = 0; i < favProductsLarge.length; i++) {
    const element = favProductsLarge[i];
    favoriteSelection(element);
}

for (let i = 0; i < favProducts.length; i++) {
    const element = favProducts[i];
    favoriteSelection(element);
}