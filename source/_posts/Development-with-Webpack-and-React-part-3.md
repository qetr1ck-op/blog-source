title: Development with Webpack and React part 3
date: 2016-02-07 20:33:51
tags:
    - Webpack
categories:
    - Javascript
---

Implement a basic note application.

<!--toc-->

<!--more-->

# Initial data model and setting up `App`

We'll be using a Node.js implementation known as `node-uuid` and its `uuid.v4` variant. It will give us ids, such as `1c8e7a12-0b4c-4f23-938c-00d7161f94fc` and they are guaranteed to be unique with a very high probability.

The simplest way to achieve that is to push the data directly to `render()` for now:

```
//app/components/App.jsx


import uuid from 'node-uuid';
import React from 'react';

export default class App extends React.Component {
  render() {

    const notes = [
      {
        id: uuid.v4(),
        task: 'Learn Webpack'
      },
      {
        id: uuid.v4(),
        task: 'Learn React'
      },
      {
        id: uuid.v4(),
        task: 'Do laundry'
      }
    ];

    return (
      <div>
        <ul>{notes.map(note =>
          <li key={note.id}>{note.task}</li>
        )}</ul>
      </div>
    );

  }
}
```

In order to tell React in which order to render the elements, we use the `key` property. It is important that this is unique or else React won't be able to figure out the correct order in which to render. If not set, React will give a warning:

```
<li key={note.id}>{note.task}</li>
```

If you want to attach comments to your JSX, just use `{/* no comments */}`

# Adding New Items to the List

Currently the state of our application is tied to `render()`. In order to make it possible to modify it, we'll need to convert it into component `state`:

```
//app/components/App.jsx
...
export default class App extends React.Component {

  constructor(props) {
    // ------------------------
    super(props);
    this.state = {
      notes: [
        {
          id: uuid.v4(),
          task: 'Learn Webpack'
        },
        {
          id: uuid.v4(),
          task: 'Learn React'
        },
        {
          id: uuid.v4(),
          task: 'Do laundry'
        }
      ]
    };
    // ------------------------
  }
  
  render() {
    // -----------------------------
    const notes = this.state.notes;
    // -----------------------------
    ...
  }
}
```

In the earlier versions of React, you achieved the same result with `getInitialState`. We're passing `props` to `super` by convention. If you don't pass it, `this.props` won't get set! Calling `super` invokes the same method of the parent class and you see this kind of usage in object oriented programming often.

# Defining addNote Handler

Now that we have state, we can begin to modify it. A good way to achieve this is to add a simple button to `App` and then trigger `this.setState` to force React to alter the state and trigger `render()`:

```
...
export default class App extends React.Component {
  constructor(props) {
    ...
  }
  render() {
    const notes = this.state.notes;

    return (
      <div>
        <button onClick={this.addNote}>+</button>

        <ul>{notes.map(note =>
          <li key={note.id}>{note.task}</li>
        )}</ul>
      </div>
    );
  }

  // We are using an experimental feature known as property
  // initializer here. It allows us to bind the method `this`
  // to point at our *App* instance.
  //
  // Alternatively we could `bind` at `constructor` using
  // a line, such as this.addNote = this.addNote.bind(this);
  addNote = () => {
    this.setState({
      notes: this.state.notes.concat([{
        id: uuid.v4(),
        task: 'New task'
      }])
    });
  };

}
```

`this.setState` accepts a second parameter like this: `this.setState({...}, () => console.log('set state!'))`. This is handy to know if you want to trigger some behavior right after setState has completed.

You could use `[...this.state.notes, {id: uuid.v4(), task: 'New task'}]` to achieve the same result.

# Improving Component Hierarchy

By looking at our application, we can see there's a component hierarchy like this:

`App` - `App` retains application state and deals with the high level logic.
`Notes` - `Notes` acts as an intermediate in between and renders individual `Note` components.
`Note` - `Note` is the workhorse of our application. Editing and deletion will be triggered here. That logic will cascade to App through wiring.

# Extracting Note

`Note` is a component which will need to receive task as a prop and render it as below:

```
//app/components/Note.jsx

import React from 'react';

export default ({task}) => <div>{task}</div>;
```

Extracting Notes is a similar operation:

```
//app/components/Notes.jsx

import React from 'react';
import Note from './Note.jsx';

export default ({notes}) => {
  return (
    <ul>{notes.map(note =>
      <li key={note.id}>
        //------------------------
        <Note task={note.task} />
        //------------------------
      </li>
    )}</ul>
  );
}
```

We should tweak App to connect the component with it:

```
//app/components/App.jsx

import uuid from 'node-uuid';
import React from 'react';

import Note from './Note.jsx';

import Notes from './Notes.jsx';

export default class App extends React.Component {
  constructor(props) {
    ...
  }
  render() {
    const notes = this.state.notes;

    return (
      <div>
        <button onClick={this.addNote}>+</button>
        //---------------------------------------
        <Notes notes={notes} />
        //---------------------------------------
      </div>
    );
  }
  addNote = () => {
    this.setState({
      notes: this.state.notes.concat([{
        id: uuid.v4(),
        task: 'New task'
      }])
    });
  };
}
```

# Editing Notes

This means `Note` will need to track its `editing` state somehow. In addition, we need to communicate that the value (`task`) has changed so that `App` knows to update its state.

## Tracking Note editing State

