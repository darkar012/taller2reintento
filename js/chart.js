const ctx = document.getElementById("myChart").getContext("2d");

let gradient = ctx.createLinearGradient(0,0,0,400);
gradient.addColorStop(0, 'rgba(58,123,213,1)');
gradient.addColorStop(1, 'rgba(0,210,255,0.3)');


const labels = [
    "Latam",
    "USA",
    "Africa",
    "Europe",
    "Asia",
    "Oceania"
];

const data = {
    labels,
    datasets: [
        {
            data: [4.5, 3.2, 5.0, 4.8, 2.5, 3.8],
            label: "valoraciones",
            fill: true,
            backgroundColor: gradient,
            borderColor: "#fff",
            pointBackgroundColor: "#fff"
        }
    ]
}

const config = {
    type: 'line',
    data: data,
    options: {
        radius:5,
        responsive: true,
        /*scales: {
            y: {
                ticks: {

                }
            }
        }*/
    },
};

const myChart = new Chart(ctx, config);