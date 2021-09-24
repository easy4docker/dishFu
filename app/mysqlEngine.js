const mysql = require('mysql');
module.exports = class mysqlEngine {
    constructor() {
        const _dbConfig = require('/var/_config/mysql/dev/dbConfig.json');
        this.connection = mysql.createConnection(_dbConfig);
    }
    queryAll(sqlQ, callback) {
        const me = this;
        me.connection.connect();
        const  q = [];
        for (let sql in sqlQ) {
            q.push(me.queryPromise(sql));
        }
        Promise.all(q).then((values) => {
            me.connection.end();
            callback(values);
        }).catch(error => {
            me.connection.end();
            callback(error);
        });
        
    }
    queryPromise(sql) {
        const me = this;
        return new Promise((resolve, reject) => {
            me.connection.query(sql, (err, result)=> {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    }
    queryBK(sql, callback) {
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
