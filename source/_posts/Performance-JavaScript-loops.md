title: 'Performance: JavaScript loops'
tags:
  - Perforamance
id: 607
categories:
  - Javascript
date: 2014-08-06 20:38:48
---

Is it faster to use the native forEach or just loop with for?

<!--more-->

Types of methods for test:

*   forEach
*   for loop, simple
*   for loop, cached length
*   for loop, reverse
*   for loop, cached length, callback
*   $.each
*   for ... in
*   for loop, reverse decrement
*   other crazy loops

Is it faster to use the native forEach or just loop with for?

Obviously, the most faster loop is `for` with `cashed array length`. But in my case it was ordinary for loop :)

Also I was confused that Array.forEach method is slowest more than 89% from classic for loop... 

Screenshot from jsperf: 

![](/performaceArray.png)

SaveMyDay:

*   on [jsperf.com](http://jsperf.com/for-vs-foreach/37)