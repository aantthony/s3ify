s3ify
=====

Upload files from web browser clients directly to S3 using signed urls.

This code however, doesn't do the signing or even request the signed url. That should be done externally to this library.

# Usage

```js
var upload = new S3ify(signedUrl);
var data = new Blob(..., {type: 'image/png'});
upload.send(data, function (err) {
  console.log('Uploaded!');
});
```

# Future planned usage (not yet implemented)

```js
var upload = new S3ify(signedUrl);
upload.on('progress', function () {});
upload.send(dataUrl, function (err) {
  console.log('Uploaded');
});
```
