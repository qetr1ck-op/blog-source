title: 'Kata: Filter through name/email'
date: 2016-02-15 22:34:45
tags:
    - Kata
    - Arrays
    - RegExp
categories: 
    - Javascript
    - Kata
---

He has troubles with users ending or starting in a `.`, and his user-array is a flat array of user-email-pairs, like so:

<!--more-->

```
[ "foo", "foo@bar.com", "bar", "bar@foo.com", ".foo", "food@bar.com" ]
```

He is only interested in e-mailing the users and ask them to sign up again, so no need to keep the user-name, only e-mail addresses for the user-names that start or end with a `.` should be returned. For the above array, the correct return-array would be

```
[ "food@bar.com" ]
```

Test:
```
describe( "Testing a list", function(){
  it( "Basic list", function(){
    var a = [ "foo", "foo@foo.com", "bar.", "bar@bar.com" ],
    b = [ "bar@bar.com" ];    
    Test.assertSimilar( searchNames( a ), b,
      "not correct " + Test.inspect(a) + " given" );
  } );
} );

```

Result:
```
const searchNames = logins => {
  return logins.filter(
        ( login, i, ary) => i % 2 === 1 && ary[i - 1].match(/^\.|\.$/);
    )
};
```