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
    me.generateCA(15, (ca)=>{
      me.saveToDb(ca);
    });
  }

  saveToDb(cadata) {
    const me = this;
    if (cadata.status === 'failure') {
        me.res.send(cadata.status)
    } else {
      const mapping = {
        roles : 'roles' ,
        name : 'name' ,
        publisher :'visitorId',
        address: 'address',
        description: 'description',
        phone: 'phone',
        qualification: 'qualification',
        privateKey : ()=>  'ca.privateKey',
        publicKey : ()=>  'ca.publicKey',
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
        result.ca = cadata.ca,
        me.res.send(result)
      })
    }
  }
  rootPrivateKey(callback) {
    const me = this;
    var pki = me.forge.pki;
    me.fs.readFile('/var/_rootCert/privateKey.key', 'utf-8', (err, privatePem)=> {
      const rootPrivateKey = pki.privateKeyFromPem(privatePem);
      callback(rootPrivateKey);
    });
  }
  generateCA(expd, callback) {
    const me = this;
    const addressObj = !me.req.body.data ? {} : me.req.body.data.addressObj;
    const address = !me.req.body.data ? '' : me.req.body.data.address;
    me.rootPrivateKey((rootPrivateKey)=> {
      me.forge.options.usePureJavaScript = true; 
  
      var pki = me.forge.pki;
      var keys = pki.rsa.generateKeyPair(2048);
      var cert = pki.createCertificate();
  
      cert.publicKey = keys.publicKey;
      cert.serialNumber = '01';
      cert.validity.notBefore = new Date();
      cert.validity.notAfter = new Date();
      cert.validity.notAfter.setDate(cert.validity.notBefore.getDate()+expd); // give 15 days expiration

      const attrs = [
        {name:'commonName',value: address}
        ,{name:'countryName',value:addressObj.country}
        ,{shortName:'ST',value:addressObj.state}
        ,{name:'localityName',value:addressObj.city}
        ,{name:'organizationName',value:addressObj.name}
        ,{shortName:'OU',value:'foodie'}
      ];

      try {

        cert.setSubject(attrs);
        cert.setIssuer(attrs);
        cert.sign(rootPrivateKey);

        callback({status : 'failure', ca :{
          privateKey  : pki.privateKeyToPem(keys.privateKey),
          publicKey   : pki.publicKeyToPem(keys.publicKey),
          cert        : pki.certificateToPem(cert)
        }});
      } catch (e) {
        callback({ status: 'failure', message: e.message, data:attrs });
      }
    })
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Application;
