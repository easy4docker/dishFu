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
    const v0 = {...cert.validity}
    const siginfo0 = {...cert.siginfo}

    var issuer = [
      {name:'commonName',value:'dishFu.com'}
     ,{name:'countryName',value:'US'}
     ,{shortName:'ST',value:'CA'}
     ,{name:'localityName',value:'San Ramon'}
     ,{name:'organizationName',value:'TestCA'}
     ,{shortName:'OU',value:'Test'}
 ];

    me.rootPrivateKey((rootPrivateKey)=> {
      cert.validity.notBefore = new Date();
      cert.validity.notAfter = new Date();
      
      cert.validity.notAfter.setDate(cert.validity.notBefore.getDate()+15); // give 15 days expiration
      cert.setIssuer(attrs);
      cert.sign(rootPrivateKey);

      me.res.send({
        publicKeyPem2 : pki.publicKeyToPem(cert.publicKey),
        v0:v0, v1: cert.validity, 
        siginfo0: siginfo0, 
        siginfo: cert.siginfo, 
        issuer:cert.subject, 
        subject:cert.subject } );
    })
   
    // me.res.send(['requestCertificate'])
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Cert;
