var should = require('should');
var connect = require('connect');


describe('Upload', function () {
  var server;

  // var dataUrl2 = require('fs').readFileSync(__dirname + '/image.dataURL').toString();
  var file = require('fs').readFileSync(__dirname + '/image.png');
  var dataUrl = 'data:image/png;base64,' + file.toString('base64');

  // before(function (done) {
  //   server = connect(function (req, res) {
  //     var bufs = [];
  //     console.log('wait file...');
  //     req.on('data', function (buffer) {
  //       bufs.push(buffer);
  //     })
  //     .on('end', function () {
  //       var buffer = Buffer.concat(bufs);
  //       console.log(buffer.length);
  //       res.end();
  //     });
  //   });

  //   server.listen(40403, done);
  // });

  it('should upload a png file', function (done) {

    global.Blob = function (datum, meta) {
      meta.type.should.equal('image/png');
      return datum[0];
    };


    var xhr = {
      open: function () {},
      setRequestHeader: function () {},
      send: function (data) {
        should.not.exist(this.data);
        should.exist(data);
        this.data = data;
      }
    };

    global.XMLHttpRequest = function () {
      return xhr;
    };

    var S3ify = require('./..');

    var upload = new S3ify('http://localhost:40403/filename?params=x');

    upload.send(dataUrl, done);

    xhr.status = 200;

    var bytes = xhr.data;
    var correct = new Uint8Array(file);
    bytes.byteLength.should.equal(correct.byteLength);

    for(var i = 0; i < correct.length; i++) {
      if (bytes[i] !== correct[i]) {
        throw new Error('Mismatch at position ' + i);
      }
    }

    xhr.onload();
  });
});
