title: Node.js design pattern book review
date: 2016-10-06 21:11:33
thumbnailImage: "https://www.packtpub.com/sites/default/files/5587OS_5259_Node.js%20Design%20Platforms.jpg"
thumbnailImagePosition: right
categories:
  - Javascript
  - Node.js
tags:
  - Javascript
  - Node.js
  - ...
---

"How could I organize my code?", "What is the best way to design this?", "How can I make my application more modular?", "How do I handle a set of asynchronous call effectively?", "How can I make sure that my application will not collapse while it grows?".

If you have such questions without answers, that book is definitely for you!

The aim of this book is to guide you through this emerging world of patterns, techniques and practices, showing proven solution to the common problem.

<!--more-->
<!--toc-->

# Chapter 1: Welcome to the Node.js platform
## The Node.js philosophy

Some of these principles arise from the technology itself, some of them are enabled by its ecosystem, some are just trends in community, some directly comes from its creator, another are influenced by the Unix culture.

* Small core
* Small modules
* Small surface area
* Simplicity and pragmatism

## I/O is slow

I/O is definitely the slowest among the fundamental operations of a computer. Accessing to RAM is in the order of nanoseconds, while accessing data on disk the network is in order of milliseconds. For the bandwidth is the same story. RAM has a transfer rate consistently in the order of GB/s, while disk and network varies from MB/s to, optimistically, GB/s.

On the top of that, we also have to consider the human factor. Often input of an application comes from a real person, so the speed or frequency of I/O doesn't only depend on technical aspects.

### Blocking I/O

In traditional blocking I/O programming the function call corresponding to an I/O request will block the execution of the thread until the operation completes.

```javascript
// block the thread until the data is available
data = socket.read()
// data is available
print(data)
```

It's trivial to notice how web-server which is using blocking I/O will not be able to handle multiple connection in the same thread. Each operation will block the processing of any other connection:

{% image fancybox center images/blocking-input-output.png %}

The preceding image emphasis on the amount of time each thread is idle, waiting for new data to be received from associated connection. Also we need to consider how much time of I/O can possibly block a request, for example, while interacting with database or with filesystem.

### Non-blocking I/O with "busy-waiting"

In this operation mode, the system call always returns immediately without waiting for data to be read or written. If no result are available at the moment of call, the function will simply return a predefined constant, indicating that there is no data available to return at the moment.

The most basic pattern for accessing this kind of non-blocking I/O is `busy-waiting` - it actively poll the resource within a loop until some actual data is returned.

```javascript
resource = [socketA, socketB, pipeA]

while(!resources.isEmpty()) {
  foreach resource in resources {
    // try to read
    let data = resource.read()

    if (data === NO_DATA_AVAILABLE) {
      // there is no data to read at the moment
      continue
    }
    if (data === RESOUCE_CLOSED) {
      // there was closed, remove it from list
      resources.remove(resource)
    } else {
      // data was received, proceed it
      consumeData(data)
    }
  }
}
```

With this technique it's already possible to achieve handling different resources in the same thread, but still it isn't efficient.

### Event demultiplexing

Luckily, most modern operation systems provide a mechanism to handle concurrent, non-blocking resources in efficient way. It's a `synchronous event demultiplexing` or `event notification interface` - it's collect and queues I/O events that come from set of watched resources, and block until new events are available for process.

```javascript
watchedList.add(socketA, FOR_READ)
watchedList.add(socketB, FOR_READ)
watchedList.add(pipeA, FOR_READ) // [1]

while(events = demultiplexer.watch(watchedList)) { // [2]
  // event loop
  foreach (event in events) { // [3]
    // this read operation won't never block
    // and we will always return data
    data = event.resource.read()
    if (data === RESOUCE_CLOSED) {
      // remove from watched list
      demultiplexer.unwatch(event.resource)
    } else {
      // data was received, proceed it
      consumeData(data)
    }
  }
}
```

1. The resources was added to a data structure, associated with specific operation
2. The event notifier is set up with the group of resources to be watched. This call is synchronous and blocks until any of watched resource is ready for `read` operation. When the resource is ready for an operation the `event demultiplexer` returns from the call new set of events.
3. Each event is proceed. At this point, the resource associated with each event is guaranteed to be ready to processing and not to block during the operation. When all events are processed, the flow will be blocked again on the `event demultiplexer` until new events are again available to be proceed.

> This is called the `event loop`

It's interesting that with this pattern, we can now handle several I/O operation inside a single thread. How web-server will handle multiple requests using synchronous `event demultiplexer` with single thread:

{% image fancybox center images/webserver-event-demultiplexer.png %}

## The reactor pattern

The main idea behind it is to have a handler (which in Node.js is represented by `callback` function) associated with each I/O operation, which will be invoked as soon as an event is produces and processed by `event loop`:

{% image fancybox center images/reactor-pattern.png %}

What's happen when application use the `reactor patter`:

