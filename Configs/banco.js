const mysql = require('mysql');

const dbConnection = function () {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'node.mysql'
    });
}

const query = function (query_dinamica) {
    return new Promise((response, erro) => {
        let connection = dbConnection();
        connection.query(query_dinamica
            , function (err, result) {
                if (err) {
                    connection.end();
                    erro(err);
                } else {
                    connection.end();
                    response(result);
                }
            });
    });
}
module.exports = { query }