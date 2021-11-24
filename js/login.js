import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
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

const body = document.getElementById("bodyLogin");

const getMyCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

const cart = getMyCart();


const addProductsToCart = async (products, id) => {
    await setDoc(doc(db, "cart", id), {
        products,
    });
};

const getUserInfo = async (userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (error) {
        console.log(error);
    }
}

const login = async (email, password) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("user", user);
        const userInfo = await getUserInfo(user.uid);
        cambiarPagina();
    } catch (error) {
        console.log(error);
        if (error.code === "auth/user-not-found") {
            alert("non-existent user");
        }
        if (error.code === "auth/wrong-password") {
            alert("Wrong password");
        }
    }
};

const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userId = user.uid;
        const username = user.displayName;
        const email = user.email;
        if (email === "crisdamencast@gmail.com") {
            await setDoc(doc(db, "users", userId), { username: username, isAdmin: true });
        } else {
            await setDoc(doc(db, "users", userId), { username: username, isAdmin: false });
        }
        addProductsToCart(cart, userId);
        cambiarPagina();
    } catch (error) {
        console.log(error);
    }

};

const createUser = async (email, password, userFields) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userId = user.uid;
        await setDoc(doc(db, "users", userId), userFields);
        await setDoc(doc(db, "cart", userId), { id: 0 });
        addProductsToCart(cart, userId);
        cambiarPagina();
    } catch (e) {
        console.log(e.code);
        if (e.code === "auth/email-already-in-use") {
            alert("Email is in use");
        }

        if (e.code === "auth/weak-password") {
            alert("Weak mail");
        }
    }
};

const drawForm = () => {
    body.innerHTML = `<img src="./images/login.png" class="loginImage">
<form class="login" id="login">
    <img src="./images/sonyLogo.png" class="loginLogo">
    <h2>Log into your account</h2>
    <div class="accounts">
    <img src="./images/google.png" class="signLogo" id="google">
    
    </div>
    <p>Email</p>
    <input type="email" name="email">
    <p>Password</p>
    <input type="password" name="password">
    <div class="login__buttons">
        <button class="login__button login__button--signIn" id="sign_In">Sign In</button>
        <button class="login__button login__button--signUp" id="sign_Up">Sign Up</button>
    </div>
</form>`

    const signUp = document.getElementById("sign_Up");
    let form = document.getElementById("login");
    const signIn = document.getElementById("sign_In");
    const google = document.getElementById("google");

    google.addEventListener("click", e => {
        loginWithGoogle()
    });

    signIn.addEventListener("click", e => {
        e.preventDefault()
        const email = form.email.value;
        const password = form.password.value;

        if (email && password) {
            login(email, password);
        } else {
            alert("Completa todos los campos");
        }
    });

    signUp.addEventListener("click", e => {
        e.preventDefault();
        body.innerHTML = "";
        body.innerHTML = `<img src="./images/signOut.png" class="loginImage">
        <form class="login" id="login">
            <img src="./images/sonyLogo.png" class="loginLogo">
            <h2>Create an account</h2>
            <p>Username</p>
            <input type="text" name="username">
            <p>Email</p>
            <input type="email" name="email">
            <p>Password</p>
            <input type="password" name="password">
            <div class="login__buttons">
                <button class="login__button login__button--signIn" id="returnSignIn">Sign In</button>
                <button class="login__button login__button--signUp" id="register">Sign Up</button>
            </div>
        </form>`

        form = document.getElementById("login");
        const register = document.getElementById("register");
        const returnSignIn = document.getElementById("returnSignIn");

        register.addEventListener("click", e => {
            e.preventDefault();
            const email = form.email.value;
            const username = form.username.value;
            const password = form.password.value;


            if (email && username && password) {
                if (email === "crisdamencast@gmail.com") {
                    createUser(email, password, { username: username, isAdmin: true });
                } else {
                    createUser(email, password, { username: username, isAdmin: false });
                }

            } else {
                alert("Completa todos los campos");
            }
        });

        returnSignIn.addEventListener("click", e => {

        });

    });
}

drawForm();

const cambiarPagina = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location = "landing.html"
        }
    });
}