const mysql = require('mysql');
const dbConfig = require('./app/database-config');

const dbCon = mysql.createConnection(dbConfig);

setInterval(function () {

    let currentTime = new Date().getTime();

    let temp = Math.round(Math.random() * 100);

    let query = `INSERT INTO readings(temp, time_ms) VALUES (${temp}, ${currentTime})`;
    dbCon.query(query, function (xError, aResult, aFields) {
        if (xError) console.log(xError);
        console.log(query);
    });
}, 1000);