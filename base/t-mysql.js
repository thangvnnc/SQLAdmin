var mysql = require("mysql");
require('dotenv').config();

var pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});

var MySqlObject = (function () {
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

    return {
        query: _query
    };
})();

module.exports = MySqlObject;