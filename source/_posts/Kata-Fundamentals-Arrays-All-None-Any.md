title: 'Kata (Fundamentals, Arrays): All, None & Any'
date: 2016-02-10 20:58:59
tags:
    - Kata
    - Array
    - Fundamentals
categories: 
    - Javascript
---

As a part of this Kata, you need to create three functions that one needs to be able to call upon an array:

* all

This function returns true only if the predicate supplied returns true for all the items in the array

```
[1, 2, 3].all(isGreaterThanZero) => true
[-1, 0, 2].all(isGreaterThanZero) => false
```

* none

This function returns true only if the predicate supplied returns false for all the items in the array

```
[-1, 2, 3].none(isLessThanZero) => false
[-1, -2, -3].none(isGreaterThanZero) => true
```
* any

This function returns true if at least one of the items in the array returns true for the predicate supplied

```
[-1, 2, 3].any(isGreaterThanZero) => true
[-1, -2, -3].any(isGreaterThanZero) => false
```

You do not need to worry about the data supplied, it will be an array at all times.

```
function isGreaterThanZero (num) {
  return num > 0;
}

function isLessThanZero (num) {
  return num < 0;
}

Test.expect([1, 2, 3].all(isGreaterThanZero), 'All are greater than zero');
Test.expect(![-1, 0, 2].all(isLessThanZero), 'All is less than zero');

Test.expect(![1, 2, 3].none(isGreaterThanZero), 'None is greater than zero');
Test.expect([3, 0, 2].none(isLessThanZero), 'None is less than zero');

Test.expect([1, 2, 3].any(isGreaterThanZero), 'None is greater than zero');
Test.expect([-1, 0, 2].any(isLessThanZero), 'None is less than zero');
```

```
Array.prototype.all = function (p) {
 return this.filter(p).length === this.length;
};

Array.prototype.none = function (p) {
   return this.filter(p).length === 0;
};

Array.prototype.any = function (p) {
  return this.filter(p).length > 0;
};
```