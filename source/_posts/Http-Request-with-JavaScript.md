---
title: Http Request with JavaScript
date: 2019-01-11 12:40:06
tags:
  - javascript
  - http
category:
  - javascript
---

##### ![](https://i.postimg.cc/6q0DtFbd/HTTP-txch7g.png)

##### Introduction  

Basically http request is one of the most important skill to have for frontend developer to comunicate with the backend developer.

The Flow is first you sends a request, waits for the server respond to the request, and (once the server responds) processes the request , and you will get the data (ex.from API). All of this communication is made possible because of something known as the HTTP protocol.

##### **Style to make Http Request **

Let's staright to the point , a lot of way to making request with javascript and this is the common style for making http request  :

###### 1.FETCH

Fetch is a new powerful web API from vanilla javascript that lets you make asynchronous requests. In fact, fetch is one of the best and my favorite way to make an HTTP request. It returns a “Promise” which is one of the great features of ES6. Let's take a look at how fetch technically works.

    var base_url = "https://jsonplaceholder.typicode.com/todos/1";
    fetch(base_url)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));

###### 2.AJAX

Ajax is the traditional way to make an asynchronous HTTP request. Data can be sent using the HTTP POST method and received using the HTTP GET method. Let’s take a look and make a GET request. I’ll be using JSONPlaceholder, a free online REST API for developers that returns random data in JSON format.

    const Http = new XMLHttpRequest();
    const url='https://jsonplaceholder.typicode.com/posts';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      console.log(Http.responseText)
    }

###### 3.JQuery

JQuery has many methods to easily handle HTTP requests. In order to use these methods, you’ll need to include the jQuery library in your project. Get from [CDN JS](https://cdnjs.com/libraries/jquery/)

      $.ajax({
        type: "GET",
        url: "https://jsonplaceholder.typicode.com/todos/1",
        dataType: 'JSONP'
        success: function(data){
            console.log(data);
        }

###### 4.Axios

Axios is one of the most popular http request liblary because ability to conver JSON automatically . You can download from NPM or using [CDN JS](https://cdnjs.com/libraries/axios)  . This is axios style to make get request :

    axios.get('https://jsonplaceholder.typicode.com/todos/1').then(resp => {
        console.log(resp.data);
    });

###### Demo

For demo  i have create an app called "GIF Bank" , it's simple gif finder app implementing Fetch and i'm using it for request GIPHY API . You can fork the project from my github, link down below :

Live Demo

**[https://gif-bank.now.sh/](https://gif-bank.now.sh/)**

Github Repo

**[https://github.com/Faeshal/GIF-Bank](https://github.com/Faeshal/GIF-Bank) **

###### Last Word

That's it about http request , remember i just explain get request in each style . There is many more http verb like post , put , delete etc so maybe you must check this awesome article , Link down below:

- **[Axios - Flaviocopes.com](https://flaviocopes.com/axios/)**
- **[Http Request Method](https://www.tutorialspoint.com/http/http_methods.htm)**