1. The application generates a new I/O operation by submitting a request to `event demultiplexer`. Also application specified a handler, which will be invoked when the operation is completes. Submitting a new request is non-blocking call and it immediately returns control to the application
2. When set of I/O operation completes, the `event demultiplexer` pushes the new events into the `event loop`
3. At this point, `event loop` iterates over the items of the `event queue`
4. For each event, the associated handler is invoked
5. 
  * (a) The handler which is a part of application code, will give control to `event loop` when it's execution completes.
  * (b) However, new asynchronous operation might be requested during the execution of handler, causing new operation to registered in the `event demultiplexer`, before control is given back to `event loop`
6. When all items are processed in `event queue`, the loop will blocked again on `event demultiplexer` which will trigger another cycle of when a new events are available

A Node.js application will exit automatically when there are no more pending operation in `event demultiplexer` and no more events to be processed in `event queue`

> `Pattern Reactor` handles I/O by blocking until new events are available from a set of observable resources and then reacts by dispatching each event with associated handler.

## The non-blocking I/O engine of Node.js-libuv

Each operation system has its own interface for the `event demultiplexer`. Besides that, each I/O operation can behave quite differently depending on type of resource, even within the same OS. All this inconsistencies required a higher abstraction for `event demultiplexer`.

This is exactly why Node.js core created a C library called `libuv` with objective to make Node.js compatible with all the major platform and normalize the non-blocking behavior of the different types of resource.

## The building blocks of Node.js platform

The `reactor pattern` and `libuv` are the basic building blocks but we need the following three other components to build the full platform:

* a set of bindings responsible for wrapping and expose `libuv` and other low-level functionality to Javascript
* `V8` the Javascript engine, this one of the reason why Node.js is so fast and efficient
* a `node-core` that implements the high-level Node.js API

{% image fancybox center images/building-nodejs-blocks.png %}

# Chapter 2: Node.js essential patterns

In this chapter, we'll use two of the most important asynchronous patterns: `callback` and `event-emitter`

## The callback pattern

Callbacks are materialization of the handlers of the `reactor pattern`. Callback is a function that is invoked to propagate the result of an operation and this is exactly what we need when we dealing with asynchronous operation. Another ideal construct for implementing callbacks is `closure`

### The continue-passing style

> In Javascript, a callback is a function that is passed as an argument to another function and is invoked with the result when operation is complete.

Meanwhile,

> in function programming, this way of propagating the result is called `continuation-passing style` (CPS)

To clarify the concept lets see a `direct style`:

```javascript
function add(a, b) {
  return a + b;
}
```

The equivalent `continue-passing style` would be as follow:

```javascript
function add(a, b, callback) {
  callback(a + b);
}
```

Since `add()` is a synchronous `CPS` function the result will be:

```javascript
console.log('before');
add(1, 2, result => console.log(`Result ${result}`));
console.log('after');

// before
// Result 3
// after
```

### Asynchronous continue-passing style

Lets consider a case where the `add()` function is asynchronous:

```js
function addAsync(a, b, callback) {
  setTimeout(callback(a + b));
}

console.log('before');
addAsync(1, 2, result => console.log(`Result ${result}`));
console.log('after');

// before
// after
// Result 3
```

Since `setTimeout()` triggers an asynchronous operation, it won't wait for the callback to be executed, but instead, it returns immediately, giving control back to `addAsync()` and then back to its caller. This is crucial and following image shows how it works:

{% image fancybox center images/async-cps-in-action.png %}

The execution will start from the `event loop` so it will have a fresh stack. Thanks to `closure` it's trivial to maintain the context of the caller in asynchronous function.

### Synchronous or asynchronous? 
 
The following is an analysis of these two paradigms and their pitfalls.

#### An unpredictable function

One of the most dangerous situation is to have API that behaves synchronously under certain conditions and asynchronous under others:

```js
const fs = require('fs');
const cache = {};

function inconsistentRead(filename, callback) {
  if (cache[filename]) {
    // invoked synchronously
    callback(cache[filename]);
  } else {
    // async call
    fs.readFile(filename, 'utf8', (err, data) => {
      cache[filename] = data;
      callback(data);
    })
  }
}
```

#### Unleashing Zalgo

Now lets see how to use an unpredictable function, such as to easily break an application:

```js
function createFileReader(filename) {
  const listeners = [];

  incosistentRead(filename, value => {
    listeners.forEach(listener => listener(value));
  })

  return {
    onDateReady: listener => listeners.push(listener)
  }
}
```

When the preceding function is invoked, it creates a new object that acts as notifier, allowing us to set multiple listeners for a file read operation. All listeners will be invoked at once when the read operation completes and the data is available:

```js
const reader1 = createFileReader('data.txt');

reader1.onDateReady(data => {
  console.log(`First data call ready: ${data}`);

  // same time letter we try to read the same file again
  const reader2 = createFileReader('data.txt');

  reader2.onDateReady(data => {
    console.log(`Second data call ready: ${data}`);
  })
})
```

