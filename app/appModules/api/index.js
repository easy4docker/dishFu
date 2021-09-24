module.exports = (req, res, next)=> {
  const appModule = (module,req, res, next)=> {
    delete require.cache[__dirname +'/' + module + '.js'];
    const M = require(__dirname +'/' + module + '.js');
    const m = new M(req, res, next);
    if (!!req.body.action && typeof m[req.body.action] === 'function') {
      m[req.body.action]();
    } else {
      m.actionError();
    }
  }
  const adminModule = (module,req, res, next)=> {
    delete require.cache[__dirname +'/adminApp/' + module + '.js'];
    const M = require(__dirname +'/adminApp/' + module + '.js');
    const m = new M(req, res, next);
    if (!!req.body.action && typeof m[req.body.action] === 'function') {
      m[req.body.action]();
    } else {
      m.actionError();
    }
  }
  switch (req.params.module) {
    case 'application':
    case 'community':
    case 'auth':
    case 'ad':
    case 'menu':
      appModule(req.params.module, req, res, next);
      break
    case 'admin':
    case 'usersAdmin':
      adminModule(req.params.module, req, res, next);
      break

    case 'getMainIp':
      const fs = require('fs');
      const connection = req.app.get('dbConnection');
      connection.connect();
      const sql = "SHOW TABLES";
      /*
      fs.readFile('/var/_ROOTENV/mainip.data', 'utf-8', (err, data)=>{
        res.send((err) ? {status:'failure', message: err.message } : {status:'success', 
          dbConfig : req.app.get('dbConfig'),
          data: data.replace(/^\s+|\s+$/gm,'')});
      })
*/
      connection.query(sql, function (err, result) {
        if (err) {
          me.res.send({status: 'failure', message:err.message});
        } else {
          me.res.send({status: 'success', data: result});
        }
      });
      connection.end();      
      break

    default: 
      res.send({status: 'failure', message: 'wrong or missing module!'});
    break;
  }
}