title: 'Huston, do we have a problem with promises?'
thumbnailImage: title.jpg
thumbnailImagePosition: right
date: 2015-02-02 20:13:01
categories:
	- Javascript
	- Web Api
tags:
	- Promise
---

Many of us are using promises without really understanding them.

<!--more-->

<!--toc-->

# Wherefore promises?

If you read the literature on promises, you'll often find references to the *pyramid of doom*, with some horrible callback-y code that steadily stretches toward the right side of the screen.

The whole point of promises is to give us back the language fundamentals we lost when we went async: `return`, `throw`, and the `stack`. But you have to know how to use promises correctly in order to take advantage of them.

# Rookie mistakes

I'm only going to talk about the official spec, as exposed in modern browsers as `window.Promise`. Not all browsers have `window.Promise` though, so for a good *polyfill*, check out the cheekily-named [Lie](https://github.com/calvinmetcalf/lie), which is about the smallest spec-compliant library out there.

# Rookie mistake #1: the promisey pyramid of doom

The most common bad practice is this one:
```
remotedb.allDocs({
  include_docs: true,
  attachments: true
}).then(function (result) {
  var docs = result.rows;
  docs.forEach(function(element) {
    localdb.put(element.doc).then(function(response) {
      alert("Pulled doc with id " + element.doc._id + " and added to local db.");
    }).catch(function (err) {
      if (err.status == 409) {
        localdb.get(element.doc._id).then(function (resp) {
          localdb.remove(resp._id, resp._rev).then(function (resp) {
// et cetera...
```

Yes, it turns out you can use promises as if they were *callbacks*, and yes, it's a lot like using a power sander to file your nails, but you can do it.

A better style is this one:

```
remotedb.allDocs(...).then(function (resultOfAllDocs) {
  return localdb.put(...);
}).then(function (resultOfPut) {
  return localdb.get(...);
}).then(function (resultOfGet) {
  return localdb.put(...);
}).catch(function (err) {
  console.log(err);
});
```

This is called composing promises, and it's one of the great superpowers of promises. Each function will only be called when the previous promise has resolved, and it'll be called with that promise's output. More on that later.

# Rookie mistake #2: WTF, how do I use forEach() with promises?

This is where most people's understanding of promises starts to break down. As soon as they reach for their familiar `forEach()` loop (or `for` loop, or `while` loop), they have no idea how to make it work with promises. So they write something like this:

```
// I want to remove() all docs
db.allDocs({include_docs: true}).then(function (result) {
  result.rows.forEach(function (row) {
    db.remove(row.doc);  
  });
}).then(function () {
  // I naively believe all docs have been removed() now!
});
```

What's the problem with this code? The problem is that the first function is actually returning `undefined`, meaning that the second function isn't waiting for `db.remove()` to be called on all the documents. In fact, *it isn't waiting on anything*, and can execute when any number of docs have been removed!

The *TLDR* of all this is that `forEach()`/`for`/`while` are not the constructs you're looking for. You want `Promise.all()`:

```
db.allDocs({include_docs: true}).then(function (result) {
  return Promise.all(result.rows.map(function (row) {
    return db.remove(row.doc);
  }));
}).then(function (arrayOfResults) {
  // All docs have really been removed() now!
});
```

What's going on here? Basically `Promise.all()` takes an array of promises as input, and then it gives you another promise that only resolves when every one of those other promises has resolved. It is the asynchronous equivalent of a `for-loop`.

# Rookie mistake #3: forgetting to add .catch()

Many developers forget to add a `.catch()` anywhere in their code. Unfortunately this means that any thrown errors will be swallowed, and you won't even see them in your console. This can be a real pain to debug.

```
somePromise().then(function () {
  return anotherPromise();
}).then(function () {
  return yetAnotherPromise();
}).catch(console.log.bind(console)); // <-- this is badass
```

# Rookie mistake #4: using "deferred"

If you are writing that word in your code you are doing something wrong. Here's how to avoid it.

First off, most promise libraries give you a way to *import* promises from third-party libraries. For instance, Angular's `$q` module allows you to wrap non-$q promises using `$q.when()`. So Angular users can wrap PouchDB promises this way:

```
$q.when(db.put(doc)).then(/* ... */); // <-- this is all the code you need
```

Another strategy is to use the revealing constructor pattern, which is useful for wrapping *non-promise APIs*. For instance, to wrap a callback-based API like Node's `fs.readFile()`, you can simply do:

```
new Promise(function (resolve, reject) {
  fs.readFile('myfile.txt', function (err, file) {
    if (err) {
      return reject(err);
    }
    resolve(file);
  });
}).then(/* ... */)
```

# Rookie mistake #5: using side effects instead of returning

What's wrong with this code?

```
somePromise().then(function () {
  someOtherPromise();
}).then(function () {
  // Gee, I hope someOtherPromise() has resolved!
  // Spoiler alert: it hasn't.
});
```

Seriously, this is the *one weird trick* that, once you understand it, will prevent all of the errors I've been talking about. 

As I said before, the magic of promises is that they give us back our precious `return` and `throw`. But what does this actually look like in practice?

What can we do here? There are three things:

1.`return` another promise
2.`return` a synchronous value (or `undefined`)
3.`throw` a synchronous error

## Return another promise

This is a common pattern you see in the promise literature, as in the *composing promises* example above:

```
getUserByName('nolan').then(function (user) {
  return getUserAccountById(user.id);
}).then(function (userAccount) {
  // I got a user account!
});
```

Notice that I'm returning the second promise – that `return` is crucial. If I didn't say return, then the `getUserAccountById()` would actually be a *side effect*, and the next function would receive `undefined` instead of the `userAccount`.

## Return a synchronous value (or undefined)

