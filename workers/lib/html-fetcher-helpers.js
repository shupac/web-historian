var fs = require('fs');
var httpGet = require('http-get');


exports.readUrls = function(filePath, cb){
  var siteStr;
  fs.readFile(filePath,{encoding: 'utf8'}, function(err, data) {
    if(err) throw err;
    cb(data);
  });
};

exports.downloadUrls = function(urls){
  urls = urls.split("\n");


  for(var i = 0 ; i < urls.length; i++){
    var options = {url : urls[i]};
    httpGet.get(options, __dirname+'/../../data/sites/'+urls[i], function (error, result) {
      if (error) {
        console.log(result);
        console.error(error);
      } else {
        console.log('File downloaded at: ' + result.file);
      }
    });
  }
};
