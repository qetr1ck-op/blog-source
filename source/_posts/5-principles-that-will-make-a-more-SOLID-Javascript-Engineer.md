title: 5 principles that will make a more SOLID Javascript Engineer
date: 2016-07-11 23:13:43
categories:
    - Javascript
    - OOP
---

Being a SOLID developer in JS isn't so as straight forward as in other languages. Some developers consider functional approach. Others chose OOP style. Some stand in both line. And other think that having class is wrong and redundant and prefer factories. But still, SOLID principles are the basic pillars of object oriented programming.

But what are they?

<!--more-->
<!--toc-->

# The SOLID principles are:

*   **S** - Single responsibility principle
*   **O** - Open-Close principle
*   **L** - Liskov Substitution principle
*   **I** - Interface segregation principle
*   **D** - Dependency Inversion principle

# Single responsibility principle

Very similar to Unix slogan: 
> "Do one thing and do it well"

This one is easy to comprehend but harder to implement. Every function should do exactly one thing. It should have 
one clearly defined goal.

So were should we draw a line to decouple on big peace of code. I have 2 basic strategies for dealing with complexity:

* If you find yourself writing/calling function `loginUserAndSaveToken()` you're probably breaking the **SRP**. Break 
this function into two separate ones.
* For every function imagine if there are possibility to extract reusable part to not repeat your self.

But there is a tricky moment.

Using this logic, `runFacebook()` is indeed a single responsible function. But this only applies as long as the body 
of function `runFacebook()` is implemented correctly in small divided functions. 

# Open-Close principle

It means that our module should be open to extension, but closed to modification.

Meaning is simple, if someone wants to extend your module behavior, they won't need to modify existing code if they 
don't want to.

There is a easy rule to follow here: 

> If you have to open a JS file and need to make a modification there, in order to extend it - you've failed 
**OCP**


```
class IceCreamMachine {
    constructor() {
        this.flavors = ['chocolate', 'vanilla'];
    }
    create() {
        if (this.flavors.includes(flavor)) { // warning, ES7 Array.prototype.includes
            console.log('Great success. You now can eat your ice cream');
        } else {
            console.log('A bad choice, not ice cream today');
        }
    }
}

export default IceCreamMachine
```

As far as you can see there's no way to add new ice cream flavor without literally open the module and edit 
`IceCreamMachine.flavors` array.

To follow **OCP** we can easily change that:

```
class IceCreamMachine {
    constructor() {
        this.flavors = ['chocolate', 'vanilla'];
    }
    create() {
        if (this.flavors.includes(flavor)) { // warning, ES7 Array.prototype.includes
            console.log('Great success. You now can eat your ice cream');
        } else {
            console.log('A bad choice, not ice cream today');
        }
    }
    flavorAdd(flavor) {
        this.flavors = [...this.flavors, flavor];
    }
}
```

# Liskov Substitution Principle

This is one of the most obscure name I've ever seen in programming world. 

And even more the classical description is: 

> Child classes should never break the parent class type definition.

What a tough explanation. I'll make it more simple:

> It means that we must make sure that new derived classes are extending the base class without changing their behavior.

To illustrate we will go with classical example with:

```
class Rectangle {
    constructor() {
        // init procedure
    }
    setWidth(width) {
        this.width = width;
    }
    setHeigth(height) {
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
}
```

We start with basic geometry abstraction `Rectangle`. Imagine that is a working and already is deployed to several clients.

Now we need a new feature. A possibility to manipulate `Square`'s.

In real life, in geometry, a square is a form of rectangle. So we could try to implement `Square` class that extends `Rectangle`.

![](https://cdn.tutsplus.com/net/uploads/2014/01/SquareRect.png)

But is a `Square` really a `Rectangle` in programming?..

```
class Square extends Rectangle {
    constructor() {
        super();
        // init procedure
    }
    setWidth(width) {
        this.width = width;
        this.height = width;
    }
    setHeigth(height) {
        this.height = height;
        this.width = height;
    }
}
```

A square is a rectangle with equal width and height, and we do a strange implementation like in example above. 
We overwrite both setters.

So, our `Square` class isn't a `Rectangle` after all. 

It breaks the law of geometry. It fails the `LSP` principle.

# Interface Segregation principle

The `SRP` is about actors and high lever architecture. 
The `OCP` is about design and feature extension.
The `LSP` is about sub-typing and inheritance.
And the `ISP` is about business logic to client communication.

> Interface Segregation actually means you shouldn't create bloated interfaces

Since JS doesn't have an interfaces, I'm going to use more abstractive description.

So how should we define our interfaces? We could thing about our model and expose all functionality we want it to offer:

Let's say your friend created a brand new HTML5 route library. He convinced you to implement it in your project.

You start to play around and register the first route via `registerRouter(routeName)`. And you thing all are set up.

But your friend lied.

He forgot to mention that you also need to implement `onErrorHandler()` and `handleIE8()` for every your registered route.

> The lesson is whenever you expose a module, make sure only essential are required, everything else is optional. Otherwise your friends will hate you.

# Dependency Inversion Principle

You've might heard about dependency inversion as a standalone term. `Dependency Injection` and `Inversion of Control` also mean the same.

> A. High-level modules shouldn't depend on low-level modules. Both should depend on abstraction.
> B. Abstraction shouldn't depend upon details. Details should depend on details.

`DI` is all about handling over control from the function itself to the caller function. In our case it means defining who controls the type of parameters the function receives. Let's use an example.

We've started to use an event emitter implementation. Your old functionality looks like this:

```
function awesomeFoo(dispatcher) {
    dispatcher.trigger('awesome/foo');
}

function awesomeFooListener(dispatcher) {
    dispatcher.on('awesome/foo', event => {
        console.log(event)
    };    
}
```

There is one problem. New dispatcher methods are called with `emit()` and `listen()`.

You could refactor your code. But what if implementation isn't all that great.

> You'd like to be able easily switch between implementations

You realize that you don't need the whole dispatcher object in every function. You change your code to receive only the relevant methods for every function:

```
function awesomeFoo(dispatcher) {
    dispatch('awesome/foo');
}

function awesomeFooListener(dispatcher) {
    listen('awesome/foo', event => {
        console.log(event)
    };    
}
```

Your code now doesn't depend on any concrete implementation of event emitter object.

> It does depend on abstraction. You can now freely switch between new/old implementation or even use a mock implementation for testing.

Save my day:

* [The Full Stack](http://thefullstack.xyz/solid-javascript/)
* [Aspiring Craftsman](http://aspiringcraftsman.com/2011/12/08/solid-javascript-single-responsibility-principle/)
* [code.tutsplus](http://code.tutsplus.com/series/the-solid-principles--cms-634)