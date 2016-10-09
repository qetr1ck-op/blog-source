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
# The Node.js philosophy

Some of these principles arise from the technology itself, some of them are enabled by its ecosystem, some are just trends in community, some directly comes from its creator, another are influenced by the Unix culture.

* Small core
* Small modules
* Small surface area
* Simplicity and pragmatism

# I/O is slow

I/O is definitely the slowest among the fundamental operations of a computer. Accessing to RAM is in the order of nanoseconds, while accessing data on disk the network is in order of milliseconds. For the bandwidth is the same story. RAM has a transfer rate consistently in the order of GB/s, while disk and network varies from MB/s to, optimistically, GB/s.

On the top of that, we also have to consider the human factor. Often input of an application comes from a real person, so the speed or frequency of I/O doesn't only depend on technical aspects.

## Blocking I/O

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

## Non-blocking I/O with "busy-waiting"

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

## Event demultiplexing

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

# The reactor pattern

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

# The non-blocking I/O engine of Node.js-libuv

Each operation system has its own interface for the `event demultiplexer`. Besides that, each I/O operation can behave quite differently depending on type of resource, even within the same OS. All this inconsistencies required a higher abstraction for `event demultiplexer`.

This is exactly why Node.js core created a C library called `libuv` with objective to make Node.js compatible with all the major platform and normalize the non-blocking behavior of the different types of resource.

# The building blocks of Node.js platform

The `reactor pattern` and `libuv` are the basic building blocks but we need the following three other components to build the full platform:

* a set of bindings responsible for wrapping and expose `libuv` and other low-level functionality to Javascript
* `V8` the Javascript engine, this one of the reason why Node.js is so fast and efficient
* a `node-core` that implements the high-level Node.js API

{% image fancybox center images/building-nodejs-blocks.png %}

# Chapter 2: Node.js essential patterns

In this chapter, we'll use two of the most important asynchronous patterns: `callback` and `event-emitter`

# The callback pattern

Callbacks are materialization of the handlers of the `reactor pattern`. Callback is a function that is invoked to propagate the result of an operation and this is exactly what we need when we dealing with asynchronous operation. Another ideal construct for implementing callbacks is `closure`

## The continue-passing style

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

## Asynchronous continue-passing style

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

## Synchronous or asynchronous? 
 
The following is an analysis of these two paradigms and their pitfalls.

### An unpredictable function

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

### Unleashing Zalgo

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

## Using synchronous APIs

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

## Using asynchronous operation with deferred execution

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

## Node.js callback convention

CPS APIs and callbacks follows a set of specific convention.

### Callback come last

In all core Node.js methods, the standard convention is that when a function accept callback as input, this has to be passed as last parameter:

```js
fs.readFile(filename[, options], callback)
```

### Error comes first

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