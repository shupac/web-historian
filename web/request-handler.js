var path = require('path');
var url = require('url');
var fs = require('fs');
var fetcher = require(__dirname + '/../workers/htmlfetcher');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.



module.exports.handleRequest = function (req, res) {
  // console.log(req.method);
  var route = url.parse(req.url).pathname;
  if(req.method === "GET") {
    if(route === "/"){
      fs.readFile(__dirname + '/public/index.html', function(err, html) {
        if(err) console.log(err);
        res.writeHead(200, {"Content-Type":"text/html"});
        res.end(html);
      });
    } else {
      fs.readFile(__dirname + '/../data/sites' + route, function(err, html) {
        if(err) {
          res.writeHead(404);
          res.end();
        } else {
          res.writeHead(200, {"Content-Type": "text/html"});
          res.end(html);
        }
      });
    }
  } else if(req.method === "POST") {
    if(route === "/") {
      var postData = "";
      req.on('data', function(chunk) {
        postData += chunk;
        console.log('Chunk received:', chunk);
      });
      req.on('end', function(){
        fetcher.write(postData);
        res.writeHead(302);
        res.end();
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  }
};
