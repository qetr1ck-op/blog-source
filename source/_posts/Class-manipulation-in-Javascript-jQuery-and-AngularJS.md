title: 'Class manipulation in Javascript, jQuery and AngularJS'
thumbnailImage: title.jpg
categories:
  - Angular
  - Javascript
  - jQuery
date: 2014-07-02 23:24:37
---

In this article, I would like to create short reference for how add/remove/toogle/... class in pure Javascript and with freemework.

<!--more-->

<!--toc-->

# Javascript

<a href name="className"></a>
<div class="title-block">className</div>

Property `className` has value of HTML-atribute `class`:

```
<body class="class1 class2"></body>
```

```
console.log(document.body.className);
//class1 class2

document.body.className += ' class3';

console.log(document.body.className);
//class1 class2 class3
```

<a href name="classList"></a>
<div class="title-block">classList</div>

Property `classList` gives convenient interface for work with certain classes.

*   `elem.classList.contains(cls)` - return `true/false` if element has class `cls`
*   `elem.classList.add/remove(cls)` - adding/removing class `cls`
*   `elem.classList.toogle(cls)` - if element has class `cls`, remove it, else add class `cls`

# jQuery

These methods inspect and manpulate classes assigned to elements:

*   `$(elem).hasClass(cls)` - return `true/false` if element has class `cls`
*   `$(elem).addClass/removeClass(cls)` - adding/removing class `cls`
*   `$(elem).toogleClass(cls)` - if element has class(es) `cls`, remove it, else add class(es) `cls`

# AngularJS

<a href name="ng-class"></a>
<div class="title-block">ng-class</div>

`ng-class` accepts an "expression" that must evaluate to one of the following:

*   a `string` of space-delimited class names
*   an `array` of class names
*   a `map/object` of class names to boolean values

See the Pen [AngularJS, ng-class example](http://codepen.io/qetr1ck-op/pen/yjiAp/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).
<script async src="//codepen.io/assets/embed/ei.js"></script>

<a href name="ng-style"></a>
<div class="title-block">ng-style</div>

`ng-style` accepts an "expression" that must evaluate to:

*   an `map/object` of CSS style names to CSS values

See the Pen [AngularJS, ng-style example](http://codepen.io/qetr1ck-op/pen/KyBjs/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).