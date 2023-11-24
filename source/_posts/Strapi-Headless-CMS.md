title: Low Code Era - Meet Strapi The Headless CMS
date: 2023-11-23 18:42:08
tags:

- cms
- backend

---

![](https://i.postimg.cc/Fz0rDgJj/meme.jpg)

## Headless ? What's that ? 🍹

The trend of low code development is very massive, especially in Singapore. My CTO told me to research about headless cms in NodeJS ecosystem for our next project. The term is a little bit weird for me, headless ? what the heck is that. So, i write the results of my exploration here with language that may be simpler and straight forward.

In short, headless cms is cms without "frontend" so this type of cms focusing on the serving & managing the API. If you wanna consume the API, you must build the frontend by yourself whether is mobile, web etc. That's why i like the idea, **Headless CMS is very Backend Friendly & API Oriented.**

![](https://i.postimg.cc/kMYd8H6W/cms.png)

Before, my first thought when I heard CMS, i was expecting something similar to WordPress, Wix, Drupal. Where we create content in the admin panel, then that content appears on the frontend page so the user can consume it. Tada, i was wrong.

![](https://i.postimg.cc/26Vw1YHK/wrong.jpg)

CMS like WordPress, WIX etc that's call reguler / traditional CMS. On Headless we only got backend UI for managing content (API) most likely this is only for admin. What about page for external user ? **we make it separately**.

This is the core difference between headless and traditional CMS. We are given flexibility to choosing technology for our frontend applications, regardless of platform. In contrast to traditional CMS which is very monolithic and strict. So we can combine like Strapi + React.js, Strapi + Flutter etc. Completely different codebase.

![https://i.postimg.cc/kMYd8H6W/cms.png](https://i.postimg.cc/CLZp44kX/cms3.png)

## Introduction, Strapi 👷‍♀️

{% youtuber video BAAhEWbnOak %}{% endyoutuber %}

Actually, there are many headless CMS choices based on NodeJS, but in my opinion Strapi still the best one (at least when this post created). If there is a project that requires me to use headless cms, i will definitely choose strapi for that, here's why.

1. Documentation

Guys, Strapi documentation is sooo good. The example of world-class quality documentation. Clean, Structure, modern with intuitive UI. Documentation is very important here. There is a lot of software that may be technically good, but because the documentation is disorganized, developer have difficulty during development or finding solutions, make it unproductive. So ya, Strapi good at this.

![](https://i.postimg.cc/ZnHW8BDY/Screenshot-2023-11-24-at-2-17-18-PM.pnghttps://i.postimg.cc/C5zgQ36T/s-7-E0-CDF98-C8224-A710-ADADF2-AFD2360-BE291-C4097-D3580-E7-A564-BF1-A5-D07-D603-A-1651562077417-image.pnghttps://i.postimg.cc/kMYd8H6W/cms.p)

2. Customization

In real world projects, 99% i can confirm that even if you use low code tools, you will definitely still customize the code. What I mean is not customize basic things like add field, edit text etc, but it's more like changing the default behavior of the software.

![](https://i.postimg.cc/C5zgQ36T/s-7-E0-CDF98-C8224-A710-ADADF2-AFD2360-BE291-C4097-D3580-E7-A564-BF1-A5-D07-D603-A-1651562077417-image.pnghttps://i.postimg.cc/kMYd8H6W/cms.pn)

Things like how to change the default login flow, how to extend the default query, how to extend the middleware etc. Very spesific things like that maybe will not cover in the documentation. This is very critical. The abilily to customize the software. I think strapi is pretty good at that, because the code style is easy to understand and not too much sugar syntax on it.

3. Popularity

If there is a problem during development and we are looking for a solution, then the platform we use is not well known. Congratulations, you've got a headache. That's why popularity is important especially in open source software. Strapi is not as bad as think before, if you encounter problem when development, beside we use stackoverflow strapi provide forum platform which can be used for finding solutions. I got more answers there compare to Stackoferflow to be honest. So ya, that's another plus point.

![](https://i.postimg.cc/zBkvNYjy/Screenshot-2023-11-24-at-9-42-14-AM.png)

Also if you look at the repository, the team is very active maintaining the codebase and since this post was made Strapi has received 57.4K stars on GitHub & enter [top 150 most popular repositories](https://gitstar-ranking.com/repositories?page=2) among the 28 million public on GitHub. In terms of number of github stars Strapi even beating the most popular framework in Ruby, which is Rails. Impressive.

![](https://i.postimg.cc/HnhpWY7k/github.pnghttps://i.postimg.cc/zBkvNYjy/Screenshot-2023-11-24-at-9-42-14-AM.pn)

## Code Customization 👋

##### Quick setup

I just breakdown the main part cause too many things that can be customized. You can look at the official docs for details. First i will start with how to setup strapi. It start with pretty simple command:

```
npx create-strapi-app@latest my-project
# 'npx' runs a command from an npm package
# 'create-strapi-app' is the Strapi package
# '@latest' indicates that the latest version of Strapi is used
# 'my-project' is the name of your Strapi project
```

follow the prompt to choose your favorite Database & root user. After finising instalation you will get default codebase like this.

![](https://i.postimg.cc/SsN6w4FK/Screenshot-2023-11-24-at-7-31-16-PM.pnghttps://i.postimg.cc/SsN6w4FK/Screenshot-2023-11-24-at-7-31-16-PM.pnghttps://i.postimg.cc/HnhpWY7k/github.pnghttps://i.postimg.cc/zBkvNYjy/Screenshot-2023-11-24-at-9-42-14-AM.)

to run the server

```
npm run develop
```

go to admin url & voila you get full feature backend admin panel ready to use.

![](https://i.postimg.cc/NMzHSrkN/Screenshot-2023-11-24-at-7-35-50-PM.png)

##### Add Resource

xxxxx

Every time you want to create a new resource / table structure you don't need to bother setup SQL manually, just go to the content type builder menu & use the ui. You can even set database relationships with content type builder. This features is pretty handy, everything is automatic.

https://i.postimg.cc/Kj3M2v9m/Screenshot-2023-11-24-at-7-50-26-PM.pn

For example i will create category table & when i finish creating the structure & save it. Strapi will automatically create the table including CRUD (create, read, update & delete) functionality for us, so we don't need coding to create a basic CRUD on the /categories endpoint. everything has been made by strapi. Cool isn't it ?. Anyway this is the dafault structure for /categories API that already create.

controller

```'use strict';/** * category controller */const { createCoreController } = require('@strapi/strapi').factories; module.exports = createCoreController('api::category.category');

```

service

route

##### Add Endpoint on existing Resource

xxxxx

##### Customize behavior default API

xxxxx

## Recap 👋

**If you feel like traditional CMS is too rigid for the project you're handling and puts too many constraints on you** , then headless CMS might be the way to go. While headless CMS is beneficial for developers especially in terms of user experience, it might not be needed for small websites with few pages. Using a traditional CMS for smaller projects is faster and more effective. Remember, all tools cannot solve all problems, always make sure to use right tools on the right place. Peace out.
