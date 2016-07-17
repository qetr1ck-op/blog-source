title: 5 principles that will make a more SOLID Javascript Engineer
date: 2016-07-11 23:13:43
categories:
    - Javascript
    - OOP
thumbnailImage: http://phpsrbija.rs/wp-content/uploads/2015/04/solid-principles-e1428402535364.png
---

Being a SOLID developer in JS isn't so as straight forward as in other languages.

Some developers consider functional approach. Others chose OOP style.

Some stand in both line. And other think that having class is wrong and redundant and prefer factories.

But still, SOLID principles are the basic pillars of object oriented programming.

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

![](https://cdn.tutsplus.com/net/uploads/2014/01/hugeInterface.png)

This looks as a good starting point to define what we want to implement in our class. Or is it?

A start like this will lead as to one of the two possible implementation:

* A huge `Car` or `Bus` or `Van` class implementation with all methods on Vehicle interface. And not only `SRP` should tell us to avoid such classes.
* Or, many small classes like `LightControl`, `AudioCountrol` or `SpeedControl` which are implemented the whole interface but actually provide only the parts they implementing.

It's obvious that neither solution is acceptable to implement the business logic.


