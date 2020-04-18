var mysql = require("mysql");
var tBase = require('./t-base');
require('dotenv').config();

var pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    database: process.env.DB_MYSQL_NAME,
    user: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASS,
});

module.exports = (function () {
    function _query(query, params, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                if (connection) connection.release();
                callback(null, err);
                return;
            }

            connection.query(query, params, function (err, rows) {
                if (!err) {
                    callback(rows);
                }
                else {
                    callback(null, err);
                }
                if (connection) connection.release();
            });

            connection.on('error', function (err) {
                if (connection) connection.release();
                callback(null, err);
                return;
            });
        });
    };

    function _getTables() {
        return new Promise(function (resolve, reject) {
            _query("SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?", [process.env.DB_MYSQL_NAME], function (tables, err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(tBase.arrayObjectPropertyCase(tables, true));
            });
        })
    };

    function _getColumnFromTable(table) {
        return new Promise(function (resolve, reject) {
            var tableName = table.TABLE_NAME;
            _query("SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?", [process.env.DB_MYSQL_NAME, tableName], function (columns, err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({ table: table, columns: tBase.arrayObjectPropertyCase(columns, true) });
            });
        })
    }

    return {
        query: _query,
        getTables: _getTables,
        getColumnFromTable: _getColumnFromTable
    };
})();