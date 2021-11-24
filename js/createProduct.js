import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-storage.js";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const createProductForm = document.getElementById("formAddProduct");

const imageUploadedReference = async (file) => {
    const storageRef = ref(storage, `products/images/${file.name}`);
    return await uploadBytes(storageRef, file);

}

const uploadMainImage = async (file) => {
    try {
        const image = await imageUploadedReference(file);
        return getDownloadURL(ref(storage, image.ref.fullPath))
    } catch (error) {
        console.log(error);
    }

}

const uploadGallery = (files) => {
    const images = files.map(async (file) => {
        const image = await imageUploadedReference(file);
        return getDownloadURL(ref(storage, image.ref.fullPath));
    });
    return images;

}
const createProduct = async () => {

    let id;
    let relevance;


    const name = createProductForm.name.value;
    const price = createProductForm.price.value;
    const rating = createProductForm.rating.value;
    const description = createProductForm.description.value;
    const type = createProductForm.type.value;
    const discount = createProductForm.discount.value;

    const highlight1 = createProductForm.highlight1.value;
    const highlight2 = createProductForm.highlight2.value;
    const highlight3 = createProductForm.highlight3.value;
    const highlight4 = createProductForm.highlight4.value;
    const highlight5 = createProductForm.highlight5.value;

    const highlights = [
        highlight1,
        highlight2,
        highlight3,
        highlight4,
        highlight5,
    ];

    const isLarge = false;
    const isStock = true;
    const Stock = "stock";

    const color1 = createProductForm.color1.value;
    const color2 = createProductForm.color2.value;
    const color3 = createProductForm.color3.value;
    const color4 = createProductForm.color4.value;

    const colors = [color1, color2, color3, color4];
    let isColor;

    for (let i = 0; i < colors.length; i++) {
        if (colors[i] == undefined || colors[i] === "") {
            removeItemFromArr(colors, colors[i]);
        }
    }

    if (colors.length == 0) {
        isColor = false;
    } else {
        isColor = true;
    }

    for (let i = 0; i < highlights.length; i++) {
        if (highlights[i] == undefined || highlights[i] === "") {
            removeItemFromArr(highlights, highlights[i]);
        }
    }

    let is10discount;
    let is20discount;
    let is50discount;

    if (discount == "10Discount") {
        is10discount = true;
        is20discount = false;
        is50discount = false;
    } else if (discount == "20Discount") {
        is10discount = false;
        is20discount = true;
        is50discount = false;
    } else if (discount == "50Discount") {
        is10discount = false;
        is20discount = false;
        is50discount = true;
    } else {
        is10discount = false;
        is20discount = false;
        is50discount = false;
    }

    const mainImage = createProductForm.image.files[0];
    const urlMainImage = await uploadMainImage(mainImage);

    const gallery = createProductForm.gallery.files;
    const galleryUrls = await uploadGallery([...gallery]);
    const galleryImages = await Promise.all(galleryUrls);

    if (gallery.length == 7) {
        try {
            const collectionRef = collection(db, "products");
            const { docs } = await getDocs(collectionRef);
            await addDoc(collection(db, "products"), {
                colors,
                description,
                discount,
                highlights,
                id: docs.length + 1,
                relevance: docs.length + 1,
                is10discount,
                is20discount,
                is50discount,
                isColor,
                isLarge,
                isStock,
                name,
                price,
                rating,
                Stock,
                type,
                image: urlMainImage,
                images: galleryImages
            });
        } catch (error) {

        }
        alert("producto añadido correctamente")

    } else {
        alert("Please, add 7 images files");
    }


};

function removeItemFromArr(arr, item) {
    var i = arr.indexOf(item);

    if (i !== -1) {
        arr.splice(i, 1);
    }
}

createProductForm.addEventListener("submit", e => {
    e.preventDefault();
    createProduct();
});