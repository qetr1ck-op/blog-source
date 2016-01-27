title: 'Bootstrap 3: CSS'
thumbnailImage: title.jpg
date: 2014-07-17 20:10:04
categories:
  - CSS
tags:
  - Bootstrap
---

A detailed look for implementation of UI popular library.

<!--more-->

<!--toc-->

1.  Overview
	*   [Mobile First](#Mobile First)
	*   [Typography and links](#Typography and links)
	*   [Normalize.css](#Normalize.css)

2.  Grid System
	*   [Media query](#Media query)
	*   [Stacked-to-horizontal](#Stacked-to-horizontal)
	*   [Fluid container](#Fluid container)
	*   [Offseting columns](#Offseting columns)
	*   [Grid System Examples](#Grid System Examples)

3.  Typography
	*   [Headings](#Headings)
	*   [Body copy](#Body copy)
	*   [Inline text elements](#Inline text elements)
	*   [Transformation clases](#Transformation clases)
	*   [Alignment classes](#Alignment classes)
	*   [Blockquotes](#Blockquotes)
	*   [Lists](#Blockquotes)
	*   [Codes](#Codes)
	*   [User input](#User Input)
	*   [Basic block](#Basic block)
	*   [Varible](#Varible)
	*   [Sample output](#Sample output)
	*   [Typography Examples](#Typography Examples)

4.  Tables
	*   [Basic example](#Basic example)
	*   [Bordered table](#Bordered table)
	*   [Hover rows](#Hover rows)
	*   [Condensed table](#Condensed table)
	*   [Contextual classes](#Contextual classes)
	*   [Responsive tables](#Responsive tables)
	*   [Table Examples](#Table Examples)

5.  Forms
	*   [Basic example](#Basic example)
	*   [Inline form](#Inline form)
	*   [Horizontal form](#Horizontal form)
	*   [Input focus](#Input focus)
	*   [Validates states and Icon](#Validates states and Icon)
	*   [Control sizing and Help text](#Control sizing and Help text)
	*   [Form Examples](#Form Examples)

6.  Buttons
	*   [Options](#Options)
	*   [Sizes](#Sizes)
	*   [Horizontal form](#Horizontal form)
	*   [Active state](#Active state)
	*   [Disabled state](#Disabled state)
	*   [Buttons Examples](#Buttons Examples)

7.  Images
	*   [Responsive image](#Responsive image)
	*   [Image shapes](#Image shapes)

8. Helper classes
	*	[Contextual colors](#Contextual colors)
	*	[Contextual backgrounds](#Contextual backgrounds)
	*	[Close icon](#Close icon)
	*	[Carets](#Carets)
	*	[Quick floats](#Quick floats)
	*	[Center content blocks](#Center content blocks)
	*	[Clearfix](#Clearfix)
	*	[Showing and hiding content](#Showing and hiding content)

<a href name="Mobile First"></a>
<div class="title-block">Mobile First</div>

To ensure proper rendering and touch zooming, add the viewport `meta` tag:

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

You can disable zooming capabilities on mobile devices by adding:

```
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

<a href name="Typography and links"></a>
<div class="title-block">Typography and links</div>

Bootstrap sets basic global display, typography, and link styles. Specifically, we:

*   Set `background-color: #fff;` on the body
*   Use the `@font-family-base`, `@font-size-base`, and `@line-height` - base attributes as our typographic base
*   Set the global link color via `@link-color` and apply link underlines only on `:hover`

These styles can be found within `scaffolding.less`.

<a href name="Normalize.css"></a>
<div class="title-block">Normalize.css</div>

For improved cross-browser rendering, Bootstrap uses [Normalize.css](http://necolas.github.io/normalize.css/), a project by Nicolas Gallagher and Jonathan Neal.

<a href name="Media queries"></a>
<div class="title-block">Media queries</div>

Bootstrap includes a responsive, mobile first fluid grid system that appropriately scales up to `12 columns as` the device or viewport size increases.

Here's how the Bootstrap grid system works:

*	Rows must be placed within a `.container` (fixed-width) or `.container-fluid` (full-width) for proper alignment and padding.
*	Use `rows` to create horizontal groups of columns.
*	Content should be placed within columns, and only columns may be immediate children of rows.
*	Predefined grid classes like `.row` and `.col-xs-4` are available for quickly making grid layouts. Less mixins can also be used for more semantic layouts.
*	Columns create gutters (gaps between column content) via padding. That padding is offset in rows for the first and last column via negative margin on `.rows`.
*	The negative margin is why the examples below are outdented. It's so that content within grid columns is lined up with non-grid content.
*	Grid columns are created by specifying the number of twelve available columns you wish to span. For example, three equal columns would use three `.col-xs-4`.
*	If more than 12 columns are placed within a single row, each group of extra columns will, as one unit, wrap onto a new line.
*	Grid classes apply to devices with screen widths greater than or equal to the breakpoint sizes, and override grid classes targeted at smaller devices. Therefore, e.g. applying any `.col-md-*` class to an element will not only affect its styling on medium devices but also on large devices if a `.col-lg-*` class is not present.

Initial grid system implementation:

```
/* Extra small devices (phones, less than 768px) */
/* No media query since this is the default in Bootstrap */
@media (min-width: @screen-xs-min) { ... }

/* Small devices (tablets, 768px and up) */
@media (min-width: @screen-sm-min) { ... }

/* Medium devices (desktops, 992px and up) */
@media (min-width: @screen-md-min) { ... }

/* Large devices (large desktops, 1200px and up) */
@media (min-width: @screen-lg-min) { ... }
```

Using a single set of `.col-md-*` grid classes, you can create a basic grid system that starts out stacked on mobile devices and tablet devices (the extra small to small range) before becoming horizontal on desktop (medium) devices. Place grid columns in any `.row`.

<a href name="Stacked-to-horizontal"></a>
<div class="title-block">Stacked-to-horizontal</div>

```
<div class="row">
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
</div>
<div class="row">
  <div class="col-md-8">.col-md-8</div>
  <div class="col-md-4">.col-md-4</div>
</div>
<div class="row">
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4">.col-md-4</div>
</div>
<div class="row">
  <div class="col-md-6">.col-md-6</div>
  <div class="col-md-6">.col-md-6</div>
</div>
```

<a href name="Fluid container"></a>
<div class="title-block">Fluid container</div>

Turn any fixed-width grid layout into a full-width layout by changing your outermost `.container` to `.container-fluid`.

```
<html class="container-fluid">
  <div class="row">
    ...
  </div>
</div>
```

<a href name="Offseting columns"></a>
<div class="title-block">Offseting columns</div>

```
<div class="row">
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4 col-md-offset-4">.col-md-4 .col-md-offset-4</div>
</div>
<div class="row">
  <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
  <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
</div>
<div class="row">
  <div class="col-md-6 col-md-offset-3">.col-md-6 .col-md-offset-3</div>
</div>
```

Move columns to the right using `.col-md-offset-*` classes. These classes increase the left margin of a column by * columns. For example, `.col-md-offset-4` moves `.col-md-4` over four columns:

<a href name="Grid System Examples"></a>
<div class="title-block">Grid System Examples</div>

<p data-height="268" data-theme-id="10606" data-slug-hash="qLfBk" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/qLfBk/'>Bootstrap CSS: Grids</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

<a href name="Headings"></a>
<div class="title-block">Headings and Secondary Text</div>

All HTML headings, `h1` through `h6`, are available. .h1 through .h6 classes are also available, for when you want to match the font styling of a heading but still want your text to be displayed inline.

Create lighter, secondary text in any heading with a generic `small` tag or the .small class.

```
<h1>h1. Bootstrap heading <small>Secondary text</small></h1>
<h2>h2. Bootstrap heading <small>Secondary text</small></h2>
<h3>h3. Bootstrap heading <small>Secondary text</small></h3>
<h4>h4. Bootstrap heading <small>Secondary text</small></h4>
<h5>h5. Bootstrap heading <small>Secondary text</small></h5>
<h6>h6. Bootstrap heading <small>Secondary text</small></h6>
```

<a href name="Body copy"></a>
<div class="title-block">Body copy</div>

Bootstrap's global default `font-size` is 14px, with a `line-height` of 1.428\. This is applied to the `body` and all paragraphs. In addition, `p` (paragraphs) receive a bottom margin of half their computed `line-height` (10px by default).

Make a paragraph stand out by adding `.lead`.

```
<p class="lead">...</p>
```

<a href name="Inline text elements"></a>
<div class="title-block">Inline text elements</div>

<p data-height="268" data-theme-id="10606" data-slug-hash="hoLwb" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/hoLwb/'>Inline text element</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

<a href name="Alignment classes"></a>
<div class="title-block">Alignment classes</div>

Easily realign text to components with text alignment classes.

```
<p class="text-left">Left aligned text.</p>
<p class="text-center">Center aligned text.</p>
<p class="text-right">Right aligned text.</p>
<p class="text-justify">Justified text.</p>
<p class="text-nowrap">No wrap text.</p>
```

<a href name="Transformation clases"></a>
<div class="title-block">Transformation clases</div>

Transform text in components with text capitalization classes

```
<p class="text-lowercase">Lowercased text.</p>
<p class="text-uppercase">Uppercased text.</p>
<p class="text-capitalize">Capitalized text.</p>
```

<a href name="Abbreviations"></a>
<div class="title-block">Abbreviations</div>

Stylized implementation of HTML's `abbr` element for abbreviations and acronyms to show the expanded version on hover. Abbreviations with a `title` attribute have a light dotted bottom border and a help cursor on hover, providing additional context on hover.

```
<abbr title="attribute">attr</abbr>
```

<a href name="Blockquotes"></a>
<div class="title-block">Blockquotes</div>

For quoting blocks of content from another source within your document.

Add a `footer` for identifying the source. Add `.blockquote-reverse` for a blockquote with right-aligned content.

```
<blockquote>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
</blockquote>

<blockquote class="blockquote-reverse">
  ...
</blockquote>
```

<a href name="Lists"></a>
<div class="title-block">Lists</div>

```
<ol>
  <li>...</li>
</ol>

<ul class="list-unstyled">
  <li>...</li>
</ul>

<ul class="list-inline">
  <li>...</li>
</ul>

<dl class="dl-horizontal">
  <dt>...</dt>
  <dd>...</dd>
</dl>
```

* * *

<a href name="Codes"></a>
<div class="title-block">Codes</div>

Wrap inline snippets of code with `code`.

```
For example, `&lt;section&gt;` should be wrapped as inline.
```

<a href name="User Input"></a>
<div class="title-block">User Input</div>

Use the `kbd` to indicate input that is typically entered via keyboard.

```
To switch directories, type <kbd>cd</kbd> followed by the name of the directory.
```

<a href name="Basic block"></a>
<div class="title-block">Basic block</div>

Use `&lt;pre&gt;` for multiple lines of code. Be sure to escape any angle brackets in the code for proper rendering.

```
<pre>&lt;p&gt;Sample text here...&lt;/p&gt;</pre>
```

You may optionally add the `.pre-scrollable` class, which will set a max-height of 350px and provide a y-axis scrollbar.

<a href name="Varible"></a>
<div class="title-block">Varible</div>

For indicating variables use the `&lt;var&gt;` tag.

```
<var>y</var> = <var>m</var><var>x</var> + <var>b</var>
```

<a href name="Sample output"></a>
<div class="title-block">Sample output</div>

For indicating blocks sample output from a program use the `&lt;samp&gt;` tag.

```
<samp>This text is meant to be treated as sample output from a computer program.</samp>
```

<a href name="Typography Examples"></a>
<div class="title-block">Typography Examples</div>

See the Pen [Bootstrap CSS: Typography](http://codepen.io/qetr1ck-op/pen/ILeCa/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).

<a href name="Basic example"></a>
<div class="title-block">Basic example</div>

For basic styling—light padding and only horizontal dividers—add the base class .table to any `table`.

```
<table class="table">
  ...
</table>
```

<a href name="Bordered table"></a>
<div class="title-block">Bordered table</div>

Add `.table-bordered` for borders on all sides of the table and cells.

```
<table class="table table-bordered">
  ...
</table>
```

<a href name="Hover rows"></a>
<div class="title-block">Hover rows</div>

Add `.table-hover` to enable a hover state on table rows within a `tbody`.

```
<table class="table table-hover">
  ...
</table>
```

<a href name="Condensed table"></a>
<div class="title-block">Condensed table</div>

Add `.table-condensed` to make tables more compact by cutting cell padding in half.

```
<table class="table table-condensed">
  ...
</table>
```

<a href name="Bordered table"></a>
<div class="title-block">Contextual classes</div>

Use contextual classes to color table rows or individual cells:

```
<!-- On rows -->
<tr class="active">...</tr>
<tr class="success">...</tr>
<tr class="warning">...</tr>
<tr class="danger">...</tr>
<tr class="info">...</tr>

<!-- On cells (`td` or `th`) -->
<tr>
  <td class="active">...</td>
  <td class="success">...</td>
  <td class="warning">...</td>
  <td class="danger">...</td>
  <td class="info">...</td>
</tr>
```

<a href name="Responsive tables"></a>
<div class="title-block">Responsive tables</div>

Create responsive tables by wrapping any `.table` in `.table-responsive` to make them scroll horizontally on small devices (under 768px). When viewing on anything larger than 768px wide, you will not see any difference in these tables.

```
<div class="table-responsive">
  <table class="table">
    ...
  </table>
</div>
```

<a href name="Table Examples"></a>
<div class="title-block">Table Examples</div>

See the Pen [Bootstrap CSS: Tables](http://codepen.io/qetr1ck-op/pen/wqrFH/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).

<script async src="//codepen.io/assets/embed/ei.js"></script>

<a href name="Basic example"></a>
<div class="title-block">Basic example</div>

Individual form controls automatically receive some global styling. All textual `input`, `textarea`, and `select` elements with .form-control are set to `width: 100%;` by default. Wrap labels and controls in `.form-group` for optimum spacing.

```
<form role="form">
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
  </div>
  <div class="form-group">
    <label for="exampleInputFile">File input</label>
    <input type="file" id="exampleInputFile">
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Check me out
    </label>
  </div>
  <button type="submit" class="btn btn-default">Submit</button>
</form>
```

<a href name="Inline form"></a>
<div class="title-block">Inline form</div>

Add `.form-inline` to your `form` for left-aligned and inline-block controls. This only applies to forms within viewports that are at least `768px` wide.

For these inline forms, you can hide the labels using the `.sr-only` class.

```
<form class="form-inline" role="form">
  <div class="form-group">
    <label class="sr-only" for="exampleInputEmail2">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail2" placeholder="Enter email">
  </div>
  <div class="form-group">
    <div class="input-group">
      <div class="input-group-addon">@</div>
      <input class="form-control" type="email" placeholder="Enter email">
    </div>
  </div>
  <div class="form-group">
    <label class="sr-only" for="exampleInputPassword2">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password">
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Remember me
    </label>
  </div>
  <button type="submit" class="btn btn-default">Sign in</button>
</form>
```

<a href name="Horizontal form"></a>
<div class="title-block">Horizontal form</div>

Use Bootstrap's predefined grid classes to align labels and groups of form controls in a horizontal layout by adding `.form-horizontal` to the form. Doing so changes `.form-groups` to behave as grid rows, so no need for `.row`.

```
<form class="form-horizontal" role="form">
  <div class="form-group">
    <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
    </div>
  </div>
  <div class="form-group">
    <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox"> Remember me
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-default">Sign in</button>
    </div>
  </div>
</form>
```

<a href name="Input focus"></a>
<div class="title-block">Input focus</div>

Bootstrap remove the default outline styles on some form controls and apply a `box-shadow` in its place for `:focus`:

<a href name="Validation states"></a>
<div class="title-block">Validation states</div>

Bootstrap includes validation styles for error, warning, and success states on form controls. To use, add `.has-warning`, `.has-error`, or `.has-success` to the parent element. Any .control-label, .form-control, and .help-block within that element will receive the validation styles.

You can also add optional feedback icons with the addition of `.has-feedback` and the right icon.

<a href name="Control sizing and help text"></a>
<div class="title-block">Control sizing and help text</div>

Set heights using classes like `.input-lg`, and set widths using grid column classes like `.col-lg-*`.

Wrap inputs in grid columns, or any custom parent element, to easily enforce desired widths.

See the Pen [Bootstrap CSS: Forms](http://codepen.io/qetr1ck-op/pen/kAeGg/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).

<a href name="Options"></a>
<div class="title-block">Options</div>

Use any of the available button classes to quickly create a styled button:

```
<!-- Standard button -->
<button type="button" class="btn btn-default">Default</button>

<!-- Provides extra visual weight and identifies the primary action in a set of buttons -->
<button type="button" class="btn btn-primary">Primary</button>

<!-- Indicates a successful or positive action -->
<button type="button" class="btn btn-success">Success</button>

<!-- Contextual button for informational alert messages -->
<button type="button" class="btn btn-info">Info</button>

<!-- Indicates caution should be taken with this action -->
<button type="button" class="btn btn-warning">Warning</button>

<!-- Indicates a dangerous or potentially negative action -->
<button type="button" class="btn btn-danger">Danger</button>

<!-- Deemphasize a button by making it look like a link while maintaining button behavior -->
<button type="button" class="btn btn-link">Link</button>
```

<a href name="Sizes"></a>
<div class="title-block">Sizes</div>

Fancy larger or smaller buttons? Add `.btn-lg`, `.btn-sm`, or `.btn-xs` for additional sizes
Create block level buttons—those that span the full width of a parent— by adding `.btn-block.`

```
<button type="button" class="btn btn-primary btn-lg">Large button</button>
<button type="button" class="btn btn-default btn-lg">Large button</button>

<button type="button" class="btn btn-primary">Default button</button>
<button type="button" class="btn btn-default">Default button</button>

<button type="button" class="btn btn-primary btn-sm">Small button</button>
<button type="button" class="btn btn-default btn-sm">Small button</button>

<button type="button" class="btn btn-primary btn-xs">Extra small button</button>
<button type="button" class="btn btn-default btn-xs">Extra small button</button>

<!-- Block level button -->
<button type="button" class="btn btn-primary btn-lg btn-block">Block level button</button>
<button type="button" class="btn btn-default btn-lg btn-block">Block level button</button>
```

<a href name="Active state"></a>
<div class="title-block">Active state</div>

Buttons will appear pressed (with a darker background, darker border, and inset shadow) when active. For `button` elements, this is done via `:active`. For `a` elements, it's done with `.active`. However, you may use `.active` on `button` should you need to replicate the active state programmatically.

<a href name="Disabled state"></a>
<div class="title-block">Disabled state</div>

Make buttons look unclickable by fading them back 50%.

Add the `disabled` attribute to `button` or `.disabled` class to `a`:

```
<button type="button" class="btn btn-lg btn-primary" disabled="disabled">Primary button</button>
<button type="button" class="btn btn-default btn-lg" disabled="disabled">Button</button>
<!-- Anchors elements -->
<a href="#" class="btn btn-primary btn-lg disabled" role="button">Primary link</a>
<a href="#" class="btn btn-default btn-lg disabled" role="button">Link</a>
```

See the Pen [Bootstrap CSS: Buttons](http://codepen.io/qetr1ck-op/pen/Chnep/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).

<a href name="Responsive images"></a>
<div class="title-block">Responsive images</div>

Images in Bootstrap 3 can be made responsive-friendly via the addition of the `.img-responsive` class. This applies `max-width: 100%;` and `height: auto;` to the image so that it scales nicely to the parent element.

```
<img src="..." class="img-responsive" alt="Responsive image">
```

<a href name="Images shapes"></a>
<div class="title-block">Images shapes</div>

Add classes to an `img` element to easily style images in any project:

```
<img src="..." alt="..." class="img-rounded">
<img src="..." alt="..." class="img-circle">
<img src="..." alt="..." class="img-thumbnail">
```
See the Pen [Images shapes](http://codepen.io/qetr1ck-op/pen/ILkHg/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).

<a href name="Contextual colors"></a>
<div class="title-block">Contextual colors</div>

Convey meaning through color with a handful of emphasis utility classes: `text-muted`, `text-primary`, `text-success`, `text-info`, `text-warning`, `text-danger`:

```
<p class="text-muted">...</p>
<p class="text-primary">...</p>
<p class="text-success">...</p>
<p class="text-info">...</p>
<p class="text-warning">...</p>
<p class="text-danger">...</p>
```

<a href name="Contextual backgrounds"></a>
<div class="title-block">Contextual backgrounds</div>

Similar to the contextual text color classes, easily set the `background` of an element to any contextual class. Anchor components will darken on hover, just like the text classes.

```
<p class="bg-primary">...</p>
<p class="bg-success">...</p>
<p class="bg-info">...</p>
<p class="bg-warning">...</p>
<p class="bg-danger">...</p>
```

<a href name="Close icon"></a>
<div class="title-block">Close icon</div>

Use the generic close icon for dismissing content like modal and alert.

```
<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
```

<a href name="Carets"></a>
<div class="title-block">Carets</div>

Use carets to indicate drop-down functionality and direction.

```
<span class="caret"></span>
```

<a href name="Quick floats"></a>
<div class="title-block">Quick floats</div>

```
<div class="pull-left">...</div>
<div class="pull-right">...</div>
```

<a href name="Center content blocks"></a>
<div class="title-block">Center content blocks</div>

Set an element to `display: block` and center via `margin`

```
<div class="center-block">...</div>
```

<a href name="Clearfix"></a>
<div class="title-block">Clearfix</div>

Easily clear floats by adding `.clearfix` to the parent element.

```
<!-- Usage as a class -->
<div class="clearfix">...</div>
```

<a href name="Showing and hiding content"></a>
<div class="title-block">Showing and hiding content</div>

Force an element to be shown or hidden (including for screen readers) with the use of `.show` and `.hidden` classes.

```
<div class="show">...</div>
<div class="hidden">...</div>
```

<a href name="Helper Classes Examples"></a>
<div class="title-block">Helper Classes Examples</div>

See the Pen [Helper Classes](http://codepen.io/qetr1ck-op/pen/zLJKp/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).

The materials which save my day:

*	[Bootstrap Official Site](http://getbootstrap.com/css/#helper-classes-center)