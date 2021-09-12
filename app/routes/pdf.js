var express = require('express');
var router = express.Router();
const RESTS = 'get|put|post|delete'.split('|');
for (let i=0 ; i < RESTS.length; i++) {
  router[RESTS[i]]('/:action/:id', (req, res, next)=> {
    if (['adminPDF', 'customerPDF'].indexOf(req.params.action) !== -1) {
      const config = req.app.get('config');
      delete require.cache[config.root +'/appModules/pdf/' + req.params.action + '.js'];
      const PDF = require(config.root +'/appModules/pdf/' + req.params.action + '.js');
      const pdf = new PDF(req, res, next);
      pdf.run()
    } else {
      res.send({status: 'failure',  message: 'Action Error!'});
    }
    return true;
  });
}

module.exports = router;
