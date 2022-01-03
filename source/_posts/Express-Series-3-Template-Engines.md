---
title: "Express Series 3 : Template Engines"
date: 2019-07-12 12:38:06
tags:
  - express.js
  - express series
category:
  - node.js
---

![](https://i.postimg.cc/vmS8zTkY/banner-template.jpg)

##### Introduction

Template engine is **tools for implement the view in easy way** . Template engines allow us to add data to a view, and generate HTML dynamically  Instead of cluttering the code by generating HTML using string concatenating etc , instead use a template and interpolate the variable in them.There is ton of templating engine that support with express , this the list from express doc :

| Engine     | Docs                                                    |
| ---------- | ------------------------------------------------------- |
| Nunjucks   | [Nunjucks](https://mozilla.github.io/nunjucks/)         |
| Handlebars | [handlebarsjs.com](https://handlebarsjs.com/)           |
| Pug        | [Pugjs.org](https://pugjs.org/api/getting-started.html) |
| Mustache   | [Mustache](https://mustache.github.io/)                 |
| EJS        | [Ejs.co](https://ejs.co/)                               |
| Underscore | [UnderscoreJS.org](https://underscorejs.org/)           |

But in this series we just giving 2 example with Pug & EJS, but dont forget to place index inside folder called **views** , because that is default folder name for views. You can explore all if u want and use that fit with your style , without further ado Let's get started .

##### Pug

![](https://i.postimg.cc/2SgL7qFC/pug.png)

The old version of pug called Jade Pug is a high performance template engine heavily influenced by Haml and implemented with JavaScript for Node.js.  Pug has powerful features like conditions, loops, includes, mixins using which we can render HTML code based on user input or reference data. Pug also support JavaScript natively, hence using JavaScript expressions, we can format HTML code. company using pug.

###### Usage

app.js

      const express = require("express");
      const app = express();
      const pug = require("pug");
      const path = require("path");

      //SECTION : Templating Engine
      app.set("views", path.join(__dirname, "views"));
      app.set("view engine", "pug");

      // SECTION : Routing
      app.use("/", (req, res) => {
        res.render("index", {
          name: "PUG"
        });
      });

      app.listen(3000, (req, res) => {
        console.log("Web Server Runing on Port 3000");
      });

index.js

    html
      head
          title www.pug.com
          body
              h1 Templating Engine
              hr
              p Hello from #{name}

##### EJS

![](https://i.postimg.cc/W47Lrycv/Untitled-1.jpg)

EJS simply stands for Embedded Javascript. It is a simple templating engine that lets its user generate HTML with plain javascript. It offers an easier way to interpolate (concatenate) strings effectively.EJS is lightweight solution towards creating HTML markup with simple JavaScript code. Worry not about organizing your stuff in the right manner, it is just straight JavaScript all the way.

###### Usage

app.js

      const express = require("express");
      const app = express();

      // SECTION : Templating Engine
      app.set("view engine", "ejs");
      app.set("views", "views");

      // SECTION : Routing
      app.use("/", (req, res) => {
        res.render("index", {
          name: "EJS"
        });
      });

      app.listen(3000, (req, res, err) => {
        if (!err) {
          console.log("Server Running : 3000");
        } else {
          res.sendStatus(400);
        }
      });

index.ejs

    <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Document </title >
      </head >
      <body >
      <h4>TEMPLATING ENGINE</h4>
      <hr>
      <p>This Is From <%-name%></p>
      </body >
     </html >

##### Last Word

That's it , fell free to explore all templating engine until you get the best way for your coding style . Dont Forget to check their documentation as always link down below.

- **[Pug - Docs](https://pugjs.org/api/getting-started.html)**
- **[EJS - Docs](https://ejs.co/)**

Because Believe it or not if you get stuck the official documenation will help you a lot than some random tutorial on the internet .
