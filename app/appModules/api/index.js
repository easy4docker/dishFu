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
    delete require.cache[__dirname +'/admin/' + module + '.js'];
    const M = require(__dirname +'/admin' + module + '.js');
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

    default: 
      res.send({status: 'failure', message: 'wrong or missing module!'});
    break;
  }
}