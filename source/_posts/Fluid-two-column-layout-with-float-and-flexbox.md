title: Fluid two-column layout with float and flexbox
thumbnailImage: title.png
categories:
  - CSS
date: 2014-03-31 20:49:09
---

Two-column layout allows effective use browser space. Layout doesn't require hard work and it can used with combining colomn in pixels or percentage.

<!--more-->

<!--toc-->

There are several approach for formation such layout, but the quickest and easiest is compine `margin` and `float`.

#  For left side bar with static width

| For left layer with width 20%     |                    |
|-----------------------------------|--------------------|
| `Left` column                     | `Right` column     |
| float: left width: 20%            | margin-left: 21%   |
| For left layer with width 200px   |                    |
| float: left width: 200px          | margin-left: 210px |

#  For right side bar:

| For right layer with width 20%   |                          |
|----------------------------------|--------------------------|
| Left column                      | Right column             |
| margin-right: 21%                | float: right, width: 20% |
| For right layer with width 200px |                          |
| float: right width: 200px        | margin-left: 210px       |

<br>

See the Pen [oAtih](http://codepen.io/qetr1ck-op/pen/oAtih/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).
<script async src="//codepen.io/assets/embed/ei.js"></script>

#  With display: flex

See the Pen [Two-column layout with Flexbox](http://codepen.io/qetr1ck-op/pen/MwdvEV/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).


Make my day:
*	[fluid 2 column layout](http://htmlbook.ru/samlayout/tipovye-makety/rezinovyi-dvukhkolonochnyi-maket "fluid 2 column layout on htmlbook.ru")
*	[awesome checkboxes](http://www.inserthtml.com/demos/css/radio-buttons/ "awesome checkboxes on www.inserthtml.com")