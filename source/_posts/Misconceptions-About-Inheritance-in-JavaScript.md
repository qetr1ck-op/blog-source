title: Misconceptions About Inheritance in JavaScript
thumbnailImage: title.png
thumbnailImagePosition: right
date: 2016-02-14 22:54:55
tags:
    - OOP
categories:
    - Javascript
---

What’s the Difference Between Class & Prototypal Inheritance?

This can be a tricky question, and you’ll probably need to defend your answer with follow-up Q&A, so pay special attention to learning the differences, and how to apply the knowledge to write better code.

<!--more-->

<!--toc-->

# Aren’t classical and prototypal inheritance really the same thing, just a stylistic preference?

No.

Classical and prototypal inheritance are fundamentally and semantically distinct.

In class inheritance, instances inherit from a `blueprint` (the class), and create sub-class relationships. In other words, you can’t use the class like you would use an instance. You can’t invoke instance methods on a class definition itself. You must first create an instance and then invoke methods on that instance.

In prototypal inheritance, `instances inherit from other instances`. Using delegate prototypes (setting the prototype of one instance to refer to an examplar object), it’s literally Objects Linking to Other Objects, or OLOO. Using concatenative inheritance, you just copy properties from an exemplar object to a new instance.

# Aren’t classes the right way to create objects in JavaScript?

No.

There are several right ways to create objects in JavaScript. The first and most common is an object literal:

```
let mouse = {
  furColor: 'brown',
  legs: 4,
  tail: 'long, skinny',
  describe () {
    return `A mouse with ${this.furColor} fur,
      ${this.legs} legs, and a ${this.tail} tail.`;
  }
};
```

You can attach delegate prototypes with `Object.create()`:

```

let animal = {
  animalType: 'animal',
  
  describe () {
    return `An ${this.animalType}, with ${this.furColor} fur, 
      ${this.legs} legs, and a ${this.tail} tail.`;
  }
};

let mouse = Object.assign(Object.create(animal), {
  animalType: 'mouse',
  furColor: 'brown',
  legs: 4,
  tail: 'long, skinny'
});
```

Let’s break this one down a little:

* *animal* is a delegate prototype. 
* *mouse* is an instance. 
* When you try to access a property on *mouse* that isn’t there, the JavaScript runtime will look for the property on `animal` (the delegate).

I’m skipping the constructor function example because I can’t recommend them.

# Don’t you need a constructor function to specify object instantiation behavior and handle object initialization?

No.

Any function can create and return objects. When it’s not a constructor function, it’s called a *factory function*.

Factory function:

```
let animal = {
  animalType: 'animal',
 
  describe () {
    return `An ${this.animalType} with ${this.furColor} fur, 
      ${this.legs} legs, and a ${this.tail} tail.`;
  }
};
 
let mouseFactory = function mouseFactory () {
  return Object.assign(Object.create(animal), {
    animalType: 'mouse',
    furColor: 'brown',
    legs: 4,
    tail: 'long, skinny'
  });
};

let mickey = mouseFactory();
```

# Don’t you need constructor functions for privacy in JavaScript?

No.

In JavaScript, any time you export a function, that function has access to the outer function’s variables. When you use them, the JS engine creates a `closure`.

Closures are not unique to constructor functions. Any function can create a closure for data privacy:

```
let animal = {
  animalType: 'animal',
 
  describe () {
    return `An ${this.animalType} with ${this.furColor} fur, 
      ${this.legs} legs, and a ${this.tail} tail.`;
  }
};
 
let mouseFactory = function mouseFactory () {
  let secret = 'secret agent';

  return Object.assign(Object.create(animal), {
    animalType: 'mouse',
    furColor: 'brown',
    legs: 4,
    tail: 'long, skinny',
    profession () {
      return secret;
    }
  });
};
 
let james = mouseFactory();
```

# Does `new` mean that code is using classical inheritance?

No.

The `new` keyword is used to invoke a constructor. What it actually does is:
*   Create a new instance
*   Bind `this` to the new instance
*   Reference the new object’s delegate [[Prototype]] to the object referenced by the constructor function’s `prototype` property.
*   Names the object type after the constructor, which you’ll notice mostly in the debugging console. You’ll see `[Object Foo]`, for example, instead of `[Object object]`.
*   Allows `instanceof` to check whether or not an object’s prototype reference is the same object referenced by the .prototype property of the constructor.

