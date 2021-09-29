class Cert {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.fs = require('fs');
    this.forge = require('node-forge');
  }
  rootPrivateKey(callback) {
    const me = this;
    var pki = me.forge.pki;
    me.fs.readFile('/var/_rootCert/privateKey.key', 'utf-8', (err, privatePem)=> {
      const rootPrivateKey = pki.privateKeyFromPem(privatePem);
      callback(rootPrivateKey);
    });
  }
  requestCertificate() {
    const me = this;
    var pki = me.forge.pki;
    const cert = pki.certificateFromPem(me.req.body.data.selfcCert);
    me.rootPrivateKey((rootPrivateKey)=> {
      cert.sign(rootPrivateKey);
      me.res.send({issuer: cert.issuer, subject:cert.subject } );
    })
   
    // me.res.send(['requestCertificate'])
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Cert;
