class Service {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.mysql = require('mysql');
    const config = this.req.app.get('config');
    delete require.cache[config.root +'/config/mysql.json'];
    this.cfg = require(config.root +'/config/mysql.json').devDB;;
  }
  dishFuHashService(url, callback) {
    const https = require('https');
    const data = JSON.stringify({ url: url })

    const options = {
      hostname: 'dishfu.com',
      port: 443,
      rejectUnauthorized: 0,
      path: '/_service_/push/code/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
    const req = https.request(options, res => {
      res.on('data', d => callback(d))
    })

    req.on('error', error => {
      callback(error)
    })
    req.end()
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
      case 'qr' :
        me.res.send(me.makeid(32));
        break;
      case 'push':
        me.push(
          (result)=>{
            me.res.send(result);
          }
        );
        break;
      case 'pull':
        me.pull(
          (result)=>{
            if (result.status === 'success' && result.data) {
              me.res.writeHead(302, {"Location": result.data.data});
              me.res.end();
            } else {
              me.res(result);
            }
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
      const code = ((!me.req.params.code) ? '' : me.req.params.code).split('.');
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
        callback({status: 'success', data: code + '.' + result.insertId});
      }
    });
    connection.end();
  }

  saveQrScanData(callback) {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    const sql = "INSERT INTO `qrService` (`code`, actionCode, `data`, `created`) VALUES ?";
    const values =[me.req.body.code, me.req.body.actionCode, me.req.body.data, new Date()];
    connection.query(sql, [[values]], function (err, result) {
      if (err) {
        callback({status: 'failure', message:err.message});
      } else {
        callback({status: 'success', data: code + '.' + result.insertId});
      }
    });
    connection.end();
  }

  actionError(str) {
    const me = this;
    me.res.send({status: 'failure',  p: me.req.params, d: me.req.body, message: (str) ? str : 'Action -- Error!'});
  }
}
module.exports  = Service;
