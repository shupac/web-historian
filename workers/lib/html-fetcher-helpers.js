var fs = require('fs');
var httpGet = require('http-get');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'webhistorian'
});

// connection.query('SELECT * from websites', function(err, rows, fields) {
//   if (err) throw err;
//   console.log('The solution is: ', rows);
// });

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

  connection.connect();
  for(var i = 0 ; i < urls.length; i++){
    var recordurl = urls[i];
    var http = require('http-get');
    var options = {
      url: urls[i]
    };

    var sqlCallback = function(err,result){
      if(err){console.log(err);}
      else{console.log('Site updated and inserted into database: ' + result);}
      if(this.i === 3) {
        console.log('Sql update complete, closing connection.');
        connection.end();
      }
    };

    var httpCallback = function(error, result){
      i = this.i;
      console.log(this.i);
      if (error) {
        console.error(error);
      } else {
        console.log(urls[i]);
        var post  = {id: 1,
                     url: urls[i],
                     file: result.buffer,
                     date: (new Date()).toString()};
        var query = connection.query('INSERT INTO websites SET ?', post, sqlCallback.bind({i:this.i}));
      }
    };


    http.get(options, httpCallback.bind({i:i}));
  }
};


