title: Gulp instruction
thumbnailImage: title.gif
date: 2016-02-03 23:47:28
tags:
	- Build Sytems
	- Gulp
categories:
	- Javascript
---

TODO
<!--more-->

<!--toc-->

# Gulp, who are you?

When we open main Gulp page we will see 

> Streaming build system

First of all let's consider *build system*:

## Build: `gulpfile.js`

```
*!
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

// Styles
gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/styles', 'dist/scripts', 'dist/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});
```

More info about that [configuration](https://markgoodyear.com/2014/01/getting-started-with-gulp/).

## Deploy: deploy/gulpfile.js

In previous example I say that Gulp can be *build system*. But is Gulp is more. Gulp is a system to describe custom tasks. 
Next example deploy `dist` folder to GiHub Pages:

```
var gulp        = require('gulp');
var deploy      = require('gulp-gh-pages');

/**
 * Push build to gh-pages
 */
gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});
```

More info [here](http://charliegleason.com/articles/deploying-to-github-pages-with-gulp).

## Core: Vinil-FS

For better understanding let's compare Gulp with Grunt. I are not blaming Grunt, it's still a popular. I will compare it just as an alternative.

### gruntfile.js

```
const grunt = require('grunt');

grunt.loadNpmTasks('grunt-sass'); // 
grunt.loadNpmTasks('grunt-autoprefixer');

grunt.initConfig({
	sass: {
		dist: {
			files: [{
				src: 'dev/*.scss', // get files
				dest: '.tmp/styles', // put result here
				ext: '.css'
			}]
		}
	},
	autoprefixer: { // runs only after previous task
		dist: {
			files: [{
				src: '{,*/}*.scss', // proccess files
				cwd: '.tmp/styles' // work with directory
				dest: 'css/styles', // put result
			}]
		}
	},
	watch: {
		styles: {
			files: ['dev/*.scss'], // watch for files
			tasks: ['sass', 'autoprefixer'] // trigger after change
		}
	}
})

grunt.registerTask('default', ['sass', 'autoprefixer', 'watch']);
```
I can see ordinary overflow of Grunt process on the image:

![](/img.jpg)

It's easy to see redundant steps, I don't need `temp` directories.

### gulpfile.js

```
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

gulp.task(function sass() {
	return gulp.src('dev/*scss') // get files, AND create stream (Node's readable stream) with object instance of Vinil.js
															 // AND one more, streams send data immediately, don't wait until the whole file will be processed
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('css/styles')); // save stream in dir
});

gulp.task('default', gulp.series('sass', function() {
	gulp.watch('dev/*scss', gulp.series('sass'));
}))

```

On image clear work-flow of Gulp:

![](/img2.jpg)

Another example with uploading files:

```
var gulp = require('gulp');
var sftp = require('gulp-sftp');

gulp.task('default', function () {
    return gulp.src('src/*') // gulp don't wait for all files
        .pipe(sftp({				 // downloading start immediately
            host: 'website.com',
            user: 'johndoe',
            pass: '1234'
        }));
});
```

## Gulp vs Grunt

After comparing two approaches we can summarize, that Gulp:

*	more compact `config`, side effect - more peoples like style of declaration task
* VFS (virtual file system): no `temp` folder, as a result - faster
* stream parallelism

## Gulp vs ... Webpack

Gulp, it isn't *system* for *build *. It's a system to describe custom tasks with variate of plugins as we saw [here](#Build_3A_gulpfile-js). 

Webpack is a system to bundle JavaScript files:

*	Create dependency: CommonJS, AMD, ES-2015
* Bundle as one/couple bundles
* Dynamic loading (`require-insure`)
* Loaders for styles, picture...
* Plugins APIs

So Webpack is powerful system for bundling. Implement this features with Gulp hard or even impossible. So if Gulp is enough for you just don't use Webpack. 
One more thing, Webpack great deals Gulp:

*	Tasks: Gulp
* JS build: Webpack

![](/img3.jpg)

# Installation and run tasks

We need both, local (`require(gulp)`) and global (`in cli`) instance of Gulp:

## Install globally and locally
```
npm i -g -D gulp
```

## Install only locally via npm scipts

Sometimes developer won't to install Gulp globally.

```
npm i -D gulpjs/gulp#4.0
```
And add in `package.json`:

```
"scripts": {
  "gulp": "./node_modules/.bin/gulp"
},
```

## Install only locally via PATH

On unix:
```
echo $PATH

export $PATH=./node_modules/.bin/gulp:$PATH
```
On windows:
```
echo %PATH%

setx path "%path%;./node_modules/.bin/gulp
```

## Create first gulpfile.js

```
'use strict'

const gulp = require('gulp');

gulp.task('hello', function(cb) {
  console.log('Hello!');
  
  cb(); // say that async task done, error first parameter
});
```

Task can be without name, name will get from `fn.name`:

```
const gulp = require('gulp');

gulp.task(hello); // but name can't be reserved word, 'default' ...

function hello(cb) {
  console.log('Hello!');
  
  cb(); // say that async task done
}
```

If in project are a lot of modules, the name of task can be:

```
gulp.task('deploy:reload', function(cb) {
  console.log('Hello!');
  
  cb(); // say that async task done, error first parameter
});
```

## Exit from task, run in series and parallel

```
const gulp = require('gulp');

gulp.task('hello', function(cb) {
  console.log('Hello!');
  cb();
});

gulp.task('example:promise', function(cb) {
  return Promise.resolve('result');
});

gulp.task('example:stream', function(cb) {
  // reads all data from input stream -> ignores data -> done
  return require('fs').createReadStream(__filename); // can't return result!
});

gulp.task('example:process', function(cb) {
  // returns child process
  return require('child_process').spawn('ls', ['.'], {stdio: 'inherit'})
});

gulp.task('default', gulp.series('hello', 'example:promise', 'example:stream', 'example:process'));
// gulp.task('default', gulp.parallel('hello', 'example:promise', 'example:stream', 'example:process')); run in parallel

```

# Streams Vinyl-FS

Let's get knowledge about `Vinyl`, a simple but a crucial example:

```
const gulp = require('gulp');

gulp.task('default', function(cb) {
  return gulp.src('source/**/*.*')
  	.pipe(gulp.dest('dest'));
});
```

This task will copy files and saves directory structure. `gulp.src` it's a command of module `vinyl-fs`, so basically his job is working with files and create instance of `vinyl`. More in the [vinyl module](https://www.npmjs.com/package/vinyl). So sharing stream (from one `pipe` to another) is a `vinyl` object:

```
const gulp = require('gulp');

gulp.task('default', function(cb) {
  return gulp.src('source/**/*.*')
  	.data('data', function(file) {
  		console.log(file); // logs Buffer as a binary presentation of file
  	})
  	// and we still can use chaining
  	.pipe(gulp.dest('dest'));
});
```

## base and relative path

The question is, how Gulp save structure of folders? Lets consider more detailed example:

```
const gulp = require('gulp');


const gulp = require('gulp');

gulp.task('default', function() {
  return gulp.src('source/**/*.*')
      .on('data', function(file) {
        console.log({
          contents: file.contents,
          path:     file.path,
          cwd:      file.cwd,
          base:     file.base,
          // path component helpers
          relative: file.relative,
          dirname:  file.dirname,  // .../source/1
          basename: file.basename, // 1.js
          stem:     file.stem,     // 1
          extname:  file.extname   // .js
        });
      })
      .pipe(gulp.dest('dest')); // folder/file.ext
      
});
```

`file.base` is an important property. We can divide pattern `'source/**/*.*'` on two pieces:

* `base`, before `*` - `'source/`
* `relative`,  after - `**/*.*'`

So in the end `gulp.dest()` recessives `relative path`, knows about folder structure and copy file in `'dest/folder/file.ext'`.

## specific `gulp.dest`

What if we want save file depends on it extension name?

```
.pipe(gulp.dest(function(file) {
  return file.extname == '.js' ? 'js' :
      file.extname == '.css' ? 'css' : 'dest';
}));
```

## minimatch

To have possibility to parse the pattern `'source/**/*.*'` Gulp in his source uses model [minimatch](https://github.com/isaacs/minimatch). A useful to test minimatch patterns - [globtester](http://www.globtester.com/).

A few examples:

```
gulp.src('source/**/*.{js,css}') // with ext js,css

gulp.src('{source1,source2}/**/*.{js,css}') // from dirs

gulp.src('[source1/**/*.js], [source2/**/*.css]') // get in sequence, first js, then css

gulp.src('source/**/*.*, `!node_modules/**`) // ignore folder, it's very slow!

gulp.src('{css,js,source}/**/*.*, file1.js, file2.js`) // better to search what we are need

```

## Exclude content from stream

When don't need read whole files from stream, we just need to pass stream to another task:

```
gulp.src('movies/**/*.mp4', { read: false })
	.on('data', function(file) {
      console.log({
        contents: file.contents // null
      })
   }) 
```

Example with [mocha](https://github.com/sindresorhus/gulp-mocha):

```
const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('default', () => {
    return gulp.src('test.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});
```

# Simple system to build styles

`gulpfile.js` for parsing `*.sass` files into `*.css`:

```
const gulp = require('gulp');
const sass = require('gulp-sass')
const concat = require('gulp-concat')

gulp.task('styles', function() {
	return gulp.src('src/sass/**.sass', {base: 'src'}) // need to return, otherwise async won't stop
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('all.css')) // wait for all streams
		.pipe(gulp.dest('public'));
})
```

## gulp-debug

To monitoring of Gulp workflow, we are using `gulp-debug`:

```
const debug = require('gulp-debug')

gulp.task('styles', function() {
	return gulp.src('src/sass/**.sass', { base: 'src' }) // need to return, otherwise async won't stop
		.pipe(gulp.debug({ title: 'src'}));
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.debug({ title: 'sass'}));
		.pipe(concat('all.css')) // wait for all streams
		.pipe(gulp.debug({ title: 'concat'}));
		.pipe(gulp.dest('public'));
})
```

## add source maps

Basically it's a way to map a combined/minified file back to an unbuilt state.

```
const sourcemaps = require('gulp-sourcemaps')

gulp.task('styles', function() {
	return gulp.src('src/sass/main.sass')
	  .pipe(sourcemaps.init()) // create file.sourceMap, and after, all rest of plugin know about source maps
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public'));
})
```

## process.env.NODE_ENV

What if you want add source maps only in development stage:

```
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task('styles', function() {
	let pipeline = gulp.src('sass/main.sass');

	if (isDevelopment) {
		pipeline = pipeline.pipe(sourcemaps.init());
	}

	pipeline = pipeline
		.pipe(sass().on('error', sass.logError));

	if (isDevelopment) {
		pipeline = pipeline.pipe(sourcemaps.write());
	}

	return pipeline
		.pipe(gulp.dest('public'));
})
```

How to set `NODE_ENV` [here](http://stackoverflow.com/questions/9198310/how-to-set-node-env-to-production-development-in-os-x).

Other approach, more elegant with [gulp-if](https://github.com/robrich/gulp-if):

```
const gulpIf = require('gulp-if')
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task('styles', function() {
	return gulp.src('sass/main.sass')
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError));
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('public'));
})
```

Module has a lot of option:

```
	//...stream
		.pipe(gulpIf(function(file) {
			return file.extname === 'js';
		}, callSmts() )) 

```

## Clean directory and separate other tasks

We will use `del` plugin:

```
const del = require('del')

gulp.task('styles', function() {
	return gulp.src('sass/main.sass')
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError));
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('public'));
})

gulp.task('clean', function() {
	return del('public');
})

gulp.task('assets', function() {
	return gulp.src('src/assets/**')
		.pipe(gulp.dest('public'));
})

gulp.task('build', gulp.series('clean', ['styles', 'assets']))
```

