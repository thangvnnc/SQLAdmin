'use strict';
const express = require('express')
const sqlFormatter = require('sql-formatter');
const app = express();
const bodyParser = require('body-parser');
const chromeLauncher = require('chrome-launcher');
const PORT = process.env.PORT || 9999;
const path = require('path');
const tmysql = require('./base/t-mysql');

// Set ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set body parser json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Code tmp ///////////
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.1.108',
  user     : 'lindtscript',
  database     : 'weborder',
  password : 'lindtscript1'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});
// tmysql.query("SELECT * FROM tLocation", [], function(rows, err) {
//     console.log(rows.length);
// });
// Code tmp ///////////

// app.get('/', function(req, res) {
//     res.render('index');
// });

// app.listen(PORT, function(err) {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     console.log('Server started in port: ' + PORT);
    
//     // chromeLauncher.launch({
//     //     startingUrl: 'http://localhost:'+PORT
//     // }).then(chrome => {
//     //     console.log(`Chrome debugging port running on ${chrome.port}`);
//     // });
// });