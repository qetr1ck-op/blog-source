title: 'Organizing an application using AMD with require.js'
thumbnailImage: title.jpg
categories:
  - Javascript
date: 2014-12-20 12:39:53
tags:
    - async
---

RequireJS is a JavaScript file and module loader. It is optimized for in-browser use, but it can be used in other JavaScript environments

<!--more-->

<!--toc-->

#    What is AMD?
Asynchronous Module Definitions designed to load modular code asynchronously in the browser and server. It is actually a fork of the [Common.js](http://requirejs.org/docs/commonjs.html) specification. Many script loaders have built their implementations around AMD, seeing it as the future of modular JavaScript development.

#    Example File Structure
There are many different ways to lay out your files and I believe it is actually dependent on the size and type of the project. In the example below views and templates are mirrored in file structure.

```
/* File Structure
├── imgs
├── css
│   └── style.css
├── templates
│   ├── projects
│   │   ├── list.html
│   │   └── edit.html
│   └── users
│       ├── list.html
│       └── edit.html
├── js
│   ├── libs
│   │   ├── jquery
│   │   │   ├── jquery.min.js
│   │   ├── backbone
│   │   │   ├── backbone.min.js
│   │   └── underscore
│   │   │   ├── underscore.min.js
│   ├── models
│   │   ├── users.js
│   │   └── projects.js
│   ├── collections
│   │   ├── users.js
│   │   └── projects.js
│   ├── views
│   │   ├── projects
│   │   │   ├── list.js
│   │   │   └── edit.js
│   │   └── users
│   │       ├── list.js
│   │       └── edit.js
│   ├── router.js
│   ├── app.js
│   ├── main.js  // Bootstrap
│   ├── order.js //Require.js plugin
│   └── text.js  //Require.js plugin
└── index.html
*/
```

#    Bootstrapping your application

Using [Require.js](http://requirejs.org/docs/start.html) we define a single entry point on our index page. We should setup any useful containers that might be used by our Backbone views.

Note: The data-main attribute on our single script tag tells Require.js to load the script located at "js/main.js". It automatically appends the ".js"

```
<!doctype html>
<html lang="en">
<head>
    <title>Jackie Chan</title>
    <!-- Load the script "js/main.js" as our entry point -->
    <script data-main="js/main" src="js/libs/require/require.js"></script>
</head>
<body>

<div id="container">
  <div id="menu"></div>
  <div id="content"></div>
</div>

</body>
</html>
```

You should most always end up with quite a light weight index file. You can serve this off your server and then the rest of your site off a CDN ensuring that everything that can be cached, will be.

#    What does the require.js look like?

Our bootstrap file will be responsible for configuring Require.js and loading initially important dependencies.

In the example below we configure Require.js to create a shortcut alias to commonly used scripts such as jQuery, Underscore and Backbone.

Note: Modules are loaded relatively to the boot strap and always append with `.js`. So the module `app` will load `app.js` which is in the same directory as the bootstrap.

```
// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery/jquery',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone'
  }

});

require([

  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});
```

This awesome [article](http://backbonetutorials.com/organizing-backbone-using-modules/) saves my day.