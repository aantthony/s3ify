;(function () {

// Load the module:

if (typeof module !== 'undefined') {
  module.exports = definition();
} else if (typeof define === 'function') {
  define(definition);
} else if (typeof window !== 'undefined') {
  window.S3ify = definition();
}

function definition() {

// end crap

// base64 parsing, with Buffer used as a fallback
if (typeof atob === 'undefined') {
  var atob = function (b64string) {
    return new Buffer(b64string, 'base64').toString('binary');
  }
}

// Convert a dataurl into a blob which can be passed to the xhr.send() function.
function blobify(dataUrl) {

  var parts = dataUrl.split(',');
  var meta = parts[0].split(';');

  var contentType = meta[0].split(':')[1];
  var bytes;

  if (meta[1] === 'base64') {
    var raw = atob(parts[1]);
    var l = raw.length;
  
    bytes = new Uint8Array(l);
  
    for(var i = 0; i < l; i++) {
      bytes[i] = raw.charCodeAt(i);
    }

  } else {
    bytes = parts[1];
  }
  
  return new Blob([bytes], {type: contentType});
}

// Create a new upload

function S3ify(url) {
  var xhr = this.xhr = new this.XMLHttpRequest();
  var self = this;
  xhr.open('PUT', url, true);

  xhr.onerror = function () {
    self.callback(new Error());
  };

  xhr.onload = function() {

    if (this.status === 200) {
      self.callback(null);
    } else {
      self.callback(this.status);
    }
  };

  xhr.onprogress = function (e) {
    if (e.lengthComputable) {
      console.log(e.loaded / e.total);
    }
  };

}

S3ify.prototype.XMLHttpRequest = XMLHttpRequest;

S3ify.prototype.send = function (file, callback) {
  this.callback = callback;

  if(typeof file === 'string') {
    file = blobify(file);
  }

  this.xhr.setRequestHeader('Content-Type', file.type);
  // this.xhr.setRequestHeader('x-amz-acl', 'public-read');

  return this.xhr.send(file);
};

return S3ify;

// begin crap

}
}());
