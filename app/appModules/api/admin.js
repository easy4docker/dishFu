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

  getTargetSocket() {
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
  textService () {
    const Vonage = require('@vonage/server-sdk');
    const vonage = new Vonage({
      apiKey: "d6375822",
      apiSecret: "6YgWVWALI4voZoXQ"
    })
    const from = "18445646384"
    const to = "15108467571"
    const text = 'just want to test dynamic link https://dishfu.com/_service_/pull/TLL4dkpLVWyzJQeX.3/info '

    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
  }
  addSessionRecord() {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    const sql = "SELECT `id` FROM  `adminSession`  " + 
        " WHERE `visitorId` = '" + me.req.body.data.visitorId + "'  " +
        " AND `token` = '" + me.req.body.data.token + "' " +
        " AND `phone` = '" + me.req.body.data.phone + "' ";
    connection.query(sql, function (err, result) {
      if (err) {
        me.res.send({status: 'failure', message:err.message});
      } else {
        if (!result.length) {
          me.changeSessionRecord('add'); 
        } else {
          
          me.res.send({status: 'success', data: result, pp:888});
        }
      }
    });
    connection.end();
    
  }
  updateSessionRecord() {
    this.changeSessionRecord('update'); 
  }
  deleteSessionRecord() {
    this.changeSessionRecord('delete'); 
  }

  changeSessionRecord(code)  {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    if (code === 'delete') {
        const sql = "DELETE FROM  adminSession  " + 
        " WHERE `visitorId` = '" + me.req.body.data.visitorId + "'  " +
        " AND `token` = '" + me.req.body.data.token + "' " +
        " AND `phone` = '" + me.req.body.data.phone + "' ";
        connection.query(sql, function (err, result) {
          if (err) {
            me.res.send({status: 'failure', message:err.message});
          } else {
            me.res.send({status: 'success', data: result});
          }
        });
      } else if (code === 'add') {
        const values = [
          me.req.body.data.phone, me.req.body.data.visitorId, me.req.body.data.token, me.req.body.data.socketid, me.makeid(32), new Date()
        ]
        const sql = "INSERT INTO adminSession (`phone`, `visitorId`, `token`, `socketid`, `authcode`, `created`) VALUES ?";
        connection.query(sql, [[values]], function (err, result) {
          if (err) {
            me.res.send({status: 'failure', message:err.message});
          } else {
            //  me.textService ();
            me.res.send({status: 'success', data: result, ppp:999});
          }
        });
      }  else  {
        const sql = "UPDATE adminSession  SET `socketid` = '" + me.req.body.data.socketid + "', `created` = NOW()" + 
        " WHERE `visitorId` = '" + me.req.body.data.visitorId + "'  " +
        " AND `token` = '" + me.req.body.data.token + "' " +
        " AND `phone` = '" + me.req.body.data.phone + "' ";
        connection.query(sql, function (err, result) {
          if (err) {
            me.res.send({status: 'failure', message:err.message});
          } else {
            me.res.send({status: 'success', data: result + '==='+sql});
          }
        });
      } 
    connection.end();
  }

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
