title: TOP 10 mistakes when you develop on AngularJS
thumbnailImage: http://savemyday.in/source/images/TOP 10 mistakes when you develop on AngularJS/img.jpg
coverSize: partial
metaAlignment: center
coverMeta: out
comments: true
categories:
  - Angular
  - Javascript
  - Web
date: 2015-09-23 18:40:03
tags:
---

<!-- toc -->

*   [link](#1. MVC directory structure)1. MVC directory structure
*   [](#2\. Modules or lack of them)2. Modules (or lack of them)
*   [](#3\. Dependency Injection)3\. Dependency Injection
*   [](#3.1\. Global Dependencies)3.1\. Global Dependencies
*   [](#4\. Fat controllers)4\. Fat controllers
*   [](#5\. Service vs Factory vs Provider)5\. Service vs Factory vs Provider
*   [](#6\. Always dot in VM $scope)6\. Always dot in VM $scope's
*   [](#7\. Unit testing AngularJS apps)7\. Unit testing AngularJS apps
*   [](#8\. Not to do an end-to-end testing with Protractor)8\. Not to do an end-to-end testing with Protractor
*   [](#9\. Full-Spectrum Testing with Karma)9\. Full-Spectrum Testing with Karma
*   [](#10\. Using jQuery)10\. Using jQuery

<!--more-->

[ff](#1. MVC directory structure)
<!-- <a href="" name="1. MVC directory structure">aa</a> -->
<div class="title-block">1. MVC directory structure</div>

When you work with MVC / MVW frameworks it's convenience to structure code by `MVC components` using the following template:

<script src="https://gist.github.com/qetr1ck-op/24404d318344f4b77595.js"></script>

But when project will rise it's hard to use such structure of folders. You always need to open a few folder at the same time. It isn't depend what IDE or tool you use (Sublime, VS, Vim with NerdTree) - it's uncomfortable.

To avoid this this developers often use grouping by `functionality type`:

<script src="https://gist.github.com/qetr1ck-op/9a0e5e9af7eed2f6aef3.js"></script>

The structure allows more faster search for files which are related to the same feature. It may puzzled at the beginning to share js with html or even with test files. But it saves a lot of time, because it's more natural.

[](#2\. Modules (or lack of them))
<div class="title-block">
     2\. Modules (or lack of them)
</div>

At the beginning of development all functionalities include in a single module. But manage a such type of code is inconvenient:

<script src="https://gist.github.com/qetr1ck-op/f91462f76a1ca37f3232.js"></script>

The next most common approach is grouping objects by type:

<script src="https://gist.github.com/qetr1ck-op/3912656b35c16c50bce3.js"></script>

For better scalability and future re-usability - split code by feature:

<script src="https://gist.github.com/qetr1ck-op/2b390ced242af620f214.js"></script>

[](#3\. Dependency Injection)
<div class="title-block">
    3\. Dependency Injection
</div>

Pattern DI in AngularJS uses out of box. DI helps to keep code clean and helps with testing process.

<script src="https://gist.github.com/qetr1ck-op/58281552fe5475f79dda.js"></script>

Now AngularJS can't resolve minificated variables. Easiest solution is:

<script src="https://gist.github.com/qetr1ck-op/01721016841fc0760acd.js"></script>

Another way to handle DI with minification is [ng-annotate](https://github.com/olov/ng-annotate) module. More information on official [AngularJS docs](https://docs.angularjs.org/tutorial/step_05#a-note-on-minification)

<a href name="3.1\. Global Dependencies"></a>
<div class="title-block">
    3.1\. Global Dependencies
</div>

Often when writing AngularJS apps there will be a dependency on an object that binds itself to the global scope. This means it's available in any AngularJS code, but this breaks the dependency injection model.

AngularJS makes it simple to encapsulate these globals into modules so they can be injected like standard AngularJS modules.

<script src="https://gist.github.com/qetr1ck-op/641f588b6820a1f3de81.js"></script>

[](#4\. Fat controllers)
<div class="title-block">
    4\. Fat controllers
</div>

It's easy, especially when starting out, to put to much logic in the controller. Controller should **never** do DOM manipulation. That's work for directives! Likewise business logic should live in services.

App data should be also stored and fetched in services, except when we need bound to the `$scope`. Services are singletons that persist throughout the lifetime of the application, while controllers are transient between application states. If data is stored in the controller then it will need to be fetched from somewhere when it is instantiate.

AngularJS works best when following the Single Responsibility Principle (SRP). If the controller is a coordinator between the view and the model, then the amount of logic it has should be minimal. This will also make testing much simpler.

[](#5\. Service vs Factory vs Provider)
<div class="title-block">
    5\. Service vs Factory vs Provider
</div>

What is service:

1.  It provides methods to keep, share and organize data across the lifetime of the Angular app
2.  Lazy loads, Angular only creates instance of a service when an application component depends on it
3.  Singleton object, application component dependent on the service work with the single instance

An Angular service can be created in five different ways:

1.  service
2.  factory
3.  provider
4.  value
5.  constant

The most verbose, but also the most comprehensive one is a `Provider` recipe. The remaining four recipe types — Value, Factory, Service and Constant — are just syntactic sugar on top of a provider recipe.

Here is a great examples by Misko:

<script src="https://gist.github.com/qetr1ck-op/dc7fb71d2d3f61b4de76.js"></script>

In this case the injectors simply return the value. But what if you want to compute the value?

<script src="https://gist.github.com/qetr1ck-op/1a02d77c585f4ed31397.js"></script>

So `factory` is a function which responsible to creating or/and modifying the value. Notice that the the factory function can ask for other `dependencies`

If you want to be more OO and have a class?

<script src="https://gist.github.com/qetr1ck-op/8ef78320b0af84631e00.js"></script>

But if we want to configure function `before injection`?

<script src="https://gist.github.com/qetr1ck-op/e98dbc733fb7be97877b.js"></script>

As a side `note`, `service`, `factory`, and value are all derived from provider:

<script src="https://gist.github.com/qetr1ck-op/586b2f682b2aed2039e9.js"></script>

[](6\. Always dot in VM $scope)
<div class="title-block">
    6\. Always dot in VM $scope's
</div>

In AngularJS every `$scope` prototypical inherits from its parent `$scope` till the highest level `$rootScope`.

<script src="https://gist.github.com/qetr1ck-op/35a0dd1b8e16ff0bec4b.js"></script>

When looking up `primitive`, the prototype chain is not consulted. If `navCtrl` is to be updated simultaneously then a prototype chain lookup is required; this will happen when the value is an `object`:

<script src="https://gist.github.com/qetr1ck-op/763543e38942e2e38c1b.js"></script>

[](#7\. Unit testing AngularJS apps)
<div class="title-block">
    7\. Unit testing AngularJS apps
</div>

JavaScript is a dynamically typed language which comes with great power of expression, but it also comes with almost no help from the compiler.
For this reason we feel very strongly that any code written in JavaScript needs to come with a strong [set of tests](https://docs.angularjs.org/guide/unit-testing).

<a href name="8\. Not to do an end-to-end testing with Protractor"></a>
<div class="title-block">
    8\. Not to do an end-to-end testing with Protractor
</div>

[Protractor](https://github.com/angular/protractor) uses the [Jasmine](http://jasmine.github.io/1.3/introduction.html) test framework for defining tests. Protractor has a very robust API for different page interactions.
There are other end to end test tools, but Protractor has the advantage of understanding how to work with AngularJS code, especially when it comes to `$digest` cycles and more.

[](#9\. Full-Spectrum Testing with Karma)
<div class="title-block">
    9\. Full-Spectrum Testing with Karma
</div>

[Awesome post](http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html) about testing AngularJS with `Karma`, passage form the post:

Karma is an amazing testing tool which is designed to take all the frustration out of setting up a working test runner when testing JavaScript code.
Karma works by spawning up each browser that is specified within its configuration file and then running JavaScript code against those browsers to see if they pass certain tests.
Communication between Karma and each of the browsers is handled with the karma service running in the terminal using socket.io.
Each time a test is run, Karma records its status and then tallies up which browsers have failed for each test and which ones passed and timed out.
This makes each test work 100% natively in each browser without the need to test individually.
Also, since the Karma service runs on a port and keeps track of browsers by itself, you can easily hook up other browsers and devices to it just by visiting its broadcasting port.
Oh and did I mention that Karma is fast? Yeah it's really fast...

[](#10\. Using jQuery)
<div class="title-block">
    10\. Using jQuery
</div>

AngularJS is a framework for building scalable apps. jQuery is a famous library for simplifying DOM manipulation, event handling, AJAX operation.

AngularJS is about architecture of app, not augmenting HTML pages.

Try to stop using jQuery and imperative paradigm, just let your code to extend HTML syntax in declarative style.

DOM manipulation should only be done in directives, but this doesn't mean they have to be jQuery wrappers. Always consider what features AngularJS already provides before reaching for jQuery.

Article which saves my day:

*   on [Original post](https://www.airpair.com/angularjs/posts/top-10-mistakes-angularjs-developers-make)