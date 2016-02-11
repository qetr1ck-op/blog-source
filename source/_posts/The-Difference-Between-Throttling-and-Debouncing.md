title: The Difference Between Throttling and Debouncing
date: 2016-01-11 13:14:13
tags:
    - Performance
categories:
    - Javascript
---

One of the biggest mistakes I see when looking to optimize existing code is the absence of the debounce/throttle function.

<!--more-->

<!--toc-->

Both of them are ways to limit the amount of JavaScript you are executing based on DOM events for performance reasons. But they are, you guessed it, different.

# Throttle

Throttling enforces a maximum number of times a function can be called over time. 

> Execute this function at most once every 100 milliseconds.

Say under normal circumstances you would call this function 1,000 times over 10 seconds. If you throttle it to only once per 100 milliseconds, it would only execute that function at most 100 times

```
(10s * 1,000) = 10,000ms
10,000ms / 100ms throttling = 100 maximum calls
```

# Debounce

Debouncing enforces that a function not be called again until a certain amount of time has passed without it being called. 

> Execute this function only if 100 milliseconds have passed without it being called.

Perhaps a function is called 1,000 times in a quick burst, dispersed over 3 seconds, then stops being called. 

If you have debounced it at 100 milliseconds, the function will only fire once, at 3.1 seconds, once the burst is over. Each time the function is called during the burst it resets the debouncing timer.

# What's the point?

One major use case for these concepts is certain DOM events, like scrolling and resizing. For instance, if you attach a scroll handler to an element, and scroll that element down say 5000px, you're likely to see 100+ events be fired. If your event handler does a bunch of work (like heavy calculations and other DOM manipulation), you may see performance issues (jank). 

Quick hit examples:

* Wait until the user stops resizing the window
* Don't fire an ajax event until the user stops typing
* Measure the scroll position of the page and respond at most every 50ms
* Ensure good performance as you drag elements around in an app

# How to do it

## With lodash

[Debounce](https://lodash.com/docs#debounce) and [throttle](https://lodash.com/docs#throttle):

```
$("body").on('scroll', _.throttle(function() {
  // Do expensive things
}, 100));

$(window).on('resize', _.debounce(function() {
  // Do expensive things
}, 100));
```

## Vanila debounce

```
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
```

You'll pass the debounce function the function to execute and the fire rate limit in milliseconds. Here's an example usage:

```
var myEfficientFn = debounce(function() {
    // All the taxing stuff you do
}, 250);

window.addEventListener('resize', myEfficientFn);
```

## Vanila throttle

Below is an actual throttle function, that fires a message every 250ms by default (rather than at the end of a burst of events):

```
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = Date.now(),
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
```

```
$('body').on('mousemove', throttle(function (event) {
  console.log('tick');
}, 1000));
```

# Demo

<p data-height="710" data-theme-id="10606" data-slug-hash="GoPGrx" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/GoPGrx/'>The Difference Between Throttling, Debouncing, and Neither</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>


