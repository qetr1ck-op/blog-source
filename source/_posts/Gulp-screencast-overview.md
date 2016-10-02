title: Gulp screencast overview
thumbnailImagePosition: right
date: 2016-09-28 20:43:36
thumbnailImage: http://i.imgur.com/MnkofJm.gif
categories:
tags:
---

In depth, table of contents of one of the most popular screencast about utility for managing tasks.

<!--more-->
<!--toc-->


# What is Gulp? Compare with Webpack, etc.

What is Gulp?

1. Gulp as a "streaming build system", and moreover, it's a utility for declaring tasks [0:10](https://youtu.be/uPk6lQoTThE?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=10)
3. Example `gruntfile.js`[0:53](https://youtu.be/uPk6lQoTThE?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=53)
4. Comparing with Grunt. [2:50](https://youtu.be/uPk6lQoTThE?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=170)
  1. `gruntfile.js` vs `gruntfile.js`
  2. More compact config
  3. Virtual File System - Vinyl FS. No temp folders
  4. Power of streams, streams parallelism
5. Comparing with Webpack [10:10](https://youtu.be/uPk6lQoTThE?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=600)
  1. Deps: CommonJS, AMD, ES2015
  2. Dynamic loading
  3. CommonsChungPlugin
  4. APIs
6. Webpack + Gulp = 💕 [16:45](https://youtu.be/uPk6lQoTThE?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=825)
  1. Tasks: Gulp
  2. JS Build: Webpack 


# Install and task running

1. Installing strategies: local vs global [0:22](https://youtu.be/xptUdO3GuG8?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=22)
2. Installing v4 `npm i -D gulpjs/gulp.git#4.0`
3. First task [3:49](https://youtu.be/xptUdO3GuG8?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=229)
  1. Callback for finish async operation 
  2. Task name as function name
  3. Separate tasks with namespace `deploy:production`
  4. Strategies for finish async operations
  5. `gulp.series` and `gulp.parallel`

- [Migrate to v4](https://www.liquidlight.co.uk/blog/article/how-do-i-update-to-gulp-4/)
- [Code examples](https://github.com/iliakan/gulp-screencast/tree/master/02-basics)

# Streams Vinyl-FS

1. Example streams with coping files [0:45](https://youtu.be/NBdKplKl_3Q?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=45)
2. `gulp.src` and `gulp.dest` output as readable/writable streams of instance Vinyl-FS [1:05](https://youtu.be/NBdKplKl_3Q?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=65)
3. Log working files `.on('data', (file) => file)` [1:48](https://youtu.be/NBdKplKl_3Q?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=118)
4. File getter properties [3:10](https://youtu.be/NBdKplKl_3Q?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=190)
5. Control `gulp.dest` output [4:45](https://youtu.be/NBdKplKl_3Q?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=285)
6. Module `minimatch` and popular pattens [6:48](https://youtu.be/NBdKplKl_3Q?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=418)
7. Performance issue with globs [9:13](https://youtu.be/NBdKplKl_3Q?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=553)
8. Summary [11:50](https://youtu.be/NBdKplKl_3Q?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=710)

- [Code examples](https://github.com/iliakan/gulp-screencast/tree/master/03-vinyl)

# Basic build for styles

1. App structure [0:25](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=26)
2. Declaring task for stylus [1:13](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=73)
3. Change destination directory [5.40](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=344)
4. Concat files [7:10](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=430)
5. Log info with `gulp-debug` [7:50](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=470)
6. Create `main.styl` [10:31](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=631)
7. Add source maps [11:30](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=690)
8. Generate source maps only in dev mode [15:05](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=904)
9. Using `gulp-if` [17:05](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=1025)
10. Create `clean` task with `del` [19:05](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=1145)
11. Create `copy` task with `gulp.parallel` [20:24](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=1229)
12. Result in browser with `node-static` [21:55](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=1315)
12. Summary [23:18](https://youtu.be/_BFWG82mMkw?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=1397)

- [Code examples](https://github.com/iliakan/gulp-screencast/tree/master/04-styles-3)

# Incremental build, watch

1. Create `gulp.watch` for styles [0:30](https://youtu.be/jocvHauHcA4?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=30)
2. What does "incremental build" actually mean? Caching [1:55](https://youtu.be/jocvHauHcA4?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=115)
3. Create `gulp.watch` for assets with caching with `{ since: gulp.lastRun('taskName') }` [3:55](https://youtu.be/jocvHauHcA4?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=235)
4. Module `chokidar` and deleting files with watch [6:49](https://youtu.be/jocvHauHcA4?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=410)
5. Decoupling watch-es into separate task [8:32](https://youtu.be/jocvHauHcA4?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=512)
6. Summary [9:32](https://youtu.be/jocvHauHcA4?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=573)

- [Code examples](https://github.com/iliakan/gulp-screencast/tree/master/05-watch)

# Incremental and performance

1. Filter new files for first task run with `gulp-newer` [0:36](https://youtu.be/uYZPNrT-e-8?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=35)
2. Problem with `gulp-remember` on example with `gulp-autoprefixer` [3:57](https://youtu.be/uYZPNrT-e-8?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=237)
3. Problem with returning deleted files from IDE, using `gulp-cached` as alternative of `since` [10:10](https://youtu.be/uYZPNrT-e-8?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=609)
4. Summary [15:20](https://youtu.be/uYZPNrT-e-8?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=920)

- [Code examples 1](https://github.com/iliakan/gulp-screencast/tree/master/06-watch-perf-remember-cached)
- [Code examples 2](https://github.com/iliakan/gulp-screencast/tree/master/06-watch-perf-newer)

# Browser auto-reloading, browser-sync

1. We don't want to every time hit `F5`! Flow overview [0:14](https://youtu.be/oiMJNIG-yvg?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=14)
2. Create `sync` task with `browser-sync` [1:34](https://youtu.be/oiMJNIG-yvg?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=104)

- [Code examples](https://github.com/iliakan/gulp-screencast/tree/master/07-browsersync)

# Error handling

1. Make an error [0:20](https://youtu.be/otkXzef2wQY?t=20)
2. Was error couched? [1:25](https://youtu.be/otkXzef2wQY?t=85)
3. Notification for an error with `gulp-notify` [2:51](https://youtu.be/otkXzef2wQY?t=171)
4. Catch all errors on task with `gulp-plumber` [6:30](https://youtu.be/otkXzef2wQY?t=390)
5. Solution with `multipipe` [9:50](https://youtu.be/otkXzef2wQY?t=590)

- [Code examples 1](https://github.com/iliakan/gulp-screencast/tree/master/08-errors-combiner)
- [Code examples 2](https://github.com/iliakan/gulp-screencast/tree/master/08-errors-plumber)

# Creating plugins with "through2"

1. What we need to start [0:29](https://youtu.be/Ijg9I1CY7Ok?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=29)
2. A real example [3:41](https://youtu.be/Ijg9I1CY7Ok?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=221)

- [Code examples 1](https://github.com/iliakan/gulp-screencast/tree/master/09-plugins-through2)
- [Code examples 2](https://github.com/iliakan/gulp-screencast/tree/master/09-plugins-through2-2)

# More complex stream with "eslint", "gulp-if", "stream-combiner2"

1. Example with `pre-commit` [1:55](https://youtu.be/pjdrg6n5puU?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=115)
2. Optimize repeatable checks [4:08](https://youtu.be/pjdrg6n5puU?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=248)
3. Performance summary [14:50](https://youtu.be/pjdrg6n5puU?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=890)

- [Code examples](https://github.com/iliakan/gulp-screencast/blob/master/10-plugins-lint/gulpfile.js)

# How we know Node.JS streams?

1. A small test [0:20](https://youtu.be/5aJB4vJlHBs?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=20)
2. Why it isn't work? [1:05](https://youtu.be/5aJB4vJlHBs?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=65)
3. Fix the "pause" problem [4:00](https://youtu.be/5aJB4vJlHBs?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=280)
 
- [Code examples](https://github.com/iliakan/gulp-screencast/tree/master/11-plugins-streams)

# Structure of "gulpfile.js"

1. We have problems, don't we? [0:20](https://youtu.be/Qc6go3cNuRk?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=20)
2. A solution is task decomposition [1:50](https://youtu.be/Qc6go3cNuRk?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=110)
3. Adding `gulp-load-plugins` [5:05](https://youtu.be/Qc6go3cNuRk?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=305)
3. Result after refactoring [6:50](https://youtu.be/Qc6go3cNuRk?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&t=410)
 
- [Code examples](https://github.com/iliakan/gulp-screencast/tree/master/11-plugins-streams)
