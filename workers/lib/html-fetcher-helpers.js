var fs = require('fs');
var httpGet = require('http-get');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'webhistorian'
});

connection.query('SELECT * from websites', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows);
});

exports.readUrls = function(filePath, cb){
  var siteStr;
  fs.readFile(filePath,{encoding: 'utf8'}, function(err, data) {
    if(err) throw err;
    cb(data);
  });
};

exports.downloadUrls = function(urls){
  console.log(urls);
  urls = urls.split("\n");

  for(var i = 0 ; i < urls.length; i++){
    var http = require('http-get');
    var options = {
      url: urls[i]
    };
    http.get(options, function (error, result) {
      if (error) {
        console.error(error);
      } else {
          console.log('NEWNEWNEW');
          console.log(result.buffer);
          console.log('End Event');
      }
    });
  }
};
