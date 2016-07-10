title: How to copy object in Javascript
date: 2016-07-08 21:55:05
categories:
    - Javascript
---

There are many ways to copy object in Javascript but most of the time such operation doesn't do what we expected.

* Are all properties copied by reference? 
* Are sub-properties merged or replaced? 
* Are accessor, like getter and setters, preserved? 
* And what about Sumbols and other non-enumerable properties?

<!--more-->

# Shallow VS Deep copy

When we copied reference nor a value, we are doing **shallow** copy.
 
Whenever we do an operation like `a.prop = b.prop` we are performing a shallow copy, meaning that modifying the object property `a.prop` it will reflect changes in `b.prop` too.
 
```
const a = { 
    obj: {
        test: 'Foo'
    }
};

const b = {};
b.obj = a.obj;

//if we modify it
b.obj.test = 'Bar';

//it will be reflected in a 
a.obj.test;
```

In order to perform **deep** copy of `a.prop`:

```
const a = { 
    obj: {
        test: 'Foo'
    }
};

const b = {};
b.obj = {};

//not reflected in a
b.obj.test = 'Bar';
a.obj.test;
```

# Object.assign(target, [, sourceN])

`Object.assign` performs a **shallow** copy it merges enumerable properties with priority right to left:

```
const a = {
    obj: {
        foo: true
    },
    bar: 2
};
const b = {
    obj: {
        foz: true
    },
    baz: 3
};
//shallow merge
const c = Object.assign({}, a, b);

//which 'obj' property was copied?
//the priority is right to left
c.obj === b.obj; //true
c.obj === a.obj; //false

c.bar; // 2
c.baz; // 3

//change will reflect by reference
c.obj.foz = false;
b.obj.foz; // false
```

# Object.assign side effects

There are at least two main subtle problems most developers are not aware of:

* all accessors, those properties with `getter` or `setter`, will be copied as a simple data, invoking the getter 
during the copy
* all `Symbol` keys will be copied too, making `Symbol` less private or protected than we thing

```
const uid = Symbol('uid');
const special = {
    get next() {
        return ++this.counter;
    },
    counter: 0
};
special[uid] = Math.random;

//what could be possible wrong here?!
const notSpecial = Object.assign({}, special);

// if 'next' is declared (and copied) before 'counter'
notSpecial.counter; // 1
notSpecial.next; // 1 in any case

notSpecial[uid] === special[uid]; // same as special[uid]
```

> If you want a advice -  use `Object.assign` for simple shallow copy or merge with data that you are sure 
doesn't contain accessors.

# Use one of the simple npm package or lodash/underscore/rambda

[clone](https://www.npmjs.com/package/clone) is one a popular package for **deep** copying:

```
const clone = require('clone');
 
let a, b;
 
a = { foo: { bar: 'baz' } };  // initial value of a 
 
b = clone(a);                 // clone a -> b 
a.foo.bar = 'foo';            // changes not modify 'b'
```

Achieve the same result with [_.deepCopy](https://lodash.com/docs#cloneDeep):

```
const objects = [{ 'a': 1 }, { 'b': 2 }];

const deep = _.cloneDeep(objects);
console.log(deep[0] === objects[0]);
// → false
```

# JSON.parse(JSON.stringify(object))

If you don't have function within your object, a very simple:

```
const cloneOfA = JSON.parse(JSON.stringify(a));
```

This works with for all kinds of objects contain: `object`, `array`, `string`, `boolean`, `numbers`;