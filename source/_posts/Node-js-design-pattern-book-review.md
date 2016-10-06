title: Node.js design pattern book review
thumbnailImagePosition: right
date: 2016-10-06 21:11:33
thumbnailImage:
categories:
  - Javascript
  - Node.js
tags:
  - Javascript
  - Node.js
  - ...
---

"How could I organize my code?", "What is the best way to design this?", "How can I make my application more modular?", "How do I handle a set of asynchronous call effectively?", "How can I make sure that my application will not collapse while it grows?".

If you have such questions without answers, that book is definitely for you!

The aim of this book is to guide you through this emerging world of patterns, techniques and practices, showing proven solution to the common problem.

<!--more-->
<!--toc-->

# The Node.js philosophy

Some of these principles arise from the technology itself, some of them are enabled by its ecosystem, some are just trends in community, some directly come from its creator, another are influenced by the Unix culture.

* Small core
* Small modules
* Small surface area
* Simplicity and pragmatism

# The reactor pattern

The reactor pattern is the heart of the asynchronous nature of Node.js. The key concept here are single-threated architecture and non-blocking I/O.

## I/O is slow

I/O is definitely the slowest among the fundamental operations of a computer. Accessing to RAM is in the order of nanoseconds, while accessing data on disk the network is in order of milliseconds. For the bandwidth is the same story. RAM has a transfer rate consistently in the order of GB/s, while disk and network varies from MB/s to, optimistically, GB/s.

On the top of that, we also have to consider the human factor. Ofter input of an application comes from a real person, so the speed or frequency of I/O doesn't only depend on technical aspects.

## Blocking I/O

In traditional blocking I/O programming the function call corresponding to an I/O request will block the execution of the thread until the operation completes.

```javascript
// block the thread until the data is available
data = socket.read()
// data is available
print(data)
```

It's trivial to notice how web-server which is using blocking I/O will not be able to handle multiple connection in the same thread. Each operation will block the processing of any other connection:

{% image fancybox center images/blocking-input-output.png %}

