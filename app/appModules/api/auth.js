class Auth {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.mysql = require('mysql');
    const config = this.req.app.get('config');
    delete require.cache[config.root +'/config/mysql.json'];
    this.cfg = require(config.root +'/config/mysql.json').devDB;;
  }
  getAuthUserByAuthCode() {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    const sql = "SELECT * FROM authUsers WHERE `authCode` = '" + me.req.body.RequestID + "'";
    connection.query(sql, function (err, result, fields) {
      if (err) {
        me.res.send({status: 'failure', message:err.message});
      } else {
        if (result[0]) {
          me.res.send({status: 'success', data: {
            authCode : result[0].authCode,
            roles : result[0].roles.split(','),
            address : result[0].address,
            description : result[0].desc
          }
          });
        } else {
          me.res.send({status: 'failure', message:'No data'});
        }
      }
    });
    connection.end();


    /*
    me.res.send({status:'success', data:{
          "authCode": "bfadb7d286248d7eb4db00ffa65bc863", "roles":[ "foodie"],
          "address":"3251 Sleeping Meadow Way,San Ramon,CA 94582",
          "description":"3251 Sleeping Meadow Way, San Ramon, CA 94582"
      }});*/
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Auth;
