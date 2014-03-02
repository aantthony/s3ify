var connect = require('connect');
var fs = require('fs');
var page;

var script = fs.readFileSync(__dirname + '/../index.js', 'utf8');
var actual = fs.readFileSync(__dirname + '/../test/image.png');

var app = connect()
.use(connect.static(__dirname + '/static'))
.use(function (req, res, next) {

  if (req.url === '/s3ify.js') {
    return res.end(script);
  }

  if (req.url !== '/upload') return next();

  var bufs = [];

  console.log('UPLOAD', req.headers['content-length']);

  var got = 0;
  req
  .on('data', function (buf) {
    got += buf.length;
    console.log('»', got, '/', req.headers['content-length']);
    bufs.push(buf);
  })
  .on('end', function () {
    console.log('=', got, '/', req.headers['content-length']);

    var data = Buffer.concat(bufs);
    if (data.length !== actual.length) return next(new Error('Wrong length'));
    for(var i = 0; i < actual.length; i++) {
      if (data[i] !== actual[i]) return next(new Error('Data mismatch'));
    }
    console.log('Looks good!');
    res.end();
  });
});

app.listen(8080);