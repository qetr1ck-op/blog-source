title: NodeList vs Array in Javascript
thumbnailImage: title.png
thumbnailImagePosition: bottom
categories:
  - Javascript
date: 2014-07-30 22:39:40
---

Essentially, a `NodeList` is what you get when you call any method such as ` elem.getElemetsByTagName()`, `elem.querySelectorAll()` and so on.

<!--more-->

We should note here that `NodeLists` aren’t exactly part of the JavaScript but they are instead part of the `DOM APIs` the browsers provide through JavaScript. 

```
var myList = document.querySelectorAll('.story-item');
console.log(myList)
[
  <div class="story-item">…</div>
  ,
  <div class="story-item">…</div>
  ,
  […]
  ,
  <div class="story-item">..</div>
  ,
]

//basic array actions
console.log(myList.length) // 7
console.log(myList[2]) // <div class="story-item">..</div>
```

So far, `myList` has been talking and walking like an array so we can probably assume that it’s an array of some sorts. However, it all goes to hell when you try to call any of the basic array `methods`:

```
myList.slice(2) // indexed from 0

TypeError: Result of expression 'myList.slice' [undefined] is not a function.
```

Wait, what happened? Well, this is where the between `NodeLists` and arrays in JavaScript start to surface. Let’s see what is distinguish `array` and `NodeList`: 

```
console.log(myList.constructor.prototype) // "[object NodeListConstructor]"

var surelyArray = ['foo', 'bar'];

console.log(surelyArray.constructor.prototype) //"function Array() { [native code] }"
```

So those two elements, `myList` and `surelyArray` are definitely constructed by different constructors so it’s no wonder that they don’t share the same methods.

While `arrays` are essentially a collection of elements held in memory and are part of the JavaScript, `NodeLists` are live references to actual DOM elements.

Let’s see a quick way to convert a `NodeList` into an array:

```
//borrowing the slice() method from the Array’s prototype
var myArray = Array.prototype.slice.call(myList, 0);

console.log(myArray.constructor.prototype) //"function Array() { [native code] }"

//call pop method
myArray.pop() //<div class="story-item">…</div>

//Internet Explorer 9 cannot handle calling slice() on NodeLists
var myIEArray = [];

for (var i = 0; i < myList.length; ++i) { myIEArray.push(myList[i]); }
console.log(myIEArray.constructor.prototype) //"function Array() { [native code] }"
```

One thing is worth mentioning though; when you convert your `NodeList` into an `array`, you are no longer dealing with a live `NodeList` but instead an array of DOM nodes.

