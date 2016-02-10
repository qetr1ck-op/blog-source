title: Development with Webpack and React part 4
date: 2016-02-10 21:39:47
tags:
    - Webpack
categories:
    - Javascript
---

React and Flux architecture with Alt

<!--toc-->

<!--more-->

You can get pretty far by keeping everything in components. Eventually, that will become painful.

# Introduction to Flux

So far, we've been dealing only with views. Flux architecture introduces a couple of new concepts to the mix. These are *actions*, *dispatcher*, and *stores*. 

Flux implements unidirectional flow in contrast to popular frameworks, such as Angular or Ember.

![](img.png "Optional title")

# Actions and Stores

In our case, we will model `NoteActions` and `NoteStore`. `NoteActions` provide concrete operations we can perform over our data. For instance, we can have `NoteActions.create({task: 'Learn React'})`.

# Dispatcher

When we trigger the *action*, the *dispatcher* will get notified. The *dispatcher* will be able to deal with possible dependencies between *stores*. It is possible that a certain action needs to happen before another. The *dispatcher* allows us to achieve this.

At the simplest level, actions can just pass the message to the *dispatcher* as is.

Once the *dispatcher* has dealt with the action, *stores* that are listening to it get triggered. In our case, `NoteStore` gets notified. As a result, it will be able to update its internal state. After doing this it will notify possible listeners of the new state.

# Flux Dataflow

Usually, though, the unidirectional process has a cyclical flow and it doesn't necessarily end. 

Eventually, the components depending on our store data become refreshed through this looping process.

![](img2.png "Optional title")

# Advantages of Flux

Even though this sounds a little complicated, the arrangement gives our application flexibility. We can, for instance, implement API communication, caching, and i18n outside of our views. This way they stay clean of logic while keeping the application easier to understand.

Implementing Flux architecture in your application will actually increase the amount of code. It has been designed to allow productivity across larger teams. You could say, "explicit is better than implicit".

# Which Flux Implementation to Use?

There is no single right way to interpret the architecture. You will find implementations that fit different tastes. [voronianski/flux-comparison](https://github.com/voronianski/flux-comparison) provides a nice comparison between some of the more popular ones.

# Porting to Alt

It is a flexible, full-featured implementation that has been designed with universal (isomorphic) rendering in mind.

In Alt, you'll deal with actions and stores. The dispatcher is hidden, but you will still have access to it if needed. Compared to other implementations Alt hides a lot of boilerplate. There are special features to allow you to save and restore the application state. This is handy for implementing persistency and universal rendering.

# Setting Up an Alt Instance

Everything in Alt begins from an *Alt instance*. It keeps track of actions and stores and keeps communication going on. Set it up as follows:

```
//app/libs/alt.js

import Alt from 'alt';
//import chromeDebug from 'alt-utils/lib/chromeDebug';

const alt = new Alt();
//chromeDebug(alt);

export default alt;
```

Webpack caches the modules so the next time you import Alt, it will return the same instance again.

There is a Chrome plugin known as [alt-devtool](https://github.com/goatslacker/alt-devtool)

# Defining CRUD API for Notes

Next, we'll need to define a basic API for operating over the Note data. Alt provides a shorthand known as generateActions. We can use it like this:

```
//app/actions/NoteActions.js

import alt from '../libs/alt';

export default alt.generateActions('create', 'update', 'delete');
```

## Defining a Store for Notes

A store is a single source of truth for a part of your application state. In this case, we need one to maintain the state of the notes. We will connect all the actions we defined above using the `bindActions` function.

We have the logic we need for our store already at `App`. We will move that logic to `NoteStore`.

As a first step, we can set up a skeleton for our store. We can fill in the methods we need after that. Here's a starting point:

```
//app/stores/NoteStore.js

import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);

    this.notes = [];
  }
  create(note) {

  }
  update(updatedNote) {

  }
  delete(id) {

  }
}

export default alt.createStore(NoteStore, 'NoteStore');
```

We call `bindActions` to map each action to a method by name. We trigger the appropriate logic at each method based on that. Finally, we connect the store with Alt using `alt.createStore`.

Note that assigning a label to a store (`NoteStore` in this case) isn't required. It is a good practice as it protects the code against minification and possible collisions. These labels become important when we persist the data.

## Implementing create

```
//app/stores/NoteStore.js

import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    ...
  }
  create(note) {

    const notes = this.notes;

    note.id = uuid.v4();

    this.setState({
      notes: notes.concat(note)
    });

  }
  ...
}

export default alt.createStore(NoteStore, 'NoteStore');
```

To keep the implementation clean, we are using `this.setState`. It is a feature of Alt that allows us to signify that we are going to alter the store state. Alt will signal the change to possible listeners.

## Implementing update

```
app/stores/NoteStore.js

...

class NoteStore {
  ...
  update(updatedNote) {

    const notes = this.notes.map(note => {
      if(note.id === updatedNote.id) {
        // Object.assign is used to patch the note data here. It
        // mutates target (first parameter). In order to avoid that,
        // I use {} as its target and apply data on it.
        //
        // Example: {}, {a: 5, b: 3}, {a: 17} -> {a: 17, b: 3}
        //
        return Object.assign({}, note, updatedNote);
      }

      return note;
    });

    // This is same as `this.setState({notes: notes})`
    this.setState({notes});

  }
  delete(id) {

  }
}

export default alt.createStore(NoteStore, 'NoteStore');
```

## Implementing delete

```
app/stores/NoteStore.js

...

class NoteStore {
  ...
  delete(id) {

    this.setState({
      notes: this.notes.filter(note => note.id !== id)
    });

  }
}

export default alt.createStore(NoteStore, 'NoteStore');
```

TODO....