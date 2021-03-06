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
3. Then it creates recursively directories
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

## Applying the callback discipline

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

We realize that even thought we have one thread we can still achieve `concurrency`, thanks to not-blocking nature of Node.js. In fact, the word `parallel` is used improperly in this case, as it doesn't mean that the task run simultaneously, but rather their execution is carried out by an underlying non-blocking API and invoked by the event loop.

As we know, a task gives control back to the event loop when it request a new asynchronous operation, allowing the event loop to execute another task. The proper word is to use for this kind of flow is `concurrency`, but we still use parallel for simplicity sake.

[Concurrency vs Parallelism](http://stackoverflow.com/questions/1050222/concurrency-vs-parallelism-what-is-the-difference)

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

Imagine having thousands of files to read, URLs to access, or DB queries run in parallel. A common problem in such situation is running out of memory. In all such situation its a good idea to limit the number of tasks that can run in the same time. The following diagram show a situation where we have five tasks that run in parallel with an concurrency limit of 2:

{% image fancybox center images/concurency-limit.png %}

The algorithm to execute a set of given tasks in parallel with limited concurrency:

```js
const tasks = [ /*...*/ ];
let concurrency = 0;
let running = 0;
let completed = 0;
let index = 0;

function next() {
  while(running < concurrency && index < tasks.length) {
    const task = tasks[index];

    running++;
    task(() => {
      if (completed === tasks.length) {
        return finish();
      }
      completed++;
      running--;
      next();
    })
  }
}

next();

function finish() {
  // all tasks are completed
}

```

### "TaskQueue" to rescue

We are now going to implement a simple class which will combine a queue algorithm we presented before:

```js
class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  pushTask(taks) {
    this.queue.push(task);
    this.next();
  }

  next() {
    while(this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();

      this.running++;
      task(() => {
        this.running--;
        this.next();
      })
    }
  }
}
```

Now we can update our `spiderLink()` to execute tasks in a limited parallel flow:

```js
const TaskQueue = require('./task-queue');
const downloadQueue = new TaskQueue(2);

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

  links.forEach(link => {
    downloadQueue.pushTask(done => {
      spider(link, nesting - 1, done);
    })
  })
}
```

# Chapter 4: Asynchronous Control Flow with ES6 and beyond

We are going to explore some of the most famous alternatives, `promises`, `generators` and an innovative syntax of ES7 the `async await`.

Historically, there have been many different implementation of promise libraries, and most of them aren't compatible between each other. The JS community worked hard to sort out this limitation and these efforts leads to creation of `Promise/A+` spec.

The several poplar libraries which implement the `Promise/A+` spec:

* Bluebird
* Q
* RSVP
* When.js
* ES6 promises

## ES6 Promises techniques
### Promisifying a Node.js style function

In JS not all the asynchronous functions and libraries support promises out-of-box. We can convert a typical callback-based function into one that returns a promise, this process is also known as `promisification`:

```js
module.exports.promisify = function(fn) {
  return function promisified(...callArgs) {
    return new Promise((resolve, reject) => { //[1]
      callArgs.push((err, result, ...restResults) => { //[2]
        if (err) {
          return reject(err); //[3]
        }
        console.log(callArgs)
        if (callArgs.length <= 2) { //[4]
          resolve(result);
        } else {
          resolve([result, ...restResults]);
        }
      });

      // the same as fn.apply(null, callArgs)
      fn(...callArgs); //[5]
    });
  }
};
```

This is how it works:

1. The `promisified()` creates a new promise using `Promise` constructor and immediately return it to caller
2. We make sure to pass a special callback to `fn()`. As we know that the callback always comes last, we append it to the arguments (`args`) provided to the `promisified()`
3. In the special callback if we receive an error we immediately reject an error
4. If no error, we resolve the promise with a value or an array of values, depending how many results are passing to callback
5. Finally, we simply invoke the `fs()` with the list of arguments we have built

Another approach is to use one of the ready-production npm packages, for example [tini-promisify](https://www.npmjs.com/package/tiny-promisify)

### Sequential execution 

We are now ready to convert our web spider application to use promises:

```js
const utilities = require('utilities');
const promisify = utilities.promisify;

// const fs = require(fs);
const request = promisify(require('request'));
const makedirp = promisify(require('makedirp'));
const readFile = promisify(require(fs.readFile));
const writeFile = promisify(require(fs.writeFile));

function spider(url, nesting) {
  const filePath = utils.urlToFilePath(url);
  const fileName = utils.urlToFileName(url);

  return readFile(path.join(filePath, fileName), 'utf8')
    .then(body => spiderLink(url, body, nesting))
    .catch((err) => {
      if (err) {
        if (err.code === 'ENOENT') { 
          return download(url, fileName);
        }
      }
    })
    .then(body => {
      spiderLink(url, body, nesting)
    })
}

function download(url, filename) {
  let body = body;

  return request(url)
    .then(resp => {
      body = resp.body;
      return mkdirp(path.dirname(url));
    })
    .then(() => writeFile(filename, body))
    .then(() => {
      console.log(`Download and saved ${fileName} from ${url}`);
      return body;
    })
}
```

Also we modify its invocation as follow:

```js
spider(url, 5)
  .then(() => console.log(chalk.green(`Download and saved from ${url}`)))
  .catch((err) => console.log(chalk.red(`Error: ${err}`)));
```

If we look again at code we have written so far, we would be pleasantly surprised by the fact that we haven't include any error propagation logic, as we would be forced to do with callbacks. This is clearly a huge advantage, as it reduced boilerplate in our code.

### Sequential iteration 

So far it was shown how simple and elegant is to implement sequential execution flow using promises. However code involves only the `execution of a well known set of asynchronous operation`. So, we missing peace that will complete our exploration of sequential execution flow with implementation of `asynchronous iteration` using promises

```js
function spiderLink(url, body, nesting) {
  const links = utils.getUrls(body);
  let promise = Promise.resolve();
  
  if (nesting === 0) {
    return promise;
  }

  links.forEach(link => {
    promise = promise.then(() => spider(link, nesting--;))
  })

  return promise;
}
```

To iterate asynchronously over links we had dynamically build a chain of promises:

1. Starting with an "empty" promise, resolving to `undefined`. This is a starting point to build our chain
2. Then, in the loop, we're updating the `promise` variable with a new promise which is invoked from `then()` on the previous promise in the chain. This is actually our asynchronous iteration pattern using promises.

Let's extract a pattern for a sequential execution using promises:

```js
const tasks = [/*...*/];
let promise = Promise.resolve();

tasks.forEach(task => {
  promise = promise.then(() => task());
})

// an alternative with "reduce()"
/*
tasks.reduce((prev, task) => {
  return prev.then(() => task());
}, Promise.resolve())
*/

promise.then(() => /*all task are completed*/)
```

> The pattern: sequential iteration with promises
> Dynamically builds a chain of promises in a loop

### Parallel execution

Another execution flow is become trivial with promises is the parallel execution flow using `Promise.all()`. This static method creates promise which fulfills only when all the promises received as input are fulfilled:

```js
function spiderLink(url, body, nesting) {
  const links = utils.getUrls(body);
  
  if (nesting === 0) {
    Promise.resolve()
  }

  let promises = links.map(link => spider(link, --nesting));

  return Promise.all(promises);
}
```

#### Limited parallel execution

In fact, the pattern we've implemented in `TaskQueue` class can be easily adapted to support tasks that return a promise. This can be achieve by modifying `next()`:

```js
next() {
  while(this.running < this.concurrency && this.queue.length) {
    const task = this.queue.shift();

    this.running++;
    
    task().then(() => {
      completed++;
      running--;
      this.next();
    })
  }
}
```

Then we can modify the `spideLinks()` to achieve limit of concurrency:

```js
const TaskQueue = require('./task-queue');
const downloadQueue = new TaskQueue(2);

function spiderLink(url, body, nesting) {
  if (nesting === 0 || links.length === 0) {
    return Promise.resolve;
  }
  const links = utils.getUrls(body);

  let completed = 0;
  let hasErrors = false;

  return Promise((resolve, reject) => {
    let completed = 0;
    let error = false;

    links.forEach(link => {
      let task = () => {
        return spider(link, --nesting)
          .then(() => {
            if (++completed === links.length) {
              resolve()
            }
          })
          .catch((err) => {
            if (!error) {
              error = true;
              reject();
            }
          })
      };
      downloadQueue.pushTask(task)
    })
  })
}
```

#### Exposing callbacks and promises in public APIs

Now let's imagine that we want to build a public library that performs asynchronous operations. Do we need to create CPS API or a promise-oriented one?

The first approach is used by popular libraries such as `request`, `redis` and `mysql`, consists of offering a simply API that is only based on callbacks and leaves the developer the option to promisify the exposed functionality of needed. Some of these libraries provides helpers to achieve a such behavior.

The second approach is more transparent. It offers the developers a callback-oriented API, but it makes the callback argument optional. When the callback is not passed, the function will immediately return a `Promise` object. This approach gives possibility to choose at call time what interface to adopt, without any needs to promisify the functionality in advance. Many libraries, such as `mongoose` or `sequelize`, support this approach.

A dummy module that executes division asynchronously:

```js
//divider.js
module.exports = (divident, divisor, cb) {
  return new Promise(resolve, reject) => {
    process.nextTich(() => {
      const result = divident / divisor;

      if (!Number.isInteger(result)) {
        const err = new Error('Invalid operands');

        if (cb) return cb(err);
        reject(err);
      }
      if (cb) return cb(null, result);
      resolve(result);
    })
  }
}

//main.js
const divider = require('./divider')
divider(10, 0, (err, res) => {
  if (err) return console.error(err);

  console.log(res);
});

divider(10, 2)
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

## Generators

In fact, in a normal function we can only have one entry point which corresponds to the invocation of function itself. A generator is similar to a function, but in addition, it can be suspended (using the `yield` statement) and then resumed at a later time.

### Asynchronous control flow with generators

To demonstrate how generator will help us with this by creating a special function that accepts a generator as an argument and allows us to use asynchronous code inside the generator. The function take care to resume the execution of the generator when the asynchronous operation is complete:

```js
function asyncFlow(generatorFn) {
  const generator = generatorFn(cb);
  generator.next();

  // special callback to resume/stop the generator
  // resume by passing back the result receiving in the cb function
  function cb(err, ...result) {
    if (err) {
      return generator.throw(err);
    }

    generator.next(result);
  }
}
```

To demonstrate the power of this simple function with new module:

```js
// clone.js
const fs = require('fs');
const path = require('path');

asyncFlow(function* (cb) {
  const filename = path.basename(__filename);
  const content = yield fs.readFile(filename, 'utf8', cb);

  yield fs.writeFile(`clone_of_${filename}`, content, cb);
  console.log('clone created');
})
```

Remarkable with help of `asyncFlow()` we were able to write asynchronous code using the linear approach, as we using blocking function! The callback passed to each asynchronous function will in turn resume the generator as soon as a asynchronous operation is complete.

There are two other variation of these technique, one involves to use `promises` and other use `thunks`.

A `thunk` used in the generator based control flow it's just a function which partially applies all the arguments of original function except its callback. An example of thunkified version of `fs.readFile()`:

```js
function readFileThunk(filename, options) {
  return function(cb) {
    fs.readFile(filename, options, cb);
  }
}
```

Both promises and thunks allow us to create generators that do not need a callback argument. Thunkfied version of `asynkFlow()`:

```js
const fs = require('fs');
const path = require('path');

asyncFlowWithThunks(function* () {
  const filename = path.basename(__filename);
  const content = yield readFileThunk(filename, 'utf8');

  yield writeFileThunk(`clone_of_${filename}`, content);
  console.log('clone created');
})

function readFileThunk(filename, options) {
  return function(cb) {
    fs.readFile(filename, options, cb);
  }
}

function writeFileThunk(filename, constent) {
  return function(cb) {
    fs.writeFile(filename, constent, cb);
  }
}


function asyncFlow(generatorFn) {
  const generator = generatorFn();
  const thunk = generator.next().value;
  thunk && thunk(cb);
  
  function cb(err, ...result) {
    let thunk;

    if (err) {
      return generator.throw(err);
    }

    thunk = generator.next(result).value;
    thunk && thunk(cb);
  }
}
```

In the same way we could implement a version with promises:

```js
const fs = require('fs');
const path = require('path');

asyncFlowWithPromises(function* () {
  const filename = path.basename(__filename);
  const content = yield readFilePromise(filename, 'utf8');

  yield writeFilePromise(`clone_of_${filename}`, content);
  console.log('clone created');
})

function readFilePromise(filename, options) {
  const readFile = promisify(fs.readFile);
  return (cb) => {
    fs.readFile(filename, options, cb);
  };
}

function writeFilePromise(filename, content) {
  const readFile = promisify(fs.writeFile);
  return (cb) => {
    fs.writeFile(filename, content, cb);
  };
}

function promisify(fn) {
  return function promisified(...callArgs) {
    return new Promise((resolve, reject) => { 
      callArgs.push((err, result, ...restResults) => { 
        if (err) {
          return reject(err); 
        }
        console.log(callArgs)
        if (callArgs.length <= 2) { 
          resolve(result);
        } else {
          resolve([result, ...restResults]);
        }
      });
      
      fn(...callArgs); 
    });
  }
}

function asyncFlow(generatorFn) {
  const generator = generatorFn();
  const thunk = generator.next().value;
  thunk && thunk(cb);
  
  function cb(err, ...result) {
    let thunk;

    if (err) {
      return generator.throw(err);
    }

    thunk = generator.next(result).value;
    thunk && thunk(cb);
  }
}
```

Generator based control flow using "co"

In this section we chose to use [co](https://www.npmjs.com/package/co). It supports several types of yieldables:

* thunks
* promises
* array (parallel execution)
* object (parallel execution)
* generators (delegation)
* generator function (delegation)

To convert Node.js style function to thunks, we are going to library [thunkify](https://www.npmjs.com/package/thunkify)

### Sequential execution

Load and convert all dependencies:

```js
// spider.js
const thunkify = require('thunkify');
const co = require('co');
const path = require('path');

const request = thunkify(require('request'));
const fs = require('fs');
const mkdirp = thunkify(require('mkdirp'));
const readFile = thunkify(fs.readFile);
const writeFile = thunkify(fs.writeFile);
const nextTick = thunkify(process.nextTick);
```

Is interesting to point out if we decided to use the promisified version of our function instead of their thunkified alternatives, so code would be remain exactly the same, thanks to the fact that `co` supports both promises and thunks yiedlable objects.

Now implementation of `download()` and `spider()` becomes trivial:

```js
function* download(url, filename) {
  console.log(`download ${url}`);
  const response = yield request(url);
  const body = response[1];

  yield mkdirp(path.dirname(filename));
  yield writeFile(filename, body);
  console.log(`downloaded and saved file ${filename}`);

  return body;
}

function* spider(url, nesting) {
  const filename = utilities.urlToFilename(url);
  let body;

  try {
    body = yield readFile(url, 'utf8');
  } catch(e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
    body = yield download(url, filename);
  }
  yield spiderLink(url, body, nesting);
}
```

The interesting detail to notice that we're able to use a `try...catch` and propagate error with `throw`! Another remarkable line is where we use `yield download()` which is not a promise nor a thunk, but just another generator. This is possible thanks to `co`.

Converting `spiderLinks()` becomes trivial as well:

```js
function spiderLinks(url, body, nesting) {
  if (nesting === 0) {
    return nextTick();
  }

  const links = utilities.getPageLinks(body);
  links.forEach(link => {
    yield spider(link, nesting - 1);
  })
}
```

The is no pattern to show for sequential iteration, generators and `co` are doing the all dirty work for us, so we're able to write asynchronous iteration as we were using blocking, direct APIs.

Now an important entry point:

```js
co(function* () {
  const nesting = 1;
  try {
    yield spider(process.argv[2], nesting);
  } catch(e) {
    console.log(e);
  }
})
```

The whole implementation: 

```js
const thunkify = require('thunkify');
const co = require('co');
const path = require('path');

const request = thunkify(require('request'));
const fs = require('fs');
const mkdirp = thunkify(require('mkdirp'));
const readFile = thunkify(fs.readFile);
const writeFile = thunkify(fs.writeFile);
const nextTick = thunkify(process.nextTick);

const utilities = require('./utils');

co(function* () {
  const nesting = 1;
  try {
    yield spider(process.argv[2], nesting);
  } catch(e) {
    console.log(e);
  }
})

function* download(url, filename) {
  console.log(`download ${url}`);
  const response = yield request(url);
  const body = response[1];

  yield mkdirp(path.dirname(filename));
  yield writeFile(filename, body);
  console.log(`downloaded and saved file ${filename}`);

  return body;
}

function* spider(url, nesting) {
  const filename = utilities.urlToFileName(url);
  let body;

  try {
    body = yield readFile(filename, 'utf8');
  } catch(e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
    body = yield download(url, filename);
  }
  yield spiderLinks(filename, body, nesting);
}

function* spiderLinks(url, body, nesting) {
  if (nesting === 0) {
    return nextTick();
  }

  const links = utilities.getUrls(body);

  for (var i = 0; i < links.length; i++) {
    yield spider(links[i], nesting - 1);
  }
}
```

### Parallel execution

The bad news about generators is that they are good to write sequential algorithm, they can't be used to parallelize the execution of set of tasks.

Luckily, for the specific case of the unlimited parallel execution, `co` already allows us to obtain it natively by simpling yielding an array of promises, thunks, etc.

```js
function* spiderLinks(url, body, nesting) {
  if (nesting === 0) {
    return nextTick();
  }

  const links = utilities.getUrls(body);
  const tasks = links.map(link => spider(link, nesting - 1));
  yield tasks;
}
```

What we just did was just to collect all the download tasks, which are essentially generators, and then yield on the resulting array. All these task will be executed by `co` in parallel and then execution will be resumed when all tasks finish running.

### Limited parallel execution

The main straightforward approach for me is to use [co-limiter](https://www.npmjs.com/package/co-limiter)

```js
const co = require('co');
const wait = require('co-wait');
const limiter = require('co-limiter');

const limit = limiter(2);

const job = function *() {
  console.log('Doing something...');
  yield wait(1000);
}

for (let i = 0; i < 10; i++) {
  co(function *() {
    yield limit(job());
  })();
}
```

## "async...await" with Babel

Preparation:

```bash
# install babel cli
$ npm install -D babel-cli
# extension to support "async...await" parsing
$ npm install -D babel-plugin-syntax-async-functions
babel-plugin-transform-async-to-generator
# run the example
$ node_modules\.bin\babel-node --plugins
"syntax-async-functions,transform-async-to-generator" index.js
```

The problem is that generator function are designed to deal mostly as iterators and their usage with asynchronous operations feel a bit cumbersome. It might be hard to understand, leading to code that hard to read and maintain.

The `async` function specification aims to dramatically improve the language model for waiting asynchronous code by introducing `async` and `await` directives:

```js
const promisify = require('tiny-promisify');
const request = promisify(require('request'));

function getPage(url) {
  return request(url).then(res => {
    return res.body;
  });
}

async function main() {
  const html = await getPage('http://example.com');
  console.log(html);
}
main();

console.log('loading...');
```

## Comparison Table

* Plain JS
  - Pros:
    + Does not require any additional libraries or technology
    + Offer the best performance
    + Provides the best compatibility with 3-th party libraries
    + Allows creation of ad hoc and more advanced algorithms
  - Cons:
    + Require extra code and relatively complex algorithms
* Promises
  - Pros:
    + Simplify the most common control flow patters
    + Robust error handling
    + Part of ES6 spec
  - Cons:
    + Require promisify callback-based APIs
    + A small performance hit
* Generators:
  - Pros:
    + Makes non-blocking code looks like a blocking one
    + Simplify error handling
    + Part of ES6 spec
  - Cons:
    + Require a complementary control flow library
    + Require callback or promises to implement non-sequential flows
    + Require thunkify or promisify nongenerator-based APIs
* Async await
  - Pros:
    + Makes a non-blocking code looks like blocking
    + Clean and intuitive syntax
    + Future part of spec
  - Cons:
    + Not yet a standard
    + Require transpilers such as Babel
  - 