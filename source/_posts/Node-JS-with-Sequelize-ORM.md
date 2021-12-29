---
title: Node JS with Sequelize ORM
date: 2019-05-24 12:37:33
tags:
- database
- sql
- express.js
categories:
- backend
---
![](https://i.postimg.cc/vTsJh9FS/node.jpg)

##### Introduction

NodeJS is JavaScript run-time that executes JavaScript code outside of a browser and Sequelize is a promise-based ORM for Node.js and what the heck is ORM. ORM or Object Relation Mapping is a process of mapping between objects and relation database systems. So why use sequelize ? basicly for create , control, manipulate and manage databases with easy and fast.

If you really familiar with Node.JS , yeah **Node.js is not easy if you combine with sql database** , like MySQL, Postgre etc It's really hard to manipulate data if you are using native sql syntax. So that's why we use sequelize.

##### Project Intro

Ok Let's Straigt to the point , we gonna build simple crud App with MVC Architecture in this case fruit shop, And this is technology & tools i used for :

| Technology | Name |
| --- | --- |
| Back End | NodeJS |
| Framework | Express & Bootstrap 4 |
| DBMS | Mysql |
| NPM | Mysql2 & Body Parser & Nodemon & Sequelize |
| Template Engine | EJS |

##### Develop Step

First create Folder and then _Npm init_

Second Install All Npm Package above

* npm install --save nodemon
* npm install --save Express
* npm install --save Mysql2
* npm install --save sequelize
* npm install --save ejs

Next ,Create MVC folder schema it's up to you for name but this is mine :

* controller
* models
* routes
* util
* views
    * includes

Next Create server,model,require all package from app.js (our main route) :

     //Software Engineer : Faeshal Bin Sulaiman   const path = require("path");
      const express = require("express");
      const bodyParser = require("body-parser");
      const sequelize = require("./util/database");
      const adminRoutes = require("./routes/admin");
      const app = express();
      
      // SECTION : Model
      const Product = require("./models/product");
      
      //SECTION : Tell Express use EJS Engine
      app.set("view engine", "ejs");
      app.set("views", "views");
    
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(adminRoutes); 
    
      // SECTION : Sequelize (sync)
      sequelize
        .sync()
        .then(result => {
          return Product.findByPk(1);
        })
        .catch(err => {
          console.log(err);
        });
      
      app.listen(3000);  
    

Next create database connection in database.js inside util folder . My Database name is fruit with username & password root.

    const Sequelize = require("sequelize");
    
    const sequelize = new Sequelize("fruit", "root", "root", {
      dialect: "mysql",
      host: "localhost"
    });
    
    module.exports = sequelize;
    

Next the most important create controller name admin.js inside controller folder.Controller use for connect model and view and bring functionality

    const Product = require("../models/product");
    
    exports.getAddProduct = (req, res, next) => {
      res.render("add", {
            pageTitle: "Add Product",
            path: "/add",
            editing: false
       });};
        
          exports.postAddProduct = (req, res, next) => {
          const title = req.body.title;
          const imageUrl = req.body.imageUrl;
          const price = req.body.price;
          const stock = req.body.stock;
          const description = req.body.description;
          Product.create({
            title: title,
            price: price,
            stock: stock,
            imageUrl: imageUrl,
            description: description
          })
            .then(result => {
              // console.log(result);
              console.log("Created Product");
              res.redirect("/");
            })
            .catch(err => {
              console.log(err);
            });
        };
        
        exports.getEditProduct = (req, res, next) => {
          const editMode = req.query.edit;
          if (!editMode) {
            return res.redirect("/");
          }
          const prodId = req.params.productId;
          Product.findByPk(prodId)
            .then(product => {
              if (!product) {
                return res.redirect("/");
              }
              res.render("edit", {
                pageTitle: "Edit Product",
                path: "/edit",
                editing: editMode,
                product: product
              });
            })
            .catch(err => console.log(err));
        };
        
        exports.postEditProduct = (req, res, next) => {
          const prodId = req.body.productId;
          const updatedTitle = req.body.title;
          const updatedPrice = req.body.price;
          const updatedStock = req.body.stock;
          const updatedImageUrl = req.body.imageUrl;
          const updatedDesc = req.body.description;
          Product.findByPk(prodId)
            .then(product => {
              product.title = updatedTitle;
              product.price = updatedPrice;
              product.stock = updatedStock;
              product.description = updatedDesc;
              product.imageUrl = updatedImageUrl;
              return product.save();
            })
            .then(result => {
              console.log("UPDATED PRODUCT!");
              res.redirect("/");
            })
            .catch(err => console.log(err));
        };
        
        exports.getProducts = (req, res, next) => {
          Product.findAll()
            .then(products => {
              res.render("index", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/"
              });
            })
            .catch(err => console.log(err));
        };
        
        exports.postDeleteProduct = (req, res, next) => {
          const prodId = req.body.productId;
          Product.findByPk(prodId)
            .then(product => {
              return product.destroy();
            })
            .then(result => {
              res.redirect("/");
            })
            .catch(err => console.log(err));
        };
    

