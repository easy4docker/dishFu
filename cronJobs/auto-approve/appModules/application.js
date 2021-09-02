class Application {
  constructor(r) {
    this.mysql = require('mysql');
    const config = this.req.app.get('config');
    delete require.cache[config.root +'/config/mysql.json'];
    this.cfg = require(config.root +'/config/mysql.json').devDB;;
  }
  process() {
    const me = this;
    const connection = me.mysql.createConnection(me.cfg);
    connection.connect();

    const sql = "SELECT * FROM `application`";
    connection.query(sql, function (err, result) {
      if (err) {
        console.log({status: 'failure', message:err.message});
      } else {
        console.log({status: 'success', data: result});
      }
    });
    connection.end();
  }
  actionError() {
    const me = this;
    console.log({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Application;
