const express = require('express');
const path = require('path');
const mysql = require('mysql');

const PORT = 3000;
const dbConfig = require('./database-config');

const app = express();
const dbCon = mysql.createConnection(dbConfig);

app.use(express.static(path.join(__dirname + '/../public')));

app.get('/', function(aReq, aRes, xErr) {
    aRes.sendFile(path.join(__dirname + "/../public/index.html"));
});

app.listen(PORT, function(xErr) {
    if (xErr) throw xErr;

    console.log(`Server started on ${dbConfig.host} port ${PORT}`);
});