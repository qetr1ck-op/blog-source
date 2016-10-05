title: JavaScript Promises
tags:
  - Promises
  - XHR
id: 506
categories:
  - Javascript
date: 2014-07-13 13:43:08
---

<!--toc-->
<!--more-->

#  Promises arrive in JavaScript!

Here's how you create a promise:

```
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
```

The `promise constructor` takes one argument, a callback with two parameters, `resolve` and `reject`. Do something within the callback, perhaps async, then call resolve if everything worked, otherwise call reject.

Here's how you use that promise:

```
promise.then(function(res) {
	console.log(res) //Stuff worked!
}, function(err) {
	console.log(err) //Error!
});
```

`then` takes two arguments, a callback for a `success` case, and another for the `failure` case. Both are optional, so you can add a callback for the success or failure case only.


#  Promisifying XMLHttpRequest

Old APIs will be updated to use promises, if it's possible in a backwards compatible way. `XMLHttpRequest` is a prime candidate, but in the mean time let's write a simple function to make a GET request:

```
function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}
```

Now let's use it:
```
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
});
```

#  Chaining

`then` isn't the end of the story, you can chain `then"s` together to transform values or run additional async actions one after another:

```
var promise = new Promise(function(resolve, reject) {
  resolve(1);
}

promise.then(function(val) {
  console.log(val); // 1
  return val + 2;
}).then(function(val) {
  console.log(val); // 3
});
```

As a practical example, let's go back to:

```
get('story.json').then(function(response) {
  return JSON.parse(response);
}).then(function(response) {
  console.log("Yey JSON!", response);
});
```

`getJSON` still returns a promise, one that fetches a url then parses the response as JSON.

```
function getJSON(url) {
  return get(url).then(JSON.parse);
}
```

#  Error handling

As we saw earlier, `then` takes two arguments, one for `success`, one for `failure` (or fulfill and reject, in promises-speak):

```
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.log("Failed!", error);
});
```

You can also use `catch`:

```
get('story.json').then(function(response) {
  console.log("Success!", response);
}).catch(function(error) {
  console.log("Failed!", error);
});
```

With our story and chapters, we can use catch to display an error to the user:

```
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  addHtmlToPage(chapter1.html);
}).catch(function() {
  addTextToPage("Failed to show chapter");
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
});
```

# Creating a sequence

But how can we loop through the `story.chapter` urls and fetch them in order?

```
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);
  // TODO: for each url in story.chapterUrls, fetch & display
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
});
```

This doesn't work:

```
story.chapterUrls.forEach(function(chapterUrl) {
  // Fetch chapter
  getJSON(chapterUrl).then(function(chapter) {
    // and add it to the page
    addHtmlToPage(chapter.html);
  });
});
```

We want to turn our chapterUrls array into a `sequence of promises`. We can do that using `then`:

```
// Start off with a promise that always resolves
var sequence = Promise.resolve();

// Loop through our chapter urls
story.chapterUrls.forEach(function(chapterUrl) {
  // Add these actions to the end of the sequence
  sequence = sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
});
```

We can tidy up the above code using `array.reduce`:

```
// Loop through our chapter urls
story.chapterUrls.reduce(function(sequence, chapterUrl) {
  // Add these actions to the end of the sequence
  return sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
}, Promise.resolve());
```

Let's put it all together…

```
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  return story.chapterUrls.reduce(function(sequence, chapterUrl) {
    // Once the last chapter's promise is done…
    return sequence.then(function() {
      // …fetch the next chapter
      return getJSON(chapterUrl);
    }).then(function(chapter) {
      // and add it to the page
      addHtmlToPage(chapter.html);
    });
  }, Promise.resolve());
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
});
```

But we can do better. At the moment our page is downloading like this:

![](http://www.html5rocks.com/en/tutorials/es6/promises/promise1.gif)

Browsers aren't pretty good at downloading `multiple` things at once, so we're losing performance by downloading chapters one after the other. What we want to do is download them all at the same time, then process them when they've all arrived. Thankfully there's an API for this:

```
Promise.all(arrayOfPromises).then(function(arrayOfResults) {
  //...
});
```

`Promise.all` takes an array of promises and creates a promise that fulfills when all of them successfully complete. You get an array of results (whatever the promises fulfilled to) in the same order as the promises you passed in.

```
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // Take an array of promises and wait on them all
  return Promise.all(
    // Map our array of chapter urls to
    // an array of chapter json promises
    story.chapterUrls.map(getJSON)
  );
}).then(function(chapters) {
  // Now we have the chapters jsons in order! Loop through…
  chapters.forEach(function(chapter) {
    // …and add to the page
    addHtmlToPage(chapter.html);
  });
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened so far
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
});
```

Depending on connection, this can be seconds faster than loading one-by-one:

![](http://www.html5rocks.com/en/tutorials/es6/promises/promise2.gif)