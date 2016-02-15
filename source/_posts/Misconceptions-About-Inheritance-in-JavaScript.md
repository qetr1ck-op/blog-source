title: Misconceptions About Inheritance in JavaScript
date: 2016-02-14 22:54:55
tags:
    - OOP
categories:
    - Javascript
---

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
