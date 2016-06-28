title: Development with Webpack and React part 5
date: 2016-02-21 12:02:24
thumbnailImage: img.png

tags:
  - Webpack
  - Babel
  - ES6 
  - React
  - Alt 
categories:
  - Javascript
---

We still have work to do to turn this into a real Kanban as pictured above. Most importantly our system is missing the concept of Lane.


<!--toc-->

<!--more-->

A `Lane` is something that should be able to contain many `Notes` within itself and track their order.

# Extracting Lanes

There will be a component for the higher level (i.e., `Lanes`) and for the lower level (i.e., `Lane`). The higher level component will deal with lane ordering. A `Lane` will render itself (i.e., name and `Notes`) and have basic manipulation operations.

Just as with Notes, we are going to need a set of actions:


``` javascript app/actions/LaneActions.js
import alt from '../libs/alt';

export default alt.generateActions('create');
```

In addition, we are going to need a `LaneStore` and a method matching to create:

``` javascript app/stores/LaneStore.js
import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';

class LaneStore {
  constructor() {
    this.bindActions(LaneActions);

    this.lanes = [];
  }
  create(lane) {
    const lanes = this.lanes;

    lane.id = uuid.v4();
    lane.notes = lane.notes || [];

    this.setState({
      lanes: lanes.concat(lane)
    });
  }
}

export default alt.createStore(LaneStore, 'LaneStore');

```

We are also going to need a stub for `Lanes`:

```
//app/components/Lanes.jsx

import React from 'react';

export default class Lanes extends React.Component {
  render() {
    return (
      <div className="lanes">
        lanes should go here
      </div>
    );
  }
}
```

Next, we need to make room for `Lanes` at `App`. We will simply replace Notes references with `Lanes`, set up actions, and store as needed:

```
//app/components/App.jsx

import AltContainer from 'alt-container';
import React from 'react';


import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';


export default class App extends React.Component {
  render() {
    return (
      <div>
        <AltContainer
          stores={[LaneStore]}
          inject={{
            lanes: () => LaneStore.getState().lanes || []
          }}
        >
        <Lanes />

        </AltContainer>
      </div>
    );
  }


  addLane() {
    LaneActions.create({name: 'New lane'});
  }
}
```

It just shows a plus button and lanes should go here text. Even the add button doesn't work yet. We still need to model `Lane` and attach `Notes` to that to make this all work.

# Modeling Lane

The `Lanes` container will render each `Lane` separately. Each `Lane` in turn will then render associated `Notes`, just like our `App` did earlier.

```
//app/components/Lanes.jsx

import React from 'react';
import Lane from './Lane.jsx';

export default class ({lanes}) => {
  return (
    <div className="lanes">{lanes.map(lane =>
      <Lane className="lane" key={lane.id} lane={lane} />
    )}</div>
  );
}
```

We are also going to need a `Lane` component to make this work. It will render the `Lane` name and associated `Notes`:

```
//app/components/Lane.jsx

import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';

export default class Lane extends React.Component {
  render() {
    const {lane, ...props} = this.props;

    return (
      <div {...props}>
        <div className="lane-header">
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
          <div className="lane-name">{lane.name}</div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getState().notes || []
          }}
        >
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }
  editNote(id, task) {
    // Don't modify if trying set an empty value
    if(!task.trim()) {
      return;
    }

    NoteActions.update({id, task});
  }
  addNote() {
    NoteActions.create({task: 'New task'});
  }
  deleteNote(id) {
    NoteActions.delete(id);
  }
}
```

`const {a, b, ...props} = this.props` in the example. This allows us to attach a `className` to `Lane` and we avoid polluting it with HTML attributes we don't need. The syntax expands Object key value pairs as props so we don't have to write each prop we want separately.

If you run the application and try adding new notes, you can see there's something wrong. Every note you add is shared by all lanes. If a note is modified, other lanes update too.

![](img2.png)

The reason why this happens is simple. Our `NoteStore` is a singleton. This means every component that is listening to `NoteStore` will receive the same data. We will need to resolve this problem somehow.

# Making Lanes Responsible of Notes

Currently, our `Lane` contains just an array of objects. Each of the objects knows its id and name. We'll need something more.

In order to make this work, each `Lane` needs to know which `Notes` belong to it. If a `Lane` contained an array of Note ids, it could then filter and display the `Notes` belonging to it. We'll implement a scheme to achieve this next.

## Setting Up `attachToLane`

When we add a new `Note` to the system using `addNote`, we need to make sure it's associated to some `Lane`. This association can be modeled using a method, such as `LaneActions.attachToLane({laneId: <id>, noteId: <id>})`. Before calling this method we should create a note and gets its id.

To get started we should add `attachToLane` to actions as before:

