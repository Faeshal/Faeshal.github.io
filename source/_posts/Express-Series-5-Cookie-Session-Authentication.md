---
title: 'Express Series 5 : Cookie , Session & Authentication'
date: 2019-07-16 12:38:06
tags:
- express.js
- express series
category:
- node.js
---
![](https://i.postimg.cc/63TwMjdd/banner-template.jpg)

##### Introduction

Cookie , Session And Authentication is very important topic because you will always using this concept into software development , especially the web dev .  In this series we wanna try to implement cookie , session and authentication into express app , we will start add the auth from the previous project ( [**Fruit App** )](https://github.com/Faeshal/NodeJS-Mongoose) .

But Before we deep dive you must know the basic concept about what is cookie is , what is session is and etc . So let's get started .

##### Cookie

![](https://i.postimg.cc/fbLLsXqw/cookie.png)

Cookie is a tiny text file that contains specific information that a Web browser stores on a user’s machine. Cookies are created when you use your browser to visit a website that uses cookies to keep track of your movements within the site, help you resume where you left off, remember your registered login, theme selection, preferences, and other customization functions.

Cookies are often indispensable for websites that have huge databases, **need logins**, have customizable themes, other advanced features . Cookies can help a website to arrange content to match your preferred interests more quickly.Just Remember **Cookie is stored on the Client Side (Browser).**

##### Session

![](https://i.postimg.cc/c4yr3vCm/session.png)

Session can be defined as a **server-side storage** of information that is desired to persist throughout the user's interaction with the web site or web application. Instead of storing large and constantly changing information via cookies in the user's browser, only a unique identifier is stored on the client side (called a "session id"). This session id is passed to the web server every time the browser makes an HTTP request . Remember **Session is stored on the Server Side.**

##### Authentication

![](https://i.postimg.cc/LsnHwSh5/auth.jpg)

Authentication is the process of identifying an individual, usually based on a username and password. In security systems, authentication is distinct from authorization , which is the **process of giving individuals access to system based on their identity**. Once authenticated, a user or process is usually subjected to an authorization process as well, A user can be authenticated but fail to be given access to a resource if that user was not granted permission to access it. Now what about relation between authentication and  cookie session , how authentication is implemented . The answer is image down below .

![](https://i.postimg.cc/gjdbzbcv/auth-implement.jpg)

##### Project Intro

Let's Straight to the point , we wanna try add authentication into my previous project , you can download at my github . After that we will install some package and here dependecy that i'm adding :

| No  | Package | Description |
| --- | --- | --- |
| 1   | Express-Session | Add Express Session Middleware |
| 2   | Connect-Mongodb-Session | Store Session into Mongodb Database |
| 3   | Connect-Flash | Giving user feedback (alert) |
| 4   | bcrypt | Encrypt user Password |

First , Call the package that we install from our app.js , and add little bit configuration

    const express = require("express");
    const bodyParser = require("body-parser");
    const mongoose = require("mongoose");
    const PORT = 3000;
    
    const session = require("express-session");
    const MongoDBStore = require("connect-mongodb-session")(session);
    const flash = require("connect-flash");
    const app = express();
    
    const adminRoutes = require("./routes/admin");
    
    const MONGODB_URI = "mongodb+srv://:@.mongodb.net/";
    
    
    app.set("view engine", "ejs");
    app.set("views", "views");
    
    app.use(flash());
    
    const store = new MongoDBStore({
      uri: MONGODB_URI,
      collection: "sessions"
    });
    
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use(
      session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store: store
      })
    );
    
    app.use(adminRoutes);
    
    mongoose
      .connect(MONGODB_URI, { useNewUrlParser: true })
      .then(result => {
        app.listen(PORT);
        console.log("Web Server is Running");
      })
      .catch(err => {
        console.log(err);
      });
    

Second, Add User Models & Create Mongoose Schema

    const mongoose = require("mongoose");
    const Schema = mongoose.Schema;
    
    const userSchema = new Schema({
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      }
    });
    
    module.exports = mongoose.model("User", userSchema);

Next Step, and the most important , add Auth Controller

    const bcrypt = require("bcrypt");
    const User = require("../models/user");
    
    exports.getLogin = (req, res, next) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("login", {
        pageTitle: "Login",
        path: "/login",
        isAuthenticated: false,
        errorMessage: message
      });
    };
    
    exports.postLogin = (req, res, next) => {
      const email = req.body.email;
      const password = req.body.password;
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
          }
          bcrypt
            .compare(password, user.password)
            .then(doMatch => {
              if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                  console.log(err);
                  res.redirect("/");
                });
              }
              req.flash("error", "Invalid email or password.");
              res.redirect("/login");
            })
            .catch(err => {
              console.log(err);
              res.redirect("/login");
            });
        })
        .catch(err => console.log(err));
    };
    
    exports.getSignup = (req, res, next) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("signup", {
        pageTitle: "signup",
        path: "/signup",
        isAuthenticated: false,
        errorMessage: message
      });
    };
    
    exports.postSignup = (req, res, next) => {
      const email = req.body.email;
      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;
      User.findOne({ email: email })
        .then(userDoc => {
          if (userDoc) {
            req.flash("error", "E-Mail exists , please pick another one.");
            return res.redirect("/signup");
          }
          return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
              const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
              });
              return user.save();
            })
            .then(result => {
              res.redirect("/login");
            });
        })
        .catch(err => {
          console.log(err);
        });
    };
    
    exports.postLogout = (req, res, next) => {
      req.session.destroy(err => {
        console.log(err);
        res.redirect("/");
      });
    };
    

