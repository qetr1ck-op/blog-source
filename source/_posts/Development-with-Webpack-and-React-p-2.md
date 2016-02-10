title: Development with Webpack and React part 2
date: 2016-02-07 16:13:20
tags:
    - Webpack
categories:
    - Javascript
---

Configuring webpack babel-loader with .babelrc. Set up hot loading and create first React view.

<!--toc-->

<!--more-->

# Configuring babel-loader

You can use Babel with Webpack easily through `babel-loader`. It takes our ES6 module definition based code and turn it into ES5 bundles:

```
npm i babel-loader babel-core --save-dev
```

To make this work, we need to add a loader declaration for babel-loader to the loaders section of the configuration. It matches against both `.js` and `.jsx` using a regular expression `/\.jsx?$/`.

To keep everything performant we should restrict the loader to operate within `./app` directory. This way it won't traverse `node_modules`:

```
...
// webpack.config.js
const common = {
  entry: PATHS.app,

  // Add resolve.extensions.
  // '' is needed to allow imports without an extension.
  // Note the .'s before extensions as it will fail to match without!!!
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.app
      },

      // Set up jsx. This accepts js too thanks to RegExp
      {
        test: /\.jsx?$/,
        // Enable caching for improved performance during development
        // It uses default OS directory by default. If you need something
        // more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      }

    ]
  }
};
...
```

Note that `resolve.extensions` setting will allow you to refer to JSX files without an extension now. 

# Setting up .babelrc

Also, we are going to need a [.babelrc.](https://babeljs.io/docs/usage/babelrc/) You could pass Babel settings through Webpack (i.e., `babel?presets[]=react,presets[]=es2015`), but then it would be just for Webpack only. That's why we are going to push our Babel settings to this specific dotfile. The same idea applies for other tools, such as ESLint.

> Babel 6 relies on plugins.

To make it easier to consume plugins, Babel supports the concept of *presets*. Each preset comes with a set of plugins so you don't have to wire them up separately. In this case we'll be relying on `ES2015` and `JSX` *presets*:

```
npm i -D babel-preset-es2015 babel-preset-react
```

In addition, we'll be enabling a couple of custom features to make the project more convenient to develop:

* [Property initializers](https://github.com/jeffmo/es-class-fields-and-static-properties) - Example: `renderNote = (note) => {`. This binds the renderNote method to instances automatically. The feature makes more sense as we get to use it.
* [Decorators](https://github.com/wycats/javascript-decorators) - Example: `@DragDropContext(HTML5Backend)`. These annotations allow us to attach functionality to classes and their methods.
* [Object rest/spread](https://github.com/sebmarkbage/ecmascript-rest-spread) - Example: `const {a, b, ...props} = this.props`. This syntax allows us to easily extract specific properties from an object.

In order to make it easier to set up the features we will use:

```
npm i -D babel-preset-survivejs-kanban 
```

Next we need to set up a .babelrc file to make this all work:

```
// .babelrc
{
  "presets": [
    "es2015",
    "react",
    "survivejs-kanban"
  ]
}
```

## Using Babel for Webpack Configuration

Simply rename `webpack.config.js` to` webpack.config.babel.js` and Webpack will pick it up provided Babel has been set up in your project.

For this to work, you will need to have `babel-register` installed to your project. 

## Alternative Loader Declarations

The first one shows how to pass parameters to a loader through a query string:

```
{
  test: /\.jsx?$/,
  loaders: [
    'babel?cacheDirectory,presets[]=react,presets[]=es2015,presets[]=survivejs-kanban'
  ],
  include: PATHS.app
}
```

Another way is to use the combination of *loader* and *query* fields:

```
{
  test: /\.jsx?$/,
  loader: 'babel',
  query: {
    cacheDirectory: true,
    presets: ['react', 'es2015', 'survivejs-kanban']
  },
  include: PATHS.app
}
```

It's a good idea to keep in mind that Webpack loaders are always evaluated from right to left and from bottom to top.

# Developing the First React View

```
npm i react react-dom -S
```

First, we should define the App. This will be the core of our application:

```
//app/components/App.jsx
import React from 'react';
import Note from './Note.jsx';

export default class App extends React.Component {
  render() {
    return <Note />;
  }
}
```

You can import portions from react using the syntax `import React, {Component} from 'react';`. 

Then you can do `class App extends Component`. It is important that you `import React` as well because that JSX will get converted to React.`createElement` calls. 

# Setting up `Note`

```
//app/components/Note.jsx

import React from 'react';

export default () => <div>Learn Webpack</div>;
```

Note that we're using the `jsx` extension here. It is not absolutely necessary, but it is a good convention to have.

Rendering `index.jsx`

```
//app/index.jsx

import './main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

ReactDOM.render(<App />, document.getElementById('app'));
```

# Activating Hot Loading for Development

Note that every time you perform a modification, the browser updates with a flash. That's unfortunate because this means our application loses state. 

It is annoying to manipulate the user interface back to the state in which it was to test something.

We can work around this problem using hot loading. `babel-plugin-react-transform` allow us to instrument React components in various ways. Hot loading is one of these. It is enabled through `react-transform-hmr`.

A Babel preset known as `babel-preset-react-hmre` will keep our setup simple:

```
npm i babel-preset-react-hmre --save-dev
```

An easy way to control `.babelrc` is to set `BABEL_ENV` environment variable as npm lifecycle event. This gives us a predictable mapping between package.json and `.babelrc`:

```
//webpack.config.js
process.env.BABEL_ENV = TARGET;
```

In addition we need to expand our Babel configuration:

```
//.babelrc

...
"env": {
    "start": {
      "presets": [
        "react-hmre"
      ]
    }
  }
```

# Final app sources

The final source of the article [here](https://github.com/qetr1ck-op/webpack_react/tree/dev/project_source/03_webpack_and_react/kanban_app)

Save my day: (http://survivejs.com/)[http://survivejs.com/webpack_react/react/]