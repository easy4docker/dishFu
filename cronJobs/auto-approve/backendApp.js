const tools = require('./tools');
module.exports = class App extends tools {
    constructor() {
        super();
        const p = __dirname.split('/cronJobs/')
        this.config = {
            root : p[0],
            isDocker: /^\/var\/app\//.test(p[0]) ? true : false
        }
        this.dbCfg = require(this.config.root + '/app/config/mysql.json').devDB;
        this.mysql = require('mysql');
        this.dbCfg.host = (this.config.isDocker) ?  this.dbCfg.host : '127.0.0.1';
    }
    output() {
        const me = this;
        const connection = me.mysql.createConnection(me.dbCfg);
        connection.connect();
    
        const sql = "SELECT * FROM `application`";
        connection.query(sql, function (err, result) {
          if (err) {
            console.log({status: 'failure', message:err.message});
          } else {
            console.log({status: 'success', data: result});
          }
        });
        connection.end();
        console.log(me.dbCfg)
    }
}