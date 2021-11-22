import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyARfuimicStzpLNGCGrzqlLdImKGcRFtXQ",
    authDomain: "web-sony.firebaseapp.com",
    projectId: "web-sony",
    storageBucket: "web-sony.appspot.com",
    messagingSenderId: "840070681146",
    appId: "1:840070681146:web:8a86ca0b0b60b92736db03",
    measurementId: "G-D39VZ29MQH"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const signText = document.getElementById("signIn");
const admin = document.getElementById("adminChange")
let userId = "";


const getUserInfo = async(userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (error) {
        console.log(error);
    }
}


onAuthStateChanged(auth, async(user) => {
    if (user) {
        userId = user.uid;
        const userInfo = await getUserInfo(userId);
        //alert("Bienvenido de vuelta " + userInfo.username);
        if (userInfo.isAdmin) {
            admin.setAttribute('href', "./productForm.html");
            admin.innerHTML = "Add Product"
        } else {}
        signText.innerHTML = "Sign Out"
    } else {
        signText.innerHTML = "Sign In"
    }
});

const logout = async() => {
    try {
        await signOut(auth);
    } catch (error) {
        console.log(error);
    }
}

signText.addEventListener("click", e => {
    if (signText.innerHTML == "Sign Out") {
        logout()
    } else {
        window.location = "login.html"
    }
});