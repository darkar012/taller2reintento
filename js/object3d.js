import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";

import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../js/GLTFLoader.js';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const url = window.location.search;
const searchParas = new URLSearchParams(url);
let productId = searchParas.get("id").replace('"', "");



let scene, camera, renderer;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer({ antialias: true });

scene.background = new THREE.Color(0xE5E5E5);

camera.position.set(2, 2, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', renderer);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let hlight = new THREE.AmbientLight(0x404040, 100);
scene.add(hlight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const loader = new GLTFLoader();

loader.load("./models/xperia/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
}, undefined, function (error) {

    console.error(error);
});

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

onAuthStateChanged(auth, async (user) => {
    if (user) {
        
        userLogged = user;
    } else {
        
    }
    //getProduct();
});