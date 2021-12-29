---
title: 'Express Series 6 : Validation & Sanitization'
date: 2019-07-18 12:38:06
tags:
- express.js
- express series
category:
- node.js
---
![](https://i.postimg.cc/ZqVJ1hCg/banner-template.jpg)

**Introduction**

We Deep dive into add more security layer inside form , Validation Basically is verifying process after the client had entered all the necessary data and then pressed the Submit button , **validation means checks if the input meets a set of criteria or not**. Validating can set on the server side or client side.

What about sanitizing ? Sanitizing is **process that will modifies the input to ensure that it is valid** such as doubling single quotes , clear white spacing etc. You would normally combine these two techniques to provide in-depth defense to your application. In this series we wanna using **Server Side** Validation & Sanitization because **it's more secure **using third party express middleware called Express Validator.

* **[Express Validator - Docs](https://express-validator.github.io/docs/)**
* **[Express Validator - NpmJS](https://www.npmjs.com/package/express-validator)**

##### Validation

Say you have a POST endpoint that accepts the name, email and age parameters:

    const express= require ("express");const bodyParser = require("body-parser");const app = express();app.post("/form",(req,res)=>{   const name = req.body.name;   const email = req.body.email;   const age = req.body.age;})

How do you server side validate those result to make :

* name is a string of at least 3 character ?
* email is a real email ?
* age is a number , between 0 - 110 ?

That's why we need Express Validator to handle this case . For using express validator simply just 

    npm install express-validator --save

call the package , you can call all parametes too in one require (body/check + validationResult).

In the controller: 

    const { validationResult } = require("express-validator");

In th the routes: 

    const { body } = require("express-validator");

You can see how to implement express vaidator in the project at the project section below. But the most important things is validator methods , This is most common validator methods that i'm using :

| No  | Methods | Description |
| --- | --- | --- |
| 1   | isAlphanumeric() | check if the string contains only letters and numbers. |
| 2   | isCreditCard() | check if the string is a credit card. |
| 3   | isDecimal() | check if the string represents a decimal number, such as 0.1, 4.0, etc. |
| 4   | isEmail() | check if the string is an email. |
| 5   | isFloat() | check if the string is a float. |
| 6   | isLenght() | check if the string's length falls in a range. |
| 7   | isUppercase() | Check if the string is uppercase. |
| 8   | isLowercase() | check if the string is lowercase. |
| 9   | isEmpty() | check if the string has a length of zero. |
| 10  | isURL() | check if the string is an URL. |
| 11  | isMobilePhone() | check if the string is mobile number. |
| 12  | isURL() | check if the string is an URL. |

##### Sanitization

There's one thing you quickly learn when you deploy app into server : **never trust the input**  you need to sanitize make sure that people can't enter weird things using client-side code and this is most common sanitize methods that express validator have :

| No  | Methods | Description |
| --- | --- | --- |
| 1   | normalizeEmail() | canonicalizes an email address. |
| 2   | isCreditCard() | check if the string is a credit card. |
| 3   | toDate() | convert the input string to a date, or null if the input is not a date. |
| 4   | toFloat() | convert the input string to a float, or NaN if the input is not a float. |
| 5   | trim() | trim characters (whitespace by default) from both sides of the input. |
| 6   | blacklist() | remove characters that appear in the blacklist. Ex : blacklist(input, '\\\\[\\\\]'). |

##### Project

Let's add Validation & Sanitization to our previous project (**[Fruit Shop](https://github.com/Faeshal/NodeJS-Mongoose-Auth)**) 

first install express validator with npm install dont forget to require after that 

Next , in Auth Controller 

    const bcrypt = require("bcrypt");
    const User = require("../models/user");
    const { validationResult } = require("express-validator");
    
    exports.getLogin = (req, res, next) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("login", {
        pageTitle: "login",
        path: "/login",
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
          email: "",
          password: ""
        },
        validationErrors: []
      });
    };
    
    exports.postLogin = (req, res, next) => {
      const email = req.body.email;
      const password = req.body.password;
    
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render("login", {
          path: "/login",
          pageTitle: "Login",
          isAuthenticated: false,
          errorMessage: errors.array()[0].msg,
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: errors.array()
        });
      }
    
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
        errorMessage: message,
        oldInput: {
          email: "",
          password: "",
          confirmPassword: ""
        },
        validationErrors: []
      });
    };
    
    exports.postSignup = (req, res, next) => {
      const email = req.body.email;
      const password = req.body.password;
    
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render("signup", {
          pageTitle: "signup",
          path: "/signup",
          isAuthenticated: false,
          errorMessage: errors.array()[0].msg,
          oldInput: {
            email: email,
            password: password,
            confirmPassword: req.body.confirmPassword
          },
          validationErrors: errors.array()
        });
      }
    
      bcrypt
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
        })
        .catch(err => {
          res.status(500);
          console.log(err);
        });
    };
    
    exports.postLogout = (req, res, next) => {
      req.session.destroy(err => {
        console.log(err);
        res.redirect("/");
      });
    };
    

