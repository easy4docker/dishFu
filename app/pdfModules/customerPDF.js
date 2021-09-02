class CustomerPDF {
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
  run() {
    const me = this;
    const fnDoc = __dirname + '/tpl/mailQrCodeDoc.html';
    const fnPDF = __dirname  + '/userData/mailQrCodeDoc.pdf';
    const linkUrl = 'http://192.168.86.126:3000/scanSignin/';

    me.QRCode.toDataURL(linkUrl , { 
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
            const options = { format: 'A4', 
            'border': {
              'top': '0.5in',            // default is 0, units: mm, cm, in, px
              'right': '0.5in',
              'bottom': '0.5in',
              'left': '0.5in'
            }};
            me.pdf.create(html, options).toFile(fnPDF, function(err, res) {
              // if (err) return console.log(err);
              // console.log(res); // { filename: '/app/businesscard.pdf' }
              me.res.sendFile(fnPDF);
            });
            
          } catch (err) {
            me.res.send(err.message + '=>' + doc);
          }
        });
    });
  }
  onError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = CustomerPDF;
