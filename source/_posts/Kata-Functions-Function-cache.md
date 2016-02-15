title: 'Kata (Functions): Function cache'
date: 2016-02-14 21:17:45
tags:
    - Kata
    - Functions
categories: 
    - Javascript
---

If you are calculating complex things or execute time-consuming API calls, you sometimes want to cache the results. In this case we want you to create a function wrapper, which takes a function and caches its results depending on the arguments, that were applied to the function.

Usage example:

```
const complexFunction = (arg1, arg2) => { /* complex calculation in here */ };
const cachedFunction = cache(complexFunction);

cachedFunction('foo', 'bar'); // complex function should be executed
cachedFunction('foo', 'bar'); // complex function should not be invoked again, instead the cached result should be returned
cachedFunction('foo', 'baz'); // should be executed, because the method wasn't invoked before with these arguments
```

```
const cache = fn => {
  const calls = {};
  
  return function(...args) {
    if (!calls[args]) {
      calls[args] = fn(...args);
    }
    return calls[args];
  }
}
```