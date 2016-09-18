title: Exploring AngularJS 1.5 .component() method
date: 2016-07-22 22:20:03
thumbnailImage: http://html5-demos.appspot.com/static/webcomponents/images/logos/webcomponents.png
thumbnailImagePosition: right
tags:
    - AngularJS
categories:
    - Javascript
    - AngularJS
---

AngularJS 1.5 introduce `.component()` helper method which is much simpler than the `.directive()` definitions and advocates best practices and common default behavior.

Using `.component()` will allow to write in Angular 2 style as well, which will turn transition to Angular 2 much easier.

Let's compare the difference in syntax and the possibility of new abstraction.

<!--toc-->
<!--more-->

# "directrive()" to "component()"

The syntax change is simple:

```
// before
module.directive(name, fn);

// after
module.component(name, options);
```

I've rebuild a simple `counter` directive which which we'll refactor to `component()`:

```
module
  .directive('counter', function counter() {
    return {
      scope: {},
      bindToController: {
        count: '='
      },
      contorllerAs: '$ctlr',
      controller: function() {
        this.increment = () => this.count++;
        this.decrement = () => this.count--;
      },
      template: `
        <div>
          <input type="number" ng-model="$ctlr.count">
          <button ng-click="$ctrl.increment()">+</button>
          <button ng-click="$ctrl.decrement()">-</button>
        </div>
      `
    }
  })
```

{% iframe http://embed.plnkr.co/K66Z99ejkma90mWNxfqs/ 100% 600px %}

# Function to Object

Let's start from the top and refactor the function argument to object:

```
// before
module
  .directive('counter', function counter() {
    return {

    }
  })

// after
module
  .component('counter', {

  })
```

Nice and simple.

# "scope" and "bindToController" become "bindings"

In `directive()` the `scope` property allows us to define whether we want to isolate the `$scope` or inherit it. So repeating every time just create an extra boilerplate. With [bindToController](https://docs.angularjs.org/api/ng/service/$compile) we can explicitly define binding directly to instance of controller via `this`.

With `bindings` we can remove this boilerplate and simple define what we want to pass down to the component.

And `component()` will always have an isolated scope.

```
// before
module
  .directive('counter', function counter() {
    return {
      scope: {
        count: '='
      },
      bindToController: true
    }
  })

// after
module
  .component('counter', {
    binding: {
      count: '='
    }
  })
```

# Controller and "contorllerAs" changes

Nothing has changed in the way we declare `controller`, however it's now smarter and has a default `contorllerAs` value of `$ctrl`.

Under the hood it looks like:

```
// inside angular.js
controllerAs: identifierForController(options.controller) || options.controllerAs || '$ctrl'

//...

var CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
function identifierForController(controller, ident) {
  if (ident && isString(ident)) return ident;
  if (isString(controller)) {
    var match = CNTRL_REG.exec(controller);
    if (match) return match[3];
  }
}
```

This allows us to do the following inside `.component()`:

```
{
  ...
  controller: 'FooController as foo'
}
```

Based on the information we refactor our `Directive` to `Component` by dropping controllerAs property:

```
// before
.directive('counter', function counter() {
  return {
    scope: {
      count: '='
    },
    bindToController: true,
    controller: function () {
      this.increment = () => this.count++;
      this.decrement = () => this.count--;
    },
    controllerAs: 'counter'
  };
});

// after
.component('counter', {
  bindings: {
    count: '='
  },
  controller: function () {
    this.increment = () => this.count++;
    this.decrement = () => this.count--;
  }
});
```

Things now are becoming much simpler and funny.

# Template

The `template` property can be defined as a function property with injected `$elem` and `$attrs` values:

```
{
  ...
  template: function ($element, $attrs) {
    // access to $element and $attrs
    return `
      <div>
        <input type="text" ng-model="$ctrl.count">
        <button type="button" ng-click="$ctrl.decrement();">-</button>
        <button type="button" ng-click="$ctrl.increment();">+</button>
      </div>
    `
  }
  ...
}
```

# A life demo with new ".component()":

{% iframe http://embed.plnkr.co/CRSS2VkrfM6KK9U72mxg/ 100% 600px %}

# Inheriting behavior with "require"

Inherited Directive or Component methods will be bound to `this.parent` property in the Controller:

```
{
  ...
  require: {
    parent: '^^parentComponet'
  },
  controller: function() {
    // use this object to access to required Object
    this.parent.foo();
  }
}
```

# One-way binding

A new syntax expression for isolate scope values:

```
{
  ...
  bindings: {
    oneWay: '<',
    twoWay: '='
  },
  ...
}
```

> But still remember that object are passed by reference, and Angular doesn't make a clone of the object when it passed via `one-way binding`, it actually sets the same value, which means that objects have still `two-way binding` somehow.

# Upgrading to Angular 2

Writing in this style using `.component()` allows you easily transit to Angular 2, it'd look something like this:

```
import { Component } from '@angular/core'

@Component({
  selector: 'counter',
  template: `
    <div>
      <input type="number" [(ng-model)]="count">
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  `,
})

export default class CounterComponent {
  constructor() {}
  increment() {
    this.count++;
  }
  decrement() {
    this.count++;
  }
}
```

Save my day: 

* [toddmotto](https://toddmotto.com/exploring-the-angular-1-5-component-method/)