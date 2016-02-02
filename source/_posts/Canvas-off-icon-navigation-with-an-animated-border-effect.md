title: Canvas-off icon navigation with an animated border effect
thumbnailImage: title.png
categories:
  - Javascript
date: 2014-08-11 21:11:48
---

<!--more-->

<!--toc-->

#   The Markup

The HTML structure for our menu will consist of a `nav` element that will contain a `trigger anchor` and an unordered list with the menu items which will consist of icons:

```
<nav id="bt-menu" class="bt-menu">
    [<span>Menu</span>](#)

*   [Zoom](#)
*   [Refresh](#)
*   [Lock](#)
*   [Sound](#)
*   [Favorite](#)
</nav>
```

#    The CSS

Let’s use the border-box box-sizing:

```
*,
*:after,
*::before {
    box-sizing: border-box;
}
```

And let’s set some styles for the body and the main container:

```
body  {
    background: #04a466;
}

.container {
    padding: 80px;
}
```

The padding will help providing some space around our content so that when the border appears, we guarantee that there is enough space around.

The main menu element will have position `fixed` so that, no matter where we are in the page, the border is always around the viewport. We set an initial `border` style which we will transition to a bigger border. Setting the initial `height` to 0 will make sure that the menu does not cover anything initially. The “backward” or closing height `transition` will have a delay of 0.3s:

```
.bt-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    border-width: 0px;
    border-style: solid;
    border-color: #333;
    background-color: rgba(0,0,0,0);
    transition: border-width 0.3s, background-color 0.3s, height 0s 0.3s;
}
```

When we open the menu, we’ll set the `height` to 100% (but we won’t transition that property) and the `border will` animate to 90px on the left side and 30px on all the other sides. The `background color` will be semi-transparent using an RGBA value:

```
.bt-menu.bt-menu-open {
    height: 100%;
    border-width: 30px 30px 30px 90px;
    background-color: rgba(0,0,0,0.3);
    transition: border-width 0.3s, background-color 0.3s;
}
```

Now we have to use a little trick. We will add another `element` using JavaScript which will server as a dummy container covering the whole page except the border. This will allow us to distinguish where we are clicking in order to close the whole thing. We don’t want the menu to close when clicking on the border but only when clicking in the space between:

```
.bt-overlay {
    position: absolute;
    width: 100%;
}
```

When we open the menu, this element will have full `height`:

```
.bt-menu-open .bt-overlay {
    height: 100%;
}
```

Let’s style that little `trigger element`. We’ll give it a `fixed` position and we’ll show it in the `top left corner` of the page:

```
.bt-menu-trigger {
    position: fixed;
    top: 15px;
    left: 20px;
    display: block;
    width: 50px;
    height: 50px;
    cursor: pointer;
}
```

The `trigger anchor` itself will serve as a container and the span will be the middle line of our hamburger menu icon. So we position it in the middle by setting the `top` to 50% and giving it a negative top `margin` of half of its height:

```
.bt-menu-trigger span {
    position: absolute;
    top: 50%;
    left: 0;
    display: block;
    width: 100%;
    height: 4px;
    margin-top: -2px;
    background-color: #fff;
    font-size: 0px;
    user-select: none;
    transition: background-color 0.3s;
}
```

When opening the menu, we will make a cross out of the icon. The other two lines will be created by pseudo-elements and when the menu is open, the middle line will disappear:

```
.bt-menu-open .bt-menu-trigger span {
    background-color: transparent;
}
```

Now, let’s create the two other lines. The pseudo-elements will be `positioned` absolutely and their `height` is going to be the same like of their parent by setting it to 100%:

```
.bt-menu-trigger span:before,
.bt-menu-trigger span:after {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    content: '';
    transition: transform 0.3s;
}
```

For positioning them correctly, we’ll use `translateY`:

```
.bt-menu-trigger span:before {
    transform: translateY(-250%);
}

.bt-menu-trigger span:after {
    transform: translateY(250%);
}
```

The cross will be formed when opening the menu by setting the `translateY` to 0 and rotating the pseudo-elements accordingly:

```
.bt-menu-open .bt-menu-trigger span:before {
    transform: translateY(0) rotate(45deg);
}

.bt-menu-open .bt-menu-trigger span:after {
    transform: translateY(0) rotate(-45deg);
}
```

The `unordered list` with our icons will also have a `fixed` position and we’ll set it to the left side of the window:

