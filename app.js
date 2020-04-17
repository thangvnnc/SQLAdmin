'use strict';
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const chromeLauncher = require('chrome-launcher');
const PORT = process.env.PORT || 9999;
const path = require('path');
const tSqlFormater = require('./base/t-sql-formater');
const tmysql = require('./base/t-mysql');

// Set ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set body parser json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Code tmp ///////////
var GetTables = function () {
  return new Promise(function (resolve, reject) {
    tmysql.query("SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?", [process.env.DB_NAME], function (tables, err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tables);
    });
  })
}

var GetColumnFromTableName = function (table) {
  return new Promise(function (resolve, reject) {
    var tableName = table.TABLE_NAME;
    tmysql.query("SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?", [process.env.DB_NAME, tableName], function (columns, err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({ table: table, columns: columns });
    });
  })
}

app.get('/', function (req, res) {
  GetTables()
    .then(tables => {
      var workGetColumnTables = [];
      tables.forEach(table => {
        workGetColumnTables.push(GetColumnFromTableName(table));
      });
      return Promise.all(workGetColumnTables);
    })
    .then(tableInfos => {
      res.render('index', {
        tableInfos: tableInfos,
        error: null
      });
    })
    .catch(err => {
      res.render('index', {
        tableInfos: null,
        error: err
      });
    });
});

app.post('/api/sql/format', function (req, res) {
  let data = req.body;
  let start = data.start;
  let end = data.end;
  let indent = data.indent;
  let contentReq = data.content;
  let sqlFomat = tSqlFormater(contentReq, indent);

  let sqlResult = '';
  let lines = sqlFomat.split('\n');
  for(let idxLine = 0; idxLine < lines.length; idxLine++) {
      sqlResult += start + lines[idxLine] + end + '\n';
  }

  let result = {
      code: 0,
      content: sqlResult
  }

  res.send(result);
});

app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Server started in port: ' + PORT);

  // chromeLauncher.launch({
  //     startingUrl: 'http://localhost:'+PORT
  // }).then(chrome => {
  //     console.log(`Chrome debugging port running on ${chrome.port}`);
  // });
});