The result output is: 

```js
First data call ready: foo bar here!
```

You can see the callback of the second operation is never invoked. Lets see why:

1. During the creation of `reader1`, our `inconsistentRead()` function behaves asynchronously, because there isn't cached result. Therefore, we have all time in the world to register our listener, as it will invoked later in another cycle of `event loop`, when the read operation is complete.
2. Then the `reader2` is created when requested file is in the cache. In this case the inner call of `inconsistentRead()` will be synchronous. So its call back will be invoked immediately, which mean that listener of `reader2` will be invoked synchronously as well. However, we registering the listeners after creation of `reader2`, so they will never be invoked!

### Using synchronous APIs

One suitable fix for our `inconsistentRead()` function is to make it totally synchronous:

```js
const fs = require('fs');
const cache = {};

function consistentRead(filename) {
  if (cache[filename]) {
    return cache[filename];
  }
  cache[filename] = fs.readFileSync(filename, 'utf8');
  return cache[filename];
}
```

There is no reason for a function to have a continue-passing style it's synchronous. In fact, it's always a best practice to implement synchronous API using a `direct style`.

> Pattern:
> Prefer `direct style` for purely synchronous function

Bear in mind, that changing an API from `CPS` to a `direct style` (from asynchronous to synchronous or vice versa) require a change of style of all code using:

```js
function createFileReader(filename) {
  const listeners = [];
  const fileData = consistentRead(filename)

  return {
    onDateReady: listener => {
      listeners.push(listener);
      listeners.forEach(listener => listener(fileData));
    }
  }
}
```

### Using asynchronous operation with deferred execution

The trick here is to schedule the synchronous callback invocation to be executed "in the future", instead of being run immediately in the same event loop cycle. In Node.js this is possible using `process.nextTick()`, which defers the execution of a function until next the event loop cycle. This function is a very simple, it takes a callback and pushes it to the top of event queue, in front of any pending I/O event, and returns control immediately. So callback will run be invoked as soon as the event loop runs again.

Apply this technique to fix `inconsistentRead()`:

```js
const fs = require('fs');
const cache = {};

function inconsistentRead(filename, callback) {
  if (cache[filename]) {
    // now invoked asynchronously
    process.nextTick(() => callback(cache[filename]));
  } else {
    // async call
    fs.readFile(filename, 'utf8', (err, data) => {
      cache[filename] = data;
      callback(data);
    })
  }
}
```

Now, our function is guaranteed to invoke its callback asynchronous, under any circumstances.

Another API for deferring the execution is `setImmediate()`. While their purposes are very similar, their semantics are quite different. Callback deferred with `process.nextTick()` run before any other I/O event fired, while with `setImmediate()`, the execution is queued behind any I/O event that is already in the queue. Since `process.nextTick()` runs before any already scheduled I/O, it might cause I/O starvation under certain circumstances, for example, a recursive invocation, this can never happen with `setImmediate()`

> Pattern:
> We guarantee that a callback is invoked asynchronously be deferring it execution using `process.nextTick()`

### Node.js callback convention

CPS APIs and callbacks follows a set of specific convention.

#### Callback come last

In all core Node.js methods, the standard convention is that when a function accept callback as input, this has to be passed as last parameter:

```js
fs.readFile(filename[, options], callback)
```

#### Error comes first

In Node.js, any errors produced by a CPS function is always passed as first argument of the callback, and any actual result is passed starting from the second argument. It the operation is succeeds without errors, the first error will be `null` or `undefined`:

```js
fs.readFile('foo.txt', 'utf8', (err, data) => {
  if (err) {
    handleError(err);
  } else {
    handleData(data);
  }
})
```

#### Propagation errors

Propagation errors in synchronous, direct function is done with well-known `throw` statement.

In CPS style however, proper propagation is done by passing the error to the next callback in the chain:

```js
function readJson(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    let parsed;
    if (err) {
      // propagate the error and exit
      return callback(err);
    }

    try {
      parsed = JSON.parse(data);
    } catch(err) {
      // catch parsing error
      return callback(err);
    }

    // no error propagate just data
    callback(null, parsed);
  })
}
```

## The module system and its pattern

Modules are bricks for structuring non-trivial application, but also the main mechanism to enforce hiding information by keeping private all the function and variable that are not explicitly marked to be exported.

### The revealing module pattern

Once of the major problem in Javascript is an absence of namespacing. A popular technique to solve this issue is called `the revealing module pattern`: 

```js
const module = (() => {
  const privateFoo = () => {};
  const privateBar = [];

  const exported = {
    publicFoo: 'dataFoo',
    publicBar: 'dataBar',
  }

  return export
}())
```

We have a private scope and exporting only the parts that are meant to be public. As we'll see at the moment, the idea behind this pattern is used as a base for a Node.js module system.

### Node.js modules explained

