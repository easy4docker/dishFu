class Auth {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  getAuthUserByAuthCode() {
    const me = this;
    const eng = me.req.app.get('mysqlEngine');
    const sql = "SELECT * FROM authUsers WHERE `authCode` = '" + me.req.body.RequestID + "'";
    eng.queryOnly(sql, (result)=> {
      me.res.send(result)
    })
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Auth;
