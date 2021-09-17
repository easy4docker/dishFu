class QrPDF {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.mysql = require('mysql');
    this.config = this.req.app.get('config');
    delete require.cache[this.config.root +'/config/mysql.json'];
    this.cfg = require(this.config.root +'/config/mysql.json').devDB;;
    this.QRCode = require('qrcode');
    this.pdf = require('html-pdf');
    this.fs = require('fs');
  }
  tpl = (str, vars) =>{
    var func = new Function(...Object.keys(vars),  "return `"+ str +"`;")
    return func(...Object.values(vars));
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
  sendPDF() {
    const me = this;
    const fnDoc = __dirname + '/tpl/3stamps.html';
    const linkUrl = 'http://192.168.86.126:3006/3Stamps/'+this.makeid(32);
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
  run() {
    const me = this;
    me.sendPDF();
    return true;
  }
  onError(message) {
    const me = this;
    me.res.send({status: 'failure',  message: message});
  }
}
module.exports  = QrPDF;
