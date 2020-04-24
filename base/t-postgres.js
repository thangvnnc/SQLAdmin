var Pool = require('pg-pool');
var tBase = require('./t-base');
const fs = require('fs');
const dotenv = require('dotenv');
function getConfig() {
    return dotenv.parse(fs.readFileSync('.pg_env'));
}
var pool = new Pool(getConfig());

module.exports = (function () {
    function _recreate() {
        return new Promise((resolve, reject) => {
            if (pool == null) {
                pool = new Pool(getConfig());
                resolve(true);
                return;
            }
            pool.end(error => {
                if (error != null) {
                    reject(error);
                    return;
                }
                pool = new Pool(getConfig());
                resolve(true);
            });
        });
    }

    function _query(query, params, callback) {
        (async () => {
            var connection = await pool.connect();
            try {
                var result = await connection.query(query, params)
                callback(result.rows, null);
            } finally {
                connection.release()
            }
        })().catch(error => {
            callback(null, error);
        })
    };

    function _getTables() {
        return new Promise(function (resolve, reject) {
            _query("SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = $1", [getConfig().schema], function (tables, err) {
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
            _query("SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = $1 AND TABLE_NAME = $2", [getConfig().schema, tableName], function (columns, err) {
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
        getColumnFromTable: _getColumnFromTable,
    };
})();