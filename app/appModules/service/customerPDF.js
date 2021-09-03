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
  getRecord(callback) {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    const sql = "SELECT * FROM `authUsers`";
    connection.query(sql, function (err, result, fields) {
      if (err) {
        me.onError(err.message)
      } else {
        callback(result);
      }
    });
    connection.end();
  }
  sendPDF(hashCode) {
    const me = this;
    const fnDoc = __dirname + '/tpl/mailQrCodeDoc.html';
    const fnPDF = me.config.dataFolder  + '/' + (!hashCode ? 'mailQrCodeDoc.pdf' : (hashCode + '.pdf'));
    const linkUrl = 'http://192.168.86.126:3000/scanSignin/' + hashCode;



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
            const options = { format: 'A4', 
            'border': {
              'top': '0.5in',            // default is 0, units: mm, cm, in, px
              'right': '0.5in',
              'bottom': '0.5in',
              'left': '0.5in'
            }};

            me.pdf.create(html, options).toFile(fnPDF, (err, res) => {
             // me.res.send( res);
             // return true;
              me.res.sendFile(fnPDF);
            });
            
          } catch (err) {
            me.res.send(err.message + '=>' + doc);
          }
        });
    });
  }
  run() {
    const me = this;
    me.getRecord(
      (rec) => {
        me.sendPDF((!rec || !rec[0]) ? '' : rec[0].authCode);
      }
    ); 
    return true;
  }
  onError(message) {
    const me = this;
    me.res.send({status: 'failure',  message: message});
  }
}
module.exports  = CustomerPDF;
