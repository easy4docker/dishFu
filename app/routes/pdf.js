var express = require('express');
var router = express.Router();
const RESTS = 'get|put|post|delete'.split('|');
for (let i=0 ; i < RESTS.length; i++) {
  router[RESTS[i]]('/:id', function(req, res, next) {
    const config = req.app.get('config');
    delete require.cache[config.root +'/pdfModules/customerPDF.js'];
    const CustomerPDF = require(config.root +'/pdfModules/customerPDF.js');
    const custmerPDF = new CustomerPDF(req, res, next);
    custmerPDF.run()
    return true;
  });
}

module.exports = router;
