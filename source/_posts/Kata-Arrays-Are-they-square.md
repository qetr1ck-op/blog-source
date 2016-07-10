title: 'Kata: Are they square?'
date: 2016-02-09 23:54:01
tags:
    - Kata
    - Arrays
categories: 
    - Javascript
---

Write a function that checks whether all elements in an array are square numbers. The function should be able to take any number of array elements.

<!--more-->

Your function should return true if all elements in the array are square numbers and false if not.

An empty array should return undefined. You can assume that all array elements will be positive integers.

```
Test.describe("isSquare",function() {
    Test.it("Basic tests",function() {    
        Test.assertEquals(isSquare([1, 4, 9, 16, 25, 36]), true);
        Test.assertEquals(isSquare([1, 2, 3, 4, 5, 6]), false);
        Test.assertEquals(isSquare([]), undefined);
        Test.assertEquals(isSquare([1, 2, 4, 15]), false); 
    })
});
```

```
var isSquare = function(arr){
  return (arr.length) ? arr.every(x => Math.sqrt(x) % 1 === 0) : undefined;
}
```