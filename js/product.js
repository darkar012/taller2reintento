import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let productG = {};
let userLogged;
let cart;
let productId;

const getProduct = async () => {
    const url = window.location.search;
    const searchParas = new URLSearchParams(url);
    productId = searchParas.get("id").replace('"', "");

    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    productSection.classList.add("loaded");
    loader.classList.add("loaded");

    loadProductInfo(data, productId);
};

const productSection = document.getElementById("oneProduct");
const loader = document.getElementById("loader");
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productRating = document.getElementById("productRating");
const productPrice = document.getElementById("productPrice");
const productBreadscrumb = document.getElementById("productBreadscrumb");
const productGallery = document.getElementById("productGallery");
const productHighlights = document.getElementById("productHighlights");
const productLessImages = document.getElementById("productLessImages");
const productColors = document.getElementById("productColors");
const productBuy = document.getElementById("buyNow");
const productCart = document.getElementById("addCart");

const getMyCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
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
    getProduct();
});

const loadProductInfo = (product, id) => {
    productBreadscrumb.innerText = product.name;
    productName.innerText = product.name;
    productRating.innerText = `Rating: ${product.rating}`;
    productPrice.innerText = `${formatCurrency(product.price)}`;
    productImage.setAttribute("src", product.images[0]);

    const isAdded = cart.find((productCart) => productCart.id === id);
    if (isAdded) {
        productCart.innerHTML = `Product Added to Cart`;
        productCart.disabled = true;
    } else {
        productCart.innerHTML = `Add to Cart`;
        productCart.disabled = false;
    }

    createHighlights(product.highlights);
    createGallery(product);
    createLessImages(product);
    createSelectColors(product, product.colors);

    const view3D = document.getElementById("renderer");

    if (product.is3D) {
        view3D.style.display = "block"
        
        view3D.setAttribute("href", `./object3d.html?id=${productId}"`);
    } else if (!product.is3D || product.is3D === null || product.is3D === undefined){
        view3D.style.display = "none"
    }

    productG = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        description: product.description,
    };
    AOS.init({
        offset: 200,
        duration: 1000
    });
};

const createGallery = (product) => {
    const gallery = document.createElement("div");
    gallery.className = "galleryImages"
    for (let i = 1; i < 5; i++) {
        gallery.innerHTML += `<div class="productImages" data-aos="flip-left" data-aos-mirror="true" ><img  src="${product.images[i]}"></div>`;
    }

    productGallery.appendChild(gallery);
    const productGalleryImages = document.querySelector(
        ".productItem > #productGallery > div"
    );

    productGalleryImages.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG") {
            const imageSource = e.target.currentSrc;
            productImage.setAttribute("src", imageSource);
        }
    });

};

const createHighlights = (texts) => {
    const highlights = document.createElement("ul");
    texts.forEach((highlight) => {
        highlights.innerHTML += `<li class="productItem__highlight">${highlight}</li>
        `;
    });
    highlights.innerHTML += `<a class="render" id="renderer" href="">3D View</a>`
    productHighlights.appendChild(highlights);
};

const createLessImages = (product) => {
    const lessImages = document.createElement("div");
    for (let i = 5; i < 7; i++) {
        lessImages.innerHTML += `<img data-aos="flip-right" src="${product.images[i]}">`;
    }
    productLessImages.appendChild(lessImages);
};

const createSelectColors = (product, colors) => {
    const select = document.createElement("select");
    select.className = "select discounts";
    if (product.isColor) {
        colors.forEach((color) => {
            select.innerHTML += `<option value= "${color}">${color}</option>`;
        });
    } else {
        select.innerHTML = "";
    }

    productColors.appendChild(select);
};

const addProductsToCart = async (products) => {
    await setDoc(doc(db, "cart", userLogged.uid), {
        products,
    });
};

productBuy.addEventListener("click", (e) => {
    e.preventDefault();
    const productAdded = {
        id: productG.id,
        name: productG.name,
        image: productG.image,
        price: productG.price,
        description: productG.description,
    };

    if (userLogged) {
        cart.push(productAdded);
        addProductsToCart(cart);
    } else {
        cart.push(productAdded);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    window.location = "cart.html";
});

productCart.addEventListener("click", (e) => {
    e.preventDefault();
    const productAdded = {
        id: productId,
        name: productG.name,
        image: productG.image,
        price: productG.price,
        description: productG.description,
    };
    const added = cart.find((productCart) => productCart.id === id);

    if (added) {
        productCart.innerHTML = "Product Added to Cart";
        productCart.disabled = true;
    } else {
        if (userLogged) {
            cart.push(productAdded);
            addProductsToCart(cart);
        } else {
            cart.push(productAdded);
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        productCart.innerHTML = "Product Added to Cart";
        productCart.disabled = true;
    }

});
