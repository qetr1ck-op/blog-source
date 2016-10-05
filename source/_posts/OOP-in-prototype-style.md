title: 'OOP in prototype style'
thumbnailImage: title.png
thumbnailImagePosition: right
tags:
  - OOP
categories:
  - Javascript
  - OOP
date: 2014-09-15 22:40:38
---

The main point is that one object can be `prototype` of another object. That means if property isn't found in the object - than it takes from `prototype` object. In JavaScript this implementation is at the language level.

<!--more-->

<!--toc-->

#    Inheritance through link `__proto__`

Inheritance in JavaScript is realized via special property `__proto__` (In specs EcmaScript the name is `[[Prototype]]`). In ES5 the property was available in Chrome / Firefox and Safari, but in other browser was hidden. ES6 includes `__proto__` property as standard. In this article, for more efficient way I'll use `__proto__` property, but for legacy you should use `Object.getPrototypeOf()`

If the object, for instance `rabbit`, has a special link `__proto__` to another object `animal`, that mean, that all property which are searched in the `rabbit`, will be also searched in the `animal` object.

<script src="https://gist.github.com/qetr1ck-op/acf247f35d67290c8fbe.js"></script>

We can write any object in `prototype` object:

<script src="https://gist.github.com/qetr1ck-op/446b83701477ad23da58.js"></script>

So, object pointed by `__proto__` it is his `prototype`. In another words `prototype` it's "Backup Storage of Properties and Methods", which automatically used in the search.

![](/img1.png)

#    Method `hasOwnProperty`

Simple loop `for...in` or loop through iterable objects (Array, Mas, Set, arguments object) can't distinguish between the own properties and properties of his `prototype`

<script src="https://gist.github.com/qetr1ck-op/bb4165bd8e74e36f3570.js"></script>

For iterate only through own properties with `obj.hasOwnProperty(prop)`:

<script src="https://gist.github.com/qetr1ck-op/f69804da0f8a16a29f79.js"></script>

#    Prototype Chain

In object `__proto__` can be another `__proto__` object and so on. For example, the inheritance chain of three object donkey -> winnie -> owl:

<script src="https://gist.github.com/qetr1ck-op/d57b779a057e164bf1d2.js"></script>

![](/img2.png)

#    Methods to work with `__proto__`

By historical reason we have methods to get/set `__proto__` property:

<script src="https://gist.github.com/qetr1ck-op/54c9dbea765318e4a2c2.js"></script>

`Object.create(proto, descriptors)` creates new empty object with `__proto__` object:

<script src="https://gist.github.com/qetr1ck-op/970d7c61bf7452fd8b5e.js"></script>

This method only allows create new empty object. He can't change `prototype` of an existing object.

Create an empty collection, without prototype chain with `Object.create(null)`:

<script src="https://gist.github.com/qetr1ck-op/99be3a7345429941c2eb.js"></script>

#    Exercise with `__proto__`

1.1
<script src="https://gist.github.com/qetr1ck-op/d20e3a520e4dc06a5f63.js"></script>

1.2
<script src="https://gist.github.com/qetr1ck-op/32ce09bfa0ca65d5346d.js"></script>

![](/img3.png)

#    F.prototype

Property `prototype` can point on any object but it has sense, when it's assigned to function-constructor.

When project is creating via `new`, in his `__proto__` object writes link from `prototype` of function-constructor.

<script src="https://gist.github.com/qetr1ck-op/c4ac921c558015b4a481.js"></script>

#    Exercises with prototype and new

1.1

<script src="https://gist.github.com/qetr1ck-op/079e4c21baa262ca5f44.js"></script>

1.2

<script src="https://gist.github.com/qetr1ck-op/340acc108182399dbd38.js"></script>

1.3

<script src="https://gist.github.com/qetr1ck-op/275f8d2485c73f3a365a.js"></script>

1.4

<script src="https://gist.github.com/qetr1ck-op/9b042fd1294bb8529477.js"></script>

1.5

<script src="https://gist.github.com/qetr1ck-op/36a799bfd94038ea3a88.js"></script>

2.1

<script src="https://gist.github.com/qetr1ck-op/aadce099bb5b8ddf7a02.js"></script>

<!--  -->

#    "Classes". Where methods come from empty {}

Lets begin with creating empty object end call method `toString`:

<script src="https://gist.github.com/qetr1ck-op/d0902bca8a134b7c101f.js"></script>

It's obviously, that `{ }` is empty. But then who generates method `toString()`? Off-course this makes method `toString()` which is built-in `Object.prototype`.

In details it works like this:

1.  Creating object literal `obj = { }` means shorthand form for `obj = new Object()`, were `Object` is built-in function-constructor for objects
2.  While `new Object` invokes, new object has receives `obj.__proto__ = Object.prototype`.
3.  `obj.toString === Object.prototype.toString` method will be taken from prototype object.

![](/img4.png)

#    Build-in "Classes"

The same methods use in arrays `Array`, functions `Function` and other objects. Build-in methods are in `Array.prototype`, `Function.prototype`, etc.

![](/img5.png)

Thats why everywhere JS developers like to say that "All objects inherit from `Object`". But it's a quite incorrect. All objects inherit from `Object.prototype` via `__proto__` link.

In some cases, method can overrides. For example, "class" `Array` has it's own `toString`, which is in `Array.prototype.toString`:

<script src="https://gist.github.com/qetr1ck-op/823a2dfdf760938c91fd.js"></script>

#    Exercises with overriding prototype

1.1

<script src="https://gist.github.com/qetr1ck-op/df77c34e3efec24039e6.js"></script>

1.2

<script src="https://gist.github.com/qetr1ck-op/188c0afa47da9b036b73.js"></script>

1.3

<script src="https://gist.github.com/qetr1ck-op/e733ebd38e35616ed565.js"></script>

1.4

<script src="https://gist.github.com/qetr1ck-op/a292315fd0ddd6477827.js"></script>

#    Declares own "Classes"

For create "Class" you need:

1.  Declare function-constructor
2.  Write all required methods and properties in `prototype`

<script src="https://gist.github.com/qetr1ck-op/fde34608e4532f82d166.js"></script>

#    Property `constructor`

Property `constructor` is in every function, even if it isn't declare. So concept is next, the property `constructor` should have link to function, which creates the object:

<script src="https://gist.github.com/qetr1ck-op/02ee2ee811e78b50274c.js"></script>

But when you overriding the `prototype`, property `constructor` disappears:

<script src="https://gist.github.com/qetr1ck-op/c43b5a7d1ec3afd701af.js"></script>

So how it works: animal -> Animal.prototype (new Object) -> Object.prototype

#    Prototype OOP

Classes it isn't only function-constructor with `prototype`, it's also additional opportunities for OOP development.

For example two "Classes" and realization of "Class inheritance":

<script src="https://gist.github.com/qetr1ck-op/4aed9017910b8e0d2c39.js"></script>

SaveMyDay:

*   on <a href="https://learn.javascript.ru/prototypes"</a> learn.javascript.ru