title: Medium-Style Page Transition
thumbnailImage: title.gif
categories:
  - CSS
  - Inspiration
  - Javascript
date: 2014-09-01 22:50:51
---

An article on how to achieve [Medium’s](https://medium.com/) next page transition effect—an effect that can be seen by clicking anywhere on the “Read Next” footer at the bottom of the page. This effect is characterized by the lower article easing upward as the current article fades up and out.

<!--more-->

The page makes Ajax request to static `json` files. Page state is managed by using the [PushState API](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history) and `location.hash`. All photos are from [Unsplash](http://unsplash.com/).

<!--toc-->

In this article, I will outline how to achieve Medium’s page transition effect—an effect that can be seen by clicking anywhere on the “Read Next” footer at the bottom of the page. This effect is characterized by the lower article easing upward as the current article fades up and out. See the animation below for an illustration of this effect.

#    HTML

In this demo, the page first loads with barebones HTML, which we’ll use as a template that will be filled in later with Ajax’d-in data. Below is what our `<body>` looks like on initial page load. One main `<article>` tag. Pretty simple, eh?

```
<body>
  <article class='page hidden'>
    <div class='big-image'></div>
    <div class='content'></div>
  </article>
</body>
```

Once the content is Ajax’d-in, the <body> looks something like so:

```
<body>
  <article class='page current'><!--other HTML --></article>
  <article class='page next '><!--other HTML --></article>
<body>
```

The page currently being viewed has a class of `current`, and the next article has a class of `next`. The next article only has its large image being shown at the bottom of the page, which, when `clicked` on, brings it into focus.

#    CSS

The styles in this demo which control the article transitions are both applied dynamically via jQuery’s `css()` method, as well as by applying classes to the `<article>` elements using jQuery’s `addClass()` method:

```
article.page.hidden { 
    display: none
}

article.page.content-hidden .content { 
    display: none
}

article.fade-up-out {
    opacity: 0;
    transform: scale(0.8) translate3d(0, -10%, 0);
    transition: all 450ms cubic-bezier(0.165, 0.840, 0.440, 1.000);
}

article.easing-upward {
    transition: all 450ms cubic-bezier(0.165, 0.840, 0.440, 1.000);
}
```

#    JavaScript

Before getting into the Javascript code, I want to first outline the algorithm used to transition the `next` article upward, and transition the `current` article up and away.

So, when user click on `next` article:

1.  Disable scroll on the page
2.  Fade `current` article to `opacity` of 0, a `scale` of .8 and move it upward by 10%
3.  Show the `article` content, give it smooth transition, then move it upward to the top of the window
4.  After 500ms:

Non-Closure Example:

```
function nonClosure() {
    //encapsulation
    var date = new Date(); //Varible lost after function returns

    return date.getMilliseconds();
}
```

Closure function:
```
function trueClosure() {
    //encapsulation
    var date = new Date(); //Varible stays around even after function returns

    //nested function (!)
    return function() {
        return date.getMilliseconds();
    }
}
```

Closure function example2:
```
function trueClosure() {
    //encapsulation
    var date = new Date(); //Varible stays around even after function returns
    //nested function (!)
    function getTime() {
        return date.getMilliseconds();
    }

    return {
        getTime: getTime
    }
}
```

#    Animation Code

```
 ArticleAnimator.animatePage = function(callback){
  var self              = this;
  var translationValue  = this.$next.get(0).getBoundingClientRect().top;
  this.canScroll        = false;

  this.$current.addClass('fade-up-out');

  this.$next.removeClass('content-hidden next')
       .addClass('easing-upward')
       .css({ "transform": "translate3d(0, -"+ translationValue +"px, 0)" });

  setTimeout(function(){
      scrollTop();
      self.$next.removeClass('easing-upward')
          self.$current.remove();

      self.$next.css({ "transform": "" });
          self.$current = self.$next.addClass('current');

      self.canScroll = true;
      self.currentPostIndex = self.nextPostIndex( self.currentPostIndex );

      callback();
  }, self.animationDuration + 300 );
}
```

Throughout the CSS and JavaScript code in order to achieve fluid animation I'm using `transform: translate3d(x, y, z)` to move DOM elements. By doing this, we `hardware accelarate` the DOM elements movement. This method is preferred over animating an element using `top / left` or `transform: translateX(x) / translateY(y)`, which are not `hardware` accelarated by default.