var dataResolution = 5; // Time in sec
var retrievedData = [];

var tempChart;
var humChart;

let chartOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
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
};


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
});

function getData(aTimePeriod = 1) {
    $.ajax({
        type: 'GET',
        url: `/api/data?timePeriod=${aTimePeriod}`,
        data: {
            get_param: 'timePeriod'
        },
        dataType: 'json',
        success: function (data) {
            $.each(data.data, function (index, element) {
                retrievedData.push(element);
            });
        }
    });
}

function displayData() {
    var minTime = retrievedData[0].time_ms;
    var maxTime = retrievedData[retrievedData.length - 1].time_ms;
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
            tempChart.data.labels.push(retrievedData[i].time_ms);
            tempChart.update();

            humChart.data.datasets[0].data.push(retrievedData[i].hum);
            humChart.data.labels.push(retrievedData[i].time_ms);
            humChart.update();

            dataTime += resMs;
        }
    }
}