Next create admin.js again inside _routes_ folder and create routing & call from controller

    const express = require("express");
    const adminController = require("../controller/admin");
    const router = express.Router();
    
    router.get("/add", adminController.getAddProduct);
    router.get("/", adminController.getProducts);
    router.post("/add", adminController.postAddProduct);
    router.get("/edit/:productId", adminController.getEditProduct);
    router.post("/edit", adminController.postEditProduct);
    router.post("/delete", adminController.postDeleteProduct);
    
    module.exports = router;    
    

Next , Create product.js inside models folder for manage database structure

        const Sequelize = require("sequelize");
        const sequelize = require("../util/database");
        const Product = sequelize.define("product", {
          
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
          title: {
            type: Sequelize.STRING
          },
          price: {
            type: Sequelize.DOUBLE,
            allowNull: false
          },
          imageUrl: {
            type: Sequelize.STRING,
            allowNull: false
          },
          stock: {
            type: Sequelize.INTEGER
          },
          description: {
            type: Sequelize.STRING,
            allowNull: false
          }
        });
        
        module.exports = Product;    
    

Next we build the view. I will separate header and footer inside _views/includes_ for use by 3 main file inside views which is index.ejs(for main page),add.ejs(for add product page),edit.ejs(for edit product).So this is good for modularity and clean code. Ok this is head.ejs inside _views/includes_:

    <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Fruit App</title>
            <!-- Required meta tags -->
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
        
            <!-- Bootstrap CSS -->
            <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossorigin="anonymous"
            />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous"></link>
          </head>
          <body>
        
            <!-- NAVBAR -->
          <nav class="navbar navbar-light bg-light">
            <a class="navbar-brand" href="/">
            <i class="fas fa-campground d-inline-block align-top mr-2 ml-2 mt-1 fa-lg"></i>
            Shop</a>
            <a class="navbar-brand ml-auto" href="/add"><i class="fas fa-plus"></i></i></a>
            <a class="navbar-brand ml-auto" href="https://www.instagram.com/faeshal_/" target="_blank"><i class="fab fa-instagram fa-lg"></i></a>
            <a class="navbar-brand" href="https://github.com/faeshal" target="_blank"><i class="fab fa-github fa-lg"></i></a>
          </nav>
    

and this is the end.ejs

    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script
          src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
          integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
          integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
          integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
          crossorigin="anonymous"
        ></script>
      </body>
    </html>
    

