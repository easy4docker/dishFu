class Admin {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.mysql = require('mysql');
    const config = this.req.app.get('config');
    this.rootpath = config.root;
    delete require.cache[config.root +'/config/mysql.json'];
    this.cfg = require(config.root +'/config/mysql.json').devDB;
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
        me.processPhone({status: 'failure', message:err.message});
      } else {
        if (result && result.length) {
          me.processPhone({status: 'success', data: result});
        } else {
          me.processPhone({status: 'failure', message:'The phone ' + me.req.body.data.phone + ' is not authrized.'});
        }
      }
    });
    connection.end();
  }
  processPhone(data) {
    const me = this;
    if (data.status !== 'success') {
      me.res.send(data);
    } else {
      const  twilioCFG = require(me.rootpath +'/config/sms/twilio.json');
      
      const accountSid = twilioCFG.accountSid; 
      const authToken = twilioCFG.authToken; 
    
      const messagingServiceSid = twilioCFG.messagingServiceSid;
         
      const client = require('twilio')(accountSid, authToken); 
    /*
      client.messages 
            .create({ 
               body: 'clike the link ==> one more test http://192.168.86.126:3006/',  
               messagingServiceSid: messagingServiceSid,      
               to: '+' + me.req.body.data.phone 
             }) 
            .then(message => console.log(message.sid)) 
            .done();
            */
  
     
       me.res.send({status: 'failure', message: JSON.stringify(twilioCFG)});
    }
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
    const accountSid = ''; 
    const authToken = ''; 
    const client = require('twilio')(accountSid, authToken); 
     
    client.messages 
          .create({ 
             body: 'clike the link ==> one more test http://192.168.86.126:3006/',  
             messagingServiceSid: '',      
             to: '+51111' 
           }) 
          .then(message => console.log(message.sid)) 
          .done();
    
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
