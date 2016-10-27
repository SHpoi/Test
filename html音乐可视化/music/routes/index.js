var express = require('express');
var router = express.Router();
var path=require('path');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//设置media路径配置
var media=path.join(__dirname,'../public/media');
router.get('/',function(req,res,next){
  var fs=require('fs');
  fs.readdir(media,function(err,names){
    if(err){
      console.log('err')
    }else{
      res.render('index',{title:'Canvas Music可视化',music:names });
    }
  });
  
})

module.exports = router;
