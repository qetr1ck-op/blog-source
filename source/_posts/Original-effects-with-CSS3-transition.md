title: Original effects with CSS transition
categories:
  - CSS
date: 2014-04-01 14:48:05
---

The power of CSS3 is enormous and in this post I create appearing effect of "Sign In Form" using differn style in each example.

<!--more-->

<!--toc-->

Actually, now transition property of CSS supporting almost in all browsers, just in some case you need to use prefix `-webkit, -moz, -ms, -o`. You may check it on [Can I use...](http://caniuse.com/#search=transition "Can I use...")

Awesome and simple [CSS3 Transition generator](http://css3generator.com/ "css3generator.com") (and not only).

More about [transition-timing-funtion with example](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function "transition-timing-function").

If you look closely you may see that in all example firstly I hide "Sign In Form" with `transform: scale, rotate, translateX/Y` and add `transition`. Than I use different value of transform, transition-delay, opacity for show original transition CSS effects.

# Example 1

<p data-height="268" data-theme-id="10606" data-slug-hash="gwJsh" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/gwJsh/'>CSS3 transition effects example 1</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

In first example I used `transition` for base elements with different timestamps and time function. Also I used `transform: translateY` property that push "Sign In Form" and child elements from current position.

When you click on main section, you can see delay property that emulate animation. In this example I added a `transition-delay: ...s` which make transition effect start a bit later.

# Example 2

<p data-height="268" data-theme-id="10606" data-slug-hash="wlxGq" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/wlxGq/'>CSS3 transition effects example 2</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

In second example I used new `div.content`, you can see it in HTML mark-up. For "Sign In Form" I applied `transform: translate(...px, ...px) rotate(...deg)` for children used only `translate`. Of course added `transition` for elements.

Translate transformation in order move elements in place. The "Sign In Form" will also be rotated. The each elements of the description will come with a little delay.

# Example 3

<p data-height="270" data-theme-id="10606" data-slug-hash="tLaic" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/tLaic/'>CSS3 transition effects example 3</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

In third example I used the `translate` and  `transforms: rotate` to bring up content.

Than I just need to reset `transform: translateX(0px) rotate(0deg)` and add `transition-delay: ...s`.

# Example 4

Here in four example I performed zoom out for main block and zoom in for "Sign In Form" with rotation effect. All thanks to `transform: scale and rotate`.

<p data-height="266" data-theme-id="10606" data-slug-hash="aGqou" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/aGqou/'>CSS3 transition effects example 4</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

# Example 5

In this example I used `transform: translateX()` and transition timing function `ease-in-out`. Transition effect make the "Sign In Form" slide from right, with pushing effect for main container.

<p data-height="268" data-theme-id="10606" data-slug-hash="Jbzvm" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/Jbzvm/'>CSS3 transition effects example 5</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

# Example 6

* * *

In sixth example I performed that "Sign In Form" comes from the front, zooming out until its original size: `transform: scale(from 10 to 1)`. And inputs will slide from bottom, used `transform: translateY`.

<p data-height="271" data-theme-id="10606" data-slug-hash="Deijo" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/Deijo/'>CSS3 transition effects example 6</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

# Example 7

In this seven example the idea is to rotate the image to center and scale it down: `transform: rotate(0deg)->(720deg) scale(1)->(0)`. Then the "Sign In Form" comes from up with description content following. `transform: translateY())`.

Also Added delay for the "Sign In Form" elements `transition-delay: ..s`. This will show us the rotating main block first and then the description will come into. In the reverse transition, everything will disappear immediately and image will rotate back.

<p data-height="268" data-theme-id="10606" data-slug-hash="pIrwa" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/pIrwa/'>CSS3 transition effects example 7</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

# Example 8

In eighth example I used an animation which recreate a bounce effect. The "Sign In Form" will bounce in from top. `animation: bounceY 0.9 linear`.

```
animation: bounceY 0.9 linear
```

<p data-height="277" data-theme-id="10606" data-slug-hash="veLhG" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/veLhG/'>CSS3 transition effects example 8</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

