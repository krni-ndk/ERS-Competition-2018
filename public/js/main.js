var retrievedData = [];
var tempChart;
var autoTimer;

$(function () {
    let tempChartCTX = document.getElementById('tempChart').getContext('2d');

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
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: true
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
    getData();

    $("form[name='timeForm']").submit(function (e) {
        e.preventDefault(); // Disables redirect        
    });

    $("#autoRefresh").click(function () {
        let dataResolution = parseInt($("input[name='timeResInput']").val(), 10) * 1000; // miliseconds to seconds
        if (document.getElementById('autoRefresh').checked) {
            autoTimer = setInterval(function () {
                getData();
            }, dataResolution);
        } else {
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
    console.log("Data");
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
    tempChart.data.datasets[0].data = [];
    tempChart.data.labels = [];
    $('#tempTable tbody').empty();

    for (let i = 0; i < retrievedData.length; i++) {
        let tempTableRow = document.createElement('tr');
        let tempTableTemp = document.createElement('td');
        let tempTableTime = document.createElement('td');

        if ((dataTime <= maxTime) && retrievedData[i].time_ms >= dataTime) {
            tempChart.data.datasets[0].data.push(retrievedData[i].temp);
            tempChart.data.labels.push(convertMsToTime(retrievedData[i].time_ms));
            tempChart.update();

            tempTableTemp.appendChild(document.createTextNode(retrievedData[i].temp));
            tempTableTime.appendChild(document.createTextNode(convertMsToTime(retrievedData[i].time_ms)));
            tempTableRow.appendChild(tempTableTime);
            tempTableRow.appendChild(tempTableTemp);
            $('#tempTable').find('tbody').append(tempTableRow);

            dataTime += resMs;
        }
    }
}

function convertMsToTime(aMs) {
    let date = new Date(aMs);
    let date_txt = date.toLocaleTimeString('sl-SI');
    return date_txt;
}