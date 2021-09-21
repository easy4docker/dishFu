var express = require('express');
var router = express.Router();
const RESTS = 'get|put|post|delete'.split('|');
for (let i=0 ; i < RESTS.length; i++) {
  router[RESTS[i]]('/:action/', (req, res, next)=> {
    const config = req.app.get('config');
    delete require.cache[config.root +'/appModules/adminService/index.js'];
    const ServiceEngine = require(config.root +'/appModules/adminService/index.js');
    const serviceEngine = new ServiceEngine(req, res, next);
    serviceEngine.call();
    return true;
  });
  router[RESTS[i]]('/:action/:code', (req, res, next)=> {
    const config = req.app.get('config');
    delete require.cache[config.root +'/appModules/adminService/index.js'];
    const ServiceEngine = require(config.root +'/appModules/adminService/index.js');
    const serviceEngine = new ServiceEngine(req, res, next);
    serviceEngine.call();
    return true;
  });
  router[RESTS[i]]('/:action/:code/:other', (req, res, next)=> {
    const config = req.app.get('config');
    delete require.cache[config.root +'/appModules/adminService/index.js'];
    const ServiceEngine = require(config.root +'/appModules/adminService/index.js');
    const serviceEngine = new ServiceEngine(req, res, next);
    serviceEngine.call();
    return true;
  });
  router[RESTS[i]]('/:action/:code/:other/:more', (req, res, next)=> {
    const config = req.app.get('config');
    delete require.cache[config.root +'/appModules/adminService/index.js'];
    const ServiceEngine = require(config.root +'/appModules/adminService/index.js');
    const serviceEngine = new ServiceEngine(req, res, next);
    serviceEngine.call();
    return true;
  });
}

module.exports = router;
