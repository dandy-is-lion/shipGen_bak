const statLabels = [
    'Durability',
    'Thrust',
    'Top Speed',
    'Stability',
    'Steer',
    'Strafe'
];

var statData = [{
    label: 'Selection',
    data: [0, 0, 0, 0, 0, 0],
    fill: true,
    borderWidth: 3,
    backgroundColor: 'rgba(0, 72, 186, 0.2)',
    borderColor: 'rgb(0, 72, 186)',
    pointBorderWidth: 2,
    pointBackgroundColor: 'rgb(0, 72, 186)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(0, 72, 186)'
}, {
    label: 'Comparison',
    data: [0, 0, 0, 0, 0, 0],
    fill: true,
    borderWidth: 3,
    backgroundColor: 'rgba(229,43,80, 0.2)',
    borderColor: 'rgb(229,43,80)',
    pointBorderWidth: 2,
    pointBackgroundColor: 'rgb(229,43,80)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(229,43,80)'
}, {
    label: 'Target',
    data: [0, 0, 0, 0, 0, 0],
    fill: true,
    borderWidth: 3,
    backgroundColor: 'rgba(153, 255, 51, 0.2)',
    borderColor: 'rgb(153, 255, 51)',
    pointBorderWidth: 2,
    pointBackgroundColor: 'rgb(153, 255, 51)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(153, 255, 51)'
}];

const ctxBars = document.getElementById('stat-bars');
const ctxRadar = document.getElementById('stat-radar');

var statBars = new Chart(ctxBars, {
    type: 'bar',
    data: {
        labels: statLabels,
        datasets: statData
    },
    options: {
        legend: {
            display:false,
        },
        scales: {
            x: {
                grid: {
                    offset: true
                }
            }
        }
    },
});

var statRadar = new Chart(ctxRadar, {
    type: 'radar',
    data: {
        labels: statLabels,
        datasets: statData
    },
    options: {
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 100
            }
        }
    },
});