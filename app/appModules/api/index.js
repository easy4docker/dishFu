module.exports = (req, res, next)=> {
  const standardModule = (module,req, res, next)=> {
    delete require.cache[__dirname +'/' + module + '.js'];
    const M = require(__dirname +'/' + module + '.js');
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
    case 'menu':
      standardModule(req.params.module, req, res, next);
      /*
      delete require.cache[__dirname +'/menu.js'];
      const Menu = require(__dirname +'/menu.js');
      const menu = new Menu(req, res, next);
      if (!!req.body.action && typeof menu[req.body.action] === 'function') {
        menu[req.body.action]();
      } else {
        menu.actionError();
      }*/
      break

    default: 
      res.send({status: 'failure', message: 'wrong or missing module!'});
    break;
  }
}