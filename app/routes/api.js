var express = require('express');
var router = express.Router();
const RESTS = 'get|put|post|delete'.split('|');
for (let i=0 ; i < RESTS.length; i++) {
  router[RESTS[i]]('/:module/', function(req, res, next) {
    const config = req.app.get('config');
    delete require.cache[config.root +'/apiModules/index.js'];
    const appEngine = require(config.root +'/apiModules/index.js');
    appEngine(req, res, next);
    return true;
  });
  router[RESTS[i]]('/:module/:id', function(req, res, next) {
    const config = req.app.get('config');
    delete require.cache[config.root +'/apiModules/index.js'];
    const appEngine = require(config.root +'/apiModules/index.js');
    appEngine(req, res, next);
    return true;
  });
}

module.exports = router;
