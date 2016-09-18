title: Moving from "ngModel.$parsers"/"ng-if" to "ngModel.$validators"/"ngMessages"
date: 2016-09-03 22:24:46
thumbnailImage: http://i.giphy.com/P7SYySPcTnQC4.gif
thumbnailImagePosition: right
categories:
  - Javascript
  - AngularJS
tags:
  - Javascript
  - AngularJS
---

Implementation custom Model validation is typically done by extending the built-in `$error` object to `ngForm` models, such as a simple `<input`.

Prior to AngularJS 1.3 custom validation was done by injecting a function into the `ngModel.$parsers` array pipeline and manually setting validation states using `$setValidity('visa', true)` if the Model value matched a Visa credit card expression format.

AngularJS 1.3+ has the `$validators` pipeline object, which requires no manual setting of validation states.

Let's take a look of old school way then we can shift to `ngModel.$validators` technique.

<!--more-->
<!--toc-->

# Old school "$parsers"

Let’s take some basic form markup, binding `name="myForm"` to the `<form>` element so Angular takes control of our form and validation states. Next we’ll add an `<input>` with the name `creditCard`, which builds up the Model Object internally so we can access `myForm.creditCard` and handle our validation. I’ve added a `validate-visa` attribute, which will serve as the Directive bound to the input, so we can capture the Model and validate it.


```html
<form name="myForm">
  <h3>Visa validation ($parsers)</h3>
  <input type="text" name="creditCard" ng-model="creditCardModel" validate-visa>
  {{ myForm.creditCard | json }}
</form>
```

The result is something like this: 

```javascript
{
  "$validators": {},
  "$asyncValidators": {},
  "$parsers": [],
  "$formatters": [
    null
  ],
  "$viewChangeListeners": [],
  "$untouched": true,
  "$touched": false,
  "$pristine": true,
  "$dirty": false,
  "$valid": false,
  "$invalid": true,
  "$error": {},
  "$name": "creditCard",
  "$options": null
}
```

The generated `ngModel.creditCard.$error` object it the place where we need to hook into. At this point we want conditionally toggle DOM based on the boolean value of this property. 

If `myForm.creditCard.$error.visa` is `true` create the element, otherwise `false` framework will remove it from DOM.

```html
<form name="myForm">
  <h3>Visa validation ($parsers)</h3>
  <input type="text" name="creditCard" ng-model="creditCardModel" validate-visa>
  <p ng-if="myForm.creditCard.$error.visa" class="invalid">
    Not a valid Visa format
  </p>
</form>
```

Now we need to write logic for `validate-visa` directive to tie in to the `ngModel` and set states. Typically it's done by using `ngMode.$parsers`:

```javascript
// create a validateVisa function
function validateVisa() {

  // link function
  function link($scope, $element, $attrs, $ctrl) {
    // Some basic Visa Regular Expression
    const VISA_REGEXP = /^4[0-9]{12}(?:[0-9]{3})?$/;
    // visaParser function, passing in the current viewValue
    function visaParser(viewValue) {
      // a Boolean variable evaluated by RegExp.test(String)
      const isValid = VISA_REGEXP.test(viewValue);
      // Manually set the validity of the "visa" property on 
      // the "$error" Object bound to the Model.
      // Note: $ctrl is the fourth argument in the "link" function
      // as we're requiring "ngModel" (see below in the return {} statement)
      $ctrl.$setValidity('visa', isValid);
      // return the "viewValue" if it's valid or undefined 
      // so Angular doesn't set the value
      return isValid ? viewValue : undefined; 
    }
    // push the "visaParser" function into the "$parsers" Array
    $ctrl.$parsers.push(visaParser);
  }

  // export the Directive Object
  // which requires the "ngModel" Controller and
  // binds the above "link" function
  return {
    require: 'ngModel',
    link: link
  };
  
}

angular
  .module('app')
  .directive('validateVisa', validateVisa);
```

