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
    queryOnly(sql, callback) {
        const me = this;
        me.connection.connect();
        me.connection.query(sql, (err, result)=> {
            me.connection.end();
            callback((err) ? {status:'failure', message : err.message} : {status:'success', result : result});
        });
    }
    queryPromise(sqlObj) {
        const me = this;
        const sql = (typeof sqlObj === 'string') ? sqlObj : sqlObj.sql;
        const validation = (typeof(sqlObj) === 'string') ? false : sqlObj.validation;
        return new Promise((resolve, reject) => {
            me.connection.query(sql, (err, result)=> {
                if (err) {
                    reject({status:'failure', message : err.message});
                } else {
                    const v = (typeof validation !== 'function') ? true : validation(result);
                    if (v === true) {
                        resolve({status:'success', result : result});
                    } else {
                        reject({status:'failure', message : v.message});
                    }
                }
            });
        });
    }
    querySerial(sqlQ, callback) {
        const me = this;
        const ErrorMessage = [];
        me.connection.connect();
        const exe = sqlQ.reduce((prevPr, nextSql) => {
            return prevPr.then((acc) => {
               return (ErrorMessage.length) ? null :  me.queryPromise(nextSql)
                    .then((resp) => {
                        if (resp.status !== 'success') {
                            ErrorMessage.push(resp.message)
                        }
                        return [...acc, resp]
                    }).catch(e => ErrorMessage.push(e.message))
                });
        }, Promise.resolve([]));
           
        exe.then((result) => {
            me.connection.end();
            callback(ErrorMessage.length ? {status: 'failure', message : ErrorMessage} : 
                { status: 'failure', result : result });
        });
        return true;
    }
}
/*---
    sqlQ could be string array or
    {sql : sql,
    validation : (result) => {
        return true or { message: 'bla bla'}
    }}
    querySerial : will stop once any
    ueryParallal : will run all
    queryOnly( : run once

*/