# Is There a Big Performance Difference Between Classical and Prototypal Inheritance?

No.

Can you tell the difference between .0000000001 seconds and .000000001 seconds? Neither can I, but I sure can tell the difference between loading 10 small icons or loading one web font, instead!

# The Native APIs use Constructors. Aren’t they More Idiomatic than Factories?

Factories are extremely common in JavaScript. For instance, the most popular JavaScript library of all time, jQuery exposes a factory to users. 

What else exposes factories?

* *React* `React.createClass()` is a factory.
* *Angular* uses classes & factories, but wraps them all with a factory in the Dependency Injection container. All providers are sugar that use the `.provider()` factory. There’s even a `.factory()` provider, and even the `.service()` provider wraps normal constructors and exposes … you guessed it: A factory for DI consumers.
* *Ember* `Ember.Application.create();` is a factory that produces the app. Rather than creating constructors to call with `new`, the `.extend()` methods augment the app.
* *Node* core services like `http.createServer()` and `net.createServer()` are factory functions.
* *Express* is a factory that creates an express app.

The only object instantiation pattern more common than factories in JS is the object literal.

JavaScript built-ins started out using constructors because Brendan Eich was told to make it look like Java. JavaScript continues to use constructors for self-consistency. It would be awkward to try to change everything to factories and deprecate constructors now.

# Doesn’t the Choice Between Classical and Prototypal Inheritance Depend on the Use Case?

No.

I recommend that you follow the Gang of Four’s advice on this point:

> “Favor object composition over class inheritance.”

In Java, that was harder than class inheritance because you actually had to use classes to achieve it.

In JavaScript, we don’t have that excuse. It’s actually much easier in JavaScript to simply create the object that you need by assembling various prototypes together than it is to manage object hierarchies.

You don’t have to `extend` a `class`. JavaScript has dynamic object extension, and jQuery exposes its own prototype so you can just extend that:

```
/*
How to extend the jQuery prototype:
So difficult.
Brain hurts.
ouch.
*/

jQuery.fn.megaCalendarWidget = megaCalendarWidget;

// omg I'm so glad that's over.
```

The next time you call the jQuery factory, you’ll get an instance that can make your date inputs mega awesome.

Similarly, you can use `Object.assign()` to compose any number of objects together with last-in priority:

```
import ninja from 'ninja';
import mouse from 'mouse';

let ninjamouse = Object.assign({}, mouse, ninja);
```

No, really — any number of objects:

```
// I'm not sure Object.assign() is available (ES6)
// so this time I'll use Lodash.
var assign = require('lodash/object/assign');

var skydiving = require('skydiving');
var ninja = require('ninja');
var mouse = require('mouse');
var wingsuit = require('wingsuit');

// The amount of awesome in this next bit might be too much
// for seniors with heart conditions or young children.
var skydivingNinjaMouseWithWingsuit = assign({}, // create a new object
  skydiving, ninja, mouse, wingsuit); // copy all the awesome to it.
```

This technique is called **concatenative inheritance**, and the prototypes you inherit from are sometimes referred to as exemplar prototypes, which differ from **delegate prototypes** in that you copy from them, rather than delegate to them.

# Why Does this Matter?

Inheritance is fundamentally a code reuse mechanism: A way for different kinds of objects to share code. The way that you share code matters because if you get it wrong, it can **create a lot of problems**.

In fact, class inheritance causes many well known problems in OO design:

* Class inheritance creates parent/child object taxonomies as a side-effect.
* The tight coupling problem (class inheritance is the tightest coupling available in oo design), which leads to the next one…
* The fragile base class problem
Inflexible hierarchy problem (eventually, all evolving hierarchies are wrong for new uses)
* The duplication by necessity problem (due to inflexible hierarchies, new use cases are often shoe-horned in by duplicating, rather than adapting existing code)
* The Gorilla/banana problem (What you wanted was a banana, but what you got was a gorilla holding the banana, and the entire jungle)

The solution to all of these problems is to favor object **composition over class inheritance**.

Save my day - [Eric Elliott on Medium](https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9#.2cya8y3jf)