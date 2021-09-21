class AdminService {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.mysql = require('mysql');
    const config = this.req.app.get('config');
    delete require.cache[config.root +'/config/mysql.json'];
    this.cfg = require(config.root +'/config/mysql.json').devDB;
    this.QRCode = require('qrcode');
    this.fs = require('fs');
  }
  tpl = (str, vars) =>{
    var func = new Function(...Object.keys(vars),  "return `"+ str +"`;")
    return func(...Object.values(vars));
  }
  sendPDF(rec) {
    const me = this;
    const fnDoc = __dirname + '/tpl/foodieAuthMail.html';
    const linkUrl = 'http://192.168.86.126:3006/adminAuth/';
    me.QRCode.toDataURL(linkUrl, { 
      width:256,
      type: 'image/png',
      quality: 1.0,
      color: {
          dark: '#000000',  
          light: '#0000'
      }
    }, (err, str)=>{

        me.fs.readFile(fnDoc, 'utf-8', (err, doc)=> {
          try {
            const html = me.tpl(doc, {linkUrl: linkUrl, qrCode : str});
            me.res.send(html);
          } catch (err) {
            me.res.send(err.message + '=>' + doc);
          }
        });
    });
  }
  call() {
    const me = this;
    switch(me.req.params.action) {
      case 'authedUser' :
        me.sendPDF();
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
