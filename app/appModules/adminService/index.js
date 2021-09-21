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
    const me = this;
    switch(me.req.params.action) {
      case 'authedUser' :
        me.res.send('me.makeid(32)--');
        break;
     
      default:  
        me.actionError(); 
    }
  }
  actionError(str) {
    const me = this;
    me.res.send({status: 'failure',  p: me.req.params, d: me.req.body, message: (str) ? str : 'Action -- Error!'});
  }
}
module.exports  = AdminService;
