title: 'Kata (Functions, Curring): A chain adding function'
date: 2016-02-11 23:15:33
tags:
    - Kata
    - Strings
categories: 
    - Javascript
---
Write a reverseWords function that accepts a string a parameter, and reverses each word in the string:

```
reverseWords("This is an example!"); // returns  "sihT si na !elpmaxe"
```

```
Test.assertEquals(reverseWords("This is an example!"), "sihT si na !elpmaxe")
```

```
'use strict';

var reverseWords = str => {
  return str.split(' ')
    .map( word => word.split('').reverse().join('') )
    .join(' ')
}
```