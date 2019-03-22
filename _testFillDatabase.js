const mysql = require('mysql');

const dbConfig = {
    host: "localhost",
    user: "user",
    password: "pass",
    database: "sensor_v1"
};

const dbCon = mysql.createConnection(dbConfig);

setInterval(function () {
    const maxTemp = 0.26
    const minTemp = 0.15;
    const maxHum = 0.75;
    const minHum = 0.30;

    const currentTime = new Date().getTime();

    let temp = ((Math.random() * (maxTemp - minTemp) + minTemp) * 100).toFixed(2);
    let hum = ((Math.random() * (maxHum - minHum) + minHum) * 100).toFixed(2);


    let query = `INSERT INTO readings(temp, hum, time_ms) VALUES (${temp}, ${hum}, ${currentTime})`;
    dbCon.query(query, function (xError, aResult, aFields) {
        if (xError) console.log(xError);
        console.log(query);
    });
}, 5000);