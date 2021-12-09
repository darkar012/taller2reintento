import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

let productId;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const ctx = document.getElementById("myChart").getContext("2d");

let info;

const getProduct = async () => {
    const url = window.location.search;
    const searchParas = new URLSearchParams(url);
    productId = searchParas.get("id").replace('"', "");

    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    info = data;
    chart(labels,info.world);
};

let gradient = ctx.createLinearGradient(0, 0, 0, 500);
gradient.addColorStop(0, '#00416a');
gradient.addColorStop(1, '#e4e5e600');

let myChart;

const type = document.getElementById("countries");

let labels = ["Latam",
    "USA",
    "Africa",
    "Europe",
    "Asia",
    "Oceania"];

let delayed;

type.addEventListener("change", (e) => {
    if (type.value === "All") {
        labels = [
            "Latam",
            "USA",
            "Africa",
            "Europe",
            "Asia",
            "Oceania"
        ];
        delayed = false;
        myChart.destroy()
        chart(labels,info.world);
    } else if (type.value === "America") {
        labels = [
            "Argentina",
            "Brasil",
            "Colombia",
            "México",
            "Perú",
            "USA"
        ];
        delayed = false;
        myChart.destroy()
        chart(labels,info.america);
    } else {
        labels = [
            "France",
            "Germany",
            "Italy",
            "Portugal",
            "Rusia",
            "Spain"
        ];
        delayed = false;
        myChart.destroy()
        chart(labels,info.europe);
    }

});

const chart = (labels,info) => {
    const data = {
        labels,
        datasets: [
            {
                data:info,
                label: "ratings",
                fill: true,
                backgroundColor: gradient,
                borderColor: "#fff",
                pointBackgroundColor: "#fff",
                borderWidth: 1
            }
        ]
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            radius: 5,
            responsive: true,
            animation: {
                onComplete: () => {
                    delayed = true;
                },
                delay: (context) => {
                    let delay = 0;
                    if (context.type === "data" && context.mode === "default" && !delayed) {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        color: 'white',
                        borderWidth: 1
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 14
                        },
                        color: 'white'
                    }
                },
                y: {
                    grid: {
                        display: false,
                        color: 'white',
                        borderWidth: 1
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 14
                        },
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            family: 'Poppins',
                            size: 14,
                            
                        },
                        color:'white'
                    }
                }
            }
        },
    };
    myChart = new Chart(ctx, config);
}

getProduct();