Returning `undefined` is often a mistake, but returning a *synchronous value* is actually an awesome way to convert synchronous code into promisey code. For instance, let's say we have an in-memory cache of users. We can do:

```
getUserByName('nolan').then(function (user) {
  if (inMemoryCache[user.id]) {
    return inMemoryCache[user.id];    // returning a synchronous value!
  }
  return getUserAccountById(user.id); // returning a promise!
}).then(function (userAccount) {
  // I got a user account!
});
```

For this reason, I make it a personal habit to always return or throw from inside a `then()` function. I'd recommend you do the same.

## Throw a synchronous error

Let's say we want to throw a synchronous error in case the user is logged out. It's quite easy:

```
getUserByName('nolan').then(function (user) {
  if (user.isLoggedOut()) {
    throw new Error('user logged out!'); // throwing a synchronous error!
  }
  if (inMemoryCache[user.id]) {
    return inMemoryCache[user.id];       // returning a synchronous value!
  }
  return getUserAccountById(user.id);    // returning a promise!
}).then(function (userAccount) {
  // I got a user account!
}).catch(function (err) {
  // Boo, I got an error!
});
```

# Advanced mistake #1: don't know about Promise.resolve

As I showed above, promises are very useful for wrapping synchronous code as asynchronous code. However, if you find yourself typing this a lot:

```
new Promise(function (resolve, reject) {
  resolve(someSynchronousValue);
}).then(/* ... */);
```

You can express this more succinctly using `Promise.resolve()`:

```
Promise.resolve(someSynchronousValue).then(/* ... */);
```

```
//more verbose exapmle
function somePromiseAPI() {
  return Promise.resolve().then(function () {
    return 'foo';
  }).then(/* ... */);
}
```

# Advanced mistake #2: catch() isn't exactly like then(null, cb)

If you're wondering why they're not equivalent, consider what happens if the first function throws an error:

```
somePromise().then(function () {
  throw new Error('oh noes');
}).catch(function (err) {
  // I caught your error! :)
});

somePromise().then(function () {
  throw new Error('oh noes');
}, function (err) {
  // I didn't catch your error! :(
});
```

As it turns out, when you use the then(resolveHandler, rejectHandler) format, the rejectHandler won't actually catch an error if it's thrown by the resolveHandler itself.

# Advanced mistake #3: use promise in paralel or promises vs promise factories

That is, you want something like `Promise.all()`, but which doesn't execute the *promises in parallel*.

You might naïvely write something like this:

```
function executeSequentially(promises) {
  var result = Promise.resolve();
  promises.forEach(function (promise) {
    result = result.then(promise);
  });
  return result;
}
```

The promises you pass in to `executeSequentially()` will still execute in parallel.

The reason this happens is that you don't want to operate over an array of promises at all. Per the promise spec, as soon as a promise is created, it begins executing. So what you really want is an array of promise factories.

A promise factory is very simple, though – it's just a function that returns a promise:

```
function myPromiseFactory() {
  return somethingThatCreatesAPromise();
}
```
```
function executeSequentially(promiseFactories) {
  var result = Promise.resolve();
  promiseFactories.forEach(function (promiseFactory) {
    result = result.then(promiseFactory);
  });
  return result;
}
```

Why does this work? It works because a promise factory doesn't create the promise until it's asked to. It works the same way as a `then` function – in fact, it's the same thing!

Another task, create code which will download recurses from array URLs in sequence:

```
let urls = [
  'user.json',
  'guest.json'
];
```

```
// begin of the chain
let chain = Promise.resolve();

let results = [];

// in loop add tasks in chain
urls.forEach(function(url) {
  // task are added in sequence
  chain = chain
    .then(() => httpGet(url))
    .then((result) => {
      results.push(result);
    });
});

// result of promises
chain.then(console.log.bind(console));
```

The same approach with parallel:

```
Promise.all( urls.map(httpGet) )
  .then(console.log.bind(console));
```

# Advanced mistake #4: okay, what if I want the result of two promises?

Often times, one promise will depend on another, but we'll want the output of both promises. For instance:

```
getUserByName('nolan').then(function (user) {
  return getUserAccountById(user.id);
}).then(function (userAccount) {
  // dangit, I need the "user" object too!
});
```

Wanting to be good JavaScript developers and avoid the pyramid of doom, we might just store the user object in a higher-scoped variable:

```
var user;
getUserByName('nolan').then(function (result) {
  user = result;
  return getUserAccountById(user.id);
}).then(function (userAccount) {
  // okay, I have both the "user" and the "userAccount"
});
```

My recommended strategy: just let go of your preconceptions and embrace the pyramid:

```
getUserByName('nolan').then(function (user) {
  return getUserAccountById(user.id).then(function (userAccount) {
    // okay, I have both the "user" and the "userAccount"
  });
});
```

If the indentation ever becomes an issue, then you can do what JavaScript developers have been doing since time immemorial, and extract the function into a named function:

```
function onGetUserAndUserAccount(user, userAccount) {
  return doSomething(user, userAccount);
}

function onGetUser(user) {
  return getUserAccountById(user.id).then(function (userAccount) {
    return onGetUserAndUserAccount(user, userAccount);
  });
}

getUserByName('nolan')
  .then(onGetUser)
  .then(function () {
  // at this point, doSomething() is done, and we are back to indentation 0
});
```

As your promise code starts to get more complex, you may find yourself extracting more and more functions into named functions. I find this leads to very aesthetically-pleasing code, which might look like this:

```
putYourRightFootIn()
  .then(putYourRightFootOut)
  .then(putYourRightFootIn)  
  .then(shakeItAllAbout);
```

Save my day:
	*	[We have a problem with promises](http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)