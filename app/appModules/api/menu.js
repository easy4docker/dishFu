class  Menu {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  add() {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();
    const mapping = {
      publishCode   :'publishCode',
      foodie        : ()=>'',
      supie         : ()=>'',
      price         : 'price',
      zip           : 'zip',
      desc          : 'desc',
      created       : ()=>  new Date(),
      status        : ()=> 0
    }
    const sql = "INSERT INTO menu (`" + Object.keys(mapping).join('`,`') + "`) VALUES ?";
    const values =[];
    for (let k in mapping) {
      const func = (typeof mapping[k] === 'function') ?  true :  false;
      values.push((!me.req.body || !me.req.body.data[mapping[k]]) ? (func) ? mapping[k]() : '' 
          :  me.req.body.data[mapping[k]])
    }
    connection.query(sql, [[values]], function (err, result) {
      if (err) {
        me.res.send({status: 'failure', message:err.message});
      } else {
        me.res.send({status: 'success', data: result});
      }
    });
    connection.end();
  }
  getList() {
    const me = this;
    me.res.sendFile('/var/_appData/default/menuList.json');
  }

  getListBK() {
    const me = this;
    const eng = me.req.app.get('mysqlEngine');
    eng.queryOnly('SELECT * FROM `menu` limit 100', (result)=> {
      me.res.send(result)
    })
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Menu;
