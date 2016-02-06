title: Understanding Components approach and Thinking in React
date: 2016-02-05 12:34:35
thumbnailImage: title.png
tags:
categories:
    - Javascript
    - React
---

The parts of a web user interface form the building blocks for both simple websites and modern front-end applications. 

<!--more-->

<!--toc-->

# Understanding Components

These parts are commonly referred to as UI components or UI widgets. The browser offers many native components and, when these are not enough, custom components like [Kendo UI](http://www.telerik.com/kendo-ui), (Bottsrap)[http://getbootstrap.com/] [Semantic UI](http://semantic-ui.com/), [UI Kit](http://getuikit.com/)  can be used.

UI component is a region in a web page that contains an isolated UI feature that is distinct from everything around it. For example, an HTML `<select>`element is considered a native HTML UI component.

![](img.jpg)

An HTML <select> element can be placed into a web page and a developer gets:

1. An isolated, reusable, and decoupled instance of a `<select>` with no side effects;
2. A default styled UI element that a user can interact with;
3. Configuration that affects the state via properties that are passed declaratively to the component by way of HTML attributes, text, and child components (i.e. `<option>`) that can contain attributes and text as well;
4. An API to imperatively program the component, affecting state, via the DOM and JavaScript (i.e. DOM events and methods).

The main primitive (speaking about React, Angular & Ember) is this idea of a *component*. I think everyone has some notion of what a component is. The idea is that it should be an atomic UI piece that is *composable* and *reusable*, and should work with other pieces.

> We’re not designing pages, we’re designing systems of components.

# Thinking in React

One of the many great parts of React is how it makes you think about apps as you build them. I'll walk through the process of building a searchable product data table using React.

## Start with a mock

Imagine that we already have a JSON API which returns some data that looks like this:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

And the mock v.0.0.1 should looks like this:

![](img1.png)

## Step 1: break the UI into a component hierarchy

The first thing you'll want to do is to draw boxes around every component (and subcomponent) in the mock and give them all names. 

But how do you know what should be its own component? Just use the same techniques for deciding if you should create a new function or object. One such technique is the single *responsibility principle*, that is, a component should ideally only do one thing. If it ends up growing, it should be decomposed into smaller subcomponents.

![](img1.png)

Components that appear within another component in the mock should appear as a child in the hierarchy:

```
- FilterableProductTable
    - SearchBar
    - ProductTable
        - ProductCategoryRow
        - ProductRow
```

## Step 2: Build a static version in React

<iframe width="100%" height="300" src="//jsfiddle.net/reactjs/yun1vgqb/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

To build a static version of your app that renders your data model, you'll want to build components that reuse other components and pass data using `props`. `props` are a way of passing data from parent to child. 

If you're familiar with the concept of state, *don't use state* at all to build this static version. 

State is reserved only for *interactivity*, that is, data that changes over time. Since this is a static version of the app, you don't need it.

## Step 3: Identify the minimal representation of UI state

To make your UI interactive, you need to be able to trigger changes to your underlying data model. React makes this easy with `state`.

Think of all of the pieces of data in our example application. We have:

* The original list of products
* The search text the user has entered
* The value of the checkbox
* The filtered list of products

Let's go through each one and figure out which one is `state`. Simply ask three questions about each piece of data:

1. Is it passed in from a parent via `props`? If so, it probably isn't state.
2. Does it change over time? If not, it probably isn't `state`.
3. Can you compute it based on any other state or props in your component? If so, it's not state.

So finally, our state is:

* The search text the user has entered
* The value of the checkbox

## Step 4: Identify where your state should live

This is often the most challenging part for newcomers to understand, so follow these steps to figure it out:

For each piece of state in your application:

* Identify every component that renders something based on that `state`.
* Find a common owner component (a single component above all the components that need the `state` in the hierarchy).
* If you can't find a component where it makes sense to own the `state`, create a new component simply for holding the `state`

Let's run through this strategy for our application:

* ProductTable needs to filter the product list based on state and SearchBar needs to display the search text and checked state.
* The common owner component is FilterableProductTable.
* It conceptually makes sense for the filter text and checked value to live in FilterableProductTable
 
We've decided that our state lives in `FilterableProductTable`. First, add a `getInitialState()` method to `FilterableProductTable` that returns `{filterText: '', inStockOnly: false}` to reflect the initial `state` of your application. 

Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as a `prop`. Finally, use these `props` to filter the rows in `ProductTable` and set the values of the form fields in `SearchBar`.

## Step 5: Add inverse data flow

Now it's time to support data flowing the other way: the form components deep in the hierarchy need to update the `state` in `FilterableProductTable`.

If you try to type or check the box in the previous version of the example, you'll see that React *ignores* your input. This is intentional, as we've set the value `prop` of the input to always be equal to the `state` passed in from `FilterableProductTable`.

Since components should only update their own state, `FilterableProductTable` will pass a callback to `SearchBar` that will fire whenever the state should be updated. We can use the `onChange` event on the inputs to be notified of it. And the callback passed by `FilterableProductTable` will call `setState()`, and the app will be updated.

<iframe width="100%" height="300" src="//jsfiddle.net/reactjs/n47gckhr/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>