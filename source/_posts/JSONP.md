title: JSONP
categories:
  - Javascript
date: 2014-10-29 21:44:50
tags:
	- XHR
---

JSONP is really simple trick to overcome XMLHttpRequest same origin domain policy - you can't send AJAX (XMLHttpRequest) request to different domain.

<!--more-->

So instead of using `XMLHttpRequest` we have to use `script` HTML tag to get data from another domain. And yes, it's sound weird. Example:

```
(function() {
	var script = document.createElement('script');
	script.type = 'text/javascript'
	script.src = 'http://www.someWebApiServer.com/some-data?callback=my_callback';
	document.getElementsByTagName('head')[0].appendChild(elem)
})()
```

Notice the `my_callback` function over here? So when when server receives request and finds callback parameter - instead of returning plain `JSON` object :

```
{foo: bar}
```

It will return callback: 

```
my_callback({foo: bar}) // 'Response from another domain: with {foo: bar}

//it's already implemented
function my_callback(resp) {
	console.log('Response from another domain: ' + resp);
}
```

The profit is that we get automatic callback `my_callback` that will be triggered once we get the data.

So `JSONP` is callback and script tags.

Basic JavaScript example (simple Twitter feed using JSONP):
```
<div id = 'twitterFeed'></div>
<script>
function myCallback(dataWeGotViaJsonp){
    var text = '';
    var len = dataWeGotViaJsonp.length;
    for(var i=0;i<len;i++){
        twitterEntry = dataWeGotViaJsonp[i];
        text += ' + twitterEntry['text']';
    }
    document.getElementById('twitterFeed').innerHTML = text;
}
```