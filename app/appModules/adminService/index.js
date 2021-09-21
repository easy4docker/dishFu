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
      case 'qr' :
        me.res.send('me.makeid(32)');
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

      case 'saveQrScanData':
        me.saveQrScanData(
          (result)=>{
            me.res.send(result);
          }
        );
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