CommonJS is a group with the aim to standardize the Javascript ecosystem, and one of their most popular proposal is `CommonJS module system`. Node.js built its module system on the top of this specification, with the addition of some custom extensions.

#### A homemade module loader

To explain how Node.js modules work let's built a similar system from scratch. The code mimics a subset of functionality of original `require`:

```js
function loadModule(filename, module, require) {
  const wrappedSrc = `function(module, module, require) {
    ${fs.readFileSync(filename, 'utf8')}
  }(module, module.exports, require)`;

  eval(wrappedSrc);
}
```

Bear in mind, that this code is only for example, feature such as `eval()` or `vm` [module](https://nodejs.org/api/vm.html) can be easily used in a wrong way or with a wrong input to inject attack. They should be used always with extreme care.

Now implementation of our `require()` function:

```js
function require(moduleName) {
  console.log(`Require invoked for module: ${moduleName}`);
  const id = require.resolve(moduleName); // [1]

  if (require.cache[id]) { // [2]
    return require.cache[id].exports;
  }

  // module metadata
  const module = { // [3]
    exports: {},
    id
  };
  // update the cache
  require.cache[id] = module; // [4]

  // load the module
  loadModule(id, module, require); // [5]

  // return exported variables
  return module.exports; // [6]
}

require.cache = {};
require.resolve = function(moduleName) {
  // resolve a full module id from the moduleName
}
```

What our homemade module system does is explain as follows:

1. Module name is accepted as input, and the very first thing that we do is resolve the full path of module, and receive module `id`. It's implementing by special resolving algorithm of `require.resolve()`
2. If the module has already been loaded it should be available in the cache.
3. If the module hasn't loaded yet, we set up environment for the first load. The property `module.exports` will be used to export public API.
4. The `module` object is cached.
5. The `loadModule()` code reads from its file, and the code is evaluated. We provide the module with `module` object that we just created, and a reference to `require()` function. The module exports its public API by manipulation or replacing the `module.exports` object.
6. Finally the content of `module.exports` is returned from caller.

#### Defining a modules

By looking how us `require()` works be are able to define a module:

```js
// module.js
// load another module-dependency
const dependency = require('./anotherModule');

// private section
function privateFoo() {}

// the exported API
module.exports.run = function publicBar() {
  privateFoo()
}
```

The essential concept to remember that everything in the module is private unless it's assigned to `module.exports`

#### Defining globals 

It's still possible to define a global variable, in fact, module system exposes a special variable `global`, which can be used for this purpose

#### "module.exports" VS "exports"

A common source of confusion is the difference between using `module.exports` and `exports` to expose the public API. The code of our custom `require` function should again clear any doubts.

The variable `exports` is just a reference to initial value of `module.exports`, essentially it's an empty object before the module is loaded. This means that we can only attach new properties referencing by `exports` variable:

```js
exports.hello = () => { console.log('Hello') };
```

Reassigning the `exports` variable doesn't have any sense, because it doesn't change content of `module.exports`. That's how object in Javascript works. The following code therefore is wrong:

```js
exports.hello = () => { console.log('Hello') };
```

If we want to export something other than an object literal, we can reassigning `module.exports` as follow:

```js
module.exports = () => { console.log('Hello') };
```

#### The "require" function is synchronous

We should take into account that our homemade `require` is synchronous. In fact, it returns the module contents using simple direct style therefore no callback is required. This is true for original Node.js `require` function too. As a consequence any assignments to `module.exports` must be synchronous. The following code is incorrect:

```js
setTimeout(() => {
  module.exports = () => {}
}, 100);
```

This is one of the important reasons why Node.js libraries offer synchronous APIs as alternative to asynchronous ones.

#### The resolving algorithm

Node.js solver the `dependency hell` elegantly by loading different version of module depending on where the module is loaded from. As we saw the `resolve()` function takes a module name (`moduleName` in our loader) as input, and it returns the full path of module. This path is used to load its code and to identify the module uniquely.

The resolving algorithm can be divided into the following three major branches:
* file modules
* core modules
* package modules

The resolving algorithm can be be found at [official spec](https://nodejs.org/api/modules.html#modules_all_together).

The `node_modules` directory is where `npm` installs the dependencies of each package. Based on the algorithm, each package can have its own private dependencies. Consider the following structure:

```
myApp
├── foo.js
└── node_modules
    ├── depA
    │   └── index.js
    ├── depB
    │   ├── bar.js
    │   └── node_modules
    │       └── depA
    │           └── index.js
    └── depC
        ├── foobar.js
        └── node_modules
            └── depA
            └── index.js
```

Following rules of resolving algorithm, using `require('depA')` will load a different file depending on the module that requires it:

* Calling `require('depA')` from `/myApp/foo.js` will load `/myApp/node_modules/depA/index.js`
* Calling `require('depA')` from `/myApp/node_modules/depB/bar.js` will load `/myApp/node_modules/depB/node_modules/depA/index.js`
* Calling `require('depA')` from `/myApp/node_modules/depC/foobar.js` will load `/myApp/node_modules/depc/node_modules/depA/index.js`

#### The module cache

Each module is only loaded and evaluated the first time it's required, since any subsequent call of `require()` will return the cached version. Again, it should be clear by looking at the code of homemade `require()` function.

The module cache is exposed via the `require.cache` reference, so it's possible to directly access it if needed.

### Module definition patterns

The module system besides being a mechanism for loading dependencies, is also a tool for defining APIs. To aim is to maximize information hading and API usability, with balancing with other software quality such as `code reuse` and `extensibility`.

#### Named exports

The most basic method for exposing public API is using `named exports`, which consist to assignment all the public values to object referenced by `exports` or `module.exports`. Most of the Node.js core modules use this pattern.

```js
// file logger.js
exports.info = (msg) = {
  console.log(`info: ${msg}`)
};

exports.verbose = (msg) = {
  console.log(`verbose: ${msg}`)
};

// file main.js
const logger = require('./logger');

logger.info('Info massage');
logger.verbose('Verbose massage');
```

#### Exporting a function

One of the most popular module definition pattern consists of reassigning of the whole `module.exports` variable to the function. The main goal to provide a clear entry point for the module, making it simpler to understand and use. It also honors the principle of `small area surface`. This way of defining modules also is known as the `substack pattern`.

```js
// file logger.js
module.exports = (msg) = {
  console.log(`info: ${msg}`)
};
```

A possible extension for this pattern is using the exported function as namespace for other public APIs. This is a very powerful technique, because it still gives clarity of a single entry point.

```js
// the same file logger.js
module.exports.verbose = (msg) = {
  console.log(`verbose: ${msg}`)
};

// file main.js
const logger = require('./logger');

logger('Info massage');
logger.verbose('Verbose massage');
```

> Pattern:
> Substack or Single Responsibility Principle (SRP)
> Expose the main functionality of a module by exporting only one function. Use the exported function as a namespace to expose any auxiliary functionality

#### Exporting a constructor

The difference is with this approach we allow user to create a new instance using the constructor with ability to extend its prototype and forge new classes.

```js
// file logger.js
class Logger {
  constructor(name) {
    this.name = name;
  }

  log(msg) {
    console.log(`[${this.name}] ${msg}`)
  }

  info(msg) {
    console.log(`info: ${msg}`)
  }

  verbose(msg) {
    console.log(`info: ${msg}`)
  }
}

module.exports = Logger;
```

A variation of this pattern consists of applying a security check against invocation that doesn't use `new` directive. This a little trick allows us to use our module as `factory`:

```js
function LoggerFactory(name) {
  if (!this instanceof Logger) {
    return new Logger(name)
  }
  return new Logger(name);
}
```

A much cleaner approach is offered by ES6 `new.targer` which is available starting from Node.js v6. The syntax expose the `new.targer` which is called `meta property`, made available inside all the function, end evaluates to true at runtime if the function was called using the `new` directive.

```js
function LoggerFactory(name) {
  if (!new.target) {
    return new Logger(name);
  }
  return new Logger(name);
}
```

#### Exporting an instance

We can leverage the caching mechanism of `require()` to define stateful instance with a state created from a constructor or factory, shared across different modules:

```js
// file logger.js
class Logger {
  constructor(name) {
    this.name = name;
    this.count = 0;
  }

  log(msg) {
    this.count++;
    console.log(`[${this.name}] ${msg}`)
  }
}

module.exports = new Logger('default');

// file main.js
const logger = require('./logger.js');
logger.log('test the singleton');
```

This is much like a `singleton pattern`, however it doesn't guarantee the uniqueness of the instance across the whole application, as it happens with traditional singleton pattern. When analyzing the resolving algorithm, we have seen in fact, that a module might be installed multiple times inside the dependency tree of an application.

#### Modifying other modules or the global scope

A module can even export nothing. We should not forger that module can modify the global scope and the object in it, including other modules in the cache. In general it's considering as a bad practice.

> Pattern:
> Monkey patching is when module can modify other modules or object in global scope. It change the existing objects at runtime to change or extend their behavior or apply temporary fixes

How we can add a new function to another module:

```js
// file patcher.js
require('./logger').customMessage = () => console.log('this is a new functionality');

// main.js
require('./patcher');

const logger = require('./logger');
logger.customMessage();
```

The technique is dangerous, because it affects the state of entire app.

## The observer pattern

Together with the `reactor`, `callbacks` and `modules`, the `observer pattern` is one of the pillars of the platform and is used by mane Node.js core and user-land modules.

> Pattern Observer:
> Defines an object (subject), which can notify a set of observers (listeners) when change is occur.

The main difference from the callback pattern is that the `subject` can notify multiple observers, while a traditional `CPS` will propagate its result to only one listener, the callback.

### The EventEmitter class

The observer pattern built into core and it's available through the `EventEmitter` class. It allows to register one or multiple function as `listeners`, which will be notified when a particular event type is fired. The following explains the concept:

{% image fancybox center images/event-emitter.png %}

How to require `EventEmitter` from core `events` module:

```js
const EventEmitter = require('events');
const eeInstance = new EventEmitter;
```

The API is in [official Node.js specification](https://nodejs.org/api/events.html#events_class_eventemitter).

We can already see that there is a big difference between a listener and a traditional Node.js callback, in particular, the first argument isn't an error, but any data which is passed to `emit()` at the moment of invocation.

### Creating and using EventEmitter

The following code shows a function that uses `EventEmitter` to notify its subscribers in real time when a particular pattern is found in a list of files:

```js
const EventEmitter = require('events');
const fs = require('fs');

function findPattern(files, regexp) {
  const emitter = new EventEmitter;

  files.forEach(file => {
    fs.readFile(file, 'utf8', (err, content) => {
      let match;

      if (err) {
        emitter.emit('error', err);
      }

      emitter.emit('fileread', file); 

      if (match = content.match(regexp)) {
        match.forEach(elem => emitter.emit('found', file, elem))        
      }
    })
  })

  return emitter;
}
```

Lets see how `findPattern` can be used:

```js
findPattern(
  ['data1.txt', 'data2.txt'],
  /foo \w+/g
)
  .on('fileread', file => console.log(`${file} was read`))
  .on('found', (file, match) => console.log(`matched ${match} in file ${file}`))
  .on('error', err => console.log(`Error: ${err}`))
```

### Extends from EventEmitter class

To demonstrate the pattern lets implement the functionality of the `findPattern()`:

```js
const EventEmitter = require('events');
const fs = require('fs');

class FindPattern extends EventEmitter {
  constructor(regexp) {
    super();
    this.regexp = regexp;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);

    return this;
  }

  find() {
    this.files.forEach(file => {
      fs.readFile(file, 'utf8', (err, content) => {
        let match;

        if (err) {
          this.emit('error', err);
        }

        this.emit('fileread', content); 

        if (match = content.match(this.regexp)) {
          match.forEach(elem => this.emit('found', file, elem); )        
        }
      })
    })
    return this;
  }
}
```

The `FindPattern` prototype extends `EventEmitter`. In this way it becomes a fully-fledged observable class. The usage:

```js
const findPatternObj = new FindPattern(/hello \w+/g);

findPatternObj
  .addFile('data1.txt')
  .addFile('data2.txt')
  .on('fileread', file => console.log(`${file} was read`))
  .on('found', (file, match) => console.log(`matched ${match} in file ${file}`))
  .on('error', err => console.log(`Error: ${err}`))
```

This is a pretty common pattern in the Node.js ecosystem, for example, the `Server` object of the core HTTP module defines methods such as `listen()`, `close()`, `setTimeout()` and internally it inherits from the `EventEmitter` function. It allows to produce events such as `request` when a new connection is received, or `connection` when a new connection is established, or `close` when server is shut down.

### Combining callbacks with EventEmitter

There are also circumstances where `EventEmitter` can be combining with a `callback`. One example of this pattern is offered by the `node-glob` module, which performs a glob-style searching. The function `glob(pattern, [options], callback)` takes a `callback` that is invoked with the list of all files which are matched by the providing pattern. At the same time it returns `EventEmitter` that provides an interface to report over the state of the process:

```js
const glob = require('glob');

glob('*.txt', (err, files) => console.log(`Founded files: ${JSON.stringify(files)}`))
  .on('match', match => console.log(`Matched files: ${match}`))
```

# Chapter 3: Asynchronous control flow patterns with callbacks

One of the common mistake is to fail into the trap of the callback hell and see how the code is growing horizontally rather than vertically, with the nesting which makes even simple routine hard to read and maintain.

In this chapter we we'll see how it's actually possible to tame callbacks and write clean, manageable asynchronous code with the aid of some patterns.

## Creating a simple web spider

To explain the problem we'll create a little CLI application that takes a web URL as input and downloads its contents locally into file.

```js
// file spider.js
const fs = require('fs');
const path = require('path');
const request = require('request'); // HTTP request client
const mkdirp = require('mkdirp'); // Recursively mkdir, like mkdir -p
const chalk = require('chalk'); // Terminal string styling done right.

const utils = require('./utils');

function spider(url, cb) {
  const filePath = utils.urlToFilePath(url);
  const fileName = utils.urlToFileName(url);
  let isFileExists = false;

  fs.stat(filePath, (err, stats) => { // [1]
    if (stats) {
      cb(null, fileName, isFileExists = true);
    } else {
      request(url, (err, response, body) => { // [2]
        if (err) {
          cb(err);
        } else {
          mkdirp(filePath, err => { // [3]
            if (err) {
              cb(err);
            } else {
              fs.writeFile(path.join(filePath, fileName), body, err => { // [3]
                if (err) {
                  cb(err);
                } else {
                  cb(null, fileName, isFileExists);
                }
              })
            }
          })
        }
      })
    }
  })
}

spider(process.argv[2], (err, fileName, fileExists) => {
  if (err) {
    console.log(chalk.red(`Error: ${err}`));
  } else if (fileExists) {
    console.log(chalk.blue(`File: ${fileName} exists`));
  } else {
    console.log(chalk.green(`File: ${fileName} is downloaded`));

  }
})

// file utils.js
/*
* Converts urls to simplified strings
*/
const slugifyUrl = require('slugify-url');

exports.urlToFilePath = urlToFilePath;
exports.urlToFileName = urlToFileName;

function urlToFilePath(url) { // http://example.com/bar
  const slashChar = '/';

  return slugifyUrl(url, { slashChar }); // example.com/bar
}

function urlToFileName(url) { // http://example.com/bar
  const slashChar = '/';
  const parsedUrl = slugifyUrl(url, { slashChar }).split('/');

  return parsedUrl[parsedUrl.length - 1]; // bar
}
```

The preceding functions execute the following tasks:

1. Check if the URL was already downloaded by verifying that corresponding file hasn't already created.
2. If the file is not found, it would download content of provided URL
3. Than it crates recursively directories
4. Finally, it writes the body of HTTP response to file system

## The callback hell

We can surely notice that even though the algorithm was straightforward, the resulting code has several level of indentation and it's very hard to read. Implementing a similar function in `direct style` would more straightforward, and it would be very few chances to make it look so wrong. However, using `CPS` is another story, and making bad use of closure may lead to to incredible bad code.

That's known as `callback hell` or `piramid of domm`. The typical structure of code affected by the problem looks like the following:

```js
asyncFoo(err => {
  asyncBar(err2 => {
    asyncFooBar(err3 => {
      // ...
    })
  })
})
```

Another problem is caused by overlapping of the variable names used in each scope. Some people try to avoid it with variation of variables `error, err, err2`.

Also we should keep in mind that closure can create memory leaks that are not so easy to identify. We shouldn't forget that any context referenced by an active closure is retained from garbage collector.

# Applying the callback discipline

Basic principles that can help to keep the nesting level low and improve the organization of our code in general:

* you must exit as soon as possible. Use `return`, `continue` or `break`, depending on context to immediately exit the current statement
* create a named function for callbacks. Will keep our code shallow and better look for stack trace
* modularize the code. Create a small, reusable function whenever it's possible

After applying the following recommendation our `spider()` would look as following:

```js
function spider(url, cb) {
  const filePath = utils.urlToFilePath(url);
  const fileName = utils.urlToFileName(url);
  let isFileExists = false;

  fs.stat(filePath, (err, stats) => {
    if (stats) {
      return cb(null, fileName, isFileExists = true); // [!]
    }
    download(url, filePath, fileName, isFileExists, cb);
  })
}

function download(url, filePath, fileName, isFileExists, cb) {
  request(url, (err, response, body) => {
    if (err) {
      return cb(err); // [!]
    } else {
      saveFile(filePath, fileName, body, isFileExists, cb); // [!]
    }
  })
}

function saveFile(filePath, fileName, content, isFileExists, cb) {
  mkdirp(filePath, err => {
    if (err) {
      return cb(err); // [!]
    } else {
      writeContent(filePath, fileName, content, isFileExists, cb);
    }
  })
}

function writeContent(filePath, fileName, content, isFileExists, cb) {
  fs.writeFile(path.join(filePath, fileName), content, err => {
    if (err) {
      return cb(err); // [!]
    } else {
      return cb(null, fileName, isFileExists); // [!]
    }
  })
}
```

## Sequential execution
 
Executing a set of task in sequence means running them one at time, one ofter other. The order of execution matters. The concept:

{% image fancybox center images/sequential-execution.png %}

There are different variation of this flow:

* `execution a set of known task in sequence`, without chaining and propagate the result
* using output of task as the input to the next task, also known as `chain`, `pipe`, or `waterfall`
* iterating over a collection while running an asynchronous task on each element, one ofter other

### Execution a set of known task in sequence

We've already met a sequential execution while implementing the `spider()` function. Taking that code as guideline we can generalize the solution into the following pattern:

```js
function task1(cb) {
  asyncOperation(() => task2(cb))
}

function task2(cb) {
  asyncOperation(() => task3(cb))
}

function task3(cb) {
  asyncOperation(() => cb()) // finally executes the callback
}

function asyncOperation(cb) { // emulates asynchronous operation
  setTimeout(() => cb());
}

task1(() => console.log('task 1, 2 and 3 executed'));
```
### Sequential iteration with crawling of links

What if we want to invoke an asynchronous operation for each file in a collection?

With new feature, downloading all the links contained in the web-page recursively. To do that, we are going to extract all links from the page and than trigger our web spider on each of them recursively and in sequence.

The new version of `spider()` is as following:

```js
function spider(url, nesting, callback) {
  const filename = utilities.urlToFilename(url);
  fs.readFile(filename, 'utf8', (err, body) => {
    if(err) {
      if(err.code ! == 'ENOENT') {
        return callback(err);
      } 
      return download(url, filename, (err, body) => {
        if(err) {
          return callback(err);
        }
        spiderLinks(url, body, nesting, callback);
      });
    }

    spiderLinks(url, body, nesting, callback);
  });
}

function spiderLink(url, body, nesting, cb) {
  if (nesting === 0) {
    return process.nextTick(cb);
  }
  // require('get-urls')
  const links = utils.getUrls(body); // [1]

  function iterate(index) { // [2]
    if (index === links.length) {
      return cb();
    }

    spider(links[index], nesting - 1, err => { // [3]
      if (err) {
        return cb(err);
      }
      iterate(index - 1);
    })
  }
  iterate(0); // [4]
}
```

The important steps to understand:

1. Obtain the list of all links on the page using the `utils.getUrls()`. This links should return only with the same hostname
2. Iterate through links via local function `iterate()`. The first thing it checks if the `index` is equal to the length of `links`, in which case it immediately invokes the `cb()` as it means it proceeds all items
3. At this point everything is ready to processing the links. It invokes the `spider()` function by decreasing the nesting level and invoking the next step of iteration then the operation is complete
4. It's a bootstrapping the iteration by `iterate(0)`

### The pattern "sequential iteration" 

It can be generalize as follow:

```js
function iterate(index) {
  if (index === tasks.length) {
    return finish();
  }

  const task = tasks[index];
  task(function() {
    iterate(index + 1);
  })
}

function finish() {
  // iteration completed
}

iterate(0);
```

It's important to notice that these type of algorithm become really recursive if `task()` is an asynchronous operation. In such a case there might be a risk of hitting the maximum call stack limit.

> Pattern sequential iterator:
> execute a list of tasks in sequence by creating a function `iterate()` which invokes the next available task in the collection and makes sure to invoke next step of iteration when the current task is completed

## Parallel execution 

There is some situation when the order of execution of the set of asynchronous tasks is not important and we want just to be notified when all these running tasks are completed.

{% image fancybox center images/parallel-execution.png %}
# 
We realize that even thought we have one thread we can still achieve `concurrency`, thanks to not-blocking nature of Node.js. In fact, the word `parallel` is used improperly in this case, as it doesn't mean that the task run simultaneously, but rather their execution is carried out by an underlying non-blocking API and invoked by the event loop.

As we know, a task gives control back to the event loop when it request a new asynchronous operation, allowing the event loop to execute another task. The proper word is to use for this kind of flow is `concurrency`, but we still use parallel for simplicity sake.

The following diagram shows how two asynchronous tasks can run in parallel in a Node.js program:

{% image fancybox center images/parallel-execution-diagram.png %}

We have `Main` function that executes two asynchronous tasks:

1. The `Main` function triggers the execution of `Task1` and `Task2`. As they are asynchronous operations the immediately return control to `Main`, which then returns to `event loop`
2. When the asynchronous operation of `Task1` is completed, the `event loop` gives control to it. When `task1` completes the internal synchronous operation processing as well, it notifies the `Main`
3. The same as described in p2 but now with `event loop` triggers the `Task2`. At this point `Main` function knows that `Task1` and `Task2` are completed, so it can continue the execution or return the result of the operation to another callback.

### Execution with "spiderLinks"

So far application is executing the recursive download of the linked pages in a sequential fashion. We can easily improve performance of this process by downloading all the linked pages in parallel:

```js
function spiderLink(url, body, nesting, cb) {
  if (nesting === 0) {
    return process.nextTick(cb);
  }
  const links = utils.getUrls(body);

  if (links.length === 0) {
    return process.nextTick(cb)
  }

  let completed = 0;
  let hasErrors = false;

  function done(err) {
    if (err) {
      hasErrors = true;
      return cb(err);
    }
    if (++completed === links.length && !hasErrors) {
      return cb()
    }
  }

  links.forEach(link => {
    spider(link, nesting - 1, done);
  })
}
```

The trick to make our application to wait for all the task to complete is to invoke the `spider()` with a special callback `done()`. The `done()` increases a counter when a `spider()` task completes. When the number of completed downloads reaches the size of `links[]`, the final callback is invoked.

### The pattern "unlimited parallel execution"

We can represent a generic version of the pattern:

```js
const tasks = [ /*...*/ ];
let completed = 0;

tasks.forEach(task => {
  task(() => {
    if (++competed === tasks.length) {
      finish();  
    }
  })
})

function finish() {
  // all tasks are completed
}

```

> Pattern unlimited parallel execution
> Run a set of asynchronous tasks in parallel by spawning them all at once, and then waiting for all of them to complete by counting the number of the times their callback are invoked

### Limited parallel execution