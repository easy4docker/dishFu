const tools = require('./tools');
const md5 = require('md5');
const path = require('path');
module.exports = class App extends tools {
    constructor() {
        super();
        const p = __dirname.split('/cronJobs/')
        this.config = {
            root : path.join(__dirname, '..')
        }
        delete require.cache[this.config.root +'/mysqlEngine.js'];
        const MYSQLENGINE = require(this.config.root + '/mysqlEngine');
        const eng = new MYSQLENGINE();
    }
    output() {
        const me = this;
        const sql = "SELECT * FROM `application` WHERE `status` = 0 AND `type` = 'foodie' limit 100";
        this.eng.queryOnly(sql, (resultData)=> {
          if (resultData.status === 'success') {
            console.log(resultData);
          } else {
            if (resultData.result.length) {
              me.insertProcess(resultData.result);
            }
          }
        });
    }
    insertProcess(v) {
        const values =[];
        const fields = ['authCode', 'address', 'description', 'roles', 'specialFoodie', 'created', 'status'];
        const cleanList = [];
        for (let i = 0; i < v.length; i++ ) {
            values.push([
                md5(v[i].address), 
                v[i].address, v[i].publisher, 
                v[i].type, 
                (v[i].type === 'foodie') ? 1 : 0,
                new Date(),
                0
            ]);
            cleanList.push(v[i].id);
        }
        const me = this;
        const sql = "INSERT INTO authUsers (`" + fields.join('`,`') + "`) VALUES ?";
        this.eng.queryInsert(sql,  [values], (resultData)=> {
          if (resultData.status !== 'success') {
            console.log(resultData);
          } else {
            console.log(resultData);
            if (cleanList.length) {
              me.cleanProcess(cleanList)
            }
          }
        });
    }
    cleanProcess(v) {
        const me = this;
        const sql = "UPDATE `application` SET `status` = 1 WHERE `id` IN (" + v.join(',') + ")";
        this.eng.queryOnly(sql, (resultData)=> {
            if (resultData.status !== 'success') {
                console.log('cleanProcess error =>', resultData.message);
            } else {
              console.log('cleanProcess success =>', resultData);
            }
          });
    }
}