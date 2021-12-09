

const ctx = document.getElementById("myChart").getContext("2d");

let gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(58,123,213,1)');
gradient.addColorStop(1, 'rgba(0,210,255,0.3)');

let myChart;

const type = document.getElementById("countries");

let labels = [];

type.addEventListener("change", (e) => {
    if (type.value === "all"){
        labels = [
            "Latam",
            "USA",
            "Africa",
            "Europe",
            "Asia",
            "Oceania"
        ];
    } else if (type.value === "America"){
        labels = [
            "USA",
            "México",
            "Colombia",
            "Brasil",
            "Argentina",
            "Perú"
        ];
        myChart.destroy()
        myChart = new Chart(ctx, config);
    }
    
});

let delayed;

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
        /*scales: {
            y: {
                ticks: {

                }
            }
        }*/
    },
};

myChart = new Chart(ctx, config);