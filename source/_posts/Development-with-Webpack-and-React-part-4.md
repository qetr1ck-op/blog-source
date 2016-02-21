title: Development with Webpack and React part 4
date: 2016-02-10 21:39:47
thumbnailImage: title.png
tags:
  - Webpack
  - Babel
  - ES6 
  - React
  - Alt 
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

Instead of slicing and concatenating data, it would be possible to operate directly on it. For example a mutable variant, such as `this.notes.splice(targetId, 1)` would work.

We could also use a shorthand, such as `[...notes.slice(0, noteIndex), ...notes.slice(noteIndex + 1)]`. 

The exact solution depends on your preferences. I prefer to avoid mutable solutions (i.e., splice) myself.

# Gluing It All Together

Our `NoteStore` provides two methods in particular that are going to be useful. These are `NoteStore.listen` and `NoteStore.unlisten`. They will allow views to subscribe to the state changes.

As you might remember from the earlier chapters, React provides a set of lifecycle hooks. We can subscribe to `NoteStore` within our view at `componentDidMount` and `componentWillUnmount`. By unsubscribing, we avoid possible memory leaks.

```
//app/components/App.jsx
import React from 'react';
import Notes from './Notes.jsx';

//------------------------------------------------
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
//------------------------------------------------

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = NoteStore.getState();

  }

  componentDidMount() {
    NoteStore.listen(this.storeChanged);
  }
  componentWillUnmount() {
    NoteStore.unlisten(this.storeChanged);
  }
  storeChanged = (state) => {
    // Without a property initializer `this` wouldn't
    // point at the right context because it defaults to
    // `undefined` in strict mode.
    this.setState(state);
  };

  render() {
    const notes = this.state.notes;

    return (
      <div>
        <button className="add-note" onClick={this.addNote}>+</button>
        <Notes notes={notes}
          onEdit={this.editNote}
          onDelete={this.deleteNote} />
      </div>
    );
  }

  deleteNote(id) {
    NoteActions.delete(id);
  }

  addNote() {
    NoteActions.create({task: 'New task'});
  }

  editNote(id, task) {
    // Don't modify if trying set an empty value
    if(!task.trim()) {
      return;
    }

    NoteActions.update({id, task});
  }
```

The application should work just like before now. As we alter 'NoteStore' through actions, this leads to a cascade that causes our 'App' state to update through 'setState'. This in turn will cause the component to 'render'. That's Flux's unidirectional flow in practice.

We actually have more code now than before, but that's okay. 'App' is a little neater and it's going to be easier to develop as we'll soon see.

# Implementing Persistency over localStorage

`localStorage` has a sibling known as `sessionStorage`. Whereas `sessionStorage` loses its data when the browser is closed, `localStorage` retains its data. They both share the same API as discussed below:

* `storage.getItem(k`) - Returns the stored string value for the given key.
* `storage.removeItem(k`) - Removes the data matching the key.
* `storage.setItem(k, v)` - Stores the given value using the given key.
* `storage.clear()` - Empties the storage contents.

## Implementing a Wrapper for localStorage

As objects are convenient, we'll use `JSON.parse` and `JSON.stringify` for serialization. We need just `storage.get(k)` and s`torage.set(k, v)` as seen in the implementation below:

```
//app/libs/storage.js

export default {
  get(k) {
    try {
      return JSON.parse(localStorage.getItem(k));
    }
    catch(e) {
      return null;
    }
  },
  set(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  }
};
```

The implementation could be generalized further. You could convert it into a factory `storage => {...}` and make it possible to swap the storage. Now we are stuck with localStorage unless we change the code.

