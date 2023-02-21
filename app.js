function runQuery(query) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var results = JSON.parse(xhr.responseText);
                var cols = results["columns"];
                var data = results["data"];
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html += "<tr>";
                    for (var j = 0; j < cols.length; j++) {
                        var cellData = data[i][cols[j]];
                        html += "<td class='"
                        if (j === 0) html += " column-index";
                        if (j === 1) html += " column-ship";
                        if (j === 8) html += " column-score";
                        html += " results-cell' title='" + cols[j].replaceAll('_', ' ') + ": " + cellData + "'>"
                        if (j === 1) html += "<img class='ship-icon' src='img/" + cellData + ".webp'/> ";
                        html += cellData + "</td>";

                    }
                    html += "</tr>";
                }
                document.getElementById("results").innerHTML = html;
                addRowHandlers();
            } else {
                alert("No results found.");
            }
        }
    };
    xhr.open("GET", "query.php?query=" + encodeURIComponent(query), true);
    xhr.send();
}

function handleFormSubmit(event) {
    event.preventDefault();
    // var query = "SELECT * FROM combos_";
    // const score = document.getElementById("score").value;
    // const power_min = document.getElementById("power_min").value;
    // const power_max = document.getElementById("power_max").value;
    // const ship = document.getElementById("ship").selectedOptions;
    // var ships = [];
    // for (let i = 0; i < ship.length; i++) {
    //     ships.push(ship[i].value);
    // }
    // const limit = document.getElementById("limit").value;
    // if (score == "all") {
    //     query += score + " WHERE score BETWEEN " + power_min + " AND " + power_max;
    // } else {
    //     query += score + " WHERE score = score";
    // }
    // if (!ships.includes('any')) {
    //     query += " AND ship IN (" + ships + ")";
    // }
    // query += " LIMIT " + limit;
    runQuery(document.getElementById("query").value);
}

Chart.defaults.borderColor = '#3B8EB9';
Chart.defaults.color = '#FFF';
Chart.defaults.responsive = false;
Chart.defaults.maintainAspectRatio = true;
Chart.defaults.plugins.decimation = false;

var dataSelection = [0, 0, 0, 0, 0, 0];
var dataComparison = [0, 0, 0, 0, 0, 0];
var dataTarget = [39, 43, 42, 37, 42, 41];

const statLabels = [
    'Durability',
    'Thrust',
    'Top Speed',
    'Stability',
    'Steer',
    'Strafe'
];

const statData = [{
    label: 'Selection',
    data: dataSelection,
    fill: true,
    borderWidth: 3,
    backgroundColor: 'rgba(0, 72, 186, 0.2)',
    borderColor: 'rgb(0, 72, 186)',
    pointHitRadius: 25,
    pointBorderWidth: 2,
    pointBackgroundColor: 'rgb(0, 72, 186)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(0, 72, 186)'
}, {
    label: 'Comparison',
    data: dataComparison,
    fill: true,
    borderWidth: 3,
    backgroundColor: 'rgba(229,43,80, 0.2)',
    borderColor: 'rgb(229,43,80)',
    pointHitRadius: 25,
    pointBorderWidth: 2,
    pointBackgroundColor: 'rgb(229,43,80)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(229,43,80)'
}, {
    label: 'Target',
    data: dataTarget,
    fill: true,
    borderWidth: 3,
    backgroundColor: 'rgba(153, 255, 51, 0.2)',
    borderColor: 'rgb(153, 255, 51)',
    pointHitRadius: 25,
    pointBorderWidth: 2,
    pointBackgroundColor: 'rgb(153, 255, 51)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(153, 255, 51)'
}];

const ctxRadar = document.getElementById('stat-radar').getContext('2d');
const ctxBars = document.getElementById('stat-bars').getContext('2d');

