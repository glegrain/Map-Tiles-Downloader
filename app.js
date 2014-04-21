
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname + '/files', 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/file/:file', function(req, res) {
    var file = req.params.file;
    res.set('Content-type', 'force-download');
    res.download(__dirname + '/public/' + file);
});
app.get('/geoportail/:zoom/:x/:y', function(req, res) {
    var x = req.params.x;
    var y = req.params.y;
    var zoom = req.params.zoom;
    
    var options = {
        hostname: 'wxs.ign.fr',
        path: "/6qcguib31zj0w42ht311a1lz/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX=" + zoom + "&TILEROW=" + y + "&TILECOL=" + x + "&FORMAT=image%2Fjpeg",
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36",
            "Referer": "http://m.geoportail.fr/index.html"
        }
    };

    http.get(options, function(http_res) {
        //console.log('STATUS: ' + http_res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        
        var data = '';
        http_res.setEncoding('binary');
        
        http_res.on('data', function (chunk) {
            data += chunk;
            //console.log('BODY: ' + chunk);
        });
        
        http_res.on('end', function() {
            res.status(http_res.statusCode);
            //res.set('Content-type', "image/jpeg");
            res.type('jpeg');
            res.end(data, 'binary');
            //console.log('GOT FILE');
        });

    }).on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    //res.send('ok');
});



app.get('/swisstopo/:zoom/:x/:y', function(req, res) {
    var x = req.params.x;
    var y = req.params.y;
    var zoom = req.params.zoom + 12;
    
    var options = {
        hostname: 'wmts2.geo.admin.ch',
        path: "/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20140106/21781/" + zoom + "/" + y + "/" + x +".jpeg",
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36",
            "Referer": "http://map.schweizmobil.ch/?lang=en"
        }
    };

    http.get(options, function(http_res) {
        //console.log('STATUS: ' + http_res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        
        var data = '';
        http_res.setEncoding('binary');
        
        http_res.on('data', function (chunk) {
            data += chunk;
            //console.log('BODY: ' + chunk);
        });
        
        http_res.on('end', function() {
            res.status(http_res.statusCode);
            //res.set('Content-type', "image/jpeg");
            res.type('jpeg');
            res.end(data, 'binary');
            //console.log('GOT FILE');
        });

    }).on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    //res.send('ok');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