```
//app/actions/LaneActions.js

import alt from '../libs/alt';

export default alt.generateActions('create', 'attachToLane');
```

In order to implement attachToLane, we need to find a lane matching to the given lane id and then attach note id to it:

```
//app/stores/LaneStore.js

import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';

class LaneStore {
  ...

  attachToLane({laneId, noteId}) {
    const lanes = this.lanes.map(lane => {
      if(lane.id === laneId) {
        if(lane.notes.includes(noteId)) {
          console.warn('Already attached note to lane', lanes);
        }
        else {
          lane.notes.push(noteId);
        }
      }

      return lane;
    });

    this.setState({lanes});
  }

}

export default alt.createStore(LaneStore, 'LaneStore');
```

We also need to make sure `NoteActions.create` returns a `note` so the setup works just like in the code example above. The note is needed for creating an association between a lane and a note:

```
//app/stores/NoteStore.js

...

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);

    this.notes = [];
  }
  create(note) {
    const notes = this.notes;

    note.id = uuid.v4();

    this.setState({
      notes: notes.concat(note)
    });

    return note;
  }
  ...
}
...
```

## Setting Up `detachFromLane`

`deleteNote` is the opposite operation of `addNote`.

Again, we should set up an action:

```
//app/actions/LaneActions.js

import alt from './libs/alt';

export default alt.generateActions('create', 'attachToLane', 'detachFromLane');
```

The implementation will resemble `attachToLane`. In this case, we'll remove the possibly found `Note` instead:

```
//app/stores/LaneStore.js

import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneAction from '../libs/action/LaneActions';

class LaneStore {
  
  ...
  attachToLane({laneId, noteId}) {
    ...
  }
  detachFromLane({laneId, noteId}) {
    const lanes = this.lanes.map( lane => {
      if (lane.id === laneId) {
        lane.notes = lane.notes.filter( note => note.id !=== noteId );
      }

      return lanes;
    });

    this.setState({lanes});
  }
}

export default alt.createStore(LaneStore, 'LaneStore');
```

Just building an association between a lane and a note *isn't enough*. We are going to need some way to resolve the note references to data we can display through the user interface. For this purpose, we need to implement a special *getter* so we get just the data we want per each lane.

## Implementing a Getter for NoteStore

One neat way to resolve lane notes to actual data is to implement a public method `NoteStore.getNotesByIds(notes)`. It accepts an array of `Note` ids, and returns the corresponding objects.

Just implementing the method isn't enough. We also need to make it public. In `Alt`, this can be achieved using `this.exportPublicMethods`:

```
//app/sotes/NoteStore.jsx

import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);

    this.notes = [];

    this.exportPublicMethods({
      getNotesById: this.getNotesById.bind(this)
    })
  }
  ...
  getNoteByIds(ids) {
    // 1. Make sure we are operating on an array and
    // map over the ids
    // [id, id, id, ...] -> [[Note], [], [Note], ...]
    return (ids || []).map( 
      // 2. Extract matching notes
      // [Note, Note, Note] -> [Note, ...] (match) or [] (no match)
      id => this.notes.filter( note.id === id )
    )
    // 3. Filter out possible empty arrays and get notes
    // [[Note], [], [Note]] -> [[Note], [Note]] -> [Note, Note]
    .filter( ary => ary.length )
    .map( ary => ary[0] );
  }
}

export defalt alt.createStore(NoteStore, 'NoteStore');
```

Note that the implementation filters possible non-matching ids from the result.

# Connecting Lane with the Logic

Now that we have the logical bits together, we can integrate it with `Lane`. We'll need to take the newly added `props` (`id`, `notes`) into account, and glue this all together:

```
//app/components/Lane.jsx
...
import LaneActions from './app/actions/LaneActions';

export default class Lane extends React.Component {
  render() {
    const {lane, ...props} = this.props;

    return (
      <div {...props}>
        <div className="lane-header">
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
          <div className="lane-name">{lane.name}</div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getNotesById(lane.notes)
          }}
        >
          <Notes onEdit={this.onEdit} onDelete={this.onDelete} />
        </AltContainer>
      </div>
    );
  }
  editNote(id, task) {
    // Don't modify if trying set an empty value
    if(!task.trim()) {
      return;
    }

    NoteActions.update({id, task});
  }
  addNote = (e) => {
    const laneId = this.props.lane.id;
    const noteId = NoteAction.create( {task: 'New Task'} ).id;

    LaneAction.attachToLane({ noteId, laneId });
  }
  addNote = (noteId, e) => {
    const laneId = this.props.lane.id;
    
    NoteAction.delete(noteId);
    LaneAction.detachFronLane({ noteId, laneId });
    
    e.stopPropagation();
  }
}
```
There are three important changes:

