s3ify
=====

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
