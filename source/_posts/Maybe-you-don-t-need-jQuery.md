title: "Maybe, You don't need jQuery"
id: 623
categories:
  - Javascript
  - jQuery
date: 2014-08-10 18:08:20
---
Do you really need to use jQuery methods instead of vanila Javascript

<!--more-->

<!--toc-->

#   When should I use jQuery

1.  Do you need a quick prototype or proof of concept?
2.  Do you use jQuety plugin?
    2.1   jQuery Plugins, jQuery Widgets, Twitter Bootstrap, etc...
3.  Do you use a Library or Fremework than depends on jQuery?
    3.1   Backbone.js, Ember.js, etc...
4.  Do any of your browser not ["Cut the mustard"](https://gist.github.com/speedsticko/7453837) (come up to expectations, reach the required standard) ?
5.  Featured not supported Netievly in <= IE8

#    Alternative Libraries

*   [Zepto.js](http://zeptojs.com/)
*   [Min.js](https://github.com/remy/min.js/)

#    Native Selectors

```
//jQuery:
$('#datepicker');
$('input');
$('.date');
$('input.date');
```
```
//Native :
document.getElementById('datepicker');
document.getElementsByTagName('input');
document.getElementsByClassName('.date');
document.querySelectorAll('input.date');
document.querySelector('input.date');
```

#    Each
```
//Each jQuery:
$('input.date').each(function(el, i) {
    $(el).text('Hello ' + i);
})
```

```
//Native #1: 
var nodes = document.querySelectorAll('input.date');

for (var i = 0; i < nodes.length; i++) {
    nodes[i].innerText = 'Hello ' + i;
}

//Each Native #2: 
var nodes = document.querySelectorAll('input.date'),
    elems = [].slice.call(nodes);

elems.forEach(function(el, i) {
    el.innerText('Hello ' + i);
});

//Each Native #3:
var nodes = document.querySelectorAll('input.date');

[].forEach.call(nodes, function(el, i) {
    el.innerText('Hello ' + i);
});

//Each Native #4: 
function $$(selector) {
    return [].slice.call(selector)
}

$$('input.date').forEach(function(el, i) {
    el.innerText('Hello ' + i);
});
```
#  Index(eq)

```
//Index(eq) jQuery:
$(div.date).eq(3);    //return $ object
$(div.date).get(3);
$(div.date)[3];
```

```
//Index Native:
document.querySelectorAll('input.date')[3]
```

#  First, Last

```
//First, Last jQuery:

var $dates = $('.dates');

$dates.first();    //return $ object
$dates.eq(0);      //return $ object
$dates.get(0);
$dates[0];

$dates.last();    //return $ object
$dates.eq(-1);    //return $ object
$dates.get(-1);
$dates[$dates.length - 1];
```

```
//First, Last Native:
var dates = document.querySelectorAll('.dates');

dates.firstElementChild;
dates[0];
document.querySelector('.dates');

dates.lastChild
date[date.length - 1];
[].pop.call(date);
```

# Is/Matches

```
//jQuery "is":
$('#widget').is('.active');
```

```
//Native "match":
document.getElentById('widget').matches('.active');

//matches polyfil;
if (Element && !Element.prototype.matches) {
    var proto = Element.prototype;
    proto.matches = proto.matchesSelector ||
        proto.mozMatchesSelector || proto.msMatchesSelector ||
        proto.oMatchesSelector || proto.webkitMatchesSelector;
}
```

# Filter

```
//Filter jQuery:
var dates = $(.dates);

dates.filter('[pattern]');
dates.filter('.active');
```

```
//Filter Native:
var dates = [].slice.call(document.querySelectorAll('.dates'));

dates = dates.filter(function(el, i) {
    el.matches('.active')
});
```

# Find

```
//Find jQuery:
$('#widget').find('.favorites');
$('ul').find('.favorites');
```

```
//Find Native:
document.getElementById('widget').querySelectorAll('.favorites');
```
   
# Next, Prev

```
//Next, Prev jQuery:
var elem = $('#widget'),
    prev = elem.prev(),
    next = elem.next();
```

```
//Next, Prev Native:
var elem = document.getElementById('widget'),
    prev = elem.previousElemntSibling,
    next = elem.nextElemntSibling;
```

# Closest

```
$('#widget').closest('.active');
```

```
//Closest Native:
closest(document.getElementById('widget'), '.active');

function closest(elem, selector) {

   var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;

    while (elem) {
        if (matchesSelector.bind(elem)(selector)) {
            return elem;
        } else {
            elem = elem.parentElement;
        }
    }
    return false;
}
```

# Classes

Class manipulation in <=IE9

```
document.querySelector('.widget').className += ' active';
document.querySelector('.widget').className = ' ';
```

For polyfill `ClassList` use [this one](https://github.com/remy/polyfills/blob/master/classList.js).

# HTML text

```
//jQuery:
var $widget = $('#widget');

$widget.html('<b>Hello from jQuery!</b>'); //Setter
$widget.html();                            //Getter
$widget.text('Bye from jQuery!');           
$widget.text();
```

```
//Native:
var widget = document.getElementById('widget');

widget.innerHTML = '**Hello from Native!**' //Setter
widget.innerHTML;                           //Getter
widget.textContent = 'Bye from Native!';
widget.textContent;
```

# Append & Prepend

```
//jQuery:
$('#widget').append('<div>Hello from jQuery!</div>');
$('#widget').append('<div>Bye from jQuery!</div>');
```

```
//Native:
var widget = document.getElementById('widget'),
    appendEl = document.createElement('div'),
    prependdEl = document.createElement('div');

widget.appendChild(appendEl);
widget.insertBefore(prependEl, appendEl.children[0]);
```

Or you can use polifil for modern methods like `prepend`, `append`, etc...
```
<script src="https://cdn.polyfill.io/v1/polyfill.js?features=Element.prototype.append,Element.prototype.after"></script>
```

# Remove

```
//jQuery:
var $widget = $('#widget');

$widget.empty();
$widget.html('');
$widget.remove();
```

```
//Native:
var widget = document.getElementById('widget');

widget.innerHTML = '';
widget.parentNode.removeChild(widget);
while (widget.lastChild)
    widget.removeChild(widget.lastChild);
```

# CSS

```
//jQuery:
var $widget = $('#widget');

$widget.css('color', 'aquamarine');
$widget.css({
    fontSize: '2em',
    '-webkit-transform': 'rotate(45deg)',
    'transition': 'all .5s easy-in'
    });
```

```
//Native:
var widget = document.getElementById('widget');

widget.css.color = 'aquamarine';
widget.css[fontSize varible] = '2em';
```


# Attributes and Property

```
//jQuery:
var $widget = $('#search-main'),
    $toggle = $('#toogle-checkbox'),
    $link = $('#link-awesome');

$widget.attr('placeholder', 'Search Here ...');
$widget.attr('placeholder');

$toggle.prop('checked', true);
$toggle.prop('checked');

$link.attr('href'); // .pages/about.html
$link.prop('href'); // http://domain.com/pages/about.html
```


```
//Native:
var widget = document.getElementById('widget'),
    toogle = document.getElementById('toogle-checkbox'),
    link = document.getElementById('toogle-checkbox');

widget.setAttribute('placeholder', 'Search Here ...');
widget.setAttribute();

toogle.checked = true;
toogle.checked;

link.getAttribute('href'); // .pages/about.html
link.href;                 // http://domain.com/pages/about.html
```
    
# Value

```
//jQuery:
var $widget = $('#search-main');

$widget.val('Hello, new value!');
$widget.val();
```

```
//Native:
var widget = document.getElementById('search-main');

widget.value = 'Hello, new value!'
$widget.value;
```

# Height & Width

```
//jQuery:
var $container = $('#container');

$container.width();
$container.innerWidth();
$container.outerWidth();
```

```
//Native:
var container = document.getElementById('search-main');

container.clientWidth;
container.offsetWidth;
box.getBoundingClientRect().width;
```

# Bind and Unbind

```
//jQuery:
$('#foo-btn').click(function() {});
$('#foo-btn').on('click', function() {});
$('#foo-btn').bind('click', function() {});

$(.btn-active).on('click', function() {});

//unbind
var el = $('#bar-btn');

el.off();
el.off('click');
el.off('click', nameOfCallback);
```

```
Native:
var btn = document.getElementById('foo-btn');
    btnsActive = document.querySelectorAll('.foo-active'),
    cachingCallback = function(){};

btn.addEventListener('click', function() {});

[].forEach.call(btnsActive, function(el) {
    el.addEventListener('click', cachingCallback);
})

//unbind
btn.removeEventListener('click', nameOfCallback);

[].forEach.call(btnsActive, function(el) {
    el.removeEventListener('click', nameOfCallback);
})
```

# Delegation

```
//jQuery:
$('#menu').on('click', 'li' function() {});
```

```
//Native:
document.getElementById('menu').addEventListener('click', function(ev) {
    if (ev.target.tagName != 'LI') return;

    //or
    if (ev.target.matches(.active)) {
        //...
    }
});
```
    
# Prevent Default & Stop #Propation

```
//jQuery:

$('submit-form').on('click', function(ev) {
    ev.preventDefault();
    ev.stopPropation();
});
```

```
//Native:
document.getElementById('#submit-form').addEventListener('click', function(ev) {
    ev.preventDefault();
    ev.stopPropation();
});
```

# Trigger

```
//jQuery:
$('menu').on('click', function(ev, arg1, arg2) {
    console.log(ev, arg1, arg2);
});

$('menu').trigger('click');
$('menu').trigger('click', ['arg1', 'arg2']);
```

```
//Native:
document.getElementById('#menu').addEventListener('click', function(ev, arg1, arg2) {
    console.log(ev, arg1, arg2)
});

var event = new Event('click');
document.getElementById('#menu').dispatchEvent(event);

var event = new CustomEvent('click', {
    detail: ['arg1', 'arg2']
});
document.getElementById('#menu').dispatchEvent(event);
```

# DOM Ready

```
//jQuery:
$(document).ready(function() {
    //DOM is ready
});

$(function() {
    //DOM is ready
})
```

```
<!--Native #1:-->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>

    <script>
        //DOM is ready
    </script>
</body>
</html>
[/html]
```

```
//Native #2:
document.addEventListener('DOMContentLoaded', function() {
    //DOM is ready
})
```

# Ajax Get

```
//jQuery #1:
$.get('url', function(data) {
    console.log(data);
});

$.get(
    'url',
    {name: 'foo'},
    function(data) {
        console.log(date);
    }
)
```

```
//jQuery #2:
$.ajax({
    type: 'GET',
    url: 'url',
    data: {name: 'foo'},
    success: function(data) {
        console.log(date);
    }
})
```

```
//Native:
var xhr = new XMLHttRequest();

xhr.open('GET', 'url' + 'name=foo', true);
xhr.onload = function() {
    if (this.status === 200)
        console.log(this.responseText);
};
xhr.send();
```

# Ajax Post

```
jQuery #1:
$.post('url', function(data) {
    console.log(data);
});

$.post(
    'url',
    {name: 'foo'},
    function(data) {
        console.log(date);
 )
[/javascript]
```

```
//jQuery #2:
$.ajax({
    type: 'POST',
    url: 'url',
    data: {name: 'foo'},
    success: function(data) {
        console.log(date);
    }
})
```

```
//Native #1:
var xhr = new XMLHttRequest();

xhr.open('POST', 'url', true);
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
xhr.onload = function() {
    if (this.status === 200)
        console.log(this.responseText);
};
xhr.send('name=bob&age=26');
```

```
<!--Native #2:-->

<form enctype="multipart/form-data" method="post" name="fileinfo">
  <label>Your email address:</label>
  <input type="email" autocomplete="on" autofocus name="userid" placeholder="email" required size="32" maxlength="64" />

  <label>Custom file label:</label>
  <input type="text" name="filelabel" size="12" maxlength="32" />

  <label>File to stash:</label>
  <input type="file" name="file" required />
  <input type="submit" value="Stash the file!" />
</form>
<div id="output"></div>

var form = document.forms.namedItem("fileinfo");
form.addEventListener('submit', function(ev) {

  var oOutput = document.getElementById("output"),
    oData = new FormData(document.forms.namedItem("fileinfo"));

  oData.append("CustomField", "This is some extra data");

  var oReq = new XMLHttpRequest();
  oReq.open("POST", "stash.php", true);
  oReq.onload = function(oEvent) {
    if (oReq.status == 200) {
      oOutput.innerHTML = "Uploaded!";
    } else {
      oOutput.innerHTML = "Error " + oReq.status + " occurred uploading your file.
";
    }
  };

  oReq.send(oData);
  ev.preventDefault();
}, false);
```

# JSONP

```
//jQuery #1:

$.getJSON('http://domain.io/jsonp?callback=?',
 function(data) {
    console.log(data);
});
```
```
//jQuery #2:
$.ajax({
    url: 'url',
    dataTepe: 'jsonp',
    success: function(data) {
        console.log(date);
    }
})
```

```
//Native:
function jsonpCallback(data) {
    console.log(data)
}

var script = document.creatElement('script');
script.src = 'http://exampleDomain.io/jsonp?callback=jsonpCallback';
document.head.appendChils(script);
```

# Micro-Library

Reqwest on [link](https://github.com/ded/reqwest)

# Each, Grep, Map

```
//jQuery:
$.each(arr, function(el) {
    console.log(el.name + ' ' + el.id);
})

arr = $.grep(arr.function(el) {
    return el.matches('Script')
})

arr = $.map(arr, function(el) {
    return {
        nickname: el.name,
        secretCode: el.age,
        age: Date.now()
    };
});
```

```
//Native:
arr.forEach(function(el) {
    console.log(el.name + ' ' + el.id);
});

arr = arr.filter(function(el) {
    return el.matches('Script')
});

arr = arr.map(function(el) {
    return {
        nickname: el.name,
        secretCode: el.age,
        age: Date.now()
    };
});
```

Or you can use Undersore or Low-Dash `_.each`.

# in Array

```
var arr = ['foo', 'bar', 'baz'];
```

```
console.log('Found Bar: ' + !!~arr.inArray('bar'));
```


```
//Native:
console.log('Found Bar: ' + !!~arr.indexOf('bar'));
```

# Trim

```
//jQuery:
$.trim('   look at me, I"m padded!   ');
```

```
//Native:
'   look at me, I"m padded!   '.trim();
```

Save my day:
*       [YOU MIGHT NOT NEED JQUERY](http://youmightnotneedjquery.com/)