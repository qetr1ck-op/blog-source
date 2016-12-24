title: RESTful Web Services with Node.js and Express
thumbnailImagePosition: right
date: 2016-12-18 12:01:04
thumbnailImage: http://marmelab.com/images/blog/microrest_small.jpg
categories:
tags:
---

Node.js is a simple and powerful tool for backend development. When combined with express, you can create lightweight, fast, scalable APIs quickly and simply.
<!--more-->
<!--toc-->

# What is REST anyway?

The term **RE**presentational **S**tate **T**ransfer came from a dissertation written by Roy Fielding back in 2000.
He described a series of constraints that should be in place whenever two systems talk to each other. 

So ultimately REST is just a series of rules in place for your server, so everyone who uses your service understand 
what it does and how it works.

# The Uniform interface

Whenever you're dealing with RESTful service you'll be dealing with a resource or resources and all that really means
is you're dealing with with **nouns**.

Uniform resource are built around things, not actions.

For example dealing with books as a resource, the url be `http://domain/books`. With authors it would be `/authors`.

The another part of uniform interface are HTTP **verbs** that we use in our request will dictate the type of activity
we're trying to do on the resource:

* `GET` will simply request data (`/books` get all or `/books/:id` a unique book)
* `POST` uses to add data (`/books` add new book)
* `DELETE` will remove an entity (`books/:id`)
* `PUT` is used for update or replace a resource
* `PATCH` updates piece of that resource

The last part of interface is HATEOS (Hypermedia as the Engine of Application State). Basically all that means is 
that in each request will be a set of hyperlinks that you can use to navigate the API. In example, what type of 
actions you can do on a particular resource.

# The project 

The project walk through how to stand up a lightweight Express server serving truly RESTful services using Node.js, Mongoose, and MongoDB. 
There are implemented all of the RESTful verbs to get, add, and update data with working through unit and e2e-integration tests for our services.

[Link](https://github.com/qetr1ck-op/RESTful-Web-Services-with-Node.js-and-Express) on GitHub

Save my day:

* [RESTful Web Services with Node.js and Express](https://app.pluralsight.com/library/courses/node-js-express-rest-web-services/description) by Jonathan Mills on pluralsight