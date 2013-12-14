s3ify
=====

[![Build Status](https://travis-ci.org/aantthony/s3ify.png?branch=master)](https://travis-ci.org/aantthony/s3ify)

Upload files from web browser clients directly to S3 using signed urls.

This code however, doesn't do the signing or even request the signed url. That should be done externally to this library.

# Usage

```js
// Create a new upload. This will set upload.xhr
var upload = new S3ify(signedUrl);

upload.send(dataUrl, function (err) {
  console.log('Uploaded!');
});
```

# Example server side signature generation using [knox](https://github.com/LearnBoost/knox)
```js

var s3conf = {
  key   : '***',
  secret: '***',
  bucket: '***',
  access: 'public-read'
};

var s3 = knox.createClient(s3conf);

var exports = module.exports = require('express')();

exports.post('/upload', function (req, res) {
  var filename = 'photo.jpg';
  var expires = new Date(Date.now() + 30 * 60 * 1000);
  var options = {
    verb: 'PUT',
    contentType: 'image/png',
  };
  var signedUrl = s3.signedUrl(filename, expires, options);
  res.json({
    signedUrl: signedUrl // (string, pass this variable to new S3ify()),
    willbeuploadedto: '//' + s3conf.bucket + '.s3.amazonaws.com' + '/' + filename
  });
});

exports.listen(8000);

