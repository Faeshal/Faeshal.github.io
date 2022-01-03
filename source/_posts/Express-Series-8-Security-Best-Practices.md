---
title: "Express Series 8 : Security Best Practices"
date: 2019-07-23 12:38:06
tags:
  - express.js
  - express series
category:
  - node.js
---

##### ![](https://i.postimg.cc/25ZZXKk3/security-best-practice.jpg)

##### Introduction

This is the last & the most important part of express series  . How we secure our express app. Well as you already know express is very minimalist web framework and extreamly unopinionated , that means we rule and control how the app must run , how app should be structured & what package should be install , we pick all that stuff by self . On the Negative side , this give us vulnerability to our web app if we not carefull.

So in this post , i just give advice based on my experience , if you wanna add tips for tweak security in express that miss in this post , just drop in comment section ok ? . So let's Get Started ..

##### Make your Express App More Secure

###### 1.Place Sensitive Data in .env

Separate Sensitive Data like Database Connection String , User , Password , Api Keys & Port in .env file make your code a bit more secure and more clean .

This help you to Avoid (accidentally) committing (exposing) your private keys, passwords or other sensitive details(by hard-coding in them in your script) to GitHub by storing them as environment variables. Another useful package that you can use is dotenv.

- **[Dotenv - NPM](https://www.npmjs.com/package/dotenv)**

###### 2.Use Helmet

![](https://i.postimg.cc/pdqV0GRj/helmet.png)

Helmet.js is a useful Node.js module that helps you **secure HTTP headers**. HTTP headers are an important part of the HTTP protocol, but are generally transparent from the end-user perspective.

The headers provide important metadata about the HTTP request or response so the client (browser) and server can send additional information in a transaction. Helmet is helping by setting various HTTP headers. Helmet give us very clear documention , link down below :

- **[helmetjs.github.io/](https://helmetjs.github.io/)**

###### 3.Use Snyk 

Most of your code come from npm . That means, Most of your app vulnerabilities come from npm . The problem remains that the npm dependency architecture can expose your users to security problems, even if your app itself is secure.

That's why we need Snyk. Snyk is a dependency analysis platform for multiple development stacks covering JavaScript, Java, .Net, Ruby, Python, PHP, Golang and Scala etc . it's like npm audit but more advance. It's also can integrated with devops tools like jenkins , docker , circle ci etc , that make snyk more powerfull.

- **[snyk.io/](https://snyk.io/)**

###### 4.Keep Cookie Secure

Simple step that can make your cookie secure is ** don’t use the default session cookie name** and set cookie security options appropriately . We can use Package Called Express-Session for handle this things. I already make a post about cookie , session and auth better you check it .

- **[Express-Session - NPM](https://www.npmjs.com/package/express-session)**
- **[Express Series 5 : Cookie , Session & Authentication](https://faeshal.com/post/express_auth)**

###### 5.Always use Validation & Sanitization

Dont forget to use Validation & Sanitization , It's will make your form more secure , because most of the time hacker will using form vulnerability to attack your app . Another Package that can handle this problem is called express validator , Again i already make a post about this and describe how to implement into your code , better you check it .

- **[Express-Validator - NPM](https://www.npmjs.com/package/express-validator)**
- **[Express Series 6 : Validation & Sanitization](https://faeshal.com/post/express_validator)**

###### 6.Always use CSURF

![](https://i.postimg.cc/4NcWzngC/csrf.png)

One classic attack when working with web applications is Cross Site Request Forgery aka CSRF/XSRF . They are used by attackers to perform requests on behalf of users in your application without them noticing.We need to set an **extra value token** that can be passed to the server to verify the request’s authenticity.

Another good package for handle this problem called **csurf** , This is Middleware for protect you from csrf attack , again csurf give you very clear documentation , link down below :

- **[Csurf - NPM](https://www.npmjs.com/package/csurf)  **

###### 7.Use Eslint for Production App

ESLint is an open source JavaScript linting utility that help you overcome developer errors as JavaScript is loosely-typed language. So is this can make your code secure ? Directly No , But Indirectly Yes .

Eslint can make your code more readable and give pre-code review. You will find bugs and errors before they happen, you will spend less time testing new features & your code will be more consistent.

- **[EsLint - NPM](https://www.npmjs.com/package/eslint)**

##### Last Word

This is the **last series** about express , i know a lot of things which i not yet cover but i hope this can help you understand at least what express is and how to use it  . For this series i know a lot of security tweak that not yet i mention and i give you some article that speak that topic better than me :

- **[Secure your node app - Geekflare](https://geekflare.com/how-to-secure-nodejs/)**
- **[Express - Official Docs](https://expressjs.com/en/advanced/best-practice-security.html)**