An alternative would be to use [localForage](https://github.com/mozilla/localForage) to hide all the complexity.

## Persisting Application Using `FinalStore`

Besides this little utility, we'll need to adapt our application to use it. *Alt* provides a built-in store called `FinalStore` which is perfect for this purpose. We can persist the entire state of our application using `FinalStore`, bootstrapping, and snapshotting. `FinalStore` is a store that listens to all existing stores. Every time some store changes, `FinalStore` will know about it. This makes it ideal for persistency.

We can take a snapshot of the entire app state and push it to localStorage every time `FinalStore` changes. That solves one part of the problem. Bootstrapping solves the remaining part as `alt.bootstrap` allows us to set state of the all stores. The method doesn't emit events. To make our stores populate with the right state, we will need to call it before the components are rendered. In our case, we'll fetch the data from `localStorage` and invoke it to populate our stores.

An alternative way would be to take a snapshot only when the window gets closed. There's a Window level `beforeunload` hook that could be used. The problem with this approach is that it is brittle. What if something unexpected happens and the hook doesn't get triggered for some reason? You'll lose data.

`app/libs/persist.js` does the hard part. It will set up a `FinalStore`, deal with *bootstrapping* (restore data) and *snapshotting* (save data). I have included an escape hatch in the form of the debug flag. If it is set, the data won't get saved to localStorage. The reasoning is that by doing this, you can set the flag (`localStorage.setItem('debug', 'true')`), hit localStorage.`clear()` and refresh the browser to get a clean slate. The implementation below illustrates these ideas:

```
//app/libs/persist.js

import makeFinalStore from 'alt-utils/lib/makeFinalStore';

export default function(alt, storage, storeName) {
  const finalStore = makeFinalStore(alt);

  try {
    alt.bootstrap(storage.get(storeName));
  }
  catch(e) {
    console.error('Failed to bootstrap data', e);
  }

  finalStore.listen(() => {
    if(!storage.get('debug')) {
      storage.set(storeName, alt.takeSnapshot()); //(1)
    }
  });
}
```

We will need to pass the relevant data to it (Alt instance, storage, storage name) and off we go:

```
//app/index.jsx

...

import alt from './libs/alt';
import storage from './libs/storage';
import persist from './libs/persist';

persist(alt, storage, 'app');


ReactDOM.render(<App />, document.getElementById('app'));
```

# Using the AltContainer

The [AltContainer](http://alt.js.org/docs/components/altContainer/) wrapper allows us to simplify connection logic greatly and cut down the amount of logic needed. The implementation below illustrates how to bind it all together. Note how much code we can remove!

```
//app/components/App.jsx

import AltContainer from 'alt-container';

import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';

export default class App extends React.Component {
  render() {
     return (
      <div>
        <button className="add-note" onClick={this.addNote}>+</button>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getState().notes
          }}
        >
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>

      </div>
    );
  }
  ...
}
```

The `AltContainer` allows us to bind data to its immediate children. In this case, it injects the `notes` property in to `Notes`. The pattern allows us to set up arbitrary connections to multiple stores and manage them. 

# Alternative Implementations

* [Redux](http://redux.js.org/) is a Flux inspired architecture that was designed with hot loading as its primary constraint. Redux operates based on a single state tree. The state of the tree is manipulated using pure functions known as reducers. Even though there's some boilerplate code, Redux forces you to dig into functional programming. The implementation is quite close to the Alt based one. - [Redux demo](https://github.com/survivejs/redux-demo)
* Compared to Redux, [Cerebral](http://www.cerebraljs.com/) had a different starting point. It was developed to provide insight on how the application changes its state. Cerebral provides more opinionated way to develop, and as a result, comes with more batteries included. - [Cerebral demo](https://github.com/survivejs/cerebral-demo)
* [Mobservable](https://mweststrate.github.io/mobservable/) allows you to make your data structures observable. The structures can then be connected with React components so that whenever the structures update, so do the React components. Given real references between structures can be used, the Kanban implementation is surprisingly simple. - [Mobservable demo](https://github.com/survivejs/mobservable-demo)


# Final app sources

The final app of the article [here](https://github.com/qetr1ck-op/webpack_react/tree/dev/project_source/05_react_and_flux/kanban_app)

Save my day: (http://survivejs.com/)[http://survivejs.com/webpack_react/react_and_flux/]