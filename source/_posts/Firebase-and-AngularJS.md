title: Firebase and AngularJS
thumbnailImage: title.jpg
categories:
  - Angular 1.x
date: 2014-12-10 23:45:45
tags:
	- Firebase
---

AngularFire is the officially supported AngularJS binding for Firebase. The combination of Angular and Firebase provides a three-way data binding between your HTML, your, JavaScript, and the Firebase database.

<!--more-->

<!--toc-->

# Why, Who and WHAT?

[Firebase](https://www.firebase.com/) is developed by Google and its a rich API to store and sync data in realtime. Firebase has full-featured libraries for support all major web framework.

AngularFire is the officially supported by AngularJS binding fir Firebase. The combination of Angular and Firebase provides a `three-way` between your Firebase data store and Angular's bindings (i.e. JavaScript variables to DOM elements).

# Quick start

Simply include source from CDN:

```
<!-- Angular -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.2/angular.min.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/2.0.4/firebase.js"></script>

<!-- AngularFire -->
<script src="https://cdn.firebase.com/libs/angularfire/0.9.0/angularfire.min.js"></script>
```

Also sources are available via [Bower](http://bower.io/search/?q=firebase) or [Yeoman](https://github.com/firebase/generator-angularfire) scaffolding.

Next we need to include ANgularFire service by adding `firebase` as a module dependency in our app. And than inject dependency the `$firebase` into a controller, factory, or service.

```
var app = angular.module('app', ['firebase']);

app.controller('MainCtrl', function($scope, $firebase) {
    var ref = new Fireabase("https://<your-firebase>.firebaseio.com/");
    var sync = $firebase(ref);
})
```

#    Synchronize data with $asObject(). Thee way data-binding

Keep in mind that `$firebase` does not actually download any data from the Firebase server until `$asArray()` or `$asObject()` are called.

The full list for `$firebase` methods can be found in the [API documentation](https://www.firebase.com/docs/web/libraries/angular/api.html#firebaseobject).

Synchronizing changes from the server is pretty magical via `$save()`. To achieve three-way data binding simply call `$bindTo()` on a synchronized object and now any changes in the DOM are pushed to Angular, and then automatically to Firebase. And inversely, any changes on the server get pushed into Angular and straight to the DOM:

<p data-height="506" data-theme-id="10606" data-slug-hash="QwyJvg" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/QwyJvg/'>Synchronize data with $asObject(). Thee way data-binding</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

# Synchronize Arrays with $asArray()

Synchronized arrays should be used for any list of objects that will be sorted, iterated and have unique IDs. The complete list of methods can be found in the [API](https://www.firebase.com/docs/web/libraries/angular/api.html#firebasearray) for `$FirebaseArray`.

The contents of this array are synchronized with a remote server, and AngularFire controls adding, removing, and ordering the elements. Because of this special arrangement, AngularFire provides the concurrency safe methods `$add()`, `$remove()`, and `$save()` to modify the array elements.

<p data-height="348" data-theme-id="10606" data-slug-hash="ByjXeq" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/ByjXeq/'>Synchronize Arrays with $asArray()</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Save my day:
*	[AngularFire Development Guide](https://www.firebase.com/docs/web/libraries/angular/guide/)