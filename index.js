;(function () {

if (typeof module !== 'undefined') {
  module.exports = definition();
} else if (typeof define === 'function') {
  define(definition);
} else if (typeof window !== 'undefined') {
  window.S3ify = definition();
}

function definition() {

// end crap


// Create a new upload

function S3ify(url) {
  var xhr = this.xhr = new XMLHttpRequest();
  var self = this;
  xhr.open('PUT', url, true);

  xhr.onerror = function () {
    self.callback(new Error());
  };

  xhr.onload = function() {

    if (this.status !== 200) {
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

S3ify.prototype.send = function (file, callback) {
  this.callback = callback;
  this.xhr.setRequestHeader('Content-Type', file.type);
  // this.xhr.setRequestHeader('x-amz-acl', 'public-read');

  return this.xhr.send(file);
};

return S3ify;

// begin crap

}
}());
