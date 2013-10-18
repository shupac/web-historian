var fs = require('fs');
var mysql = require('mysql');
var http = require('http-get');
var connectionOptions = {
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'webhistorian'
};

exports.readUrls = function(cb){
  var urls = [];
  var connection = mysql.createConnection(connectionOptions);
  connection.connect();

  connection.query('SELECT url from urls', function(err, rows, fields) {
    if (err){
      connection.end();
      throw err;
    }
    console.log(rows);
    for(var i = 0 ; i < rows.length ; i++){
      urls.push(rows[i].url);
    }
    connection.end();
    console.log('Getting URLs from server...');
    exports.downloadUrls(urls);
    if(cb){cb(urls);}
  });
};

exports.downloadUrls = function(urls){
  var getCounter = 0;
  var connection = mysql.createConnection(connectionOptions);
  connection.connect();
  for(var i = 0 ; i < urls.length; i++){
    var recordurl = urls[i];
    var options = {
      url: urls[i],
      bufferType: "buffer"
    };

    var sqlCallback = function(err,result){
      if(err){console.log(err);}
      else{
        console.log('Site updated and inserted into database: ' + urls[this.i]);
        getCounter++;
      }
      if(getCounter === urls.length) {
        console.log('Sql update complete, closing connection.');
        connection.end();
      }
    };

    var httpCallback = function(error, result){
      i = this.i;
      if (error) {
        console.error(error);
      } else {
        var post  = {url: urls[i],
                     file: result.buffer,
                     dateint: (new Date()).valueOf(),
                     datestr: (new Date()).toString()};
        var query = connection.query('INSERT INTO websites SET ?', post, sqlCallback.bind({i:i}));
      }
    };
    http.get(options, httpCallback.bind({i:i}));
  }
};

exports.writeUrl = function(url) {
  var connection = mysql.createConnection(connectionOptions);
  connection.connect();
  connection.query('SELECT url from urls', function(err, rows, fields) {
    if (err){
      connection.end();
      throw err;
    }
    for(var i = 0 ; i < rows.length ; i++){
      if(rows[i].url === url){
        console.log('URL already found in table '+ url);
        return;
      }
    }
    connection.query('INSERT INTO urls (url) value ("'+url+'")',function(err,result){
      if(err){
        console.log('Error inserting '+ url +' into table');
        connection.end();
        throw err;
      }
      console.log('URL inserted into table: '+ url);
      console.log('Downloading URLs...');
      exports.readUrls();
    });
  });
};

exports.get = function(url, cb) {
  console.log('Get request received for url: ', url);
  var connection = mysql.createConnection(connectionOptions);
  connection.connect();
  connection.query("SELECT * from websites where url ='"+url+"' order by dateint limit 1,1;", function(err, rows, fields) {
    if (err){
      connection.end();
      throw err;
    }
    console.log('Query executed for get request for: ', url);
    cb(rows);
    connection.end();
  });
};