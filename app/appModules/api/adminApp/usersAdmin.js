class usersAdmin {
    constructor(req, res, next) {
      this.req = req;
      this.res = res;
      this.next = next;
      this.mysql = require('mysql');
      const config = this.req.app.get('config');
      this.rootpath = config.root;
      delete require.cache[config.root +'/config/mysql.json'];
      this.cfg = require(config.root +'/config/mysql.json').devDB;
    }
    getAuthUsers() {
      const me = this;
      const connection = me.mysql.createConnection(me.cfg);
      connection.connect();
      const sql = "SELECT * FROM `authUsers` WHERE 1"
      connection.query(sql, function (err, result, fields) {
        if (err) {
          me.res.send({status: 'failure', message:err.message});
        } else {
          if (result && result.length) {
            me.res.send({status: 'success', data: result});
          }
        }
      });
      connection.end();
    }
    getAuthUserById() {
      const me = this;
      const connection = me.mysql.createConnection(me.cfg);
      connection.connect();
      const sql = "SELECT * FROM `authUsers` WHERE `id` = '" + 
        (!me.req.body || !me.req.body.data ? '' : me.req.body.data.id + "'");
      connection.query(sql, function (err, result, fields) {
        if (err) {
          me.res.send({status: 'failure', message:err.message, ppp:sql});
        } else {
          if (result && result.length) {
            me.res.send({status: 'success', data: result});
          }
        }
      });
      connection.end();
    }
  }
  module.exports  = usersAdmin;
  