title: Development with Webpack and React part 1
date: 2016-02-07 12:11:41
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

Begin with compression of build tools. Conception of bundlers. How to install and base configuration.

<!--toc-->

<!--more-->

# Task Runners and Bundlers

Webpack is a powerful module bundler. It hides a lot of power behind configuration. Once you understand its fundamentals, it becomes much easier to use this power.

Historically speaking, there have been many build systems. [Make](https://en.wikipedia.org/wiki/Make_%28software%29) is perhaps the best known, and is still a viable option. To make things easier, specialized task runners, such as [Grunt](http://gruntjs.com/) and [Gulp](http://gulpjs.com/) appeared. Plugins available through npm, made both task runners powerful.

Task runners are great tools on a high level. They allow you to perform operations in a cross-platform manner. The problems begin when you need to splice various assets together and produce bundles. This is the reason we have bundlers, such as [Browserify](http://browserify.org/) or [Webpack](https://webpack.github.io/).

Continuing further on this path, [JSPM](http://jspm.io/) pushes package management directly to the browser. It relies on [System.js](https://github.com/systemjs/systemjs), a dynamic module loader. Unlike Browserify and Webpack, it skips the bundling step altogether during development. You can generate a production bundle using it, however.

## Browserify

Browserify is one solution to the module problem. It provides a way to bundle *CommonJS* modules together. You can hook it up with Gulp. There are smaller transformation tools that allow you to move beyond the basic usage. For example, *watchify* provides a file watcher that creates bundles for you during development. This will save some effort and no doubt is a good solution up to a point.

## Webpack

In its simplicity, it is a module bundler. It takes a bunch of assets in and outputs assets you can give to your client.

Webpack takes a more monolithic approach than Browserify. Whereas Browserify consists of multiple small tools, Webpack comes with a core that provides a lot of functionality out of the box. The core can be extended using specific loaders and plugins.

### Why use webpack?

* Hot Module Replacement
* Dynamic bundle loading
* Loaders and Plugins
* Asset Hashing
* commonJS, AMD, ES6
* Live reload

# Development with webpack

Obviously for development you already should have `node.js`, better via [nvm](https://github.com/coreybutler/nvm-windows), `npm`, `git`, `.gitignore`

# Install

```
npm i webpack -D
```

npm maintains a directory where it installs possible executables of packages. You can display the exact path using

```
npm bin -> .../node_modules/.bin
```

# Directory Structure

Set up a structure like this:

```
/app
    index.js
    component.js
/build
    index.html
package.json
webpack.config.js
```

# Setting Up Webpack Configuration

For this purpose we'll build `webpack.config.js`.

To map our application to build/bundle.js we need configuration like this:

```
//webpack.config.js
const path = require('path');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

module.exports = {
  // Entry accepts a path or an object of entries.
  // The build chapter contains an example of the latter.
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  }
};
```

Difference [path.resolve vs path.join](https://www.google.com.ua/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&ved=0ahUKEwijtcCax-XKAhXCa3IKHeKEATYQFgggMAE&url=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F10822574%2Fdifference-between-path-normalize-and-path-resolve-in-node-js&usg=AFQjCNHGkW_e3ZkNAa8LW-F3DlMKLThd2A&sig2=KNJT8WqvuceEiFZK7nGDVw)

# Adding a Build Shortcut

Given executing node_modules/.bin/webpack is a little verbose, we should do something about it:

```
//package.json
...
"scripts": {
  "build": "webpack"
},
...
```

This works because npm adds `node_modules/.bin` temporarily to the path. As a result, rather than having to write `"build": "node_modules/.bin/webpack"`, we can do just `"build": "webpack"`.

# Setting Up webpack-dev-server

webpack-dev-server is a development server running in-memory. It refreshes content automatically in the browser while you develop your application. This makes it roughly equivalent to tools, such as *LiveReload* or *Browsersync*.

The greatest advantage Webpack has over these tools is *Hot Module Replacement* (HMR). In short, it provides a way to patch the browser state without a full refresh. 

```
npm i webpack-dev-server -D
```

Given our `index.html` is below `./build`, we should let` webpack-dev-server` to serve the content from there:

```
...
"scripts": {

  "build": "webpack",
  "start": "webpack-dev-server --content-base build" // --port 3000

},
...
```

# Splitting Up Configuration

As the development setup has certain requirements of its own, we'll need to split our Webpack configuration. Given Webpack configuration is just JavaScript, there are many ways to achieve this. At least the following ways are feasible:

*   Share configuration through module imports. You can see this approach in action at [webpack/react-starter](https://github.com/webpack/react-starter/blob/master/make-webpack-config.js)
*   Push configuration to a library which you then consume. Example: [HenrikJoreteg/hjs-webpack](https://github.com/HenrikJoreteg/hjs-webpack#usage).
* Maintain configuration within a single file and branch there. If we trigger a script through npm (i.e., `npm run test`), npm sets this information in an environment variable. We can match against it and return the configuration we want.

To keep things simple and help with the approach, I've defined a custom `merge` function that concatenates arrays and merges objects. This is convenient with Webpack as we'll soon see:

```
npm i webpack-merge --save-dev
```

Next, we need to define some split points to our configuration so we can customize it per npm script:

```
//webpack.config.js
...

const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

module.exports = {

  const common = {

    // Entry accepts a path or an object of entries.
    // The build chapter contains an example of the latter.
    entry: PATHS.app,
    output: {
      path: PATHS.build,
      filename: 'bundle.js'
    }
  };

  // Default configuration
  if(TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {});
  }

  if(TARGET === 'build') {
    module.exports = merge(common, {});
  }
```

# Configuring Hot Module Replacement (HMR)

Hot Module Replacement gives us simple means to refresh the browser automatically as we make changes. 

In order to make this work, we'll need to connect the generated bundle running in-memory to the development server. Webpack uses *WebSocket* based communication to achieve this.

Beyond this we'll need to enable `HotModuleReplacementPlugin` to make the setup work:

```
//webpack.config.js

...

const webpack = require('webpack');

...

if(TARGET === 'start' || !TARGET) {

  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin() // (!)
    ]
  });

}
...
```

Given we pushed `contentBase` configuration to JavaScript, we can remove it from `package.json`:

```
//package.json
...
"scripts": {
  "build": "webpack"

  "start": "webpack-dev-server" //--watch-poll --inline --hot

},
...
```

# Refreshing CSS

[What are loaders](http://webpack.github.io/docs/using-loaders.html]?)

Loaders are transformations that are applied on a resource file of your app. They are functions (running in node.js) that take the source of a resource file as the parameter and return the new source.

For example, you can use loaders to tell webpack to load `CoffeeScript` or `JSX`

To load CSS into a project, we'll need to use a couple of loaders:

```
npm i css-loader style-loader --save-dev
```

Now that we have the loaders we need, we'll need to make sure Webpack is aware of them:

```
//webpack.config.js
...
const common = {
  ...
  },

  module: {
    loaders: [
      {
        // Test expects a RegExp! Note the slashes!
        test: /\.css$/,
        loaders: ['style', 'css'],
        // Include accepts either a path or an array of paths.
        include: PATHS.app // It is a good idea to set up include always
      }
    ]
  }

}
...
```

The loaders are evaluated from right to left. In this case, `css-loader` gets evaluated first, then `style-loader`. `css-loader` will resolve `@import` and url statements in our CSS files. `style-loader` deals with require statements in our JavaScript. A similar approach works with CSS preprocessors, like Sass and Less, and their loaders.

# Enabling Sourcemaps

In Webpack this is controlled through the devtool setting:

```
//webpack.config.js
...

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',

    ...
  });
}

...
```

In this case, we're using `eval-source-map`. It builds slowly initially, but it provides fast rebuild speed and yields real files.

Faster development specific options, such as `cheap-module-eval-source-map` and `eval`, produce lower quality sourcemaps. Especially `eval` is fast and is the most suitable for large projects.

# Library and externals

Recommended [configuration](https://webpack.github.io/docs/library-and-externals.html) (only relevant stuff):

```
//webpack.config.js
{
    output: {
        // export itself to a global var
        libraryTarget: "var",
        // name of the global var: "Foo"
        library: "Foo"
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    }
}
```

# NODE_ENV and plugins

We will use standard for node.js developers variable `NODE_ENV` and plugin [DefinePlugin](https://github.com/webpack/docs/wiki/internal-webpack-plugins#defineplugindefinitions)

```
//webpack.config.js
...
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require(webpack);
...
plugins: [
    new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV)
    });
]
```

# Final app sources

The final source of the article [here](https://github.com/survivejs/webpack_react/tree/dev/project_source/02_developing_with_webpack/kanban_app)

Save my day: [http://survivejs.com/](http://survivejs.com/webpack_react/webpack_and_react/()