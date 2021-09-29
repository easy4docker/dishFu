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
    const cert = pki.createCertificate();

    const certIn = pki.certificateFromPem(me.req.body.data.selfcCert);


    const issuer = [
      {name:'commonName',value:'dishFu.com'}
      ,{name:'countryName',value:'US'}
      ,{shortName:'ST',value:'CA'}
      ,{name:'localityName',value:'San Ramon'}
      ,{name:'organizationName',value:'TestCA'}
      ,{shortName:'OU',value:'Test'}
    ];

    const subject = !me.req.body.data ? [] : me.req.body.data.attr;


    me.rootPrivateKey((rootPrivateKey)=> {
      try {
        cert.publicKey = certIn.publicKey;
        // !me.req.body.data ? '' : pki.publicKeyFromPem(me.req.body.data.publicKey);
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setDate(cert.validity.notBefore.getDate()+15); // give 15 days expiration
        
        cert.setSubject(subject);
        cert.setIssuer(issuer);
        cert.sign(rootPrivateKey);
       
        me.res.send({status:'successs', cert:pki.certificateToPem(cert)});
      } catch (e) {
        me.res.send({e:e.message});
      }

      me.res.send({
        publicKeyPem2 : pki.publicKeyToPem(cert.publicKey),
        issuer : cert.subject.attributes.getAttibute({name:'localityName'}),
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
