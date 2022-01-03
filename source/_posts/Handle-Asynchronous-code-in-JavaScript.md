---
title: Handle Asynchronous code in JavaScript
date: 2019-11-13 12:40:06
tags:
  - asynchronous
  - async await
category:
  - javascript
---

![](https://i.postimg.cc/Pr4LKWm5/async-banner.jpg)

##### **INTRODUCTION**

Synchronous programming model, things happen one at a time. When you call a function that performs a long-running action, it returns only when the action has finished and it can return the result. This stops your program for the time the action takes. That's is Synchronous.

**![](https://i.postimg.cc/NfcnKVYz/synchronous-asynchronous-javascript.png)**

An Asynchronous allows multiple things to happen at the same time. When you start an action, your program continues to run. When the action finishes, the program is informed and gets access to the result (for example, the data read from database).**Remember Javascript is Single Thread & Synchronous by default** but we still can running async code in the Javascript. 3 Ways for handle async code in javascript:

1.  Callbacks
2.  Promises (ES6)
3.  Async-Await (ES8)

##### Callbacks

Callbacks is a function that is executed after another function has finished executing. Callbacks are a way to make sure certain code doesn’t execute until other code has already finished execution. Let's take a look this simple blocking code :

    function first(){
      console.log(1);
    }
    function second(){
      console.log(2);
    }
    first();
    second();

    //output
    //1
    //2

The function first is executed first, and the function second is executed second . Normal & All Good so far .

But What if function first contains some sort of code that can’t be executed immediately ? For example, an API request where we have to send the request then wait for a response? To simulate this action, were going to use **[setTimeout()](https://javascript.info/settimeout-setinterval)** which is a JavaScript function that calls a function after a set amount of time. Take a look this non blocking code :

    function first(){
      // setTimeout simulate a code delay (async)
      setTimeout( function(){
        console.log(1);
      }, 500 );
    }
    function second(){
      console.log(2);
    }
    first();
    second();

    //output
    //2
    //1

see ? JavaScript didn’t wait for a response from first() before moving on to execute second() . So we need callback . Callbacks are a way to **make sure** certain **code doesn’t execute until other code has already finished execution.**

Alright, enough talk, lets create a callback!

    const posts = [
      { title: "Post One", body: "Callback Introduction" },
      { title: "Post One", body: "Promises in Javascript" }
    ];

    function getPosts() {
      setTimeout(() => {
        let output = "";
        posts.forEach(post => {
          output = output + `<li>${post.title}</li>`;
        });
        document.body.innerHTML = output;
      }, 1000);
    }

    function createPost(post, callback) {
      setTimeout(() => {
        posts.push(post);
        callback();
      }, 2000);
    }

    createPost({ title: "Post Three", body: "async await" }, getPosts);

    // output
    // Post One
    // Post Two
    // Post Three

But if you have too much callback it will cause **[Callback Hell](http://callbackhell.com/)** . So that's why we use Promises.

##### Promises

A promise is an object that wraps an asynchronous operation and notifies when it’s done. A promise has its own methods , the methods a promise provides are “then(…)” for when a successful result is available and “catch(…)” for when something went wrong. A lot of liblary is promises based like Axios , Mongoose etc . Let's Convert our Callback to Promises code .

    const posts = [
      { title: "Post One", body: "Callback Introduction" },
      { title: "Post One", body: "Promises in Javascript" }
    ];

    function getPosts() {
      setTimeout(() => {
        let output = "";
        posts.forEach(post => {
          output = output + `<li>${post.title}</li>`;
        });
        document.body.innerHTML = output;
      }, 1000);
    }

    function createPost(post) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          posts.push(post);
          const error = false;
          if (!error) {
            resolve();
          } else {
            reject("Error:Something went wrong");
          }
        }, 2000);
      });
    }

    createPost({ title: "Post Three", body: "async await" })
      .then(getPosts)
      .catch(err => console.log(err));

Another modern way to use promise is using Promises.All() , so you no need to call .then() .then() too much.

    const promise1 = Promise.resolve("Hello");
    const promise2 = 10;
    const promise3 = new Promise((resolve, reject) =>
      setTimeout(resolve, 2000, "GoodBye")
    );

    Promise.all([promise1, promise2, promise3]).then(values => {
      console.log(values);
    });

You can learn about Promise.All() from great video below :

##### Async Await

Async Await is basically syntactic sugar for Promises intorduce in ES8 Feature. It makes your asynchronous code look more like synchronous/procedural code, which is easier for humans to understand. The function stays the same as the Promise version but to call it's just like this :

    async function init() {
      await createPost({ title: "Post Three", body: "async await" });
    }

    init();

See ? Very Elegant & Pretty Clean . You can check Clear await explanation from our lovely coding train.

##### Last Word

That's it about handle async code in javascript , it's super important especially when you playing with Node.JS or request an API from Front End . You will get stuck if you dont understand core concept for handle async code , Trust me .

- **[JavaScript Info - Docs](https://javascript.info/)**
- **[Javascript Docs - Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)**
- **[Callbacks vs Promises vs Async Await](https://vegibit.com/javascript-callbacks-vs-promises-vs-async-await/)**
