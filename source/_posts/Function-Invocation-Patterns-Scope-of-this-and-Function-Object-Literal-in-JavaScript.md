title: 'Function Invocation Patterns in JavaScript'
thumbnailImage: title.png
thumbnailImagePosition: bottom
categories:
  - Javascript
  - Pattern
date: 2014-05-29 05:47:57
tags:
---

Describe different approaches to define and call functions

<!--more-->

<!--toc-->

Function object are created with function literals:

```
// Create function declaration
// in it that adds two numbers

function add(a, b) {
    return a + b;
};
```

Function literal has four parts.

*   The first part is the `reserved word function`.
*   The optional second part is the `function’s name`. The function can use its name to call itself recursively. The name can also be used by debuggers and development tools to identify the function. If a function is not given a name it is said to be anonymous.
*   The third part is the set of `parameters` of the function, wrapped in parentheses. Within the parentheses is a set of zero or more parameter names, separated by commas. These names will be defined as variables in the function. Unlike ordinary variables, instead of being initialized to undefined, they will be initialized to the arguments supplied when the function is invoked.
*   The fourth part is a set of `statements` wrapped in curly braces. These statements are the body of the function. They are executed when the function is invoked.

In addition to the declared parameters, every
function receives two additional parameters: `this` and `arguments`. The this parameter is very important in object oriented programming, and its value is determined by
the invocation pattern.

#   There are four patterns of invocation in JavaScript:

*   method invocation pattern
*   function invocation pattern
*   constructor invocation pattern
*   apply, binding invocation pattern

The patterns differ how `this` will initialize.

# Method invocation pattern

When a function is stored as a property of an object, we call it a `method`. When a method is invoked, `this` is bound to that object. If an invocation expression contains a refinement (that is, a . dot expression or[subscript] expression), it is
invoked as a method:

```
var myObject = {
    value: 0,
    increment: function (inc) {
        this.value += typeof inc === 'number' ? inc : 1;
    }
};
myObject.increment( );
console.log(myObject.value); // 1
myObject.increment(2);
console.log(myObject.value); // 3
```

The binding of this to the object happens at invocation
time. This very late binding makes functions that use this highly reusable. Methods
that get their object context from this are called `public methods`.

# Function invocation pattern

When a function is invoked with this pattern, `this is bound to the global object or `undefined`.
This was a mistake in the design of the language. Had the language been designed correctly, when the inner function is invoked, this would still be bound to the this variable of the outer function. 

```
function outer() {
    console.log('outer context ' + this);
    function inner() {
        console.log('inner context ' + this);
    }
    inner();
}

outer();
//outer context[object Window]
//inner context[object Window]
[/javascript]

[javascript]
function func() { 
  "use strict";
  console.log(this); 
}

func();// undefined (expect IE<10)
```

A consequence of this error is that a method cannot use an inner function to help it do its work because the inner function does not share the method access to the object as its this is bound to the wrong value. Fortunately, there is an easy workaround. If the method defines a variable and assigns it the value of this, the inner function will have access to this through that variable. By convention, the name of that variable is `that`

# Constructor invocation pattern

JavaScript is a prototype inheritance language. That means that objects can inherit properties directly from other objects.

Constructor can be any function, which is called with directive `new`

```
function Animal(name) {
  this.name = name;
  this.canWalk = true;
  //public method
  this.sayHi = function() {
    console.log(this.name + ', says Hi!');
  }
}

var animal = new Animal('bamby');
```

How it works:

1.  Automatically is creating new, empty object
2.  Special keyword `this` gets a reference to ^- object
3.  Function is invoking. Usually, it modifies this, adds methods and properties
4.  Return this, if return object, than will be return object rather than this

# The Apply/Call Invocation Pattern

The apply method lets us choose the value of `this`. The apply method takes two parameters. The first is the value that should be bound to this. The second is an array of
parameters.

Call `func.apply(context, [a, b ...])` or `func.call(context, (a, b ...))` - the same as a normal call `func(a, b ...)`, but with an another `context`.

```
var user = { 
  firstName: "Bobby",
  surname: "Singler"
};

function getName(a, b) { 
  console.log( this[a] + ' ' + this[b] );
}

getName.apply(user, ['firstName', 'surname'])  // "Bobby Singler", this - our context

getName('firstName', 'surname')  // undefined undefined, this, will be window
```

Invoke apply/call with `null` or `undefined`:

```
function f() {
  console.log(this);
}

//if call with null or undefined, this = window 
f.call(null); // window

function f() {
  "use strict"
  console.log(this);
}

//in strict mode, this = null 
f.call(null); // null
```

Save My Day:
[learn.javascript.ru](http://learn.javascript.ru/this "learn.javascript.ru")
[Crockfords JavaScript: The Good Parts](http://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742)