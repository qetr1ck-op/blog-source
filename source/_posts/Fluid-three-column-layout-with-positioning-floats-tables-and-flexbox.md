title: 'Fluid three column layout with positioning, floats, tables and flexbox'
thumbnailImage: title.png
categories:
  - CSS
date: 2014-04-18 11:09:46
---

In Web world, fluid layout with 3 column is the most flexible and customizable layout. Mixing percentages and pixels for specify width of column allows create differents layouts, for different task.

<!--more-->

<!--toc-->


In article sumbols mean:
*   Here sumbol `%` define, that column width is given in persantage of layout width;
*   `px`- column width in static pixels;
*   `∞` - column occupies all remain width space.

#    Using positioning

To control position layout relative to the parent element layers, necessary establish for parent property - `position: relative`. And for child element set `position: absolute`, conrols fluid element with `right/left`, width in some cases used `margin-right/left`.

See the Pen [Three column fluid layout with positionig](http://codepen.io/qetr1ck-op/pen/jtyhi/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).
<script async src="//codepen.io/assets/embed/ei.js"></script>

#    Floats

For this approach I used `float` in combinatition with properties `margin` and `width`. In some case used nested or additional `div.wrap`, because we can't use in the same time for onу HTML element margin in px and %.

See the Pen [Fluid three column layout using floats](http://codepen.io/qetr1ck-op/pen/asfKq/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).

#    Table columns

Actually, it's convinient to use table when you want to create column with same height. Width of column calculated automatcaly based on their content so I just need to specify the require width. Remain columns would streach to avaible width of table.

See the Pen [Fluid three column layout using table](http://codepen.io/qetr1ck-op/pen/olGHE/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).

#    Flex box

Most layout or if you want grid system use one of next methods: `positioning`, `tables`, and most popular - `inline-blocks` or `float`. All this methods have pretty significaте problems and limetations.

For for achive bunch of three column layout Flex boxes are super ease. In generaly I used for parents : `display: flex` and for children `flex: 1` it's shorthand for `flex-grow, flex-shrink and flex-basis`

In furture post I should discover this literally one of the most promosing feature of web disign.

See the Pen [Fluid three column layout with flexbox](http://codepen.io/qetr1ck-op/pen/uAfrh/) by qetr1ck-op ([@qetr1ck-op](http://codepen.io/qetr1ck-op)) on [CodePen](http://codepen.io).

This resources Save My Day:

*   [htmlbook.ru](http://htmlbook.ru/samlayout/tipovye-makety/rezinovyi-trekhkolonochnyi-maket)
*   [css-tricks.com](http://css-tricks.com/snippets/css/a-guide-to-flexbox/)
*   [Solved by Flexbox](http://philipwalton.github.io/solved-by-flexbox/demos/grids/)