title: Front End Interview Questions
date: 2016-08-14 11:39:13
thumbnailImage: https://media.giphy.com/media/4BgU4OMAjkwyQ/giphy.gif
categories:
tags:
---

To rock the interview to achieve what you deserve and to improve your concepts about front end technologies, I have consolidated a list of questions and answers. It's a one stop solution for front end interview process.

<!--more-->
<!--toc-->

# JavaScript: basics

## Types.

### What are the differences between "==" and "==="?

**Answer:** The simplest way of saying that, `==` will not check types and `===` will check whether both sides are of same type. So, `==` under the hood converts to number type if they have not the same type and then do the comparison.

`===` compares the types and values. Hence, if both sides are not same type, answer is always false. For example, if you are comparing two strings, they must have identical character sets. For other primitives (number, boolean) must share the same value.

### What are the differences between "null" and "undefined"?

**Answer:** JavaScript has two distinct values for nothing, `null` and `undefined`.

`undefined` means, value of the variable is not defined. JavaScript has a global variable `undefined` whose value is "undefined" and typeof `undefined` is also "undefined". Remember, `undefined` is not a constant or a keyword. `undefined` is a type with exactly one value: `undefined`.

`null` means empty or non-existent value which is used by programmers to indicate “no value”. `null` is a primitive value and you can assign `null` to any variable. `null` is not an object, it is a primitive value. For example, you cannot add properties to it. Sometimes people wrongly assume that it is an object, because typeof `null` returns "object".

