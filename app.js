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
// var getTables = function (dbName) {
//   return new Promise(function (resolve, reject) {
//     tmysql.query("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?", [dbName], function (rows, err) {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(rows);
//     });
//   })
// }

// var getNumberTable = function (dbName) {
//   return new Promise(function (resolve, reject) {
//     tmysql.query("SELECT COUNT(TABLE_NAME) as number FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?", [dbName], function (rows, err) {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(rows);
//     });
//   })
// }

// var arrayWorks = [];
// arrayWorks.push(getTables(process.env.DB_NAME));
// arrayWorks.push(getNumberTable(process.env.DB_NAME));

// Promise.all(arrayWorks)
// .catch(error => {
//   console.error(error);
//   throw err;
// })
// .then(results => {
//   var resultGetTables = results[0];
//   console.log(resultGetTables);
// })
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