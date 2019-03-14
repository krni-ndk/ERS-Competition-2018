const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

const PORT = 3000;
const dbConfig = require('./database-config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const dbCon = mysql.createConnection(dbConfig);

app.use(express.static(path.join(__dirname + '/../public')));

app.get('/', function (aReq, aRes, xErr) {
    if (xErr) console.log(xErr);
    aRes.status(200).sendFile(path.join(__dirname + "/../public/index.html"));
});

app.get('/api/data', function (aReq, aRes, xErr) {
    if (xErr) console.log(xErr);
    
    let timePeriod = (parseInt(aReq.query.timePeriod, 10)) * 60 * 1000; // From minutes to miliseconds
    let currentTime = new Date().getTime();
    let reqTime = currentTime - timePeriod;

    let query = `SELECT temp, hum, time_ms FROM readings WHERE time_ms BETWEEN ${reqTime} AND ${currentTime} ORDER BY time_ms ASC`;

    dbCon.query(query, function (xError, aResults, aFields) {
        if (xError) {
            console.log(xError);
            aRes.status(500).send({
                sucess: "false",
                message: "An error occured while retrieving the data"
            });
        }

        if((aResults === undefined) || (aResults.lenght === 0)) {
            aRes.status(404).send({
                sucess: "false",
                message: "Dataset is empty"
            });
        } else {
            aRes.status(200).send({
                sucess: "true",
                message: "Data retrieved succesfully",
                data: aResults
            });
        }
    });
});

app.listen(PORT, function (xErr) {
    if (xErr) throw xErr;

    console.log(`Server started on ${dbConfig.host} port ${PORT}`);
});