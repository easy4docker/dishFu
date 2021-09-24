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

        let result = [...userIDs].reduce( (previousPromise, nextID) => {
          return previousPromise.then(() => {
            return me.queryPromise(nextID);
          });
        }, Promise.resolve()); 

        result.then(e => {
            callback("Resolution is complete! Let's party.")
          });

        return true;
        /*
        const me = this;
        let vals = sqlQ;
        let chain = Promise.resolve();
        for(let val of vals) {
          chain = chain.then(() => me.queryPromise(val));
        }
        chain.then((result) =>{
            callback(result);
        });*/
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
