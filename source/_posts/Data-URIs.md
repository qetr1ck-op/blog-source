title: Data URIs
date: 2014-02-11 12:48:12
categories:
    - Javascript
---

Did you know that you don't have to link to an external image file when using an `<img>` element in HTML, or declaring a `background-image` in CSS? You can embed the image data directly into the document with data URIs.

<!--more-->

<!--toc-->

# Why would you do this?

The biggest reason: it saves HTTP Requests. Other than pure document size, this is the #1 factor concerning how fast a page loads. Less = better.

The format, to be specific:

```
data:[<mime type>][;charset=<charset>][;base64],<encoded data>
```

```
li {
  background:
    url(data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7)
    no-repeat
    left center;
  padding: 5px 0 5px 25px;
}
```

```
<img width="16" height="16" alt="star" src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7" />
```

# How do you get the code?

Use this [online conversion tool](http://websemantics.co.uk/online_tools/image_to_data_uri_convertor/). It's the nicest one I have found. Here's a [drag and drop one](http://jpillora.com/base64-encoder/).

Save my day: [css-tricks.com](https://css-tricks.com/data-uris/)