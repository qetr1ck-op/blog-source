title: 'Performance: JavaScript adding text to a node'
tags:
  - Performance
categories:
  - Javascript
  - jQuery
date: 2014-07-25 23:10:14
---

What is the most reasonable approach?

*   jQuery's `.html()` with previously encoded text
*   Query's `.text()`
*   `innerHTML` with previously encoded text
*   `innerText` / `textContent`
*   `document.createTextNode` once per element
*   `document.createTextNode` once per test run

<!--more-->

![](/title.png)

* * *

[Link on jsPerf](http://jsperf.com/jquery-html-vs-text-vs-innerhtml-vs-innertext-textconte/2)