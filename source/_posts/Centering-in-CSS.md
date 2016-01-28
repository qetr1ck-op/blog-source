title: Centering in CSS
thumbnailImage: title.jpg
categories:
  - CSS
date: 2014-09-08 22:54:09
---

A fast guide to help centering everything with CSS.

<!--more-->

So you want to centering ..?

*   [Horizontally](#Horizontally)
	*   [Is it inline or inline-* elements(like text or links) ?](#Is it inline or inline-* elements(like text or links)
	*   [Is it a block-level element?](#Is it a block-level element?)
		*   [Is there are more than one block level element?](#Is there are more than one block level element?)

*	[Vertically](#Vertically)
	*   [Is it inline or inline-* elements(like text or links) ?](#Is it inline or inline-* elements(like text or links)
       *   [Is it single line?](#Is it single line?)
 	   *   [Is it multiple line?](#Is it multiple line?)
	
	*   [Is it a block-level element?](#Is it a block-level element?)
       *   [Do you know the height of the element?](#Do you know the height of the element?)
 	   *   [Is the element of unknown height?](#Is the element of unknown height?)

*	[Both Horizontally and Vertically](#Both Horizontally and Vertically)

	*   [Is the element of fixed width and height?](#Is the element of fixed width and height?)
	*   [Is the element of unknown width and height?](#Is the element of unknown width and height?)


<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

# Horizontally

<a href name="Is it inline or inline-* elements(like text or links)?"></a>
<div class="title-block">Is it inline or inline-* elements(like text or links)?</div>

You can easily center inline elements horizontally, within a block-level parent element, with:

```
.center-children {
	text-align: center
}
```

<p data-height="191" data-theme-id="10606" data-slug-hash="AqsLf" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/AqsLf/'>AqsLf</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

This works for `inline`, `inline-block`, `inline-table`, `inline-flex`, etc.

<a href name="Is it a block-level element?"></a>
<div class="title-block">Is it a block-level element?</div>

You can centered a block-level by give it `margin-left` and `margin-right` of `auto` (and it has a set `width`, otherwise it would be full and wouldn't need centering). This often is doing with shorthand like this: 


```
.center {
	margin: 0 auto;
}
```

<p data-height="187" data-theme-id="10606" data-slug-hash="Kxemr" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/Kxemr/'>Kxemr</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

This will work no matter what the width of the block level element you're centering, or the parent.

<a href name="Is there are more than one block level element?"></a>
<div class="title-block">Is there are more than one block level element?</div>

If you have more than two or more block-level elements than need to be centered horizontal in a `row` you should making them a different `display` type. Here is an example of making them `inline-block` or `flexbox`:

<p data-height="423" data-theme-id="10606" data-slug-hash="qlpJG" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/qlpJG/'>Centering Row of Blocks</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

# Vertically

<a href name="Is it single line?"></a>
<div class="title-block">Is it single line?</div>

Sometimes inline / text elements can appear vertically centered with equal padding above and below them:

<p data-height="186" data-theme-id="10606" data-slug-hash="Dyngd" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/Dyngd/'>Centering text (kinda) with Padding</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

If padding is not an option for some reason, there is a trick to making `line-height` equal to the `height`:

<p data-height="271" data-theme-id="10606" data-slug-hash="cugsD" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/cugsD/'>Centering a line with line-height</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

<a href name="Is it multiple lines?"></a>
<div class="title-block">Is it multiple lines?</div>

Equal `padding` on top and bottom still works for multiple lines of text, but if this isn't enough, perhaps the element text can be a `table cell`, ether literally or made to behavior like one with CSS:

<p data-height="324" data-theme-id="10606" data-slug-hash="tBvnk" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/tBvnk/'>Centering text (kinda) with Padding</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

If sometime table-like is out, perhaps you could use flex-box:

<p data-height="298" data-theme-id="10606" data-slug-hash="vcqej" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/vcqej/'>Vertical Center Multi Lines of Text with Flexbox</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>.

If both these techniques are out, you could employ the "ghost element" term:

<p data-height="318" data-theme-id="10606" data-slug-hash="BDziH" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/BDziH/'>Ghost Centering Multi Line Text</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

<a href name="Is block-level element?"></a>
<div class="title-block">Is block-level element?</div>

Vertical centering block-level component.

<a href name="Do you know the height of element?"></a>
<div class="title-block">Do you know the height of element?</div>

If you know the height, you can center vertically like:

<p data-height="374" data-theme-id="10606" data-slug-hash="EfpCb" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/EfpCb/'>Center Block with Fixed Height</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

<a href name="Is it the element with unknown height?"></a>
<div class="title-block">Is it the element with unknown height?</div>

It's still possible to vertically center it:

<p data-height="381" data-theme-id="10606" data-slug-hash="DtBKp" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/DtBKp/'>Center Block with Unknown Height</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

<a href name="Can you use flex-box?"></a>
<div class="title-block">Can you use flex-box?</div>

Surprise-surprise with this technique it's so ease:

<p data-height="417" data-theme-id="10606" data-slug-hash="shLvd" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/shLvd/'>Center Block with Unknown Height with Flexbox</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

<!-- TODO -->

# Both Horizontally and Vertically

You can combine the tehnique above in any order to get perfectly centered elements. But you can next grouped tehniques:

<a href name="Is the element of fixed width and height?"></a>
<div class="title-block">Is the element of fixed width and height?</div>

Using negative margins equels to half of width and heigh. After you get absolutely positioned it at 50% / 50%:

<p data-height="315" data-theme-id="10606" data-slug-hash="jIfuD" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/jIfuD/'>Center Block with Fixed Height and Width</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

<a href name="Is the element of unknown width and height?"></a>
<div class="title-block">Is the element of unknown width and height?</div>

If you don't know  the width and height - you can the `tranform` property with negative `translate` of 50% in both directions:

<p data-height="318" data-theme-id="10606" data-slug-hash="zqyma" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/zqyma/'>Center Block with Unknown Height and Width</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

<a href name="Can you use flexbox?"></a>
<div class="title-block">Can you use flexbox?</div>

To center in both directions with flexbox, you need to use two centering properties:

<p data-height="317" data-theme-id="10606" data-slug-hash="yxqFf" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/yxqFf/'>Center Block with Unknown Height and Width with Flexbox</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

So now you can easy to say, that centering in CSS isn't a big deal. 

Save My Day:

*   on [Css tricks](http://css-tricks.com/centering-css-complete-guide/) css-tricks