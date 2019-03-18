const mysql = require('mysql');

const dbConfig = {
    host: "localhost",
    user: "user",
    password: "pass",
    database: "sensor_v1"
};

const dbCon = mysql.createConnection(dbConfig);

setInterval(function () {
    const max = 0.26
    const min = 0.15;
    const currentTime = new Date().getTime();

    let temp = ((Math.random() * (max - min) + min) * 100).toFixed(2);

    let query = `INSERT INTO readings(temp, time_ms) VALUES (${temp}, ${currentTime})`;
    dbCon.query(query, function (xError, aResult, aFields) {
        if (xError) console.log(xError);
        console.log(query);
    });
}, 5000);