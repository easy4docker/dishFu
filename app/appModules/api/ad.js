class Ad {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  homeList() {
    const me = this;
    me.res.sendFile('/var/_appData/homeAd.json');
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Ad;
