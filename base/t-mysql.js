var mysql = require("mysql");
var tBase = require('./t-base');
const fs = require('fs');
const dotenv = require('dotenv');
function getConfig() {
    return dotenv.parse(fs.readFileSync('.my_env'));
}

var pool = mysql.createPool(getConfig());

module.exports = (function () {
    function _recreate() {
        return new Promise((resolve, reject) => {
            if (pool == null) {
                pool = mysql.createPool(getConfig());
                resolve(true);
                return;
            }
            pool.end(error => {
                if (error != null) {
                    reject(error);
                    return;
                }
                pool = mysql.createPool(getConfig());
                resolve(true);
            });
        });
    }

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
            _query("SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?", [getConfig().database], function (tables, err) {
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
            _query("SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?", [getConfig().database, tableName], function (columns, err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({ table: table, columns: tBase.arrayObjectPropertyCase(columns, true) });
            });
        })
    }

    return {
        recreate: _recreate,
        query: _query,
        getTables: _getTables,
        getColumnFromTable: _getColumnFromTable
    };
})();