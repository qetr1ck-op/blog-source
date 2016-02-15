title: 'Kata (String): Reverse words'
date: 2016-02-13 11:50:12
tags:
---

Write a `reverseWords` function that accepts a string a parameter, and reverses each word in the string. Every space should stay, so you cannot use words from Prelude.

<!--more-->

Example:

```
reverseWords("This is an example!"); // returns  "sihT si na !elpmaxe"
```

Test:

```
Test.assertEquals(reverseWords("This is an example!"), "sihT si na !elpmaxe")
```

Result:

```
const reverseWords = str => {
  return str
    .split(' ')
    .map( word => word.split('').reverse().join('') )
    .join(' ');
}
```