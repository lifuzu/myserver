var express = require('express');
var moment = require('moment');
var router = express.Router();

/* POST login. */
router.post('/', function(req, res) {
  var name = req.param('name');
  var password = req.param('password');
  if(!name || !password) {
    res.send('No username or password given. Please give correct credientials');
    return;
  }

  console.log('Password attempt by: ' + name + ' at: ' + moment() );
  if(password && password == 'letmein') {
    //Add redis key for users
    var userKey = 'user:' + name;
    //redisClient.set(userKey, moment(), redis.print);
  }
  connections = 1;
  res.send({success: true, name: name, id: connections});
});

module.exports = router;