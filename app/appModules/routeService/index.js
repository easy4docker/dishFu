class RouteService {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.mysql = require('mysql');
    const config = this.req.app.get('config');
    delete require.cache[config.root +'/config/mysql.json'];
    this.cfg = require(config.root +'/config/mysql.json').devDB;;
  }
  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *  charactersLength));
   }
   return result;
  }
  call() {
    const me = this;
    switch(me.req.params.action) {
      case 'push':
        me.push(
          (result)=>{
            me.res.send(result);
            /*
            me.res.writeHead(302, {"Location": "http://192.168.86.126:3006/"});
            me.res.end();*/
          }
        );
        break;
      case 'pull':
        me.pull(
          (result)=>{
            me.res.send(result);
            /*
            me.res.writeHead(302, {"Location": "http://192.168.86.126:3006/"});
            me.res.end();*/
          }
        );
        break;
      default:  
        me.actionError(); 
    }
  }
  pull(callback) {
      const me = this;
      const connection = me.mysql.createConnection(me.cfg);
      connection.connect();
      const code = ((!me.req.query.code) ? '' : me.req.query.code).split('.');
      const sql = "SELECT  `data` FROM `hashService` WHERE `code` = '" +code[0] + "' AND `id` = '" + code[1] + "'";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          callback({status: 'failure', message:err.message});
        } else {
          if (result && result.length) {
            callback({status: 'success', data: result[0]});
          } else {
            callback({status: 'failure', message:'No data'});
          }
        }
      });
      connection.end();

    }

  push(callback) {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    const sql = "INSERT INTO `hashService` (`code`, `data`, `created`) VALUES ?";
    const code = me.makeid(16);
    const values =[code, me.req.body.url, new Date()];
    connection.query(sql, [[values]], function (err, result) {
      if (err) {
        callback({status: 'failure', message:err.message});
      } else {
        callback({status: 'success', data: + code + '.' + result.insertId});
      }
    });
    connection.end();
    }
    actionError() {
      const me = this;
      me.res.send({status: 'failure',  message: 'Action Error!'});
    }
}
module.exports  = RouteService;