And the main view , index.ejs

    <%-include("includes/head.ejs")%>
        <!-- SECTION: CONTENT -->
        <div class="container mb-2 mt-4">
          <h4 class="text-center mb-4">FRUITS</h4>
          <hr />
          <!-- SECTION : CARD -->
          <div class="row text-center">
            <% if (prods.length > 0) { %> <% for (let product of prods) { %>
            <div class="col-md-4 text-center ">
              <div class="card mb-4 mt-2 mr-4 ml-4 mx-auto" style="width: 17rem;">
                <h5 class="card-title text-center mt-2 mb-2"><%-product.title%></h5>
                <img
                  class="card-img-top"
                  src="<%-product.imageUrl%>"
                  alt="Card image cap"
                />
                <div class="card-body text-center">
                  <h5 class="card-title">$ <%-product.price%></h5>
                  <h6 class="text-muted"><%-product.stock%> Stock</h6>
                  <p class="card-text">
                    <%-product.description%>
                  </p>
        
                  <form id="myForm" method="POST" action="/delete">
                    <a
                      href="/edit/<%= product.id %>?edit=true"
                      class="btn btn-warning mr-3"
    
                      >Update</a
                    >
                    <input type="hidden" value="<%= product.id %>" name="productId" />
                    <button
                      class="btn btn-danger"
                      onclick="return confirm('Are You Sure?');"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <% } %>
        
            <!-- END CARD -->
            <% } else { %>
            <h6 class="text-center">No Product</h6>
            <% } %>
          </div>
        </div>
        <!--  -->
        
        <%-include("includes/end.ejs")%>
    

This is Add.ejs

      <%-include("includes/head.ejs")%>
        <!-- SECTION:CONTENT -->
        <div class="container" class="mt-4 ml-2 mr-2">
          <h4 class="text-center mt-4">ADD PRODUCTS</h4>
          <hr />
          <div class="row">
            <div class="col-sm-10 mx-auto">
              <form action="/add" method="POST">
                <div class="form-group mt-4">
                  <input
                    type="text"
                    name="title"
                    class="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Name"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    name="imageUrl"
                    id="imageUrl"
                    placeholder="Image Url"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="number"
                    class="form-control"
                    name="price"
                    id="price"
                    placeholder="Price"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="number"
                    class="form-control"
                    name="stock"
                    id="stock"
                    placeholder="Stock"
                  />
                </div>
                <div class="form-group">
                  <textarea
                    class="form-control"
                    name="description"
                    id="description"
                    rows="3"
                    ,
                    placeholder="Description"
                  ></textarea>
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-outline-success btn-lg">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!--  -->
        <%-include("includes/end.ejs")%>    
    

This is Edit.ejs

      <%-include("includes/head.ejs")%> <
        <!-- SECTION:CONTENT -->
        <div class="container" class="mt-4 ml-2 mr-2">
          <h4 class="text-center mt-4">EDIT PRODUCTS</h4>
          <hr>
          <div class="row">
              <div class="col-sm-10 mx-auto">
          <form action="/edit" method="POST">
            <input type="hidden" value="<%= product.id %>" name="productId" />
            <div class="form-group mt-4">
              <input
                type="text"
                class="form-control"
                id="title"
                name="title"
                value="<%= product.title %>"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                id="imageUrl"
                name="imageUrl"
                value="<%= product.imageUrl %>"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="form-group">
              <input
                type="number"
                class="form-control"
                id="price"
                name="price"
                value="<%= product.price %>"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                id="stock"
                name="stock"
                value="<%= product.stock %>"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="form-group">
              <textarea
                class="form-control"
                name="description"
                id="description"
                rows="3"
                placeholder="Description"
              >
        <%= product.description %></textarea
              >
            </div>
            <div class="text-center">
              <button
                id="update"
                class="btn btn-outline-warning btn-lg"
                onclick="Update()"
                value="UPDATE"
              >
                UPDATE
              </button>
            </div>
        </div>
        </div>
        </div>
        
        <!--  -->
        <%-include("includes/end.ejs")%>    
    

##### Result

Anyway you can create your own design for example the card and navbar with your style for sure, dont forget to _npm start_  for start the server . This is my result:

Let's Try add Functionality :

This is Edit Functionality

And the last Delete functionality with destroy method ini Express

##### Last Word

Hope you understand how Nodejs handle the request , work flow with express and bring the data with sequelize. Dont forget to check documentation for details as always link down below.

* **[Sequelize](http://docs.sequelizejs.com/)**
* **[Express](https://expressjs.com/)**
* **[Body Parser](https://www.npmjs.com/package/body-parser)**
* **[EJS](https://ejs.co/)**
* **[Mysql2](https://www.npmjs.com/package/mysql2)**

If you have a question feel free to comment down below . for the last but not least stay curious and never stop learning. Sallam!