With non strict comparison th `null == undefined` is `true`, because that is in [spec](http://es5.github.io/x11.html#x11.9.3), and here [learn.javascript.ru](https://learn.javascript.ru/types-conversion#специальные-значения)

### What is a potential pitfall with using "typeof bar === "object"" to determine if bar is an object? How can this pitfall be avoided?

**Answer:** Use `Object.prototype.toString.call(<object>)` or use Duck Typing.

### Rapid fire table of primitive type conversions:

| Question                                    | Answer                                                                                                                    |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| "" + 1 + 0                                  | "10"                                                                                                                      |
| "" - 1 + 0                                  | -1                                                                                                                        |
| true + false                                | 1                                                                                                                         |
| "2" * "3"                                   | 6                                                                                                                         |
| 6 / "3"                                     | 3                                                                                                                         |
| 4 + 5 + "px"                                | "9px"                                                                                                                     |
| "$" + 4 + 5                                 | "$45"                                                                                                                     |
| "4" - 2                                     | 2                                                                                                                         |
| "4px" - 2                                   | NaN                                                                                                                       |
| 7 / 0                                       | Infinity                                                                                                                  |
| " -9\n" + 5                                 | " -9\n5"                                                                                                                  |
| " -9\n" - 5                                 | -14                                                                                                                       |
| 5 && 2                                      | 2                                                                                                                         |
| 2 && 5                                      | 5                                                                                                                         |                                                                                                                        |
| null + 1                                    | 1                                                                                                                         |
| undefined + 1                               | NaN                                                                                                                       |
| null == "\n0\n"                             | false                                                                                                                     |
| +null == +"\n0\n"                           | true                                                                                                                      |
| typeof []                                   | Object. Actually Array is derived from Object.  If you want to check array use Array.isArray(arr) or {}.toString.call([]) |
| What is typeof arguments                    | Object. arguments are array like but not array. it has length, can access by index but can't push pop, etc                |
| var a = (2, 3, 5);  what is the value of a? | 5. The comma operator evaluates each of its operands (from left to right) and returns the value of the last operand       |
| parseFloat('12.3.4')                        | 12.3                                                                                                                      |
| Math.max([2,3,4,5])                         | NaN                                                                                                                       |
| 3 instanceof Number                         | false                                                                                                                     |
| typeof bar                                  | undefined                                                                                                                 |
| typeof(NaN)                                 | "number"                                                                                                                  |

### True Lies. 11+ true false related questions that will trick you

**Answer:**  There are only two truthy things - `true` and everything that is not false.

The 6 things are falsy and they are - `false`, `null`, `undefined`, `''`, `0`, `NaN`.

True / False Rapid Fire Table:

| Question                                                    | Answer                                                                                                                                                                    |
|-------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Is `'false'` is `false`?                                        | No. Because, it's a string with length greater than 0. Only empty string is false                                                                                         |
| Is `' '` is `false`?                                            | No. Because, it's not an empty string. There is a white space in it.                                                                                                      |
| What about `{}`?                                              | true. It's an object. An object without any property is an object can't be falsy.                                                                                         |
| Tell me about `[]`?                                           | This is also truthy. It's an array object (array is child of object) is truthy.                                                                                           |
| You talked bout `''` to be falsy.  What about `new String('')`? | true. Though you are passing empty string to the string constructor, it is creating an String object.  More precisely a instance of String object. It becomes an object.  |
| Tell me about `new Boolean(false)`                          | As it creates an instance of the Boolean object which is an object. Object is truthy.                                                                                     |
| `Boolean(function(){})`                                       | true if you pass a truthy value to Boolean, it will be true.                                                                                                              |
| `true%1`                                                      | 0. When you are trying to find reminder of true, true becomes 1 and reminder of 1 while dividing by 1 is 0.                                                               |
| `''%1`                                                        | 0                                                                                                                                                                         |
### What is NaN? What is its type? How can you reliably test if a value is equal to NaN?

**Answer:** “not a number”, "number", `NaN` compared to anything – even itself! to `false`.

**Explanation:** The NaN property represents a value that is “not a number”. This special value results from an operation that could not be performed either because one of the operands was non-numeric (e.g., "abc" / 4), or because the result of the operation is non-numeric (e.g., an attempt to divide by zero).

ES6 offers a new `Number.isNaN()` function, which is a different and more reliable than the old global `isNaN()` function.


## Scope and hoisting

### What will the code below output to the console and why? Does it work in "use strict" directive?

```
(function(){
  var a = b = 3;
})();

console.log("(typeof a !== 'undefined'));
console.log("(typeof b !== 'undefined'));
```

**Answer:** `false true` because `b` is declared as global variable. Won't work.

**Explanation:** Since both a and b are defined within the enclosing scope of the function, and since the line they are on begins with the var keyword, most JavaScript developers would expect `typeof a` and `typeof b` to both be `undefined` in the above example.

However, that is not the case. The issue here is that most developers incorrectly understand the statement `var a = b = 3;` to be shorthand for:

```
var b = 3;
var a = b;
```

But in fact, `var a = b = 3;` is actually shorthand for:

```
b = 3;
var a = b;
```

Note that, in strict mode (i.e., with `use strict`), the statement `var a = b = 3`; will generate a runtime error of `ReferenceError: b is not defined`.

### What will you see in the console for the following example?

```
var a = 1; 
function b() { 
    a = 10; 
    return; 
    function a() {} 
} 
b(); 
console.log(a);   
```

**Answer:** 1

* function declaration `function a(){ }` is hoisted first and it behaves like `var a = function () { };`. Hence in local scope variable `a` is created.
* If you have two variables with same name (one in global another in local), local variable always get precedence over global variable.
* When you set `a = 10;`, you are setting the local variable `a`, not the global one. Hence, the value of global variable remain same and you get, `1` in the log.
* Extra: If you didnt have a function named as "a", you will see 10 in the log.

For the following code, what will be returned for executing foo:

```
function foo(){
    function bar() {
        return 3;
    }
    return bar();
    function bar() {
        return 8;
    }
}
foo();//?
```

**Answer:** 8

As function declaration is get hoisted. the first bar is at the top and second bar after the return will also be hoisted. Since there is already a bar (first function declaration), the second one will replace the first one. As there could be one function for a single name and the last one stays. Hence, when you executing bar, you are executed the second one (after hoisting) and you get.

### What is the significance, and what are the benefits, of including "use strict" at the beginning of a JavaScript source file?

**Answer:** `'use strict'` is a way to enforce stricter parsing and error handling on your code at runtime. Code errors that would otherwise have been ignored or would have failed silently will now generate errors or throw exceptions.

**Explanation:** Some of the key benefits of strict mode include:

* Makes debugging easier. Code errors that would otherwise have been ignored or would have failed silently will now generate errors or throw exceptions, alerting you sooner to problems in your code and directing you more quickly to their source.

* Prevents accidental globals. Without strict mode, assigning a value to an undeclared variable automatically creates a global variable with that name. This is one of the most common errors in JavaScript. In strict mode, attempting to do so throws an error.

* Eliminates `this` coercion. Without `strict mode`, a reference to a this value of `undefined` is automatically coerced to the global. This can cause many headfakes and pull-out-your-hair kind of bugs.

* Disallows duplicate property names or parameter values. Strict mode throws an error when it detects a duplicate named property in an object (e.g.,` var object = {foo: "bar", foo: "baz"};`) or a duplicate named argument for a function (e.g., `function foo(val1, val2, val1){}`), thereby catching what is almost certainly a bug in your code that you might otherwise have wasted lots of time tracking down.

* Throws error on invalid usage of delete. The delete operator (used to remove properties from objects) cannot be used on non-configurable properties of the object. Non-strict code will fail silently when an attempt is made to delete a non-configurable property, whereas strict mode will throw an error in such a case.

## Closure and Functions

### What is a “closure” in JavaScript? Provide an example.

> Closure is a function with all accessible variables in lexical environment

A closure is an inner function that has access to the variables in the outer (enclosing) function’s scope chain. The closure has access to variables in three scopes; specifically: (1) variable in its own scope, (2) variables in the enclosing function’s scope, and (3) global variables.

```
let globalVar = 'foo';

(function outerFunc(outerArg) {
  let outerVar = 'a';
  
  (function innerFunc(innerArg) {
    let innerVar = 'b';
    
    console.log(
      `outerArg = ${outerArg}
      outerVar = ${outerVar}
      innerArg = ${innerArg}
      innerVar = ${innerVar}
      globalVar = ${globalVar}`
    );
    
  })(456);
})(123);
/*
outerArg = 123
innerArg = 456
outerVar = a
innerVar = b
globalVar = xyz
*/
```

### Closures Inside in loop with "setTimeout".

If log the loop counter inside `setTimeout`, what will be logged?

```
for(var i = 0; i < 10; i++) {
  setTimeout(function() {
    console.log(i);  
  }, 10);
}
```

**Answer**: The above will not output the numbers 0 through 9, but will simply print the number 10 ten times.

**Explanation**: 

1. The console log is inside the anonymous function of `setTimeout` and `setTimeout` is executed when current call stack is over. 
2. So, the loop finishes and before setTimeout get the chance to execute. However, anonymous functions keep a reference to `i` by creating a closure. 
3. Since, the loop is already finished, the value `i` has been set to `10`.

**Solution:** You can fix it by avoiding closure. Just create a `IIFE` (Immediately Invoked Function Expression), it will create its own scope and you can pass i to the function. In that case i will be a local variable (will not refer to i in the closure) and value of the i in every loop will be preserved.

```
for(var i = 0; i < 10; i++) {
    setTimeout((function(i) {
      console.log(i);
    })(i), 10)
}

//or

for(var i = 0; i < 10; i++) {
  setTimeout(console.log.bind(console, i), 10);
}
```

**ES6 Solution:**

```
for(let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);  
  }, 10);
}
```

### "call" / "apply" VS "bind". If you want to use an arbitrary object as value of this, how will you do that?

**Answer:** There are at least four different ways to doing this by using `bind`, `call`, `apply` and `arrow function` with parent lexical scope.

For example, I have a method named deductMontlyFee in the object `monica` and by default value of this would be `monica` inside the method.

```
const monica = {
  name: 'Monica Geller',
  total: 400,
  deductMontlyFee(fee){
     this.total = this.total - fee;
     return this.name + ' remaining balance is '+ this.total; 
  }
}
```

If I bind the deductMontlyFee of `monica` with another object `rachel` and pass `rachel` as first parameter of the bind function, `rachel` would be the value of this:

```
const rachel = {name: 'Rachel Green', total: 1500};
const rachelFeeDeductor = monica.deductMonthlyFee.bind(rachel, 200);

rachelFeeDeductor(); //"Rachel Green remaining balance is 1300"
rachelFeeDeductor(); //"Rachel Green remaining balance is 1100"
```

With `apply`:

```
monica.deductMonthlyFee.apply(rachel, 200);
```

[call & apply VS bind, the simplest explanation](http://qetr1ck-op.github.io/2016/08/06/call-apply-VS-bind-the-simplest-explanation/)

### "arguments" and "call". Write a simple function to tell whether 2 is passed as parameter or not?

**Answer:** First convert `arguments` to an array with `rest` operator, after that simply use `Array.prototype.includes`.

``` javascript
function isTwoPassed(...params) {
  return params.includes(2);
}
/*
ES5 way
function isTwoPassed(){
  var args = Array.prototype.slice.call(arguments);
  return args.indexOf(2) != -1;
}
*/

isTwoPassed(1,4); //false
isTowPassed(5,3,1,2); //true
```

### "apply" and "spread". How could you use "Math.max" to find the max value in an array?

```
Math.max(...arr);  

//ES5 way
//Math.max.apply(Math, arr);  
```

### "apply" and "rest". How could you set a prefix before everything you log? for example, if you "log('my message')"" it will log: "(app) my message"

**Answer:** Just get the arguments, convert it to an array and unshift whatever prefix you want to set. Finally, use apply to pass all the arguments to console.

```
function log(){
  var args = Array.prototype.slice.call(arguments);
  args.unshift('(app)');
  console.log.apply(console, args);
}

log('my message'); //(app) my message
log('my message', 'your message'); //(app) my message your message 
```

**ES6 Answer:** 

```
function log(...params){
  console.log(['(app)', ...params]);
}
```

### Cashing / Memoization. How could you implement cache to save calculation time for a recursive fibonacci function?

Question: How could you cache execution of any function?

TODO: https://www.sitepoint.com/implementing-memoization-in-javascript/
http://www.thatjsdude.com/interview/js2.html#memoization

### Why wrapping the entire content of a JavaScript source file in IIFE?

**Answer:** This technique creates a closure around the entire contents of the file which, perhaps most importantly, creates a private namespace and thereby helps avoid potential name clashes between different JavaScript modules and libraries.

**Explanation:** Another feature of this technique is to allow for an easily referenceable (presumably shorter) alias for a global variable. This is often used, for example, in jQuery plugins. jQuery allows you to disable the $ reference to the jQuery namespace, using jQuery.noConflict(). If this has been done, your code can still use $ employing this closure technique, as follows:

```
(function($) { /* jQuery plugin code referencing $ */ } )(jQuery);
```

## Objects 

### this. What the heck is "this" in JavaScript?

**Answer:** At the time of execution of every function, JavaScript engine sets a property to the function called `this` which refer to the current execution context. `this` is always refer to an object and depends on how function is called:

1. In the global context or inside a function this refers to the `window`/`global` object. In ES6 or with `use strict` directive it's `undefined`
2. While executing a method in the context of an object, the object becomes the value of `this`
3. If you use a constructor (by using new keyword) to create an object, the value of `this` will refer to the newly created object.
4. Set the value of `this` to any arbitrary object by passing the object as the first parameter of `bind`, `call` or `apply`
5. Use `arrow function` for use parent lexical scope.

### How would you compare two objects?

**Answer:** JavaScript has two different approaches for testing equality. Primitives like strings and numbers are compared by their value, while objects like arrays, dates, and user defined objects are compared by their reference. This means it compares whether two objects are referring to the same location in memory.

Equality check will check whether two objects have same value for same property. To check that, you can get the keys for both the objects. 

```
function isEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a),
        bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}
```

Or use [lodash](https://www.npmjs.com/package/lodash.isequal) equivalent.

### Object comparison, toString, valueOf. Truthy isn't Equal to true. As "[]" is true, "[] == true" should also be "true", right?

**Answer:** Not.

You are right about first part, `[]`, empty array is an object and object is always truthy. 

However, special case about `==` (not-strict equal) is that it will do some implicit coercion.

1. Since left and right side of the equality are two different types, JavaScript can't compare them directl.
2. JavaScript implementation will try to convert `[]` by using `toPrimitive` (of JavaScript implementation). since `[].valueOf` is not primitive will use `toString` and will get `""`.
3. Now you are comparing `"" == 1` and still left and right is not same type. Hence left side will be converted again to a number and empty string will be `0`.
4. Finally, they are of same type, you are comparing `0 === 1` which will be `false`.

### Extend Core Object through prototype.

**Question:** How could you write a method on instance of a date which will give you next day?

**Answer:** I have to declare a method on the prototype of Date object. To get access to the current value of the instance of the date, i will use `this`

```
Date.prototype.nextDay = function(){
  return new Date(this.setDate(this.getDate() + 1));
}

var date = new Date(); 
date; //Fri May 16 2014 20:47:14 GMT-0500 (Central Daylight Time)
date.nextDay();//Sat May 17 2014 20:47:14 GMT-0500 (Central Daylight Time)
```

**Question:** If i have a var `str = 'hello world'`, how could i get `str.reverse()` return `'dlrow olleh'`?

**Answer:** You have to extend the core String Object

```
String.prototype.reverse = function(){
  return this.split('').reverse().join(''); // or better [...this].reverse().join('');
}

var str = 'hello world';
str.reverse();//"dlrow olleh"
```

**Question:** How could you make this work `[1,2,3,4,5].duplicator()` to return `[1,2,3,4,5,1,2,3,4,5]` ?

**Answer:** We need to add a method in the prototype of Array object.

```
Array.prototype.duplicator = function(){
  return this.concat(this); // or better [...this, ...this];
}

[1,2,3,4,5].duplicator(); // [1,2,3,4,5,1,2,3,4,5]
```

### Pass by value or by reference. Does JavaScript pass parameter by value or by reference?

**Answer**: Primitive type (string, number, etc.) are passed by value and objects are passed by reference. If you change a property of the passed object, the change will be affected. However, you assign a new object to the passed object, the changes will not be reflected.

```
var num = 10,
  name = "Addy Osmani",
  obj1 = {
    value: "first value"
  },
  obj2 = {
   value: "second value"
  },
  obj3 = obj2;
 
function change(num, name, obj1, obj2) {
  num = num * 10;
  name = "Paul Irish";
  obj1 = obj2;
  obj2.value = "new value";
}
 
change(num, name, obj1, obj2);
 
console.log(num); // 10
console.log(name);// "Addy Osmani"
console.log(obj1.value);//"first value"
console.log(obj2.value);//"new value"
console.log(obj3.value);//"new value"     
```

# AngularJS 

## List at least three ways to communicate between modules of your application using core AngularJS functionality.

* Using services
* Using events
* By assigning models on `$rootScope`
* Directly between controllers, using `ControllerAs`, or other forms of inheritance
* Directly between controllers, using `$parent`, `$$childHead`, `$$nextSibling`, etc.

## Which means of communication between modules of your application are easily testable?

Using a service is definitely easy to test. Services are injected, and in a test either a real service can be used or it can be mocked.

Events can be tested. In unit testing controllers, they usually are instantiated. For testing events on `$rootScope`, it must be injected into the test.

For testing direct communication between controllers, the expected results should probably be mocked. Otherwise, controllers would need to be manually instantiated to have the right context.

## The most popular e2e testing tool for AngularJS is Protractor. There are also others which rely on similar mechanisms. Describe how e2e testing of AngularJS applications work.

The e2e tests are executed against a running app, that is a fully initialized system. They most often spawn a browser instance and involve the actual input of commands through the user interface. The written code is evaluated by an automation program, such as a Selenium server (webdriver). That program sends commands to a browser instance, then evaluates the visible results and reports back to the user.

The assertions are handled by another library, for Protractor (end-to-end) / Karma (unit tests) the default is Jasmine.

## What are the basic steps to unit test an AngularJS filter?

1. Inject the module that contains the filter.
2. Provide any mocks that the filter relies on.
3. Get an instance of the filter using $filter('yourFilterName').
4. Assert your expectations.

```
describe('Filter: myFltr', function () {
  var myFltr;

  beforeEach(function () {
    // Load the filters's module
    module('myApp');

    // Provide any mocks needed
    module(function ($provide) {
      //$provide.value('Name', new MockName());
    });

    // Inject in angular constructs otherwise,
    // you would need to inject these into each test
    inject(function ($filter) {
      myFltr = $filter('myFltr');
    });
  });

  it('should exist', function () {
    expect(!!myFltr).toBe(true);
  });

  describe('when evaluating an expression', function () {
    it('should return the expected output', function () {
      var text = 'AngularJS';
      expect(myFltr(text)).toBe('my filter: ' + text);
    });
  });
});
```



## When a scope is terminated, two similar “destroy” events are fired. What are they used for, and why are there two?

The first one is an AngularJS event, “$destroy” can be used by AngularJS scopes where they are accessible, such as in controllers or link functions.

```
scope.$on(‘$destroy’, function () {
  // handle the destroy, i.e. clean up.
});
```

The jqLite / jQuery event is called whenever a node is removed, which may just happen without scope teardown:

```
element.on(‘$destroy’, function () {
  // respectful jQuery plugins already have this handler.
  // angular.element(document.body).off(‘someCustomEvent’);
});
```

## How do you reset a “$timeout”, and disable a “$watch()”?

The key to both is assigning the result of the function to a variable.

To cleanup the timeout, just `.cancel()` it:

```
var customTimeout = $timeout(function () {
  // arbitrary code
}, 55);

$timeout.cancel(customTimeout);
```

The same applies to “$interval()”. To disable a watch, just call it:

```
var deregisterWatchFn = $rootScope.$watch(‘someGloballyAvailableProperty’, function (newVal) {
  if (newVal) {
    // we invoke that deregistration function, to disable the watch
    deregisterWatchFn();
    ...
  }
});
```

## Name and describe the phases of a directive definition function execution, or describe how directives are instantiated.

Each directive undergoes something similar to a life cycle as AngularJS compiles and links the DOM. The directive lifecycle begins and ends within the AngularJS bootstrapping process, before the page is rendered. 

In a directive’s life cycle, there are four distinct functions that can execute if they are defined. Each enables the developer to control and customize the directive at different points of the life cycle.

* The `compile` function allows the directive to manipulate the DOM before it is compiled and linked thereby allowing it to add/remove/change directives, as well as, add/remove/change other DOM elements.
* The `controller` function facilitates directive communication. Sibling and child directives can request the controller of their siblings and parents to communicate information.
* The `pre-link` function allows for private `$scope` manipulation before the `post-link` process begins.
* The `post-link` method is the primary workhorse method of the directive.

```
.directive("directiveName",function () {
  return {
    controller: function() {
      // controller code here...
    },
    compile: {
      // compile code here...
      return {
        pre: function() {
          // pre-link code here...
        },
        post: function() {
          // post-link code here...
        }
      };
    }
  }
})
```

Commonly, not all of the functions are needed. In most circumstances, developers will simply create a `controller` and `link` (which refers to `post-link`) function following the pattern below.

```
.directive("directiveName",function () {
  return {
    controller: function() {
      // controller code here...
    },

    link: function() {
      // post-link code here...
    }
  }
})
```

More [here](https://www.toptal.com/angular-js/angular-js-demystifying-directives).

## How does interpolation, e.g. “{ { someModel } }”, actually work?

During the compilation process the `compiler` uses the `$interpolate` service to see if text nodes and element attributes contain interpolation markup with embedded expressions.

If that is the case, the compiler adds watches on the computed interpolation function, which will update the corresponding text nodes or attribute values as part of the normal digest cycle.

## How does the digest phase work?

In a nutshell, on every digest cycle all scope models are compared against their previous values. That is dirty checking. If change is detected, the watches set on that model are fired. Then another digest cycle executes, and so on until all models are stable.

It is probably important to mention that there is no `.$digest()` polling. That means that every time it is being called deliberately. As long as core directives are used, we don’t need to worry, but when external code changes models the digest cycle needs to be called manually. Usually to do that, `$apply()`, `$digest()`, `$timeout()`, `$evalAsync()`.

## List a few ways to improve performance in an AngularJS app

The first one can be enabled through the `$compileProvider`:

```
.config(function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
});
```

Call this method to enable/disable various debug runtime information in the compiler such as adding binding information and a reference to the current scope on to DOM elements. If enabled, the compiler will add the following to DOM elements that have been bound to the scope

* `ng-binding` CSS class
* `$binding` data property containing an array of the binding expressions

Using one-time binding where possible. Those bindings are set, e.g. in `{ { ::someModel } }` interpolations by prefixing the model with two colons. In such a case, no watch is set and the model is ignored during digest.

Making $httpProvider use applyAsync:
```
myApp.config(function ($httpProvider) {
  $httpProvider.useApplyAsync(true);
});
```

That’s it! If the application now receives multiple `$http` responses at around the same time, this is what happens (a bit simplified though):

* The call’s promise is pushed into a queue
* An asynchronous `$apply` is scheduled in case there’s no one scheduled yet, by telling the browser to execute `setTimeout()`
* Once timed out, the queue is flushed and the actual` $apply` is triggered

The `setTimeout()` is called with a 0 delay which causes an actual delay of around 10 milliseconds depending on the browser. That means, if our three asynchronous calls return at around the same time (somewhere inside that particular timeout delay), they get resolve with a single `$digest` cycle instead of three which speeds up our application.

## What is $rootScope and how does it relate to $scope?

`$rootScope` is the parent object of all `$scope` Angular objects created in a web page.

## What is the difference between "ng-show"/"ng-hide" and "ng-if" directives?

`ng-show`/`ng-hide` will always insert the DOM element, but will display/hide it based on the condition. 

`ng-if` will not insert the DOM element until the condition is not fulfilled.

`ng-if` is better when we needed the DOM to be loaded conditionally, as it will help load page bit faster compared to `ng-show`/`ng-hide`

## Where should we implement the DOM manipulation in AngularJS?

In the directives. DOM Manipulations should not exist in controllers, services or anywhere else but in directives.

Otherwise it's:
* It is not reusable
* It is not testable
* It include css hard coded selectors dependencies

## Is it a good or bad practice to use AngularJS together with jQuery?

jQuery takes a traditional imperative approach to manipulating the DOM. In an imperative approach, it is up to the programmer to express the individual steps leading up to the desired outcome. What do I mean by this? So if we want an action to occur when a user types say 150 characters into an input, in jQuery we would say, "every time the user hits a key, check how many characters are in the input, if it exceeds 150 characters, do the action." Every step is addressed along the way.

AngularJS however takes a declarative approach to DOM manipulation. Here instead of worrying about all of the step by step details regarding how to do the desired outcome, AngularJS abstracts that and allows you to just say what you want done, in this case, "AngularJS, when the state of the input is at 150 characters, do this." We are just declaring what we want and AngularJS worries about the rest, taking care of everything for us.

It might seem like I'm just splitting hairs here, but it's really an important distinction. AngularJS wants you basing your actions around the data models you create. It's how the entire framework works and how your applications will be structured. 

To simply begin writing side scripts in jQuery where you are plucking out elements and setting up side event listeners just goes against the AngularJS approach in my opinion.

## If you were to migrate from Angular 1.4 to Angular 1.5, what is the main thing that would need refactoring?

Changing `.directive` to `.component` to adapt to the new Angular 1.5 components. More about [.component approach](http://qetr1ck-op.github.io/2016/07/22/Exploring-AngularJS-1-5-component-method/)

## Lifecycle hooks in Angular 1.5

* `$onInit`
* `$postLink`
* `$onChanges`
* `$onDestroy`

More in [awesome post](https://toddmotto.com/angular-1-5-lifecycle-hooks).

## How would you specify that a scope variable should have one-time binding only?

By using `::model.property` in front of it. This allows the check if the candidate is aware of the available variable bindings in AngularJS.

## What is the difference between one-way binding and two-way binding?

One way binding implies that the scope variable in the html will be set to the first value its model is bound to (i.e. assigned to).

Two way binding implies that the scope variable will change it’s value everytime its model is assigned to a different value

## What is the role of services in AngularJS and name any services made available by default?

* Services are objects that provide separation of concerns to an AngularJS app.
* Services can be created using a factory method or a service method.
* Services are singleton components. All components of the application (into which the service is injected) will work with single instance of the service.
* Allows developing of business logic without depending on the View logic which will work with it.
* A typical service can be injected into another service or into an Controller.

Few of the inbuilt services in AngularJS are:
– the `$http` service: The `$http` service is a core Angular service that facilitates communication with the remote HTTP servers via the browser’s XMLHttpRequest object or via JSONP
– the `$log` service: Simple service for logging. Default implementation safely writes the message into the browser’s console
– the `$anchorScroll`: it scrolls to the element related to the specified hash or (if omitted) to the current value of `$location.hash()`

## What are Providers and when to use them?

Each web application you build is composed of objects that collaborate to get stuff done. These objects need to be instantiated and wired together for the app to work. In Angular apps most of these objects are instantiated and wired together automatically by the `$injector` service.

The `$injector` creates two types of objects, *services* and *specialized objects*.

* Services are objects whose API is defined by the developer writing the service.
* Specialized objects conform to a specific Angular framework API. These objects are one of controllers, directives, filters or animations.

The injector needs to know how to create these objects. You tell it by registering a "recipe" for creating your object with the injector. There are five recipe types.

The most verbose, but also the most comprehensive one is a `Provider` recipe. The remaining four recipe types — `Value`, `Factory`, `Service` and `Constant` — are just syntactic sugar on top of a provider recipe.

The `Provider` recipe is the core recipe type and all the other recipe types are just syntactic sugar on top of it. It is the most verbose recipe with the most abilities, but for most services it's overkill.

You should use the Provider recipe only when you want to expose an API for application-wide configuration that must be made before the application starts. This is usually interesting only for reusable services whose behavior might need to vary slightly between applications.

The Provider recipe is syntactically defined as a custom type that implements a `$get` method. This method is a factory function just like the one we use in the Factory recipe. In fact, if you define a Factory recipe, an empty Provider type with the $get method set to your factory function is automatically created under the hood.

More in [official docs](https://docs.angularjs.org/guide/providers).

# Algorithms

## Binary search

A binary search tree is a great place to store data in an ordered way to allow for an easy search for specific information.
It works by comparing the target value to the midpoint of the array; if they are not equal, the lower or upper half of the array is eliminated depending on the result and the search is repeated until the position of the target value is found.

The basic algorithm, then, can be described as:

- If currentValue equals value, you’re done.
- If value is less than currentValue, go left. Go to step 1.
- If value is greater than currentValue, go right. Go to step 1.

Binary search is intuitively recursive; however, it can be done iteratively by keeping track of the bounds of the search with two pointers. Binary search is efficient for sorted arrays that are stored contiguously (close together) in memory, making `O(log n)` comparisons, where `n` is the number of elements in the array.

```
function binarySearch(items, value){

    var startIndex  = 0,
        stopIndex   = items.length - 1,
        middle      = Math.floor((stopIndex + startIndex)/2);

    while(items[middle] != value && startIndex < stopIndex){

        //adjust search area
        if (value < items[middle]){
            stopIndex = middle - 1;
        } else if (value > items[middle]){
            startIndex = middle + 1;
        }

        //recalculate middle
        middle = Math.floor((stopIndex + startIndex)/2);
    }

    //make sure it's the right value
    return (items[middle] != value) ? -1 : middle;
}
```

## The fastest method to create unique items in array

With primitive values:

```
new Set([1, 2, 2, 1, 5]); // [1, 2, 5]
```

With objects: 

```
Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};
```

This is somewhat classified  as “Hash Sorting Algorithm” where every item in the array is a hash value and a hash function inserts item into a bucket, replacing existing values in case of hash collision. As such, this can be applied to any programming language for faster sieving of very large arrays.

This algorithm has a linear time complexity of `O(2n)` in worst case scenario. This is way better than what we will observe for the classic method as described below.

The classic (worst and most popular) method of finding unique items in an array runs two loops in a nested order to compare each element with rest of the elements. Consequently, the time complexity of the classic method to find the unique items in an array is around quadratic `O(n²)`.

```
var a = [], l = this.length;
  for(var i=0; i<l; i++) {
    for(var j=i+1; j<l; j++)
          if (this[i] === this[j]) j = ++i;
    a.push(this[i]);
  }
  return a;
```

## The fastest method to find items in array

Create a classical hash table with complexity of `O(n)`:

```
var result = arr.reduce(function(map, obj) {
  map[obj.id] = obj;
  return map;
}, {});
```

And search in the structure is `O(1)`;

## Big-O Complexity Chart

[An awesome cheat sheet](http://bigocheatsheet.com/)

# ES6

## When standard was finalized?

The ES6 specification was finalized in June 2015, (hence ES2015).

Future versions of the specification will follow the ES[YYYY] pattern, e.g ES2016 for ES7.

## Tooling

To get ES6 working today, you need a JavaScript-to-JavaScript transpiler:

* They allow you to compile code in the latest version into older versions of the language
* As browser support gets better, we’ll transpile ES2016 and ES2017 into ES6 and beyond
* We’ll need better source mapping functionality
* They’re the most reliable way to run ES6 source code in production today (although browsers get ES5)
* 
Use `babel` to transpile ES6 into ES5 for static build

Use `babelify` to incorporate babel into your `Gulp`, `Grunt`, or `npm` run build process

Use `Node.js` v4.x.x or greater as they have decent ES6 support baked in, thanks to v8

Use `babel-node` with any version of node, as it transpiles modules into ES5

## Assignment Destructuring, the Rapid Table

## Spread Operator and Rest Parameters

## Arrow Functions

## Template Literals

## Object Literals

## Classes

## Let and Const

## Symbols

## Iterators

## Generators

## Promises

## Maps / WeakMaps

## Sets / WeakSets

## Modules

TODO with https://ponyfoo.com/articles/es6