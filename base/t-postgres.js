var Pool = require('pg-pool');
var tBase = require('./t-base');
require('dotenv').config();

var pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: false,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 30000, // return an error after 1 second if connection could not be established
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

module.exports = (function () {
    function _query(query, params, callback) {
        // pool.connect().then(connection => {
        //     connection.query(query, params)
        //     .then(res => {
        //         connection.release();
        //         callback(res.rows, null);
        //     }).catch(error => {
        //         connection.release();
        //         callback(null, error);
        //     });
        // });

        (async () => {
            var connection = await pool.connect()
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
            _query("SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = $1", [process.env.DB_SCHEMA], function (tables, err) {
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
            _query("SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = $1 AND TABLE_NAME = $2", [process.env.DB_SCHEMA, tableName], function (columns, err) {
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
        getColumnFromTable: _getColumnFromTable,
    };
})();
