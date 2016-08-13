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
    ( () => this.x ).bind({ x: 'inner' }),
    ( () => this.x )()
  ];
})().call({ x: 'outer' });
```

* ['inner', 'outer']
* **['outer', 'outer']**
* [undefined, undefined]
* Error

Arrow function have `lexical this` value. This means that, it inherits `this` value from the context they are defined.
And later it stays unchangeable, even if explicitly bound or called with different context.

In this case both arrow function are created within the context of `{x: 'outer'}`, and `bind({x: 'inner'})` applied on the first arrow function doesn't make a difference.

# Question 3

``` javascript
let x, { x: y = 1} = { x }; y;
```

* undefined
* **1**
* { x: 1}
* Error

1. `let x` defines `x`  with value `undefined`
2. Destructive assignment `{ x: y = 1} = { x }`, on the right side has a short notation for an object literal - `{ x }` which is equalent to `{ x: x }`, that is in our case an object `{ x: undefined }`
3. Once it destucted the pattern`{ x: y = 1}`, we extract variable `y`, which correspond to the propery `x`. Since propery `x` is `undefined`, the default value `1` is assigned to it.


# Question 4

```
(function() {
  let f = this ? class g {} : class h {};
  return [
    typeof f,
    typeof h
  ] 
})()
```

* **['function', undefined]**
* ['function', 'function']
* ['function', 'function']
* ['undefined', 'undefined']
* Error

1. The IIFE is executed with no explicit `this` value. In ES6 or with `use strict` directive it means it will be `undefined`;
2. So variable `f` is a reference to `class h {}`. It's type is a `function` because essentially classes in ES6 are syntactic sugar on top of `contructor function`.
3. However, the `class h {}` is created in expression position, that means `h` isn't added to to the environment, and return `undefined`.

# Question 5

```
(typeof (new (class { class () {} })))
```

* 'function'
* **'object'**
* 'undefined'
* Error

This is an obfuscated syntax playing, let's try to figure it out!

1. The ES6 allow concise method definition, that allows dropping the `: function` part. So `class () {}` is a method inside in [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class#Examples](anonymous class expression).
2. Now instead of assigning it to variable, we can instantiate it directly: `new class { class() { } }`
3. The result of default class is always an object. So `typeof` should return `object`.

# Question 6

```
typeof (new (class F extends (String, Array) { })).substring
```

* 'function'
* 'object'
* **'undefined'**
* Error

Again an obfuscated syntax.

1. The grouping operator always return the last argument, so the result of `(String, Array)` is actually just `Array`
2. So we get `class F extends Array {}`
3. We can image as it's assigning operation `let f = new F`
4. Obviously that `typeof f.substring` is `undefined`

# Question 7

```
[...[...'...']].length
```

* 1
* **3**
* 6
* Error

The `spread` operator allows to spread all the elements to the array. It works with any `iterable` object.

1. String are iterable, meaning that we can iterate char by char. So inner `[...'...']` results to an array `['.', '.', '.']`
2. Array is iterable as well, so outer array spreads into new array.
3. Result of `['.', '.', '.'].length` is `3`

# Question 8

```
typeof (function* f() { yield f })().next().next()
```

1. Generator object has `next` method, that returns the next value at the `yield` position. The returned value has signature: `{ value: <returned value>, done: boolean}`
2. First `g.next()` has result `{value: function f, done: false}`
3. The returned value value itself doesn't have `next()` method, so trying to chain methods is an error.

# Question 9

```
typeof (new class f() { [f]() { }, f: { } })[`${f}`]
```

* 'function'
* 'undefined'
* 'object'
* **Error**

Since the syntax of class isn't correct `class f()`, the result is an error.

# Question 10

```
typeof `${{Object}}`.prototype
```

* "function"
* "undefined"
* "object"
* **Error**

That one is very tricky!

We have something that looks a bit strange: it isn't `${Object}` how it "should be", but the `${{Object}}`. It isn't a special syntax it is still a value `{Object}` in template string `${}`.

1. What is `${Object}`? ES6 has short notation for object literal, so in fact it's just: `{Object: Object}`, a simple object with the property named `'Object'`, and the value `Object` (the built in constructor).
2. So `${ {Object: Object} }`, become `'[object Object]'`. Because the `${x}` is roughly equivalent to the `x + ''` or `x.toString()`
3. Now the `'[object Object]'.prototype` is `undefined`

Save my day:
* [DmitrySoshnikov](https://gist.github.com/DmitrySoshnikov/3928607cb8fdba42e712)

