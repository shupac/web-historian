var fs = require('fs');


exports.readUrls = function(filePath, cb){
  console.log(filePath);
  var siteStr;
  fs.readFile(filePath,{encoding: 'utf8'}, function(err, data) {
    if(err) throw err;
    cb(data);
  });
};

exports.downloadUrls = function(urls){
  urls = urls.split("\n");
};
