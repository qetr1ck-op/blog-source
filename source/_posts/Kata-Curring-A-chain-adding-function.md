title: 'Kata (Curring): A chain adding function'
date: 2016-02-11 23:15:33
tags:
    - Kata
    - Functions
    - Curring
categories: 
    - Javascript
---

We want to create a function that will add numbers together when called in succession.

```
add(1)(2);
add(1)(2)(3); // 6
add(1)(2)(3)(4); // 10
add(1)(2)(3)(4)(5); // 15
```
and so on.

A single call should return the number passed in.

```
add(1) // 1
```

and we should be able to store the result and reuse it.

```
var addTwo = add(2);
addTwo // 2
addTwo + 5 // 7
addTwo(3) // 5
addTwo(3)(5) // 10
```

We can assume any number being passed in will be valid javascript number.

```
Test.expect(add(1) == 1);
Test.expect(add(1)(2) == 3);
Test.expect(add(1)(2)(3) == 6);
```

```
'use strict';

const add = x => {
  const fn = n => add(x + n);
  fn.valueOf = () => x;
  return fn;
}
```