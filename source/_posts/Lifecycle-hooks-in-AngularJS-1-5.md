title: Lifecycle hooks in AngularJS 1.5
date: 2016-09-04 10:48:03
thumbnailImage: https://media.giphy.com/media/3o6Ztn5Du98sxh2h7G/giphy.gif
categories:
  - Javascript
  - AngularJS 1.5
tags:
  - Javascript
  - AngularJS 1.5
  - Lifecycle hooks
---

Lifecycle hooks are simple functions that are called at specific points of a component's life in Angular apps. They landed in AngularJS 1.5 and are used with `.component()` method and they were inspired of Angular 2 hooks.

<!--more-->
<!--toc-->

# "$onInit" + "require"

Let's create tabs component that uses `$onInit` and `require`. Full working exapmle:

<iframe width="100%" height="300" src="//jsfiddle.net/vshmyfe8/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

# "$postLing" 

The `$postLink` gives as non-hacky-looking way to control `link` method. 

We can actually use the it to set an initial value for active tab:

<iframe width="100%" height="300" src="//jsfiddle.net/jm0b38ma/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

# "$onChanges"

This is the most important one, and allow use component architecture with one-way data flow!

The `$onChanges` method is called for a few reasons. The first is on component in initialization - component gets initial `changes` object. The second reason it gets called is only when changes occur to `<` (one-way databinding) and `@` (for evaluating DOM attribute values) that are being bound the parent component.

Once the `$onChenges` gets called, you get special `changes` object back:

```javascript
var childComponent = {
  bindings: { user: '<' },
  controller: function () {
    this.$onChanges = function (changes) {
      // `changes` is a special instance of a constructor Object,
      // it contains a hash of a change Object and
      // also contains a function called `isFirstChange()`
      // it's implemented in the source code using a constructor Object
      // and prototype method to create the function `isFirstChange()`
    };
  }
};

angular
  .module('app')
  .component('childComponent', childComponent);
```

In example we're using `bindings: { user: '<' }` which means we receive he data through one-way databinding under the alias of `user`:

<iframe width="100%" height="300" src="//jsfiddle.net/8cj1t4n7/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Cloning "changes" for "immutable" bindings

Data passed through one-way databinding are not `$watch`ed by Angular, however they are passed by reference. It means that any changes we make with object (primitives are not passed by reference) it affects the parent object, which acts as two-way databinding. We can clone data which are passed for non polluting changes from child to parent:

<iframe width="100%" height="300" src="//jsfiddle.net/Lf4y3oad/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## One-way data-flow + events

To get data back up to our `parentComponent`, we need to delegate a function to be used as an event callback, let’s add a function called `updateUser`, which expects an `event` back as an argument:

```javascript
var parentComponent = {
  ...
  controller: function () {
    ...
    this.updateUser = function (event) {
      this.user = event.user;
    };
  }
};
```

Instead of just passig back `this.user` into the function, we’re going to fake an `$event` object, which complies with how Angular 2 does this (using EventEmitter), and also provides global consistency between your templates to fetch data back through the `$ctrl.updateUser($event);` call we delegate down into the child component. The `$event` argument is a real thing in Angular, you can use it with ng-submit and so on:

```javascript
var childComponent = {
  ...
  controller: function () {
    ...
    this.saveUser = function () {
      this.onUpdate({
        $event: {
          user: this.user
        }
      });
    };
  }
};
```

The full example with delegating update of object:

<iframe width="100%" height="300" src="//jsfiddle.net/0rb4nsma/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Is two-way databinding via syntax "=" is dead?

Yes. One-way bindings establishes as the best approach for data flow. React, Angular 2 and other all use it.

![Rip two-way bindings](https://toddmotto.com/img/posts/binding-dead.jpg)

# "$onDestroy"

If you're using `$postLink` to set DOM event listener or any non-native Angular logic, `$onDestroy` is the place to clean up everything.

The old `$scope` way was kind of this:

```javascript
function SomeController($scope) {
  $scope.$on('$destroy', function () {
    // destroy event
  });
}
```

With new school it looks like this:

```javascript
var childComponent = {
  bindings: {
    user: '<'
  },
  controller: function () {
    this.$onDestroy = function () {
      // component scope is destroyed
    };
  }
};

angular
  .module('app')
  .component('childComponent', childComponent);
```

Save my day:

* [Todd Motto](https://toddmotto.com/angular-1-5-lifecycle-hooks#real-world-postlink)