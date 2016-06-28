title: "Format a string of names like 'Bart, Lisa & Maggie'"
date: 2016-02-19 00:05:14
tags:
    - Kata
    - String
categories: 
    - Javascript
    - Kata
---


Given: an array containing hashes of names

Return: a string formatted as a list of names separated by commas except for the last two names, which should be separated by an ampersand.
<!--more-->

``` javascript exapmle.js
list([ {name: 'Bart'}, {name: 'Lisa'}, {name: 'Maggie'} ])
// returns 'Bart, Lisa & Maggie'

list([ {name: 'Bart'}, {name: 'Lisa'} ])
// returns 'Bart & Lisa'

list([ {name: 'Bart'} ])
// returns 'Bart'

list([])
// returns ''
```

Tests:

``` javascript list.spec.js
Test.assertEquals(list([{name: 'Bart'},{name: 'Lisa'},{name: 'Maggie'},{name: 'Homer'},{name: 'Marge'}]), 'Bart, Lisa, Maggie, Homer & Marge',
"Must work with many names")
Test.assertEquals(list([{name: 'Bart'},{name: 'Lisa'},{name: 'Maggie'}]), 'Bart, Lisa & Maggie',
"Must work with many names")
Test.assertEquals(list([{name: 'Bart'},{name: 'Lisa'}]), 'Bart & Lisa', 
"Must work with two names")
Test.assertEquals(list([{name: 'Bart'}]), 'Bart', "Wrong output for a single name")
Test.assertEquals(list([]), '', "Must work with no names")
```

Result:

``` javascript list.js
const list = names => {
  return names.reduce( (prev, current, index, array) => {
    if (index === 0){
      return current.name;
    }
    else if (index === array.length - 1){
      return `${prev} & ${current.name}`;
    } 
    else {
      return `${prev}, ${current.name}`;
    }
  }, '');
 }
```