Next , In Auth Routes

    
    const express = require("express");
    const router = express.Router();
    const authController = require("../controller/auth");
    const isAuth = require("../middleware/is-auth");
    const User = require("../models/user");
    const { body } = require("express-validator");
    
    router.get("/signup", authController.getSignup);
    
    router.post(
      "/signup",
      [
        body("email")
          .isEmail()
          .withMessage("Please Enter Valid Email")
          .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
              if (userDoc) {
                return Promise.reject("Email Already Exist");
              }
            });
          })
          .normalizeEmail(),
        body("password", "Please Enter Valid Password & Minimal 5 Character")
          .isLength({ min: 5 })
          .isAlphanumeric()
          .trim(),
        body("confirmPassword")
          .trim()
          .custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error("Password Not Match !");
            }
            return true;
          })
      ],
      authController.postSignup
    );
    
    router.get("/login", authController.getLogin);
    router.post(
      "/login",
      [
        body("email")
          .isEmail()
          .withMessage("Please enter valid email.")
          .normalizeEmail(),
        body("password", "Please enter password at least 5 characters.")
          .isLength({ min: 5 })
          .isAlphanumeric()
          .trim()
      ],
      authController.postLogin
    );
    
    router.post("/logout", isAuth, authController.postLogout);
    
    module.exports = router;
    

Little bit change on Login View

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
          <form action="/login" method="POST" novalidate>
            <div class="form-group mt-4">
              <input
                type="email"
                class="<%= validationErrors.find(e =>e.param === 'email') ? 'form-control form-control-lg border border-danger' : 'form-control form-control-lg' %>"
                placeholder="Email"
                name="email"
                id="email"
                value="<%=oldInput.email%>"
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="<%= validationErrors.find(e =>e.param === 'password') ? 'form-control form-control-lg border border-danger' : 'form-control form-control-lg' %>"
                placeholder="Password"
                name="password"
                id="password"
                value="<%=oldInput.password%>"
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
    

Last on the Signup View

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
    
          <form action="/signup" method="POST" novalidate>
            <div class="form-group mt-4">
              <input
                type="email"
                class="<%= validationErrors.find(e =>e.param === 'email') ? 'form-control form-control-lg border border-danger' : 'form-control form-control-lg' %>"
                placeholder="Email"
                name="email"
                id="email"
                value="<%=oldInput.email%>"
                 
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="<%= validationErrors.find(e =>e.param === 'password') ? 'form-control form-control-lg border border-danger' : 'form-control form-control-lg' %>"
                placeholder="Password"
                name="password"
                id="password"
                value="<%=oldInput.password%>"
                
              />
            </div>
             <div class="form-group">
              <input
                type="password"
                class="<%= validationErrors.find(e =>e.param === 'confirmPassword') ? 'form-control form-control-lg border border-danger' : 'form-control form-control-lg' %>"
                placeholder="Confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                value="<%=oldInput.confirmPassword%>"
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

That's  all about basic validation and sanitization using express validator . I really like this package because it help much for rapid development and security . Don't forget to explore all the method that express validator have , as always link down below

* **[Express Validator - Docs](https://express-validator.github.io/docs/)**
* **[Express Validator - Github Repo](https://github.com/validatorjs/validator.js)**
* **[Fruit Shop - Github Repo](https://github.com/Faeshal/NodeJS-Mongoose-Auth)**

Last but not least stay curious and never stop learning,Sallam!