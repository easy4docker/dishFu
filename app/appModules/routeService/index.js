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
  if (['push', 'pull'].indexOf(me.req.params.action) !== -1) {
    me.res.writeHead(302, {"Location": "http://192.168.86.126:3006/"});
    me.res.end();
    // res.send(req.params)
  } else {
    me.actionError();
  }
}
push() {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    const sql = "SELECT * FROM admin WHERE `phone` = '" + me.req.body.data.phone + "'";
    connection.query(sql, function (err, result, fields) {
      if (err) {
        me.res.send({status: 'failure', message:err.message});
      } else {
        if (result && result.length) {
          me.res.send({status: 'success', data: result});
        } else {
          me.res.send({status: 'failure', message:'No data'});
        }
      }
    });
    connection.end();

  }

pull() {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    const sql = "SELECT * FROM `adminSession` WHERE `phone` = '" + me.req.body.data.phone + "' AND " +
        "`token` = '" + me.req.body.data.token + "'"
    connection.query(sql, function (err, result, fields) {
      if (err) {
        me.res.send({status: 'failure', message:err.message});
      } else {
        if (result && result.length) {
          me.res.send({status: 'success', data: result});
        } else {
          me.res.send({status: 'failure', message:'No data'});
        }
      }
    });
    connection.end();

  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action  2 Error!'});
  }
}
module.exports  = RouteService;
