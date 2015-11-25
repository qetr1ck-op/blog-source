title: 'Web Services, WSDL, SOAP envelope with JavaScript'
tags:
  - Javascript
  - SOAP
  - Web
  - WSDL
categories:
  - Javascript
date: 2014-03-17 22:18:22
---

The main concept of Web Services is to exchange data between two devices using standardized protocols and messages.

<!--more-->

<!-- toc -->

*   [What is Web Service and WSDL?](#What is Web Service and WSDL?)
*   [SOAP protocol](#SOAP protocol)
*   [Example of SOAP envelope](#Example of SOAP envelope)
*   [Create/receive SOAP request/response. Helpers](#Create/receive SOAP request/response. Helpers)
*   [$.soap](#$.soap)


<a href="" name="What is Web Service and WSDL?"></a>
<div class="title-block">What is Web Service and WSDL?</div>

The W3C defines a `Web services`: a software system designed to support machine-to-machine interaction over network. Other systems interact with the Web service in a manner prescribed by its description using `SOAP` messages, `REST`, or using `HTTP` with an XML serialization with other Web-related standards

And for be little clear about `WSDL` (Web Services Description Language) - describes services as collection of network endpoints or ports in `XML` format.

Exchange messages usually accomplished by protocol `HTTP`. However, it should be noted that it is still used, but very rarely, protocol - `SMTP` (Simple Mail Transfer Protocol).

<a href="" name="SOAP protocol"></a>
<div class="title-block">SOAP protocol</div>

Protocol `SOAP` transfers messages or small amount of information. `SOAP` messages formatted in `XML` and are typically send using `HTTP`. Some time ago `SOAP` was spelled as Simply Object Access Protocol. But time passed and everybody saws that protocol isn't simple and nothingness in common with access to objects.

<img alt="post-img" src="soaps.jpg" alt="SOAP is just a soap">

<a href="" name="Example of SOAP envelope"></a>
<div class="title-block">Example of SOAP envelope</div>

The `SOAP` message has 3 parts: `envelope, head, body`. Body contains all `response/request` data. Also can say that head isn't required and in modern apps doesn't used.

<img alt="post-img" src="soap-message.gif" alt="Example of SOAP envelope">

Example of SOAP XML:

<script src="https://gist.github.com/qetr1ck-op/36b64c830a6aa4076052.js"></script>

What here have happened? In the beginning I created SOAP envelope, which call `service` with URN (Uniform Resource Name). Then calling `method` getProductByHash.

SOAP `response` of web-service have next view, only body tag:

<script src="https://gist.github.com/qetr1ck-op/1b34f422a0c2cf8068c9.js"></script>

[]()
<a href="" name="Create/receive SOAP request/response. Helpers"></a>
<div class="title-block">Create/receive SOAP request/response. Helpers</div>

To create soap envelope I use my `soap` helper module:

<script src="https://gist.github.com/qetr1ck-op/5361eaecf2f41b9c872a.js"></script>

Example creating `SOAP request` from `soap` helper as JS object:

<script src="https://gist.github.com/qetr1ck-op/d57aec2f863bf838a722.js"></script>

Loggin result in chrome log:

<a href="soap-object-log.png">
  <img alt="post-img" src="soap-object-log.png" alt="SOAP object">
</a>

Once I've obtained object with properties which I need to use to create `XML SOAP Request`. It's time to use `xml` helper module with whole bunch of useful methods:

<script src="https://gist.github.com/qetr1ck-op/cb9ab4fbc5f4debf8ce8.js"></script>

<ol>
  <li>Next creating XHR object, 2 callbacks and send request via POST method</li>
  <li>Parse XML into JSON object</li>
  <li>Fetch response value</li>
</ol>

<a href="" name="$.soap"></a>
<div class="title-block">$.soap</div>

This script uses `$.ajax` to send a `SOAP envelope`. It can take `XML DOM`, `XML string` or `JSON` as input and the response can be returned as either `XML DOM`, `XML string` or `JSON` too.

Example:

<script src="https://gist.github.com/qetr1ck-op/e0efd1cb0d63ba2b1350.js"></script>

Full <a href="https://github.com/doedje/jquery.soap">$.soap</a> documentation.
