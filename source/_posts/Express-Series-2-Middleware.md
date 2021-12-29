---
title: 'Express Series 2 : Middleware'
date: 2019-07-12 12:38:16
tags:
- express.js
- express series
category:
- node.js
---
![](https://i.postimg.cc/6QPnF9gc/bannermiddlware.jpg)

##### Introduction

In this series we wanna talk about middleware in Express. Basicaly **Middleware is a function** which can access HTTP request (req) and HTTP responses (res) because middleware hook **inside routing object.**

If the current middleware function does not end , it must call **next() **to tell express for execute next middleware function .

![](https://i.postimg.cc/2S00StnK/midd.png)

We can use middleware that we create by our self or we can use third party middlware that express support it like body-parser, cookie parser etc. Generally middleware is put inside **app.use()** or **router.use()** method . This is some type of express middleware :

| Description | Middleware |
| --- | --- |
| Error handling middleware | app.use(**err**,req,res,next) |
| Built-in middleware | express.static, express.json , express.urlencoded |
| Thirdparty middleware | bodyparser , cookieparser etc. |

##### Writting Middleware

Before we writing a middleware , the most important thing is we must know the app.use() structure , because most of the time , middleware will put inside the app.use() method , here is the structure :

###### app.use("path",callback(http methods))

| Argument | Description |
| --- | --- |
| Path | A string representing a path |
| callback | A middleware function |

###### Writing Third party Middleware

Pretty Easy if you writing third party middleware , after you install & require the package from npm , you just write :

    const express = require("express")
    const app = express()
    const cookieParser = require("cookie-parser")
    const cors=require("cors")
    const bodyparser=require("body")
    
    // load the middleware
    app.use(cookieParser())
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }));
    

That's it very easy , and if you see why bodyparser have a parameters, it's because body parser having that ability , too see what parameters or what third party middleware that express have you can check express offical , link down below :

* **[Express - Middleware](https://expressjs.com/en/resources/middleware.html)**

###### Writing Custom Middleware

![](https://i.postimg.cc/CMCkZBtZ/next.png)

For Custom middleware i will show you 2 ways to do that , first inside same file and second in diferent file , for example i'll make 2 middleware , first request log middleware and execute next middleware to the get date middleware and the last response to "/" route . if we not call "next" on that 2 middleware we will not arrive to the "/" route.

    // Middleware
    app.use((req, res, next) => {
      console.log(req);
      next();
    });
      
    app.use((req, res, next) => {
      let date = new Date(Date.now()).toLocaleString();
      console.log(date);
      next();
    });
      
    app.get("/", (req, res) => {
      res.send("Welcome Home");
    });
    

For making more modular we can write in diferent file and export it , for example we have 2 file , index.js (for server) & midd.js (for main middleware).

midd.js

    module.exports=function(){
      return(req,res,next)=>{
        let today=new.Date();
        let hh=today.getHours();
        let nn=today.getMinutes();
        let ss=today.getSeconds();
    
        let time=hh+':'+nn+':'+ss;
    
        console.log(time);
      }
    }
    

index.js

    const require("./midd.js")
      app.use(midd())
      app.use("/",(req,res)=>{
        res.send("Welcome To HomePage")
     })
    

##### Last Word

That's all about basic middleware , this is very important , because we will use middleware all the time in node js for convert our logic and problem solving , i Hope you understand the basic , As always dont forget to check the documentation :

* **[Express Basic Middleware - Docs](https://expressjs.com/en/guide/writing-middleware.html)**
* **[Express ThirdParty Middleware - Docs](https://expressjs.com/en/resources/middleware.html)**

See you on the next express series , stay curious and never stop learning. Sallam!