The syntax of pushing a function into `$parsers` array isn't very slick and we also manually set the validation state passing in string or boolean, which seems a very procedural way to do a thing.

At this point `$error` object which is bounded to the input looks like this:

```javascript
{
  ...
  "$error": {
    "visa": true
  },
  ...
}
```

# New school "$validators"

In AngularJS 1.3+ we've a much better way of doing things! 

Just like before we `require: 'ngModel'` into directive but instead of using `$parsers` we can bind a function straight to `$validators` object:

```javascript
function validateVisa() {

  function link($scope, $element, $attrs, $ctrl) {
    var VISA_REGEXP = /^4[0-9]{12}(?:[0-9]{3})?$/;
    $ctrl.$validators.visa = function visaParser(modelValue, viewValue) {
      var value = modelValue || viewValue;
      return (VISA_REGEXP.test(value));
    };
  }

  return {
    require: 'ngModel',
    link: link
  };
  
}

angular
  .module('app')
  .directive('validateVisa', validateVisa);
```

The above doesn’t even need annotating, any `$validator` property we add becomes the property name bound to `$error`, and we just need to return a boolean. Super simple and much clearer to read. Usage as the Directive from an HTML perspective is identical, it’s just the difference of how we implement the validation that changes

# Old school "ng-if"

Using `ng-if` is super simple, we tell to conditionally swap element based on property state bound to the `$error` object:

```html
<form name="myForm">
  <h3>Visa validation (ngIf)</h3>
  <input 
    type="text" 
    name="creditCard" 
    ng-model="creditCardModel" 
    required=""
    ng-minlength="13"
    ng-maxlength="16"
    validate-visa>
  <p ng-if="myForm.creditCard.$error.required" class="invalid">
    This field is required
  </p>
  <p ng-if="myForm.creditCard.$error.visa" class="invalid">
    Not a valid Visa format
  </p>
  <p ng-if="myForm.creditCard.$error.minlength" class="invalid">
    Minimum of 13 characters
  </p>
  <p ng-if="myForm.creditCard.$error.maxlength" class="invalid">
    Maximum of 16 characters
  </p>
</form>
```

It's a very manual and repetitive process dealing with each `$error` property.

# New school "ngMassages"

Unlike `ng-if` approach we're passing `myForm.creditCard.$error` only once into `ngMassages`. The directive will look of `$error` object and the corresponding massage will be rendered:

```html
<form name="myForm">
  <h3>Visa validation (ngMessages)</h3>
  <input 
    type="text" 
    name="creditCard" 
    ng-model="creditCardModel" 
    required=""
    ng-minlength="13"
    ng-maxlength="16"
    validate-visa>
  <div ng-messages="myForm.creditCard.$error">
    <p ng-message="required" class="invalid">
      This field is required
    </p>
    <p ng-message="visa" class="invalid">
      Not a valid Visa format
    </p>
    <p ng-message="minlength" class="invalid">
      Minimum of 13 characters
    </p>
    <p ng-message="maxlength" class="invalid">
      Maximum of 16 characters
    </p>
  </div>
</form>
```

For reusable/generic validation states we can use `ngMassagesIncule`:

```html
<script type="text/ng-template" id="generic-messages">
  <div ng-message="required">This field is required</div>
  <div ng-message="minlength">This field is too short</div>
</script>
```

And ramp up it with an existing `ngMassages`:

```html
<div ng-messages="myForm.creditCard.$error">
  <div ng-messages-include="generic-messages"></div>
  <p ng-message="visa" class="invalid">
    Not a valid Visa format
  </p>
  <p ng-message="minlength" class="invalid">
    Minimum of 13 characters
  </p>
  <p ng-message="maxlength" class="invalid">
    Maximum of 16 characters
  </p>
</div>
```

There are some other powerful features well worth checking out inside ngMessages, see the [documentation](https://docs.angularjs.org/api/ngMessages) for more.

Save my day:

* [Todd Motto](https://toddmotto.com/moving-from-ng-model-parsers-to-ng-model-validates-ng-messages/)