class usersAdmin {
    constructor(req, res, next) {
      this.req = req;
      this.res = res;
      this.next = next;
    }
    getAuthUsers() {
      const me = this;
      const eng = me.req.app.get('mysqlEngine');
      const sql = "SELECT * FROM `authUsers` WHERE 1";
      eng.queryOnly(sql, (resultData)=> {
        me.res.send(resultData);
      });
    }
    getAuthUserById() {
      const me = this;
      const eng = me.req.app.get('mysqlEngine');
      const sql = "SELECT * FROM `authUsers` WHERE `id` = '" + 
        (!me.req.body || !me.req.body.data ? '' : me.req.body.data.id + "'");

      eng.queryOnly(sql, (resultData)=> {
        me.res.send(resultData);
      });
    }
  }
  module.exports  = usersAdmin;
  