1. Methods where we need to refer to this have been bound using a *property initializer*. An alternative way to achieve this would have been to bind at `render` or at `constructor`.
2. `notes: () => NoteStore.getNotesByIds(notes)` - Our new getter is used to filter notes.
3. `addNote`, `deleteNote` - These operate now based on the new logic we specified. Note that we trigger detachFromLane before delete at `deleteNote`. Otherwise we may try to render non-existent notes. You can try swapping the order to see warnings.

The current structure allows us to keep singleton stores and a flat data structure. Dealing with references is a little awkward, but that's consistent with the Flux architecture.

If you try to add notes to a specific lane, they shouldn't be duplicated anymore. Also editing a note should behave as you might expect:

![](img3.jpg)

# On Data Dependencies and `waitFor`

The current setup works because our actions are synchronous. It would become more problematic if we dealt with a back-end. In that case, we would have to set up `waitFor` based code. [waitFor](http://alt.js.org/guide/wait-for/) allows us to deal with data dependencies. It tells the dispatcher that it should wait before going on:

```
//app/stores/LaneStore.js

class LaneStore {
  ...
  attachToLane( {laneId, noteId} ) {
    if(!noteId) {
        this.waitFor(NoteStore);

        // last note -> id
        noteId = NoteStore.getState().notes.slice(-1)[0].id;
    }
    ...
  }
}
```

It becomes necessary when you need to deal with asynchronously fetched data that depends on each other, however.

# Implementing Edit/Remove for Lane

We are still missing some basic functionality, such as editing and removing lanes. For now, we just want to get `Editable` into a good condition:

```
//app/component/Editable.jsx

import React from 'react';

export default class Editable extends React.Component{
  render() {
    const { value, onEdit, onDelete, onValueClick, editing, ...props } = this.props;

    return (
      <div ...props>
        {editing ? this.renderEdit() : this.renderValue()}
      </div>
    )
  }

  renderEdit = () => {
    return (
      <input type="text"
        ref={
          (e) => e ? e.selectionStart = this.props.value.length : null
        }
        autoFocus={true}
        defaultValue={this.props.value}
        onBlur={this.finishEdit}
        onKeyPress={this.checkEnter}
      />
    )
  };

  renderValue = () => {
    const onDelete = this.props.onDelete;

    return (
      <div onClick={this.props.onValueClick}>
        <span className="value">{this.props.value}</span>
        {onDelete ? this.renderDelete() : null }
      </div>
    )
  };

  renderDelete = () => {
    return (
      <button
        className="onDelete"
        onClick={this.props.onDelete}
      >x
      </button>
    )
  };

  checkEnter = (e) => {
    if(e.key === 'Enter') {
      this.finishEdit()
    }
  };

  finishEdit = (e) => {
    this.props.onClick(e.target.value);
  };
}
```

`Editable` uses uncontrolled design with its input. This means we pass the control over its state to DOM and capture it through event handlers. If you wanted to validate the input when the user is typing, it would be useful to convert it into a controlled design. In this case you would define a onChange handler and a value prop. It's more work, but also provides more control. React documentation discusses [controlled components](https://facebook.github.io/react/docs/forms.html) in greater detail.

## Pointing `Notes` to `Editable`

Next, we need to make `Notes.jsx` point at the new component. We'll need to alter the import and the component name at `render()`:

```
//app/components/Notes.jsx

import React from 'react';
import Editable from './Editable.jsx';

export default ({notes, onValueClick, onEdit, onDelete}) => {
  return (
    <ul className="notes">{notes.map(note =>
      <li className="note" key={note.id}>
        <Editable
          editing={note.editing}
          value={note.task}
          onValueClick={onValueClick.bind(null, note.id)}
          onEdit={onEdit.bind(null, note.id)}
          onDelete={onDelete.bind(null, note.id)} />
      </li>
    )}</ul>
  );
}
```

## Connecting `Lane` with `Editable`

Next, we can use this generic component to allow a Lane's name to be modified:

```
//app/components/Lane.jsx

import Editable from './Editable.jsx';

export default class Lane extends React.Component {
  render() {
    const {lane, ...props} = this.props;

     return (
      <div {...props}>
         <div className="lane-header" onClick={this.activateLaneEdit}>

          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
          <Editable className="lane-name" editing={lane.editing}
            value={lane.name} onEdit={this.editName} />
          <div className="lane-delete">
            <button onClick={this.deleteLane}>x</button>
          </div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getNotesByIds(lane.notes)
          }}
        >
        <Notes
            onValueClick={this.activateNoteEdit}
            onEdit={this.editNote}
            onDelete={this.deleteNote} />

        </AltContainer>
      </div>
    )
  }
  editNote(id, task) {
    // Don't modify if trying set an empty value
    if(!task.trim()) {
      return;
    }

    NoteActions.update({id, task});
  }
  addNote = (e) => {
    // If note is added, avoid opening lane name edit by stopping
    // event bubbling in this case.
    e.stopPropagation();


    const laneId = this.props.lane.id;
    const note = NoteActions.create({task: 'New task'});

    LaneActions.attachToLane({
      noteId: note.id,
      laneId
    });
  };
  ...
  editName = (name) => {
    const laneId = this.props.lane.id;

    console.log(`edit lane ${laneId} name using ${name}`);
  };
  deleteLane = () => {
    const laneId = this.props.lane.id;

    console.log(`delete lane ${laneId}`);
  };
  activateLaneEdit = () => {
    const laneId = this.props.lane.id;

    console.log(`activate lane ${laneId} edit`);
  };
  activateNoteEdit(id) {
    console.log(`activate note ${id} edit`);
  }
}
```

## Defining Editable Logic

We will need to define some logic to make this work. To follow the same idea as with `Note`, we can model the remaining CRUD actions here. We'll need to set up `update` and `delete` actions in particular.

```
// app/actions/LaneActions.js

import alt from '../libs/alt';

export default alt.generateActions(
  'create', 'update', 'delete',
  'attachToLane', 'detachFromLane'
);
```

We are also going to need `LaneStore` level implementations for these. They can be modeled based on what we have seen in `NoteStore` earlier:

```
// app/stores/LaneStore.js

...

class LaneStore {
  ...
  create(lane) {
    ...
  }

  update(updatedLane) {
    const lanes = this.lanes.map(lane => {
      if(lane.id === updatedLane.id) {
        return Object.assign({}, lane, updatedLane);
      }

      return lane;
    });

    this.setState({lanes});
  }
  delete(id) {
    this.setState({
      lanes: this.lanes.filter(lane => lane.id !== id)
    });
  }

  attachToLane({laneId, noteId}) {
    ...
  }
  ...
}

export default alt.createStore(LaneStore, 'LaneStore');
```

Now that we have resolved actions and store, we need to adjust our component to take these changes into account:

```
// app/component/Lane.jsx

...
export default class Lane extends React.Component {
  ...

  editNote(id, task) {
    // Don't modify if trying set an empty value
    if(!task.trim()) {
      NoteActions.update({id, editing: false});

      return;
    }

    NoteActions.update({id, task, editing: false});
  }

  ...

  editName = (name) => {
    const laneId = this.props.lane.id;

    // Don't modify if trying set an empty value
    if(!name.trim()) {
      LaneActions.update({id: laneId, editing: false});

      return;
    }

    LaneActions.update({id: laneId, name, editing: false});
  };
  deleteLane = () => {
    const laneId = this.props.lane.id;

    LaneActions.delete(laneId);
  };
  activateLaneEdit = () => {
    const laneId = this.props.lane.id;

    LaneActions.update({id: laneId, editing: true});
  };
  activateNoteEdit(id) {
    NoteActions.update({id, editing: true});
  }

}
```
If you want that lanes and notes are editable after they are created, set `lane.editing = true;` or `note.editing = true;` when creating them.

# Styling Kanban Board

As we added Lanes to the application, the styling went a bit off. Add the following styling to make it a little nicer:

```
//app/main.css

body {
  background: cornsilk;
  font-family: sans-serif;
}


.lane {
  display: inline-block;

  margin: 1em;

  background-color: #efefef;
  border: 1px solid #ccc;
  border-radius: 0.5em;

  min-width: 10em;
  vertical-align: top;
}

.lane-header {
  overflow: auto;

  padding: 1em;

  color: #efefef;
  background-color: #333;

  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
}

.lane-name {
  float: left;
}

.lane-add-note {
  float: left;

  margin-right: 0.5em;
}

.lane-delete {
  float: right;

  margin-left: 0.5em;

  visibility: hidden;
}
.lane-header:hover .lane-delete {
  visibility: visible;
}

.add-lane, .lane-add-note button {
  cursor: pointer;

  background-color: #fdfdfd;
  border: 1px solid #ccc;
}

.lane-delete button {
  padding: 0;

  cursor: pointer;

  color: white;
  background-color: rgba(0, 0, 0, 0);
  border: 0;
}


...
```

As this is a small project, we can leave the CSS in a single file like this. In case it starts growing, consider separating it to multiple files. One way to do this is to extract CSS per component and then refer to it there (e.g., `require('./lane.css')` at `Lane.jsx`).

Besides keeping things nice and tidy, Webpack's lazy loading machinery can pick this up. As a result, the initial CSS your user has to load will be smaller.

# On Namespacing Components

TODO