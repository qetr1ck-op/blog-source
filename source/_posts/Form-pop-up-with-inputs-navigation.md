title: Form pop-up with inputs navigation
thumbnailImage: form.png
  - Javascript
  - Forms
tags:
  - Javascript
  - Forms
categories:
date: 2014-03-30 21:41:30
---

Modal pop-up confirm with "corect" navigation through inputs.

<!--more-->

Main functional requirements are:

*	When submitting a form `OK` / `Enter` - the callback function must be called with the value of the field

*	Clicking on `Cancel` or press the `Esc` should be call the function callback. `Esc` key to close the form should always, even if the message input field is not in focus.

*	Form should do modal affect, all other element on page must be unlclickable.

*	Form always centered in middle, height of form has no matter

*	When form appears input field in focus and user have possibility use `Tab` / `Tab-Shift` for switch only inputs in the form.

<p data-height="268" data-theme-id="0" data-slug-hash="xuizw" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/xuizw/'>xuizw</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

Make my day:

*	[Forms: method and event "submit"](http://learn.javascript.ru/forms-submit)
