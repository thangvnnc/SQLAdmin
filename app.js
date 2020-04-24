'use strict';
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
// const chromeLauncher = require('chrome-launcher');
const PORT = process.env.PORT || 9999;
const path = require('path');
const tSqlFormater = require('./base/t-sql-formater');
const tMysql = require('./base/t-mysql');
const tPostgres = require('./base/t-postgres');
const fs = require('fs');

// Set ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set body parser json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/mysql', function (req, res) {
	tMysql.getTables()
		.then(tables => {
			var workGetColumnTables = [];
			tables.forEach(table => {
				workGetColumnTables.push(tMysql.getColumnFromTable(table));
			});
			return Promise.all(workGetColumnTables);
		})
		.then(tableInfos => {
			res.render('sql-support', {
				tableInfos: tableInfos,
				error: null
			});
		})
		.catch(err => {
            res.render('sql-support', {
				tableInfos: null,
				error: err
			});
		});
});

app.post('/postgres', function(req, res) {
	fs.writeFileSync('.pg_env', req.body['info-connect']);
	tPostgres.recreate()
	.then(result => {
		res.redirect('/postgres');
	});
});

app.get('/postgres', function(req, res) {
	var connectionInfo = fs.readFileSync('.pg_env');
    tPostgres.getTables()
    .then(tables => {
        var workGetColumnTables = [];
        tables.forEach(table => {
            workGetColumnTables.push(tPostgres.getColumnFromTable(table));
        });
        return Promise.all(workGetColumnTables);
    }).then(tableInfos => {
        res.render('sql-support', {
			tableInfos: tableInfos,
			connectionInfo: connectionInfo,
            error: null
        });
    })
    .catch(err => {
        res.render('sql-support', {
			tableInfos: null,
			connectionInfo: connectionInfo,
            error: err
        });
    });
})

app.post('/api/sql/format', function (req, res) {
	let data = req.body;
	let start = data.start;
	let end = data.end;
	let indent = data.indent;
	let contentReq = data.content;
	let sqlFomat = tSqlFormater(contentReq, indent);

	let sqlResult = '';
	let lines = sqlFomat.split('\n');
	for (let idxLine = 0; idxLine < lines.length; idxLine++) {
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