var startTime = "";

function runQuery(query) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const results = JSON.parse(xhr.responseText);
                const cols = results.columns;
                const data = results.data;
                let html = "";

                for (let i = 0; i < data.length; i++) {
                    html += "<tr>";

                    for (let j = 0; j < cols.length; j++) {
                        const cellData = data[i][cols[j]];
                        let cssClass = "";
                        let shipIcon = "";

                        switch (j) {
                            case 0:
                                cssClass = "column-index";
                                break;
                            case 1:
                                cssClass = "column-ship";
                                shipIcon = "<img class='ship-icon' src='img/" + cellData + ".webp'/> ";
                                break;
                            case 8:
                                cssClass = "column-score";
                                break;
                            case 15:
                                cssClass = "column-deviation";
                                break;
                            default:
                                if (j > 8 && j < 15) {
                                    if (cellData > (dataTarget[j - 9] + (dataTarget[j - 9] * 0.1))) {
                                        cssClass = "results-cell-good";
                                    }
                                    if (cellData < (dataTarget[j - 9] - (dataTarget[j - 9] * 0.1))) {
                                        cssClass = "results-cell-bad";
                                    }
                                }
                        }

                        html += `<td class="results-cell ${cssClass}" title="${cols[j]}: ${cellData}">${shipIcon}${cellData}</td>`;
                    }

                    html += "</tr>";
                }

                document.getElementById("button-generate").innerHTML = `Generate (${(new Date() - startTime) / 1000}s)`;
                document.getElementById("tbody-results").innerHTML = html;
                addRowHandlers();
            } else {
                document.getElementById("button-generate").innerHTML = "Generate";
                alert("No results found.");
            }
        }
    };

    xhr.open("GET", `./src/query.php?query=${encodeURIComponent(query)}`, true);
    xhr.send();
}

function handleFormSubmit(event) {
    // Prevent form submission from reloading the page
    event.preventDefault();

    // Get the form input values
    const powerMin = document.getElementById("input-power-min").value;
    const powerMax = document.getElementById("input-power-max").value;
    const selectedClass = document.getElementById("select-class").value;
    const selectedShips = Array.from(document.getElementById("select-ships").selectedOptions)
        .map(option => `'${option.value}'`);

    // Build the SQL query based on the form inputs
    let query = `
      SELECT *, ABS(dura - ${dataTarget[0]}) + ABS(thr - ${dataTarget[1]}) +
          ABS(spd - ${dataTarget[2]}) + ABS(staby - ${dataTarget[3]}) +
          ABS(steer - ${dataTarget[4]}) + ABS(strafe - ${dataTarget[5]}) AS devi
      FROM `;

    if (selectedClass === 'x') {
        query += `combos_x WHERE ship IN (${selectedShips})`;
    } else {
        query += `combos INNER JOIN (
          SELECT id FROM combos_${selectedClass} WHERE score BETWEEN ${powerMin} AND ${powerMax}
        ) q ON combos.id = q.id WHERE ship IN (${selectedShips})`;
    }

    query += `      
      ORDER BY devi LIMIT 100`;

    let query2 = "SELECT *, ABS(spd - 90) + ABS(staby - 70) + ABS(thr - 35) AS devi FROM combos_x ORDER BY devi, dura DESC, steer DESC, strafe DESC LIMIT 100";
    // Run the SQL query and update the button text
    runQuery(query);
    startTime = new Date();
    document.getElementById("button-generate").innerHTML = "Generating <i style='text-align:center' class='fa fa-cog fa-spin'></i>";
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

const targetColor = 'rgb(153, 255, 51)';
const selectionColor = 'rgb(0, 72, 186)';
const comparisonColor = 'rgb(229, 43, 80)';
const targetColorA = 'rgba(153, 255, 51, 0.05)';
const selectionColorA = 'rgba(0, 72, 186, 0.25)';
const comparisonColorA = 'rgba(229, 43, 80, 0.05)';

const statData = [{
    label: 'Target',
    data: dataTarget,
    fill: true,
    borderWidth: 3,
    backgroundColor: targetColorA,
    borderColor: targetColor,
    pointHitRadius: 25,
    pointBorderWidth: 0,
    pointBackgroundColor: targetColorA,
    pointBorderColor: targetColor,
    pointHoverBackgroundColor: targetColor,
    pointHoverBorderColor: targetColor
}, {
    label: 'Selection',
    data: dataSelection,
    fill: true,
    hidden: true,
    borderWidth: 3,
    backgroundColor: selectionColorA,
    borderColor: selectionColor,
    pointHitRadius: 25,
    pointBorderWidth: 0,
    pointBackgroundColor: selectionColorA,
    pointBorderColor: selectionColor,
    pointHoverBackgroundColor: selectionColor,
    pointHoverBorderColor: selectionColor
}, {
    label: 'Comparison',
    data: dataComparison,
    fill: true,
    hidden: true,
    borderWidth: 3,
    backgroundColor: comparisonColorA,
    borderColor: comparisonColor,
    pointHitRadius: 25,
    pointBorderWidth: 0,
    pointBackgroundColor: comparisonColorA,
    pointBorderColor: comparisonColor,
    pointHoverBackgroundColor: comparisonColor,
    pointHoverBorderColor: comparisonColor
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
                    if (!(element.datasetIndex === 0)) return false
                },
                onDrag: function (e, datasetIndex, index, value) {
                    e.target.style.cursor = 'grabbing'
                    if (!(datasetIndex === 0)) return false
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
                    if (!(element.datasetIndex === 0)) return false
                },
                onDrag: function (e, datasetIndex, index, value) {
                    e.target.style.cursor = 'grabbing'
                    if (!(datasetIndex === 0)) return false
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
    chart.data.datasets[dataset].hidden = false;
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
    var table = document.getElementById("table-results");
    var rows = table.getElementsByTagName("tr");
    for (i = 1; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = function (row) {
            return function () {
                // Change the Selection graphs to whatever row was clicked and mark that row as selected
                row.classList.add('results-selected')
                var siblings = getSiblings(row);
                for (i = 0; i < siblings.length; i++) {
                    siblings[i].classList.remove('results-selected');
                }
                var stats = getStats(row);
                updateStatCharts(statRadar, 1, stats);
                updateStatCharts(statBars, 1, stats);
            };
        };
        var createHoverHandler = function (row) {
            return function () {
                // Change the Comparison graphs to whatever row is hovered
                var stats = getStats(row);
                updateStatCharts(statRadar, 2, stats);
                updateStatCharts(statBars, 2, stats);
            };
        };
        currentRow.onclick = createClickHandler(currentRow);
        currentRow.addEventListener("mouseover", createHoverHandler(currentRow));
    }
}