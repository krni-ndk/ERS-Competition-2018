const express = require('express');
const mysql = require('mysql');

const PORT = 3000;
const dbConfig = require('./database-config');

const app = express();
const dbCon = mysql.createConnection(dbConfig);

app.listen(PORT, function(xError) {
    if (xError) throw xError;

    console.log(`Server started on ${dbConfig.host} port ${PORT}`);
});