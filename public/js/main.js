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
        if (typeof (retrievedData[0]) != 'undefined')
            displayChartData();
        displayTableData();
    });
});

function getData() {
    let timePeriod = parseInt($("input[name='timePeriod']").val(), 10);
    let errorElm = document.createElement('p');
    retrievedData = [];
    $.ajax({
        type: 'GET',
        url: `/api/data?timePeriod=${timePeriod}`,
        data: {
            get_param: 'timePeriod'
        },
        dataType: 'json',
        error: function ($aResponse) {
            let response = $aResponse.responseJSON;
            alert(response.message);
        },
        success: function (aResponse) {


            $.each(aResponse.data, function (index, element) {
                retrievedData.push(element);
            });
            displayChartData();
            displayTableData();
        }
    });
}

function displayChartData() {
    let minTime = retrievedData[0].time_ms;
    let maxTime = retrievedData[retrievedData.length - 1].time_ms;
    let dataResolution = parseInt($("input[name='timeResInput']").val(), 10);
    let resMs = dataResolution * 1000 // From seconds to miliseconds
    let dataTime = minTime;

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

function displayTableData() {
    let minTime = retrievedData[0].time_ms;
    let maxTime = retrievedData[retrievedData.length - 1].time_ms;
    let dataResolution = parseInt($("input[name='timeResInput']").val(), 10);
    let resMs = dataResolution * 1000 // From seconds to miliseconds
    let dataTime = minTime;

    $('#tempTable tbody').empty();
    $('#humTable tbody').empty();

    for (let i = 0; i < retrievedData.length; i++) {
        let tempTableRow = document.createElement('tr');
        let tempTableTemp = document.createElement('td');
        let tempTableTime = document.createElement('td');

        let humTableRow = document.createElement('tr');
        let humTableTemp = document.createElement('td');
        let humTableTime = document.createElement('td');

        if ((dataTime <= maxTime) && retrievedData[i].time_ms >= dataTime) {
            tempTableTemp.appendChild(document.createTextNode(retrievedData[i].temp));
            tempTableTime.appendChild(document.createTextNode(msToTime(retrievedData[i].time_ms)));
            tempTableRow.appendChild(tempTableTime);
            tempTableRow.appendChild(tempTableTemp);
            $('#tempTable').find('tbody').append(tempTableRow);

            humTableTemp.appendChild(document.createTextNode(retrievedData[i].hum));
            humTableTime.appendChild(document.createTextNode(msToTime(retrievedData[i].time_ms)));
            humTableRow.appendChild(humTableTime);
            humTableRow.appendChild(humTableTemp);
            $('#humTable').find('tbody').append(humTableRow);

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