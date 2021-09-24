const mysql = require('mysql');
module.exports = class mysqlEngine {
    constructor() {
        const _dbConfig = require('/var/_config/mysql/dev/dbConfig.json');
        this.connection = mysql.createConnection(_dbConfig);
    }
    queryParallal(sqlQ, callback) {
        const me = this;

        me.connection.connect();
        const  q = [];
        for (let o in sqlQ) {
            q.push(me.queryPromise(sqlQ[o]));
            
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
    querySerial(sqlQ, callback) {
        const me = this;
        let userIDs = sqlQ;

        const queryPromise = (sql) => {
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
        [...sqlQ].reduce( (previousPromise, nextSql) => {
          return previousPromise.then(() => {
            return me.queryPromise(nextSql);
          });
        }, Promise.resolve(null)).then().then((result) => {
            callback(result)
        }).catch((error) => {
            callback(error.message)
          });
        return true;
    }
}
