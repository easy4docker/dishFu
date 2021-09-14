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

    case 'pull':
      this.pull(
        ()=>{
          me.res.writeHead(302, {"Location": "http://192.168.86.126:3006/"});
          me.res.end();
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
    const sql = "SELECT  `url` FROM `routeService` WHERE `code` = '" + me.req.body.data.code + "'";
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
  const sql = "INSERT INTO `routeService` (`code`, `url`, `created`) VALUES ?";
  const values =[me.req.body.data.code, me.req.body.data.url, new Date()];
  connection.query(sql, [[values]], function (err, result) {
    if (err) {
      callback({status: 'failure', message:err.message});
    } else {
      callback({status: 'success', data: result});
    }
  });
  connection.end();
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action  3 Error!'});
  }
}
module.exports  = RouteService;
