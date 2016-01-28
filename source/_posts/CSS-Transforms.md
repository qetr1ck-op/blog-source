title: CSS Transforms
categories:
  - CSS
date: 2014-08-03 22:13:20
---

So what are transforms and transitions? At their most basic level, transforms move or change the appearance of an element, while transitions make the element smoothly and gradually change from one state to another.
<!--more-->

<!--toc-->
*   [How to use transforms](#How to use transforms)
*   [2D examples](#2D examples)
*   [3D examples](#3D examples)
*   [3D Transform image slider](#3D Transform image slider)


<a href name="How to use transforms"></a>
<div class="title-block">How to use transforms</div>

There are two categories of transform - `2D transforms` and `3D transforms`. 2D transforms are more widely supported, whereas 3D transforms are only in newer browers.

<a href name="2D examples"></a>
<div class="title-block">2D examples</div>

```
//don't forget about prefixes
#skew {
  -webkit-transform:skew(35deg);
   -moz-transform:skew(35deg);
    -ms-transform:skew(35deg);
     -o-transform:skew(35deg);
        transform:skew(35deg);
}
#scale {
  -webkit-transform:scale(1,0.5);
   -moz-transform:scale(1,0.5);
    -ms-transform:scale(1,0.5);
     -o-transform:scale(1,0.5);
        transform:scale(1,0.5);
}
#rotate {
  -webkit-transform:rotate(45deg);
   -moz-transform:rotate(45deg);
    -ms-transform:rotate(45deg);
     -o-transform:rotate(45deg);
        transform:rotate(45deg);
}
#translate {
  -webkit-transform:translate(10px, 20px);
   -moz-transform:translate(10px, 20px);
    -ms-transform:translate(10px, 20px);
     -o-transform:translate(10px, 20px);
        transform:translate(10px, 20px);
}

.thumbnail {
  -webkit-transition: all .5s ease-in;
  -moz-transition: all .5s ease-in;  
  -o-transition: all .5s ease-in;
  transition: all .5s ease-in;
}
```

<p data-height="473" data-theme-id="10606" data-slug-hash="BGAaf" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/BGAaf/'>CSS Transforms: 2D examples</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

<a href name="3D examples"></a>
<div class="title-block">3D examples and hadle `onTransitionEnd`</div>

3D CSS transforms are similar to 2D CSS transforms. The basic properties are `translate3d`, `scale3d`, `rotateX`, `rotateY` and `rotateZ`. `translate3d` and `scale3d` take three arguments for x,y and z, whereas the rotates just take an angle. Here are some examples:

```
#rotateX{
-webkit-transform:rotateX(180deg);
   -moz-transform:rotateX(180deg);
    -ms-transform:rotateX(180deg);
     -o-transform:rotateX(180deg);
        transform:rotateX(180deg);
}
#rotateY{
-webkit-transform:rotateY(180deg);
   -moz-transform:rotateY(180deg);
    -ms-transform:rotateY(180deg);
     -o-transform:rotateY(180deg);
        transform:rotateY(180deg);
}
#rotateZ{
-webkit-transform:rotateZ(180deg);
   -moz-transform:rotateZ(180deg);
    -ms-transform:rotateZ(180deg);
     -o-transform:rotateZ(180deg);
        transform:rotateZ(180deg);
}
```

```
$('.thumbnail').on('transitionend webkitTransitionEnd MSTransitionEnd', function(e) {
  //transitionend fires for each property transitioned
  if (e.originalEvent.propertyName != 'transform') return;

  alert('webkitTransitionEnd')
});
```

<p data-height="474" data-theme-id="10606" data-slug-hash="CDrkj" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/CDrkj/'>CSS Transforms: 3D example and transtionEnd</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

<a href name="3D Transform image slider"></a>
<div class="title-block">3D Transform image slider</div>

Note that because of the way a cube works, the image is moved out towards the screen, and is bigger than it should be. You should move it back by `half` the width of an image to make sure it is normal size.

<p data-height="545" data-theme-id="10606" data-slug-hash="GgCah" data-default-tab="result" data-user="qetr1ck-op" class='codepen'>See the Pen <a href='http://codepen.io/qetr1ck-op/pen/GgCah/'>CSS Transforms: 3D Transform image slider</a> by qetr1ck-op (<a href='http://codepen.io/qetr1ck-op'>@qetr1ck-op</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

SaveMyDay:

*   on [css3.bradshawenterprises.com](http://css3.bradshawenterprises.com/transforms/)