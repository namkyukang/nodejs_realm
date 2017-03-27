var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });	
});
// /view에 있는 index.jade파일을 연결해준다. - 문법을 만들어주는데 그 형식이  jade
// mvc 형식으로 다 쪼개져 있다. index.jade -> extends layout.jade ....
module.exports = router;
