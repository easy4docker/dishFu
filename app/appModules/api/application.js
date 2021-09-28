class Application {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.fs = require('fs');
    this.forge = require('node-forge');
  }
  save() {
    const me = this;
    me.generateCA((ca)=>{
      me.saveToDb(ca);
    });
  }

  saveToDb(ca) {
    const me = this;
    const mapping = {
      roles : 'roles' ,
      name : 'name' ,
      publisher :'visitorId',
      address: 'address',
      description: 'description',
      phone: 'phone',
      qualification: 'qualification',
      privateKey : ()=>  ca.privateKey,
      publicKey : ()=>  ca.publicKey,
      created: ()=>  new Date(),
      status: ()=> 0
    }
    const eng = me.req.app.get('mysqlEngine');
    const sql = "INSERT INTO application (`" + Object.keys(mapping).join('`,`') + "`) VALUES ?";
    const values =[];
    for (let k in mapping) {
      const func = (typeof mapping[k] === 'function') ?  true :  false;
      values.push((!me.req.body || !me.req.body.data[mapping[k]]) ? (func) ? mapping[k]() : '' 
          :  me.req.body.data[mapping[k]])
    }
    eng.queryInsert(sql, [[values]], (result)=> {
      result.ca = ca,
      me.res.send(result)
    })
  }
  rootPrivateKey(callback) {
    const me = this;
    var pki = me.forge.pki;
    me.fs.readFile('/var/_rootCert/privateKey.key', 'utf-8', (err, privatePem)=> {
      const rootPrivateKey = pki.privateKeyFromPem(privatePem);
      callback(rootPrivateKey);
    });
  }
  generateCA(callback) {
    const me = this;
    me.rootPrivateKey((rootPrivateKey)=> {
      me.forge.options.usePureJavaScript = true; 
  
      var pki = me.forge.pki;
      var keys = pki.rsa.generateKeyPair(2048);
      var cert = pki.createCertificate();
  
      cert.publicKey = keys.publicKey;
      cert.serialNumber = '01';
      cert.validity.notBefore = new Date();
      cert.validity.notAfter = new Date();
      cert.validity.notAfter.setFullYear(cert.validity.notBefore.getDate()+15); // give 15 days expiration
  
      var attrs = [
          {name:'commonName',value:'foodie.com'}
          ,{name:'countryName',value:'US'}
          ,{shortName:'ST',value:'CA'}
          ,{name:'localityName',value:'San Ramon'}
          ,{name:'organizationName',value:'Test'}
          ,{shortName:'OU',value:'Test'}
      ];
      cert.validity.notBefore = new Date();
      cert.setSubject(attrs);
      cert.setIssuer(attrs);
      cert.sign(rootPrivateKey);
  
      callback({
        privateKey  : pki.privateKeyToPem(keys.privateKey),
        publicKey   : pki.publicKeyToPem(keys.publicKey),
        cert        : pki.certificateToPem(cert)
      });
    })
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Application;
