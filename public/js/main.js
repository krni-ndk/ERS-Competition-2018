var retrievedData = [];
var tempChart;
var humChart;
var autoTimer;

$(function () {
    let tempChartCTX = document.getElementById('tempChart').getContext('2d');
    let humChartCTX = document.getElementById('humChart').getContext('2d');

    Chart.defaults.global.defaultFontColor = '#b8b8b8';
    Chart.defaults.global.defaultFontSize = 13;

    tempChart = new Chart(tempChartCTX, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperatura',
                data: [],
                backgroundColor: 'rgba(73,205,228, 0.5)',
                borderColor: 'rgba(73,205,228, 0.95)',
                hitRadius: 5,
                borderWidth: 3
            }]

        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 200,
                easing: 'easeInOutSine'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function (toolTip) {
                        return toolTip.yLabel + " °C";
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
                label: 'Vlažnost',
                data: [],
                backgroundColor: 'rgba(73,205,228, 0.5)',
                borderColor: 'rgba(73,205,228, 0.95)',
                hitRadius: 5,
                borderWidth: 3
            }]

        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 200,
                easing: 'easeInOutSine'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function (toolTip) {
                        return toolTip.yLabel + " %";
                    }
                }
            }
        }
    });

    getData();

    $("form[name='timeForm']").submit(function (e) {
        e.preventDefault(); // Disables redirect        
    });

    $("#autoRefresh").click(function () {
        if (document.getElementById('autoRefresh').checked) {
            $("#autoRefreshInput").prop('disabled', '');
            $("#autoRefreshInput").change(function () {
                autoRefresh();
            });
            autoRefresh();
        } else {
            $("#autoRefreshInput").prop('disabled', 'disabled');
            clearInterval(autoTimer);
            autoTimer = null;
        }
    });



    $("input[name='timeResInput']").change(function () {
        if (typeof (retrievedData[0]) != 'undefined')
            displayData();
    });
});

function validateForm() {
    let timeForm = document.forms["timeForm"];
    let timePeriodInput = timeForm["timePeriod"];
    let errorElm = document.getElementById('statusElm');

    if ((timePeriodInput.value).trim() == "") {
        errorElm.innerHTML = 'Vnesite vrednost!';
        return false;
    } else if (isNaN(timePeriodInput.value)) {
        errorElm.innerHTML = 'Vnos je lahko samo število!';
        return false;
    }
    if (parseInt(timePeriodInput.value, 10) < 1) {
        errorElm.innerHTML = 'Vnesite vrednost večjo kot 1!';
        return false;
    }
    errorElm.innerHTML = "";
    getData();

    return true;
}

function getData() {
    let timePeriod = parseInt($("input[name='timePeriod']").val(), 10);
    let statusElm = document.getElementById('statusElm');
    retrievedData = [];
    $.ajax({
        type: 'GET',
        url: `/api/v1/data?timePeriod=${timePeriod}`,
        data: {
            get_param: 'timePeriod'
        },
        dataType: 'json',
        error: function ($aResponse) {
            let response = $aResponse.responseJSON;
            statusElm.innerHTML = response.message;
        },
        success: function (aResponse) {
            let succes = $.parseJSON(aResponse.success);
            if (succes) {
                $.each(aResponse.data, function (index, element) {
                    retrievedData.push(element);
                });
                displayData();
            } else {
                statusElm.innerHTML = aResponse.message;
            }
        }
    });
}

function displayData() {
    let minTime = retrievedData[0].time_ms;
    let maxTime = retrievedData[retrievedData.length - 1].time_ms;
    let dataResolution = parseInt($("input[name='timeResInput']").val(), 10);
    let resMs = dataResolution * 1000 // From seconds to miliseconds
    let dataTime = minTime;

    // First empty data
    $('#tempTable tbody').empty();

    for (let i = 0, j = 0; i < retrievedData.length; i++) {
        if ((dataTime <= maxTime) && retrievedData[i].time_ms >= dataTime) {
            let time = convertMsToTime(retrievedData[i].time_ms);
            let temp = retrievedData[i].temp;
            let hum = retrievedData[i].hum;

            let tableRow = document.createElement('tr');
            let tableTime = document.createElement('td');
            let tableTemp = document.createElement('td');
            let tableHum = document.createElement('td');

            tempChart.data.datasets[0].data[j] = temp;
            tempChart.data.labels[j] = time;
            tempChart.update();
            humChart.data.datasets[0].data[j] = hum;
            humChart.data.labels[j] = time;
            humChart.update();

            tableTime.appendChild(document.createTextNode(time));
            tableTemp.appendChild(document.createTextNode(temp));
            tableHum.appendChild(document.createTextNode(hum));

            tableRow.appendChild(tableTime);
            tableRow.appendChild(tableTemp);
            tableRow.appendChild(tableHum);

            $('#tempTable').find('tbody').append(tableRow);

            dataTime += resMs;
            j++;
        }
    }
}

function convertMsToTime(aMs) {
    let date = new Date(aMs);
    let date_txt = date.toLocaleTimeString('sl-SI');
    return date_txt;
}

function autoRefresh() {
    clearInterval(autoTimer);
    autoTimer = null;
    let refreshInterval = parseInt($("#autoRefreshInput").val(), 10) * 1000; // Conversion from seconds to miliseconds
    autoTimer = setInterval(function () {
        getData();
    }, refreshInterval);
}