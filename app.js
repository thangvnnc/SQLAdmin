'use strict';
const express = require('express')
const sqlFormatter = require('sql-formatter');
const app = express();
const bodyParser = require('body-parser');
const chromeLauncher = require('chrome-launcher');
const PORT = process.env.PORT || 9999;
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index', {
        title: 'title'
    });
});

app.listen(PORT, function(err) {
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