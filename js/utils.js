const firebaseConfig = {
    apiKey: "AIzaSyARfuimicStzpLNGCGrzqlLdImKGcRFtXQ",
    authDomain: "web-sony.firebaseapp.com",
    projectId: "web-sony",
    storageBucket: "web-sony.appspot.com",
    messagingSenderId: "840070681146",
    appId: "1:840070681146:web:8a86ca0b0b60b92736db03",
    measurementId: "G-D39VZ29MQH"
};

const formatCurrency = (price) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP"
    }).format(price);
}