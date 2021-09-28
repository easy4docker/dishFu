class Application {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  save() {
    const me = this;
    const mapping = {
      roles : 'roles' ,
      name : 'name' ,
      publisher :'visitorId',
      address: 'address',
      description: 'description',
      phone: 'phone',
      qualification: 'qualification',
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
      me.res.send(result)
    })
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Application;
