title: Low Code Era - Meet Strapi The Headless CMS
date: 2023-11-25 13:42:08
tags:

- lowcode
- backend

---

![](https://i.postimg.cc/Fz0rDgJj/meme.jpg)

## Headless ? 🤔

The trend of low code is raising, especially for Tech Company in Singapore. My CEO told me to research about headless CMS in NodeJS for our next project. The term is a little bit weird for me, headless ? what the heck is that. So, i write the results of my exploration here with simpler language.

In short, headless CMS is CMS **without frontend** so this type of CMS focusing on the serving & managing content or we can say API. If you wanna consume the API, you must build the frontend by yourself whether is mobile, web etc. That's why i like it. **Headless CMS is very Backend Friendly & API Oriented.**

Previously, my first thought when I heard CMS, i was expecting something similar to WordPress, Wix, Drupal. Where we create content in the admin panel, then that content appears on the frontend page so the user can consume it. Tadaaaaa, i was wrong.

![](https://i.postimg.cc/LXC5GGLk/bush.jpg)

CMS like WordPress, WIX etc that's call reguler / traditional CMS. On Headless we only got backend UI for managing content (API) most likely this is only for admin. What about page for external user ? **we make it separately** 🙂.

This is the core difference between headless and traditional CMS. We are given flexibility to choosing technology for our frontend applications. In contrast to traditional CMS which is very monolithic and strict. So we can combine like Strapi + React.js, Strapi + Flutter etc. Completely different codebase.

![https://i.postimg.cc/kMYd8H6W/cms.png](https://i.postimg.cc/CLZp44kX/cms3.png)

## Introducing, Strapi 🙋

{% youtuber video BAAhEWbnOak %}{% endyoutuber %}

Actually, there are many headless CMS choices based on NodeJS, but in my opinion Strapi is the best one (at least when this post created). I won't talk about too much detail about the features but i can say if there is a project that requires me to use headless CMS, i will definitely choose strapi for that. Beside it's free & open source this is my 3 main considerations.

1. Documentation - [docs.strapi.io/dev-docs/intro](https://docs.strapi.io/dev-docs/intro) 📖

Guys, Strapi documentation is soooo good. The example of world-class quality docs. Clean, structure, modern with intuitive UI. Documentation is very important aspect for me. There is a lot of software that may be technically good, but because the documentation is disorganized, developer have difficulty during development or finding solutions, make it unproductive. So ya, Strapi good at this.

![](https://i.postimg.cc/ZnHW8BDY/Screenshot-2023-11-24-at-2-17-18-PM.png)

2. Customization 🚀

In real world projects, 99% i can confirm that even if you use low code tools, you will definitely still customize the code. What I mean is not customize basic things like add field, edit text etc, but it's more like changing the default behavior of the software.

![](https://i.postimg.cc/C5zgQ36T/s-7-E0-CDF98-C8224-A710-ADADF2-AFD2360-BE291-C4097-D3580-E7-A564-BF1-A5-D07-D603-A-1651562077417-image.png)

Things like how to change the default login flow, how to extend the default query, how to extend the middleware etc. Very spesific things like that maybe will not cover in the documentation. This is very critical. The abilily to customize the software. I think strapi is pretty good at that, the code style is easy to understand and not too much sugar syntax on it.

3. Popularity 🌍

If there is a problem during development and we are looking for a solution, then the platform we use is not well known. Congratulations, you've got a headache. That's why popularity is important especially in open source software. Strapi is not as bad as think before, if you encounter problem when development, beside we use stackoverflow strapi provide forum platform which can be used for finding solutions. I got more answers there compare to Stackoferflow to be honest. So ya, that's another plus point.

![](https://i.postimg.cc/zBkvNYjy/Screenshot-2023-11-24-at-9-42-14-AM.png)

Also if you look at the repository, the team is very active maintaining the codebase and since this post was made Strapi has received 57.4K stars on GitHub & enter [top 150 most popular repositories](https://gitstar-ranking.com/repositories?page=2) among the 28 million public on GitHub. In terms of number of github stars Strapi even beating the most popular framework in Ruby, which is Rails. Impressive.

![](https://i.postimg.cc/HnhpWY7k/github.pnghttps://i.postimg.cc/zBkvNYjy/Screenshot-2023-11-24-at-9-42-14-AM.pn)

## Customization 🛺

![](https://i.postimg.cc/3w9xDzSM/customize.jpg)

### Quick Setup 🚅

I just breakdown the main part cause too many things that can be customized. You can look at the official docs for details. First i will start with how to setup strapi. It start with pretty simple command:

```
npx create-strapi-app@latest my-project
# 'npx' runs a command from an npm package
# 'create-strapi-app' is the Strapi package
# '@latest' indicates that the latest version of Strapi is used
# 'my-project' is the name of your Strapi project
```

follow the prompt to choose your favorite Database & creating root user. After finising instalation you will get default codebase like this.

![](https://i.postimg.cc/SsN6w4FK/Screenshot-2023-11-24-at-7-31-16-PM.png)

to run the server

```
npm run develop
```

go to admin url & voila you get full feature backend admin panel ready to use.

![](https://i.postimg.cc/NMzHSrkN/Screenshot-2023-11-24-at-7-35-50-PM.png)

### Add Resource 📚

![](https://i.postimg.cc/Vs2n6b0q/food.jpg)

Every time you want to create a new resource / table structure you don't need to setup SQL manually, just go to the content type builder menu & use the ui. You can even set database relationships with content type builder. This features is pretty handy, everything is automatic.

![](https://i.postimg.cc/s216h5xm/Screenshot-2023-11-24-at-10-26-22-PM.png)

For example i will create **product** table & when i finish creating the structure & save it. Strapi will automatically create the table including CRUD (create, read, update & delete) functionality for us, so we don't need coding to create a basic CRUD on the **/products** endpoint. everything has been made by strapi. Cool isn't it ?. Anyway this is the default structure for /products API that already create.

- controller

```
const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::product.product");
```

- service

```
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService("api::product.product");
```

- route

```
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter("api::product.product");
```

![](https://i.postimg.cc/zGPm6zRd/Screenshot-2023-11-25-at-12-01-15-AM.png)

That's it. The API is ready to use with postman on /products endpoint. Really easy.

### Add API On Existing Resource 🪣

![](https://i.postimg.cc/90D021Y6/add.jpg)

So how do we add endpoints to our resources ? very simple, you just type the logic in the service and call from your controller, but on this example i will write the logic directly in the controller just for brevity.

Lets say i wanna add new endpoint **/products/reports/analytics** with the name of controller is **productReports**. I can write like this on controller product.js.

```
module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  // * GET /products/reports/analytics
  async productReports(ctx, next) {
    // your logic .....
    ctx.body = { data: { return data... } };
  },
}))
```

and on the route folder create **custom.js** file and you write route path there. Remember, now inside your route folder, there are 2 file product.js (the default one) & custom.js like below.

```
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/products/repots/analytics",
      handler: "product.productReports",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

You may ask, what about the default CRUD function that already exist ? it seems like the controller only has one endpoint.

![](https://i.postimg.cc/dtjwHcBX/meme2.jpg)

The answer is the default CRUD function is still running without problem, because it located on different route file which is on folder **route/product.js**

### Ovveriding Default API ⏳

![](https://i.postimg.cc/d3bX1tGq/recap.png)

What if we want to customize the default CRUD function, for example create endpoint (POST /products). The answer is you must write the function with same built in function name.

so for example, i wanna customize default GET /products endpoint, i must write the name of function in the controller with **"find"** name, just like this.

```
module.exports = createCoreController("api::product.product", ({strapi}) => ({
      find: async (ctx, next) => {
        // your logic here, for example.....
        // destructure to get `data` and `meta` which strapi returns by default
        const {data, meta} = await super.find(ctx)
        // perform any other custom action
        return {data, meta}
      }
}));
```

This will override the Strapi's default function. Again, for example i wanna ovveride DELETE /products endpoint. So i must create controller with the name of **"delete"** and write our logic there. That's it. You don't need to change anything on the route. Just leave it as the default.

Then how do I know the names of other built in functions name ? such as endpoint for update product. Simple, You can see function list via dashboard, like this.

![](https://i.postimg.cc/26RQSWZV/Screenshot-2023-11-24-at-11-15-00-PM.png)

## Recap 🎉

![](https://i.postimg.cc/mkzJBFzX/x22.jpg)

If you feel like traditional CMS is too rigid for the project & you need decoupled architecture for serving accross multiple platform, then headless CMS might be the way to go. While headless CMS is beneficial for developers it might not be needed for small websites with few pages & only need simple publish functionality. Using a traditional CMS for smaller projects is faster and more effective. Remember, each tools cannot solve all problems, always make sure to use right tools on the right place.
