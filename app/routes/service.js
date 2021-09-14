var express = require('express');
var router = express.Router();
const RESTS = 'get|put|post|delete'.split('|');
for (let i=0 ; i < RESTS.length; i++) {
  router[RESTS[i]]('/:action/:code/:other', (req, res, next)=> {
    if (['PDF', 'APP'].indexOf(req.params.action) !== -1) {
      res.send(req.params)
    } else {
      res.send({status: 'failure',  message: 'Action Error!'});
    }
    return true;
  });
}

module.exports = router;
