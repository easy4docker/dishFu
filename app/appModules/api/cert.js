class Cert {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  requestCertificate() {
    const me = this;
    me.res.send(['requestCertificate'])
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Cert;
