title: 'Kangax ES2015 quiz, expained'
date: 2016-07-26 23:01:02
thumbnailImage:
categories:
  - Javascipt
  - ES2015
tags:
  - ES2015
---

[@kangax](https://twitter.com/kangax)'ve created a [quiz](http://perfectionkills.com/javascript-quiz-es6/), it's very interesting, the solution explains a tricky moment of spec.

<!--more-->
<!--toc-->

# Question 1

``` javascript
(function(x, f = () => x) {
  var x;
  var y = x;
  x = 2;
  return [x, y, f()];
})(1);
```

* **[2, 1, 1]**
* [2, undefined, 1]
* [2, 1, 2]
* [2, undefined, 2]

[As we know](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters/#conditional-intermediate-scope-for-parameters), parameters create extra scope in case of using `default values`.

1. Local variable `x` shadows the parameter with the same name, `var x`
2. It's hoisted and assigned to default value, to `undefined`?
3. Usually yes, but not in this case.
4. If there is a parameter with the same name, then the local binding is initialize not to `undefined` but with value of that parameter, that is `1`
5. The variable `y` gets the the value `1` as well, because `var y = x;`
6. `x` is assigned to `2`, `x = 2;`
7. Now it's tricky `f()`. It is created in the `scope of parameters`, so `x` refers to the parameter `x`, which is `1`.
8. Final values are `[2, 1, 1]`

# Question 2

``` javascript
(function() {
  return [
    (() => this.x).bind({x: 'inner'}),
    (() => this.x)()
  ];
})().call({x: 'outer'});
```

* ['inner', 'outer']
* **['outer', 'outer']**
* [undefined, undefined]
* Error

Arrow function have `lexical`



















Save my day:
* [DmitrySoshnikov](https://gist.github.com/DmitrySoshnikov/3928607cb8fdba42e712)
