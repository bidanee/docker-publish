var express = require('express');
var mysql = require('mysql');
const env = require('dotenv').config({ path: '../../.env' });
var app = express();

var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
});

connection.connect(function (err) {
    if (!err) {
        console.error('Database is connected~!!\n\n');
    } else {
        console.log('Error connecting Database~!!\n\n');
    }
});

app.get('/', function (req, res) {
    connection.query('select * from st_info', function (err, rows, fields) {
        connection.end();
        if (!err) {
            // res.send(rows);
            res.writeHead(200, {
                'content-type': 'text/html charset=utf-8',
            });
            var template = `
            <table border="1" margin:auto; style="text-align:center;">
                      <tr>
                        <th>ST_ID</th>
                        <th>NAME</th>
                        <th>DEPT</th>
                      </tr>
            `;
            rows.forEach((item) => {
                template += `
              <tr>
              <td>${item.ST_ID}</td>
              <td>${item.NAME}</td>
              <td>${item.DEPT}</td>
              </tr>
              `;
            });
            template += '</table>';
            res.end(template);
        } else {
            console.log('Error while performing Query~!!\n\n');
        }
    });
});

app.listen(8080, function () {
    console.log('8000 Port : Server Started~!!\n\n');
});
