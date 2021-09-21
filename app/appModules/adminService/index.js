class AdminService {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.mysql = require('mysql');
    const config = this.req.app.get('config');
    delete require.cache[config.root +'/config/mysql.json'];
    this.cfg = require(config.root +'/config/mysql.json').devDB;;
  }
  call() {
    this.res.send('===AdminService===AdminService');

  }
  actionError(str) {
    const me = this;
    me.res.send({status: 'failure',  p: me.req.params, d: me.req.body, message: (str) ? str : 'Action -- Error!'});
  }
}
module.exports  = AdminService;
