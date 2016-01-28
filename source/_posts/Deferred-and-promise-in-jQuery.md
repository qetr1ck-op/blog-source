title: Deferred and promise in jQuery
id: 510
categories:
  - jQuery
date: 2014-07-14 21:17:26
---

How handle async code with jQuery via promises and creating own promise via deffered.

<!--more-->

<!--toc-->

#  So in which cases are Promises useful?

AJAX request handler spaghetti?

```
$.ajax({
  type: 'GET',
  url: 'http://www.html5rocks.com/en/tutorials/file/xhr2/',
  success: function(response) {
    var insertDiv1 = $('<div></div>');
    insertDiv1.html($(response).find('section').html());
    $.ajax({
      type: 'GET',
      url: 'http://www.html5rocks.com/en/tutorials/audio/scheduling/',
      success: function(response) {
        var insertDiv2 = $('<div></div>');
        insertDiv2.html($(response).find('section').html());
        $('body').append(insertDiv1, insertDiv2);
      }
    });
  }
});
```

#  Why we need Deferred and Promises?

Let's do a step back in time. A time without iPod or Xbox or Facebook. If you wanted to catch a `mouseclick`, you did it with `element.onclick = someFunction;` This became a problem when another part of the code also wanted to listen to this click. This was not possible, because you could only assign one function. This was solved at the time with the `addEventListener` function. With this, you can add as many listener functions as you want. 

Now we have a similar problem with `Ajax` calls. This time it’s not the events, but the fact that `Ajax` supports only one callback function. Not only the jQuery `$.ajax()` call, but also the underlying `XMLHttpRequest` object.

`Deferred` and `promise` are part of jQuery since version 1.5 and they help in handling asynchronous functions like Ajax.

A typical `$.ajax()` call looked like this:

```
$.ajax({
  url: "/myServerScript",
  success: mySuccessFunction,
  error: myErrorFunction
});
```

Since version 1.5, the returned object implements the [CommonJS Promises/A interface](http://wiki.commonjs.org/wiki/Promises/A). CommonJS is a initiative to define common and independent interfaces `API’s`. `Promises/A` is one such interface. The advantage is that these are not jQuery specific. For example, if you work with Node.js, there is a good chance you’ll program with this same interface.

The way of assigning callbacks with Promises: 

```
var promise = $.ajax({
  url: "/myServerScript"
});

promise.done(mySuccessFunction);
promise.fail(myErrorFunction);
```

You can combine the `done()` and `fail()` functions in one `then()` function:

```
var promise = $.ajax({
  url: "/myServerScript"
});

promise.then(mySuccessFunction, myErrorFunction);
```

The advantages of promises are:

*	You can call the `done()` and `fail()` functions more times, with different callbacks. Maybe you have a callback function that stops an animation, one that does a new Ajax call and another function that shows the received data to the visitor:

```
var promise = $.ajax({
  url: "/myServerScript"
});

promise.done(myStopAnimationFunction);
promise.done(myOtherAjaxFunction);
promise.done(myShowInfoFunction);
promise.fail(myErrorFunction);
```

*	You can combine promises. Sometimes you need to do two simultaneous Ajax calls and you want to execute a function when both are successfully finished. To do this, you use the new `$.when()` function:

```
var promise1 = $.ajax("/myServerScript1");
var promise2 = $.ajax("/myServerScript2");

$.when(promise1, promise2).done(function(xhrObject1, xhrObject2) {
  // Handle both XHR objects
});
```

*	Since jQuery 1.8, you can chain the `then()` function sequentially. In the code below, first promise1 is run and when resolved successfully, getStuff is run, returning a promise and when this is resolved successfully, the anonymous function is executed:

```
var promise1 = $.ajax("/myServerScript1");

function getStuff() {
    return $.ajax("/myServerScript2");
}

promise1.then(getStuff).then(function(myServerScript2Data){
  // Both promises are resolved
});
```

Every callback function receives the result of the previous asynchronous function, in the case of Ajax, that would be the returned data.

#  So what is a deferred and what is the difference with a promise?

As you have seen above, a `promise` is an object that is returned from an asynchronous function. You need a `deferred` when you write such a function yourself.

A `deferred object` has a `resolve()` functions for a successful result and to execute the functions assigned with `done()`. The `reject()` function is for a failed result and executes the functions assigned with `fail()`.

You can give `parameters` to both the `resolve()` and `reject()` functions and they will be passed on to the functions registered with `done()` and `fail()`.

The `promise object` does not have resolve() or reject() functions. This is because you give the promise away to other scripts and you don’t want them to resolve or reject the promise.

Below is a simple script that illustrates how it works:

```
$('#result').html('waiting...');

var promise = wait();
promise.done(result);

function result() {
  $('#result').html('done');
}

function wait() {
  var deferred = $.Deferred(); // (!)

  setTimeout(function() {
    deferred.resolve();
  }, 2000);

  return deferred.promise();
}
```

The `wait()` function is the function returning a promise. This will be resolved with a setTimeout of two seconds. Instead of setTimeout, everything can be used that is asynchronous, like animations, Web workers etcetera. It should be clear that inside the `wait()` function, we use the deferred object, but we return the limited promise object.

Save My Day:
*	[Deferred and promise in jQuery](http://www.bitstorm.org/weblog/2012-1/Deferred_and_promise_in_jQuery.html)
*	[An introduction to jQuery Deferred / Promise and the design pattern in general](http://www.danieldemmel.me/blog/2013/03/22/an-introduction-to-jquery-deferred-slash-promise/)