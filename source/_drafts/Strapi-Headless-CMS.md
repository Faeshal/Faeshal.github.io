title: Strapi Headless CMS
date: 2023-11-23 18:42:08
tags:

- cms
- backend

---

{% youtuber video BAAhEWbnOak %}{% endyoutuber %}

## Headless ? What's that ? 🍹

The trend of low code development is very massive, especially in Singapore. My CTO told me to research about headless cms in NodeJS ecosystem for our next project. The term is a little bit weird for me, headless ? what the heck is that. So, i write the results of my exploration here with language that may be simpler and straight forward.

In short, headless cms is cms without "frontend" so this type of cms focusing on the serving & managing the API. If you wanna consume the API, you must build the frontend by yourself whether is mobile / web with your favorite frontend tools. That's why i like the idea, **Headless CMS is very Backend Friendly & API Oriented.**

![https://i.postimg.cc/kMYd8H6W/cms.png](https://i.postimg.cc/kMYd8H6W/cms.png)

My first thought when I heard CMS, i was expecting something similar to WordPress, Wix, Drupal. Where we create content in the admin panel, then that content appears on the frontend page so the user can consume it. Tada, i was wrong. Things like WordPress, WIX etc that's call traditional CMS. On Headless we only got UI for managing content (API) most likely this is only for admin.

What about page for external user ? **we make it separately**. This is the core difference between headless and traditional CMS. We are given flexibility to choosing technology for our frontend applications, regardless of platform. In contrast to traditional CMS which is very monolithic and strict. So we can combine like Strapi + React.js, Strapi + Flutter etc. Completely different codebase.

![https://i.postimg.cc/kMYd8H6W/cms.png](https://i.postimg.cc/CLZp44kX/cms3.png)

## Introduction, Strapi 👷‍♀️

Actually, there are many headless CMS choices based on NodeJS, but in my opinion Strapi still the best one (at least when this post created). If there is a project that requires me to use headless cms, i will definitely choose strapi for that, here's why..

![](https://i.postimg.cc/SRPFhXFg/Screenshot-2023-11-23-at-11-24-42-AM.pnghttps://res.cloudinary.com/faeshal/image/upload/v1666021467/faeshalcom/jwk_uasrvo.pn)

1. Documentation
   Guys, Strapi documentation is sooo good. The example of world-class quality documentation. Clean, Structure, modern with intuitive UI. Documentation is very important here. There is a lot of software that may be technically good, but because the documentation is disorganized, developer have difficulty during development or finding solutions, make it unproductive. So ya, Strapi good at this.

2. Customization
   In real world projects, 99% i can confirm that even if you use low code tools, you will definitely still customize the code. What I mean by customize here, is not customize basic things like add field, edit text etc, but it's more like changing the default behavior of the software. Things like how to change the default login flow, how to extend the default query, how to extend the middleware etc. Very spesific things like that maybe not cover in the documentation. This is very critical. The abilily to customize the software. I think strapi is pretty good at that, because the coding style is easy to understand and not too much sugar syntax on it.

3. Popularity
   xxxxxxxx xxxxx

## Code Customization 👋

Recap

Basically there is 2 way to generate & verify the token, we can use :

## Recap 👋

Recap

Basically there is 2 way to generate & verify the token, we can use :
