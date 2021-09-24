const mysql = require('mysql');
module.exports = class mysqlEngine {
    constructor() {
        const _dbConfig = require('/var/_config/mysql/dev/dbConfig.json');
        this.connection = mysql.createConnection(_dbConfig);
    }
    query(sql, callback) {
        const me = this;
        me.connection.connect();
        me.connection.query(sql, function (err, result) {
            me.connection.end();
            if (err) {
            callback({status: 'failure', message:err.message});
            } else {
            callback({status: 'success', data: result});
            }
        });
    }
}
