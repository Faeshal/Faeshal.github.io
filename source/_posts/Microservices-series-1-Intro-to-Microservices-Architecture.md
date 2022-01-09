---
title: "Microservices series 1 : Intro to Microservices Architecture"
date: 2022-01-01 10:18:38
tags:
  - microservices
  - architecture
category:
  - backend
---

## Introduction

This is the beginning series of microservices architecure and the implementation in node.js. First thing first i wanna say thank you & give credit to [Stephen Grider](https://www.linkedin.com/in/stephengrider/), one of the best coding instructor out there. I learn a lot about microservices from him & i'm using some of his diagram pictures for this series.

Before we dive into microservice architecture, we must know what is monolitich architecure really is and what problems arise from this architecture, this is the most common software architecture that we always use, right ?

## monolitich architecture

![mono](https://i.postimg.cc/BbQWqFzj/Screen-Shot-2022-01-01-at-10-08-25-AM.png)

Monolithic architecture is traditional approach of building software which use a single code base with multiple modules/features and is tightly coupled. It has single build system which build entire application and/or dependency. It also has single entry point or deployable binary

Pro :

- simple, easy & fast to develop, testing & error tracing
- Low cost in the early stages of the application. All source code is located in one place, packaged in a single deployment unit, and deployed. What can be easier? There is no overhead neither in infrastructure cost nor development cost.

Cons :

- Scaling become challenging
- Extremely difficult to change technology, language or framework because everything is tightly coupled and depend up on each other (lack of flexibility)
- Large code base makes IDE slow & build time increase.
- You must redeploy the entire application on each update
- Bad fault isolation, if one feature was broken, than entire system will down.

## microservices architecture

![mc](https://i.postimg.cc/9XsJpZmC/Screen-Shot-2022-01-01-at-10-09-33-AM.png)

According to the book of **Building Microservices: Aligning Principles, Practices & Culture**

> Microservices are small & autonomous services that work together - Sam Newman

> Loosely coupled service-oriented architecture with bounded contexts - Adrian Cockcroft, Battery Ventures

They both emphasize some level of independence, limited scope, and interoperability. In general Microservice architecture or simply microservices is an approach of building large enterprise application with multiple small unit called service, each service develop, test, deploy and run individually.

Microservice Pro :

- Highly Scalable, microservice is easy to scale based on demand, each service can be scaled independently.
- Each service is small and focused on a specific feature / business requirement.
- Better fault isolation, if one service down/fail, the other will continue to work (resiliency)
- Microservice is loosely coupled, means services are independent.
- Microservice architecture gives developers the freedom to independently develop and deploy services, different services can be written in different languages / framework.

Cons :

- Complex, Complex & Complex. Microservices brings additional complexity as the developers have to mitigate, harder to build & take more time to develop. If your system is not complex & you dont need high scalability, than migrating to microservices is suicide.
- Due to distributed deployment, testing can become complicated and tedious.

## One Approach Does Not Fit All

To summarize, each software architecture has its own advantages and its own drawbacks, which can highly affect the success of the developed solution. Therefore, it is important to carefully make the decision on what would be the right architecture considering several factors: the problem being addressed, the scale of development, the expectation for the future development, as well as the size of the team and the available budget.

To generalize, monolithic architecture is most suitable for:

- Simple, lightweight applications that only require limited functionality
- Startups and businesses operating only with a small team and looking for a quick launch
- MVP versions of the products in their trial stage, which are not guaranteed to be used often

On the other hand, the microservices architecture might be more suitable for:

- Big, complex and evolving system
- Stable and verified business concepts with a lot of traffic