var statRadar = new Chart(ctxRadar, {
    type: 'radar',
    data: {
        labels: statLabels,
        datasets: statData
    },
    options: {
        onHover: function (e) {
            const point = e.chart.getElementsAtEventForMode(e, 'nearest', {
                intersect: true
            }, false)
            if (point.length) e.native.target.style.cursor = 'grab'
            else e.native.target.style.cursor = 'default'
        },
        plugins: {
            dragData: {
                round: 1,
                showTooltip: true,
                onDragStart: function (e) {
                    if (!(element.datasetIndex === 2)) return false
                },
                onDrag: function (e, datasetIndex, index, value) {
                    e.target.style.cursor = 'grabbing'
                    if (!(datasetIndex === 2)) return false
                },
                onDragEnd: function (e, datasetIndex, index, value) {
                    e.target.style.cursor = 'default'
                    statBars.update();
                },
                magnet: {
                    to: Math.round
                }
            }
        },
        scales: {
            r: {
                color: '#fff',
                suggestedMax: 50,
                min: 0,
                beginAtZero: true,
                ticks: {
                    showLabelBackdrop: true,
                    backdropColor: 'rgba(0,0,0,0.2)',
                    z: 0
                },
                pointLabels: {
                    centerPointLabels: false,
                    padding: 0,
                    display: true,
                    font: {
                        weight: 600,
                        size: 11
                    }
                }
            }
        }
    },
});

var statBars = new Chart(ctxBars, {
    type: 'bar',
    data: {
        labels: statLabels,
        datasets: statData
    },
    options: {
        scales: {
            y: {
                suggestedMax: 100,
                min: 0,
                beginAtZero: true
            }
        },
        onHover: function (e) {
            const point = e.chart.getElementsAtEventForMode(e, 'nearest', {
                intersect: true
            }, false)
            if (point.length) e.native.target.style.cursor = 'grab'
            else e.native.target.style.cursor = 'default'
        },
        plugins: {
            dragData: {
                round: 1,
                showTooltip: true,
                onDragStart: function (e) {
                    if (!(element.datasetIndex === 2)) return false
                },
                onDrag: function (e, datasetIndex, index, value) {
                    e.target.style.cursor = 'grabbing'
                    if (!(datasetIndex === 2)) return false
                },
                onDragEnd: function (e, datasetIndex, index, value) {
                    e.target.style.cursor = 'default'
                    statRadar.update();
                },
                magnet: {
                    to: Math.round // to: (value) => value + 5
                }
            }
        },
    },
});

function updateStatCharts(chart, dataset, data) {
    chart.data.datasets[dataset].data = data;
    chart.update();
}

function getStats(row) {
    return [Math.max(0, getCellValue(row, 9)),
        Math.max(0, getCellValue(row, 10)),
        Math.max(0, getCellValue(row, 11)),
        Math.max(0, getCellValue(row, 12)),
        Math.max(0, getCellValue(row, 13)),
        Math.max(0, getCellValue(row, 14))
    ];
}

function getCellValue(row, cell) {
    return row.getElementsByTagName('td')[cell].innerHTML;
}

let getSiblings = function (e) {
    // for collecting siblings
    let siblings = [];
    // if no parent, return no sibling
    if (!e.parentNode) {
        return siblings;
    }
    // first child of the parent node
    let sibling = e.parentNode.firstChild;

    // collecting siblings
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};


function addRowHandlers() {
    var table = document.getElementById("results-table");
    var rows = table.getElementsByTagName("tr");
    for (i = 1; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = function (row) {
            return function () {
                row.classList.add('results-selected')
                var siblings = getSiblings(row);
                for (i = 0; i < siblings.length; i++) {
                    siblings[i].classList.remove('results-selected');
                }
                var stats = getStats(row);
                updateStatCharts(statRadar, 0, stats);
                updateStatCharts(statBars, 0, stats);
            };
        };
        var createHoverHandler = function (row) {
            return function () {
                var stats = getStats(row);
                updateStatCharts(statRadar, 1, stats);
                updateStatCharts(statBars, 1, stats);
            };
        };
        currentRow.onclick = createClickHandler(currentRow);
        currentRow.addEventListener("mouseover", createHoverHandler(currentRow));
    }
}

//   const queryDurability = document.getElementById('durability');
//   const queryThrust = document.getElementById('thrust');
//   const queryTopSpeed = document.getElementById('top_speed');
//   const queryStability = document.getElementById('stability');
//   const querySteer = document.getElementById('steer');
//   const queryStrafe = document.getElementById('strafe');

//   var createTargetHandler = function () {
//     return function () {
//       updateStatCharts(statRadar, 2, [queryDurability.value,
//         queryThrust.value,
//         queryTopSpeed.value,
//         queryStability.value,
//         querySteer.value,
//         queryStrafe.value
//       ])
//     }
//   };