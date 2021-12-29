---
title: 'Express Series 1 : Routing'
date: 2019-06-29 12:38:06
tags:
- express.js
- express series
category:
- node.js
---
![](https://i.postimg.cc/FK43rThL/bannerouting.jpg)

##### Introduction

This Series is talked about all about express for documenting my journey playing with express. First of all in this series i'm not talking about what express is , what express can do , how to install it , etc . You can research it first if you dont know that, because this series not cover some very basic stuff like that. I hope i will consistent make this express series until cover the advance topic about express. Ok Let's straight to the point.

##### What is Routing ?

Routing is the process of determining what should happen when a URL is called, or also which parts of the application should handle a specific incoming request, for example we make 2 routing one goto the homepage and one for about page , this is the code :

    const express = require('express')
    const app = express()
    
    app.get('/', (req, res)=> {
      res.send('Home Page!')
    });
    app.get('/about', (req, res)=> {
      res.send('About Page!')
    })

##### Explanation

* app.get() is called **Application Routing Methods** for getting HTTP requests to the specified path with the specified callback functions..
* '/' & '/about' called **Route Path** , this is the url destination you wanna make. Route paths can be strings, string patterns, or regular expressions.
* res.send() called **Response Routing Methods** which send 'HomePage' & 'About page' string

There is ton of method that express have , This is some mostly i'm using :

| EXPRESS ROUTING METHODS |     |     |
| --- | --- | --- |
| Type | Name | Description |
| --- | --- | --- |
| Application | app.get() | Returns the value of name app setting, where name is one of the strings in the app settings table |
| app.use() | Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path. |
| app.listen() | Starts a UNIX socket and listens for connections on the given path |
| app.render() | Returns the rendered HTML of a view via the callback function. |
| app.set() | Useful for define View Engines like Handlebars,Pug etc. |
| Request | req.get() | Returns the specified HTTP request header field (case-insensitive match). |
| req.accepts() | Checks if the specified content types are acceptable, based on the request’s Accept HTTP header field. |
| Response | res.send() | Send a response of various types. |
| res.render() | Render a view template. |
| res.sendstatus() | Set the response status code and send its string representation as the response body |
| res.redirect() | Redirect a request. |
| Router | router.use() | This method is similar to app.use() |
| router.METHOD() | Provide the routing functionality in Express, where METHOD is one of the HTTP methods, such as GET, PUT, POST, and so on, in lowercase. Thus, the actual methods are router.get(), router.post() and so on. |

##### App.Use() VS Router.Use()

You maybe think why app.use() and router.use() have very much similliar , what exactly the difference . Ok i will explain in this simple code.First i wanna create project and this is the structure :

* Router
    * admin.js
* Controllers
    * admin.js
* App.js

We will talk about more about controller in spesific post , but for now basicly controller it's just a method for telling express what action should execute for specific route. this is controllers/admin.js

    const Product = require('../models/product');
    
    exports.getProducts = (req, res, next) => {
      Product.find()
        .then(products => {
          console.log(products);
          res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAuthenticated: req.session.isLoggedIn
          });
        })
        .catch(err => console.log(err));
    };
    
    
    exports.postDeleteProduct = (req, res, next) => {
      const prodId = req.body.productId;
      Product.findByIdAndRemove(prodId)
        .then(() => {
          console.log('DESTROYED PRODUCT');
          res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    };
    

routes/admin.js

    const express = require('express');
    const adminController = require('../controllers/admin');
    const router = express.Router();
    
    router.get('/products', adminController.getProducts);
    router.post('/delete-product', adminController.postDeleteProduct);
    
    module.exports = router;
    

And the last the main file app.js

    const express = require("express");
    const app = express();
    const adminRoutes = require("./routes/admin");
    
    app.use("/admin", adminRoutes);
    
    app.listen(3000);
    

That't it , Your code seem more modular , if you using router.use().But that's not just like that.if you more detail you will see the main file which is in app.js 

**app.use("/admin",adminRoutes);**

you dont have to make a express basic callback function, you just call the router fucntion which is actually using router method that called the controller in the controllers/admin.js and then function will get automatically called. (/product & /delete-product)

##### Last Word

Hope you understand some basic routing in express , if you wanna deep dive about spesific routing method etc feel free to see express documentation link down below.

* **[Express - Documentation](http://expressjs.com/en/4x/api.html)**

Iwanna continue make this series as soon as i can maybe we will deep dive about controller, let's see the next. For the last but not least.Stay curious and never stop learning , Sallam