var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/* POST setting. */
router.post('/', function(req, res) {
  var setting = req.param('setting');
  if(!setting) {
    res.send('No setting given.');
    return;
  }

  connections = 1;
  res.send({success: true, setting: setting, id: connections});
});

module.exports = router;
