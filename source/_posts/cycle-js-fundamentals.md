title: сусle.js fundamentals
date: 2016-02-02 16:32:47
categories:
  - Javascript
tags:
    - Cycle.js
---

Cycle.js is a framework where your app is described as a simple function taking an event stream as input and outputting an event stream.

Cycle.js builds on RxJS and is as a reactive and functional JavaScript framework. What does that mean?
<!--more-->

<!--toc-->

# 1.The cycle.js principle: separate logic from effects

So `cycle.js` is based on `Rxjs` and virtual DOM.

Get `Rxjs` from `cdn.js`:
```
https://cdnjs.cloudflare.com/ajax/libs/rxjs/4.0.7/rx.min.js
```

Creating element when everything will mount:

```
<div id="app"><div>   
```

Now create an observable timer, which will show elapsed seconds:

```
Rx.Observable.timer(0, 1000)
    .map(i => `Second elapsed ${i}`)
    .subsribe(text => {
        document.querySelector('#app')
            .textContent = text;
    })
```

So the guide principle in `cycle.js` is separate logic from affects.

* Affect is everything what change external world aka changing the DOM.
* Logic it's just an event steam.

```
//Logic (functional), in developer hands
Rx.Observable.timer(0, 1000)
    .map(i => `Second elapsed ${i}`)

//Effects (imperative), in framework
    .subsribe(text => {
        document.querySelector('#app')
            .textContent = text;
    })
```

