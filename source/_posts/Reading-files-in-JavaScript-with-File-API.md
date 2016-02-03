title: Reading files in JavaScript with File API
tags:
  - File API
categories:
  - Javascript
date: 2014-08-02 15:39:09
---

Reading files in Javascript with File API

<!--more-->

<!--toc-->

#   Overview

Using [File API or file-reader interfaces](http://dev.w3.org/2006/webapi/FileAPI/#filereader-interface) on the client side code can be checked as to whether the MIME type of the uploaded file to its expansion, or set limits on the size.

This spec provides an API for representing file objects in web applications:

*   A `FileList` interface, which represents an array of individually selected files from the underlying system. The user interface for selection can be invoked via `input type="file" multiple`
*   A `File` interface, which includes readonly informational attributes about a file such as its name, MIME type, and the date of the last modification
*   A `Blob` interface, which represents immutable raw binary data, and allows access to ranges of bytes within the Blob object as a separate Blob.
*   A `FileReader` interface, which provides methods to read a `File` or a `Blob`, and an event model to obtain the results of these reads.
*   A `URL scheme` for use with binary data such as files, so that they can be referenced within web applications.

#   Check for the File API support.

```
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}
```

#   Using form input for selecting

The most straightforward way to load a file is to use a standard `input type="file"` element. JavaScript returns the list of selected `File` objects as a `FileList`. Here's an example that uses the `multiple` attribute to allow selecting several files at once:

```
<input type="file" id="files" name="files[]" multiple />
<output id="list"></output>

<script>
  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li>**', escape(f.name), '** (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '';
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
</script>
```

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
<p data-height="185" data-theme-id="10606" data-slug-hash="nhHCi" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/nhHCi/'>Using form input for selecting</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

#    Using drag and drop for selecting

Another technique for loading files is native drag and drop from the desktop to the browser. We can modify the previous example slightly to include drag and drop support:

```
<div id="drop_zone">Drop files here</div>
<output id="list"></output>

<script>
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li>**', escape(f.name), '** (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '

';
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
</script>
```

<p data-height="268" data-theme-id="10606" data-slug-hash="EnsgL" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/EnsgL/'>Using drag and drop for selecting</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

# Reading files

Now comes the fun part!

After you've obtained a `File` reference, instantiate a `FileReader` object to read its contents into memory. When the load finishes, the reader's `onload` event is fired and its result attribute can be used to access the file data.

`FileReader` includes four options for reading a file, asynchronously:

1.   `FileReader.readAsBinaryString(Blob|File)` - The `result` property will contain the file/blob's data as a binary string. Every byte is represented by an integer in the range [0..255]
2.  `FileReader.readAsText(Blob|File, opt_encoding)` - The `result` property will contain the file/blob's data as a text string. By default the string is decoded as 'UTF-8'. Use the optional encoding parameter can specify a different format.
3.   `FileReader.readAsDataURL(Blob|File)` - The `result` property will contain the file/blob's data encoded as a data URL.
4.   `FileReader.readAsArrayBuffer(Blob|File)` - The `result` property will contain the file/blob's data as an ArrayBuffer object.

Once one of these read methods is called on your `FileReader` object, the `onloadstart`, `onprogress`, `onload`, `onabort`, `onerror`, and `onloadend` can be used to track its progress.

The example below filters out images from the user's selection, calls `reader.readAsDataURL()` on the file, and renders a thumbnail by setting the `src` attribute to a data URL:

```
<style>
  .thumb {
    height: 75px;
    border: 1px solid #000;
    margin: 10px 5px 0 0;
  }
</style>

<input type="file" id="files" name="files[]" multiple />
<output id="list"></output>

<script>
  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['![]()'].join('');
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
</script>
```

<p data-height="187" data-theme-id="10606" data-slug-hash="sJpmy" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/sJpmy/'>sJpmy</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

#    Monitoring the progress of a read

One of the nice things that we get for free when using async event handling is the ability to monitor the progress of the file read; useful for large files, catching errors, and figuring out when a read is complete.

The `onloadstart` and `onprogress` events can be used to monitor the progress of a read.

```
<style>
  #progress_bar {
    margin: 10px 0;
    padding: 3px;
    border: 1px solid #000;
    font-size: 14px;
    clear: both;
    opacity: 0;
    -moz-transition: opacity 1s linear;
    -o-transition: opacity 1s linear;
    -webkit-transition: opacity 1s linear;
  }
  #progress_bar.loading {
    opacity: 1.0;
  }
  #progress_bar .percent {
    background-color: #99ccff;
    height: auto;
    width: 0;
  }
</style>

<input type="file" id="files" name="file" />
<button onclick="abortRead();">Cancel read</button>
<div id="progress_bar"><div class="percent">0%</div></div>

<script>
  var reader;
  var progress = document.querySelector('.percent');

  function abortRead() {
    reader.abort();
  }

  function errorHandler(evt) {
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    };
  }

  function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      // Increase the progress bar length.
      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
  }

  function handleFileSelect(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
    reader.onabort = function(e) {
      alert('File read cancelled');
    };
    reader.onloadstart = function(e) {
      document.getElementById('progress_bar').className = 'loading';
    };
    reader.onload = function(e) {
      // Ensure that the progress bar displays 100% at the end.
      progress.style.width = '100%';
      progress.textContent = '100%';
      setTimeout("document.getElementById('progress_bar').className='';", 2000);
    }

    // Read in the image file as a binary string.
    reader.readAsBinaryString(evt.target.files[0]);
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
</script>
```

<p data-height="216" data-theme-id="10606" data-slug-hash="GKbhy" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/GKbhy/'>Monitoring the progress of a read</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

#    Example: drag and drop files and folders
[Example: drag and drop files and folders](http://savemyday.in/examples/drag-and-drop-files-and-folders/index.html)

SaveMyDay:

*   on [html5rocks.com](http://www.html5rocks.com/en/tutorials/file/dndfiles/)