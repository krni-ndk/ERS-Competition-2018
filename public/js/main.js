var retrievedData = [];

var tempChart;
var humChart;

$(function () {
    let tempChartCTX = document.getElementById('tempChart').getContext('2d');
    let humChartCTX = document.getElementById('humChart').getContext('2d');

    tempChart = new Chart(tempChartCTX, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature',
                data: [],
                backgroundColor: [
                    'rgba(200, 100, 200, 0.15)'
                ],
                borderColor: [
                    'rgba(200, 50, 100, 1.0)'
                ],
                borderWidth: 5
            }]

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function (toolTips, data) {
                        return toolTips.yLabel + " °C";
                    }
                }
            }
        }
    });

    humChart = new Chart(humChartCTX, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity',
                data: [],
                backgroundColor: [
                    'rgba(250, 50, 200, 0.15)'
                ],
                borderColor: [
                    'rgba(250, 0, 100, 1.0)'
                ],
                borderWidth: 5
            }]

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function (toolTips, data) {
                        return toolTips.yLabel + " %";
                    }
                }
            }
        }
    });
    getData();

    $("form[name='timeForm']").submit(function (e) {
        e.preventDefault(); // Disables redirect
        getData();
    });

    $("input[name='timeResInput']").change(function () {
        displayData();
    });
});

function getData() {
    let timePeriod = parseInt($("input[name='timePeriod']").val(), 10);
    retrievedData = [];
    $.ajax({
        type: 'GET',
        url: `/api/data?timePeriod=${timePeriod}`,
        data: {
            get_param: 'timePeriod'
        },
        dataType: 'json',
        success: function (data) {
            if (data.success == "true") {
                $.each(data.data, function (index, element) {
                    retrievedData.push(element);
                });
                displayData();
                console.log(data.success);
            }
            if (data.success == "false") {
                let errorPar = document.createElement('p');
                let error = document.createTextNode(data.message);
                errorPar.appendChild(error);
                document.getElementById('errorContainer').appendChild(errorPar);
                console.log(data.success);
            }
            console.log(data.success);
        }
    });
}

function displayData() {
    var minTime = retrievedData[0].time_ms;
    var maxTime = retrievedData[retrievedData.length - 1].time_ms;
    let dataResolution = parseInt($("input[name='timeResInput']").val(), 10);
    var resMs = dataResolution * 1000 // From seconds to miliseconds
    var dataTime = minTime;

    // First empty data arrays
    tempChart.data.datasets[0].data = [];
    tempChart.data.labels = [];
    humChart.data.datasets[0].data = [];
    humChart.data.labels = [];

    for (let i = 0; i < retrievedData.length; i++) {
        if ((dataTime <= maxTime) && retrievedData[i].time_ms >= dataTime) {
            tempChart.data.datasets[0].data.push(retrievedData[i].temp);
            tempChart.data.labels.push(msToTime(retrievedData[i].time_ms));
            tempChart.update();

            humChart.data.datasets[0].data.push(retrievedData[i].hum);
            humChart.data.labels.push(msToTime(retrievedData[i].time_ms));
            humChart.update();

            dataTime += resMs;
        }
    }
}

function msToTime(aMs) {
    let date = new Date(aMs);
    let txt = date.toLocaleTimeString('sl-SI');
    return txt;
}

function valForm() {
    let timeForm = document.forms["timeForm"];
    let timePeriodInput = timeForm["timePeriod"];
    let errorCon = document.getElementById('errorContainer');
    let errorText;
    if (timePeriodInput.value == "") {
        errorText = document.createElement('p');
        let errorTextNode = document.createTextNode('Vnesite vrednost, ki naj bo vecja kot 1 min');
        errorText.appendChild(errorTextNode);
        errorCon.appendChild(errorText);

        return false;
    }
    errorCon.removeChild(errorText);
    return true;
}