```
//app/components/Note.jsx

import React from 'react';

export default class Note extends React.Component {
  constructor(props) {
    super(props);

    // Track `editing` state.
    this.state = {
      editing: false
    };
  }
  render() {
    // Render the component differently based on state.
    if(this.state.editing) {
      return this.renderEdit();
    }

    return this.renderNote();
  }
  renderEdit = () => {
    // We deal with blur and input handlers here. These map to DOM events.
    // We also set selection to input end using a callback at a ref.
    // It gets triggered after the component is mounted.
    //
    // We could also use a string reference (i.e., `ref="input") and
    // then refer to the element in question later in the code. This
    // would allow us to use the underlying DOM API through
    // this.refs.input. This can be useful when combined with
    // React lifecycle methods.
    return <input type="text"
      ref={
        (e) => e ? e.selectionStart = this.props.task.length : null
      }
      autoFocus={true}
      defaultValue={this.props.task}
      onBlur={this.finishEdit}
      onKeyPress={this.checkEnter} />;
  };
  renderNote = () => {
    // If the user clicks a normal note, trigger editing logic.
    return <div onClick={this.edit}>{this.props.task}</div>;
  };
  edit = () => {
    // Enter edit mode.
    this.setState({
      editing: true
    });
  };
  checkEnter = (e) => {
    // The user hit *enter*, let's finish up.
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  };
  finishEdit = (e) => {
    // `Note` will trigger an optional `onEdit` callback once it
    // has a new value. We will use this to communicate the change to
    // `App`.
    //
    // A smarter way to deal with the default value would be to set
    // it through `defaultProps`.
    //
    // See *Typing with React* chapter for more information.
    const value = e.target.value;

    if(this.props.onEdit && value.trim()) {
      this.props.onEdit(value);

      // Exit edit mode.
      this.setState({
        editing: false
      });
    }
  };
}
```

If you try to edit a `Note` now, you should see an input and be able to edit the data. Given we haven't set up `onEdit` handler, it doesn't do anything useful yet, though. We'll need to capture the edited data next and update `App` state so that the code works.

It is a good idea to name your callbacks using `on` prefix. This will allow you to distinguish them from other props and keep your code a little tidier.

## Communicating Note State Changes

This can be achieved through data binding as illustrated by the diagram below:

![](img.png)

As `onEdit` is defined on `App` level, we'll need to pass `onEdit` handler through `Notes`. So for the stub to work, changes in two files are needed. Here's what it should look like for `App`:

```
import uuid from 'node-uuid';
import React from 'react';
import Notes from './Notes.jsx';

export default class App extends React.Component {
  constructor(props) {
    ...
  }
  render() {
    const notes = this.state.notes;

    return (
      <div>
        <button onClick={this.addNote}>+</button>
        //---------------------------------------------
        <Notes notes={notes} onEdit={this.editNote} />
        //---------------------------------------------
      </div>
    );
  }
  addNote = () => {
    ...
  };

  editNote = (id, task) => {
    const notes = this.state.notes.map(note => {
      if(note.id === id && task) {
        note.task = task;
      }

      return note;
    });

    this.setState({notes});
  };

}
```

To make the scheme work as designed, we need to modify Notes to work according to the idea:

```
app/components/Notes.jsx

import React from 'react';
import Note from './Note.jsx';

export default ({notes}) => {

export default ({notes, onEdit}) => {

  return (
    <ul>{notes.map(note =>

      <li key={note.id}>
        <Note
          task={note.task}
          //---------------------------------------------
          onEdit={onEdit.bind(null, note.id)} />
          //---------------------------------------------
      </li>

    )}</ul>
  );
}
```

# Removing Notes

Just like earlier, it will take three changes. We need to define logic at `App` level, bind the `id` at `Notes`, and then finally trigger the logic at `Note` through its user interface. To get started, `App` logic can be defined in terms of `filter`:

```
//app/components/App.jsx

export default class App extends React.Component {
  ...
  render() {
    const notes = this.state.notes;

    return (
      <div>
        <button onClick={this.addNote}>+</button>

        <Notes notes={notes}
          onEdit={this.editNote}
          //---------------------------------------------
          onDelete={this.deleteNote} />
          //---------------------------------------------
      </div>
    );
  }

  deleteNote = (id) => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== id)
    });
  };

  ...
}
```

Notes will work similarly as earlier:

```
//app/components/Notes.jsx

import React from 'react';
import Note from './Note.jsx';

export default ({notes, onEdit}) => {

export default ({notes, onEdit, onDelete}) => {

  return (
    <ul>{notes.map(note =>
      <li key={note.id}>

        <Note
          task={note.task}
          onEdit={onEdit.bind(null, note.id)}
          //---------------------------------------------
          onDelete={onDelete.bind(null, note.id)} />
          //---------------------------------------------
      </li>
    )}</ul>
  );
}
```

Finally, we need to attach a delete button to each `Note` and then trigger `onDelete` when those are clicked:

```
//app/components/Note.jsx
...
export default class Note extends React.Component {
  ...
  renderNote = () => {
    // If the user clicks a normal note, trigger editing logic.

    const onDelete = this.props.onDelete;

    return (
      //-----------------------------------------
      <div onClick={this.edit}>
        <span>{this.props.task}</span>
        {onDelete ? this.renderDelete() : null }
      </div>
      //-----------------------------------------
    );
  };

  //---------------------------------------------------------
  renderDelete = () => {
    return <button onClick={this.props.onDelete}>x</button>;
  };
  //---------------------------------------------------------
  ...
```

# Understanding React Components

Understanding how props and state work is important. Component lifecycle is another key concept. React provides the following lifecycle hooks:

Process of initial render:

![](img2.png)

Lifecycle for state change:

![](img3.png)

More in [off docs](https://facebook.github.io/react/docs/component-specs.html).

# Final app sources

The final source of the article [here](https://github.com/survivejs/webpack_react/tree/dev/project_source/04_implementing_notes/kanban_app)

Save my day: (http://survivejs.com/)[http://survivejs.com/webpack_react/implementing_notes/]
