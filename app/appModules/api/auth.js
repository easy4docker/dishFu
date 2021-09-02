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
    me.res.send({status:'success', data:{
          "authCode": "bfadb7d286248d7eb4db00ffa65bc863", "roles":[ "foodie", "supie"],
          "address":"3251 Sleeping Meadow Way,San Ramon,CA 94582",
          "description":"3251 Sleeping Meadow Way, San Ramon, CA 94582"
      }});
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Auth;
