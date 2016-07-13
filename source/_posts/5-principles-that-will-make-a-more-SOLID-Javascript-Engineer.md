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

Meaning is simple, if someone wants to extend your module behaviour, they won't need to modify existing code if they 
don't want to.

There is a easy rule to follow here: 

> If you have to open a JS file and need to make a modification there, in order to extend it - you've failed 
**OCP**

# 