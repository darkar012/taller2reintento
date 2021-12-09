import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../js/GLTFLoader.js';

let scene, camera, renderer;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75,(window.innerWidth)/window.innerHeight,1,5000);
renderer = new THREE.WebGLRenderer({antialias:true});

scene.background = new THREE.Color(0x8d8f91);



camera.position.set( -15, -15, 7 );

/*camera.rotation.y = 45/180*Math.PI;
camera.position.x = 800;
camera.position.y = 100;
camera.position.z = 1000;*/

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', renderer);

renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

let hlight = new THREE.AmbientLight (0x404040, 100);
scene.add(hlight);

let directionalLight = new THREE.DirectionalLight(0xffffff,100);
directionalLight.castShadow = true;
scene.add(directionalLight);

let light1 = new THREE.PointLight(0xc4c4c4,10);
light1.position.set(0,300,500);
scene.add(light1);

let light2 = new THREE.PointLight(0xc4c4c4,10);
light2.position.set(500,100,0);
scene.add(light2)

let light3 = new THREE.PointLight(0xc4c4c4,10);
light3.position.set(0,100,-500);
scene.add(light3)

let light4 = new THREE.PointLight(0xc4c4c4,10);
light4.position.set(-500,300,0);
scene.add(light4)

const loader = new GLTFLoader();
loader.load("./models/ps5.gltf", function(gltf){
    let car = gltf.scene.children[0];
    
    scene.add(car);
}, undefined, function ( error ) {

    console.error( error );
} );

function animate() {
    renderer.render(scene,camera);
    console.log(camera.position.x);
    console.log(camera.position.y);
    console.log(camera.position.z);
    requestAnimationFrame(animate);  
}

animate();