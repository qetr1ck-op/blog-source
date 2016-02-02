title: 'Operator typeof, [[Class]], instanceof,  Duck Typing and Polymorphism'
tags:
  - OOP
id: 572
categories:
  - Javascript
date: 2014-07-29 22:01:59
---

How to properly get instance of object.

<!--more -->

<!--toc-->
#    Operator typeof

Operator typeof return type of argument. He has two syntax: `typeof x` and `typeof(x)`.

```
typeof undefined // "undefined" 

typeof 0    // "number" 

typeof true // "boolean" 

typeof "foo" // "string" 

typeof {} // "object" 
typeof [] // "object" 
typeof new Date // "object" 

typeof null  // "object" 
typeof function(){} // "function" 
```

`typeof` operator works great with primitive types, except null, as well as functions. But ordinary objects, arrays, and date for `typeof` all look the same, they are of type 'object'.

That's why we can't distinguish them using `typeof`.

#    [[Class]] for objects

```
var date = new Date,
    arr = [1,2];

console.log({}.toString.call(date)); //[object Object]
console.log({}.toString.call(arr)); //[object Array]

console.log(({}.toString.call(date)).slice(8,-1)); //Object
console.log(({}.toString.call(arr)).slice(8,-1)); //Array
```

We use this method because the internal implementation of the Object `toString` returns the standard `[[Class]]`. Other objects (Date, Array, etc.) `toString` her and for this purpose will not work.

This method can give the type only for embedded objects. For user constructors always `[[Class]] = "Object"`:

```
function Animal(name) { 
  this.name = name;
}
var animal = new Animal("Винни-пух");

var type = {}.toString.call( animal );

console.log(type); //[object Object]
```

#    Duck Typing

«If it looks like a duck, swims like a duck and quacks like a duck, then it probably is a duck (who cares what it really is)»

Meaning duck typing - to verify the `methods` and `properties`, regardless of the type of object.

```
//check if array has method split
var x = [1,2,3];

if (x.splice) {
  alert('Array');
}

//check if date has method getTime
var z = new Date();

if (z.getTime) {
  alert('Date!');
}
```

To check who created the object or his prototype, is the operator:

```
//check custom objects
function Animal(name) { 
  this.name = name;
}
var animal = new Animal("Bee");

console.log( animal instanceof Animal ); // true
console.log( Object.getPrototypeOf(animal) == Animal.prorotype ); // true
console.log( animal.contstructor.prototype == Animal.prorotype ); // true

//also works for inner objects
var d = new Date(); 
console.log( d instanceof Date ); // true
console.log( Object.getPrototypeOf(d) == Date.prorotype ); // true
console.log( d.contstructor.prototype == Date.prorotype ); // true

function f() { }
console.log( f instanceof Function ); // true
console.log( Object.getPrototypeOf(f) == Function.prorotype ); // true
console.log( f.contstructor.prototype == Function.prorotype ); // true
```

#    Polymophism

`Polymorphic` functions, ie, those which are differently treated arguments, depending on their type. For example, the output may have a different format numbers and dates.

In example we use type checking to create a `polymorphic` function `sayHi`. It will work in three modes:

1.  No arguments: outputs `"Hello"`.
2.  With an argument, which is not an array: displays `"Hello" + string argument`
3.  With an argument, which is an array - `"Hello" + arr[i]`

```
function sayHi(who) {
  if (!arguments.length) {
    console.log('Hello');
    return;
  }

  if ( {}.toString.call(who) == '[object Array]' ) {
    for(var i=0; i<who.length; i++) sayHi(who[i]);
    return;
  }

  console.log('Hello, ' + who);
}

sayHi(); // Hello
sayHi("Bob"); // Hello, Bob

sayHi( ["Bob", ["Sam", "Din"] ] ); // Hello Bob..Sam..Din
```

SaveMyDay:

*   on [learn.javascript.ru](http://learn.javascript.ru/type-detection)