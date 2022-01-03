---
title: "Express Series 7 : Error Handling"
date: 2019-07-19 12:38:06
tags:
  - express.js
  - express series
category:
  - node.js
---

![](https://i.postimg.cc/VNqZxbXK/error.png)

##### Introduction

One of the most crucial things in a building web applications are error handling. Error Handling refers to how Express catches and processes errors that occur both synchronously and asynchronously.

For prepare your application for such scenarios, you need to handle errors appropriately **so the client will get a better feedback** and plus much more easy for developer to see what's the error actually is .

##### Type Of Errors

![](https://i.postimg.cc/xCkg3x9N/type-error.png)

###### 1.Technical Error 

For Example Mongodb Server or Hosting Provider going Down , There is not much we can do in this type of error , maybe just send email to the provider about the issues and show error page with apologize letter to the users

###### 2.Expected Error

For this type , much more we can do , the best way to handle this is is using **[Validation & Sanitization](https://www.faeshal.com/post/express_validator)** for giving feedback to the user if the request / respond was wrong .

###### 3.Logical Error

Error handling originally created for handle this things. Logical Error can occured in  synchronous & asynchronous code .

![](https://i.postimg.cc/jj3ZN0Yr/working-with-error.jpg)

When you using error handling better you specify the http code , so that's other developer / user exactly know what is the network status is . For The Complete Http status code you can check to documentation link down below, But this is the most common things :

| Code              | Status                 |
| ----------------- | ---------------------- |
| 1×× Informational |                        |
| 100               | Continue               |
| 102               | Processing             |
| 2×× Success       |                        |
| 200               | Ok                     |
| 201               | Created                |
| 202               | Accepted               |
| 3×× Redirection   |                        |
| 307               | Temporary Redirect     |
| 308               | Permanent Redirect     |
| 4×× Client Error  |                        |
| 400               | Unauthorize            |
| 401               | Permanent Redirect     |
| 402               | Payment Required       |
| 403               | Forbidden              |
| 404               | Not Found              |
| 5×× Client Error  |                        |
| 500               | Internal Service Error |
| 502               | Bad Gateway            |
| 503               | Service Unavailable    |

##### Handling Error

For Handling Errors we using express error middleware or without , means we handle it manually in each middleware using try-catch, if-else or promises. Express Error Middleware takes four arguments (err,req,res,next) which are classified as “error handling middleware,” and will only get called if an error occurs

###### Without Middleware

    app.get("/customers", (req, res) => {
      var validateObject = function(obj) {
        if (typeof obj !== "object") {
          throw new Error("Invalid object");
        }
      };

      try {
        validateObject("123");
      } catch (err) {
        console.log("Thrown: " + err.message);
      }
    });

###### With Express Error Middleware

Controller.js

    exports.getOrders = (req, res, next) => {
      Order.find({ "user.userId": req.user._id })
        .then(orders => {
          res.render("shop/orders", {
            path: "/orders",
            pageTitle: "Your Orders",
            orders: orders
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    };

App.js

    app.use((error, req, res, next) => {
      console.error(err.stack);
      res.status(500).render("500", {
        pageTitle: "Error!",
        path: "/500",
        isAuthenticated: req.session.isLoggedIn
      });
    });

##### Last Word

That's it about error handling , Dont Forget to check documentation for detail and more example as always link down below :

- **[Express Error Handling - Docs](http://expressjs.com/en/guide/error-handling.html)**
- **[Http Error Code - Docs](https://www.restapitutorial.com/httpstatuscodes.html)**
