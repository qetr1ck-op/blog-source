title: "Units of measurement: 'px', 'em', 'rem' and other"
date: 2015-11-11 20:17:58
tags:
---

I will try not only to write about variety of units, but also build a full picture - what and when better to choose.

<!--more-->


<!-- toc -->

*	[Pixels: px](#Pixels: px)
*	[Relatively to font: em](#Relatively to font: em)
*	[Percentage, %](#Percentage, %)



<a href name="Pixels: px"></a>
<div class="title-block">Pixels: `px`</div>

Pixel `px` - is the most basic, absolute and final unit of measurement.

The number of pixels on monitor is set in `screen resolution` configuration. A `px` is such a one pixel on the screen. All values browser eventually translated into pixels.

<img alt="post-img" src="Pixels-and-Screen-Display.gif" style="height:300px" alt="Pixels and Screen Display">

The main advantage `px` is clarity and understandability.

The `px` are not relative and don't allow to set relationships between other dimensions.

<a href name="Relatively to font size: em"></a>
<div class="title-block">Relatively to font size: em</div>

Measurement in `em` are relative, they are defined by current context.

`1em` it's current font size.

Since the value of em is calculated to the current font size, the nested string will `1.5` times larger than parent:

<script src="https://gist.github.com/qetr1ck-op/2033295d2b1d25c4a2bc.js"></script>

<a href name="Percentage, %"></a>
<div class="title-block">Percentage, `%`</div>

The `%` as the `em` are relative to current context measurements but there are nuances.

Is works different with these properties: `margin-left`, `line-height`, `width/height` with `position: fixed`.

The same example:

<script src="https://gist.github.com/qetr1ck-op/38860ddb14b4c5c9a68c.js"></script>

<a href name="rem, mixture of px and em"></a>
<div class="title-block">Mixture of `px` and `em`: `rem`</div>

Measure `rem` defines font size relatively to `html` element size.

<p data-height="268" data-theme-id="10606" data-slug-hash="bVzVaQ" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/bVzVaQ/'>em vs rem</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

<a href name="Relatively to screen size: vw, vh, vmin, vmax"></a>
<div class="title-block">Relatively to screen size: vw, vh, vmin, vmax</div>

The principles behind `vw`, `vh` are to represent percentage of browser viewport `width` / `height`.

`1vw` = `1/100` of the current viewport width, i.e. `1%` of width.

`10vh` = `10/100` of the current viewport height, i.e. `10%` of height.

After first glance, it seems that `vw`, `vh` are redundant, because we already have `%` measurement system:

<script src="https://gist.github.com/qetr1ck-op/a6900f35b0330f044a82.js"></script>

Limitation of percentage measurement system:

*	viewport height is always hard to measure, as the height of `<body>` depends on content, not on the dimension of the browser window

*	body measurement cannot be applied to the `font-size`, because it relates to parent container, not to the dimension of viewport

Example, backgrounds and `vh`:

<p data-height="268" data-theme-id="10606" data-slug-hash="ZbdWvp" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/ZbdWvp/'>Backgrounds and the vh unit </a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Example, backgrounds and `vw`:

<p data-height="268" data-theme-id="10606" data-slug-hash="xwoVPX" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/xwoVPX/'>Backgrounds and the vw unit </a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Image, `vw`:

<p data-height="268" data-theme-id="10606" data-slug-hash="bVPpaX" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/bVPpaX/'>Images and vw width </a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Respectively are related to the maximum or minimum of those widths and heights, depending on which is smaller and larger. For example, if the browser was set to `1100px` wide and the `700px` tall, `1vmin` would be `7px` and `1vmax` would be `11px`.

`1vmin` = `1vw` or `1vh`, whichever is smaller
`1vmax` = `1vw` or `1vh`, whichever is larger