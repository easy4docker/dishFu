var express = require('express');
var router = express.Router();
const RESTS = 'get|put|post|delete'.split('|');
for (let i=0 ; i < RESTS.length; i++) {
  router[RESTS[i]]('/:action/:code/:other', (req, res, next)=> {
    if (['PDF', 'APP'].indexOf(req.params.action) !== -1) {
      res.writeHead(301, {"Location": "http://192.168.86.126:3006/"});
      res.end();
    } else {
      res.send({status: 'failure',  message: 'Action Error!'});
    }
    return true;
  });
  router[RESTS[i]]('/:action/:code/:other/:more', (req, res, next)=> {
    if (['PDF', 'APP'].indexOf(req.params.action) !== -1) {
      res.writeHead(301, {"Location": "http://192.168.86.126:3006/"});
      res.end();
      // res.send(req.params)
    } else {
      res.send({status: 'failure',  message: 'Action Error!'});
    }
    return true;
  });
}

module.exports = router;
