class Admin {
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
  checkPhone() {
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
  addSessionRecord() {
    changeSessionRecord('add'); 
  }
  updateSessionRecord() {
    changeSessionRecord('update'); 
  }
  changeSessionRecord(code)  {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    if (code === 'update') {
        const sql = "UPDATE adminSession  SET `socketid` = '" + me.req.body.data.socketid + "', `created` = '" + new Date() + "'" + 
        " WHERE `visitorId` = '" + me.req.body.data.visitorId + "'  " +
        " AND `token` = '" + me.req.body.data.token + "' ";
        " AND `phone` = '" + me.req.body.data.phone + "' ";
        connection.query(sql, function (err, result) {
          if (err) {
            me.res.send({status: 'failure', message:err.message});
          } else {
            me.res.send({status: 'success', data: result});
          }
        });
      } else {
        const values = [
          me.req.body.data.phone, me.req.body.data.visitorId, me.req.body.data.token, me.req.body.data.socketid, me.makeid(32), new Date()
        ]
        const sql = "INSERT INTO adminSession (`phone`, `visitorId`, `token`, `socketid`, `authcode`, `created`) VALUES ?";
        connection.query(sql, [[values]], function (err, result) {
          if (err) {
            me.res.send({status: 'failure', message:err.message});
          } else {
            me.res.send({status: 'success', data: result});
          }
        });
    }
    connection.end();
  }
  /*
  readSessionRecord(callback) {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    const values = [
      me.req.body.data.phone, me.req.body.data.visitorId, me.req.body.data.token, me.req.body.data.socketid, me.makeid(32), new Date()
    ]
    const sql = "SELECT * FROM adminSession WHERE `visitorId` = '" + me.req.body.data.visitorId + "'  " +
    " AND `token` = '" + me.req.body.data.token + "' ";
    " AND `phone` = '" + me.req.body.data.phone + "' ";
    connection.query(sql, [[values]], function (err, result) {
      if (err) {
        callback({status: 'failure', message:err.message});
      } else {
        callback({status: 'success', data: result});
      }
    });
    connection.end();
  }
*/
  checkTokenAuthCode() {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    const sql = "SELECT * FROM `adminSession` WHERE `token` = '" + me.req.body.data.token + "' AND `authcode` = '" + me.req.body.data.authcode + "'";
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
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Admin;
