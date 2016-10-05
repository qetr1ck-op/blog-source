title: Preflighted HTTP OPTIONS requests
thumbnailImagePosition: right
date: 2016-09-18 21:02:27
thumbnailImage:
categories:
tags:
---

What is not-so-simple HTTP request?

<!--more-->
<!--toc-->

# The Cross-Origin Resource sharing short overview

The CORS standard works by adding new HTTP headers that allows servers to describe the sets of origins that are permitted to read that information.

If browser performs request with "side-effects" aka not a "simple request", the specification says that that browser need to "preflight" an HTTP OPTIONS request. And then, upon "approval" from the server, sends the actual request.

# The "simple request"

A simple cross-site request is one that meets all the following conditions:

The only allowed methods are:
* `GET`
* `HEAD`
* `POST`

Apart the headers which are set automatically by the browser (`Connection`, `User-Agent`, etc.), the only headers which are allowed to be manually set are:
* `Accept`
* `Accept-Language`
* `Content-Language`
* `Content-Type`

The only allowed values for the `Content-Type` header are:

* `application/x-www-form-urlencoded`
* `multipart/form-data`
* `text/plain`

# Preflighted requests

Unlike simple requests, "preflighted" first send an HTTP request by the OPTIONS method to the resource on the server, in order to determine whether the actual request is safe to send.

An [example](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests) which creates `XHR` and an HTTP transaction log.

# CORS flow

An awesome [diagram](https://www.html5rocks.com/static/images/cors_server_flowchart.png) of processing HTTP CORS transaction