Next , Create folder (optional) called middleware and create is-auth (the name is up to you). This is security middleware for protect our route

    module.exports = (req, res, next) => {
      if (!req.session.isLoggedIn) {
        return res.redirect("/login");
      }
      next();
    };
    

Next , Add Routes and is-auth middleware beside the the routes that we wanna protect

    const express = require("express");
    const router = express.Router();
    
    const adminController = require("../controller/admin");
    const authController = require("../controller/auth");
    const isAuth = require("../middleware/is-auth");
    
    router.get("/", adminController.getProducts);
    
    router.get("/add", isAuth, adminController.getAddProduct);
    router.post("/add", isAuth, adminController.postAddProduct);
    router.get("/edit/:productId", isAuth, adminController.getEditProduct);
    router.post("/edit", isAuth, adminController.postEditProduct);
    router.post("/delete", isAuth, adminController.postDeleteProduct);
    
    router.get("/signup", authController.getSignup);
    router.post("/signup", authController.postSignup);
    
    router.get("/login", authController.getLogin);
    router.post("/login", authController.postLogin);
    
    router.post("/logout", isAuth, authController.postLogout);
    
    module.exports = router;
    

Next , add Login View

    <%-include("includes/head.ejs")%>
    
    <div class="container" class="mt-4 ml-2 mr-2">
      <br />
      <h4 class="text-center mt-4 mb-4">LOGIN</h4>
      <hr />
      <div class="row">
        <div class="col-sm-5 mx-auto">
          <% if (errorMessage) { %>
               <div class="alert alert-warning mb-2 mt-2 text-center font-weight-bold" role="alert">
                  <%= errorMessage %>
               </div>
          <% } %>
          <form action="/login" method="POST">
            <div class="form-group mt-4">
              <input
                type="email"
                class="form-control form-control-lg"
                placeholder="Email"
                name="email"
                id="email"
                required
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control form-control-lg"
                placeholder="Password"
                name="password"
                id="password"
                required
              />
    
            </div>
            <br />
            <div class="form-group text-center mx-auto">
           <button
                class="btn btn-lg btn-outline-primary mt-2 mr-2" 
              >
                 <a href="/signup" style="text-decoration:none;color: currentColor;"> SIGNUP</a>
              </button>
              <button
                type="submit"
                class="btn btn-lg btn-outline-success mt-2 ml-2"
              >
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <%-include("includes/end.ejs")%>
    

The Last but not least , Signup View

    <%-include("includes/head.ejs")%>
    
    <div class="container" class="mt-4 ml-2 mr-2">
      <br />
      <h4 class="text-center mt-4 mb-4">REGISTER</h4>
      <hr />
      <div class="row">
        <div class="col-sm-5 mx-auto">
         <% if (errorMessage) { %>
               <div class="alert alert-danger text-center font-weight-bold" role="alert">
                  <%= errorMessage %>
               </div>
          <% } %>
          <form action="/signup" method="POST">
            <div class="form-group mt-4">
              <input
                type="email"
                class="form-control form-control-lg"
                placeholder="Email"
                name="email"
                id="email"
                 required
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control form-control-lg"
                placeholder="Password"
                name="password"
                id="password"
                required
              />
            </div>
            <br />
            <div class="form-group text-center mx-auto">
              <button type="submit" class="btn btn-lg btn-outline-primary mt-2">
                REGISTER
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <%-include("includes/end.ejs")%>
    

##### Last Word

That's it, i'm trying to give very very simple example so you can easy understand this tricky topic . The Project is on my github if you wanna try your own go ahead. Dont Forget to check the documentation , as always link down below.

* **[Github Project](https://github.com/Faeshal/NodeJS-Mongoose-Auth)**
* **[Bcrypt JS](https://www.npmjs.com/package/bcrypt)**
* **[Express Session](https://www.npmjs.com/package/express-sessio)**
* **[Connect Mongodb Session](https://www.npmjs.com/package/connect-mongodb-session)**
* **[Connect Flash](https://www.npmjs.com/package/connect-flash)**

For The Last but not Least stay curious and never stop learning. Sallam!