```
.bt-menu ul {
    position: fixed;
    top: 75px;
    left: 0;
    margin: 0;
    padding: 0;
    width: 90px;
    list-style: none;
    backface-visibility: hidden;
}
```
Let’s set the list items and the anchors to `display: block` and give them full width:

```
.bt-menu ul li,
.bt-menu ul li a {
    display: block;
    width: 100%;
    text-align: center;
}
```

Each list item will be hidden initially and the `opacity` will be 0. The “backward” transition of the visibility will be delayed until all the other `transitions` of the transform and the opacity are finished:

```
.bt-menu ul li {
    padding: 16px 0;
    opacity: 0;
    visibility: hidden;
    transition: transform 0.3s, opacity 0.2s, visibility 0s 0.3s;
}
```

Now we will transform each of the list items differently so that they are all placed in the `middle` and to the left until they are hidden (-100% on the Y axis):

```
.bt-menu ul li:first-child { 
    transform: translate3d(-100%,200%,0);
}

.bt-menu ul li:nth-child(2) { 
    transform: translate3d(-100%,100%,0);
}

.bt-menu ul li:nth-child(3) { 
    transform: translate3d(-100%,0,0);
}

.bt-menu ul li:nth-child(4) { 
    transform: translate3d(-100%,-100%,0);
}

.bt-menu ul li:nth-child(5) { 
    transform: translate3d(-100%,-200%,0);
}
```

When opening the menu, the list items will become `visible` (instantly, because we are not setting a transition for it) and they will fade in. They will also move to their original positions by setting the `transform3d` to 0 for all axes:

```
.bt-menu.bt-menu-open ul li {
    visibility: visible;
    opacity: 1;
    transition: transform 0.3s, opacity 0.3s;
    transform: translate3d(0,0,0);
}
```

Now, let’s style the anchors. We will use an icon font and include the font reference and the icon classes in another CSS which will be provided by a service like [Fontastic](http://app.fontastic.me/) or the [IcoMoon app](https://icomoon.io/app).

By setting the `font size` of the anchor to 0 and make it transparent, we’ll hide the text:

```
.bt-menu ul li a {
    display: block;
    outline: none;
    color: transparent;
    text-decoration: none;
    font-size: 0px;
}
```

We’ll reset the `font size` for the pseudo-element which contains the icon. We’ll need to use a pixel-based value because the main element has a font-size of 0 so ems won’t work here:

.bt-menu ul li a:before {
    color: #04a466;
    font-size: 48px;
    transition: color 0.2s;
}

On `hover` we’ll make them white:

```
.bt-menu ul li a:hover:before,
.bt-menu ul li a:focus:before  {
    color: #fff;
}
```

And last, but not least, we want the icons to be smaller on mobile screens:

```
@media screen and (max-height: 31.125em) {
    .bt-menu ul li a:before {
        font-size: 32px;
    }
}
```

#    The Javascript

Our script is pretty straightforward; when we click on the trigger anchor, we toggle the class `bt-menu-open` and `bt-menu-close` on the `nav` element.

When we click on the `overlay`, we will close the menu. We’ll also add some touch support:

```
(function() {

    // http://stackoverflow.com/a/11381730/989439
    function mobilecheck() {
        var check = false;
        (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    function init() {

        var menu = document.getElementById( 'bt-menu' ),
            trigger = menu.querySelector( 'a.bt-menu-trigger' ),
            // event type (if mobile, use touch events)
            eventtype = mobilecheck() ? 'touchstart' : 'click',
            resetMenu = function() {
                classie.remove( menu, 'bt-menu-open' );
                classie.add( menu, 'bt-menu-close' );
            },
            closeClickFn = function( ev ) {
                resetMenu();
                overlay.removeEventListener( eventtype, closeClickFn );
            };

        var overlay = document.createElement('div');
        overlay.className = 'bt-overlay';
        menu.appendChild( overlay );

        trigger.addEventListener( eventtype, function( ev ) {
            ev.stopPropagation();
            ev.preventDefault();

            if( classie.has( menu, 'bt-menu-open' ) ) {
                resetMenu();
            }
            else {
                classie.remove( menu, 'bt-menu-close' );
                classie.add( menu, 'bt-menu-open' );
                overlay.addEventListener( eventtype, closeClickFn );
            }
        });

    }

    init();

})();
```

#    View Demo

[View demo](http://tympanus.net/Development/OffCanvasMenuEffects/)

SaveMyDay:

*   on [tympanus.net](http://tympanus.net/codrops/2013/09/30/animated-border-menus/)