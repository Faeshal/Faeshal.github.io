---
title: "Microservices series 3 : Communication strategies between services"
date: 2022-01-01 10:37:22
tags:
  - microservices
  - architecture
category:
  - backend
---

## Communication Between Services

In the previous series we already know database per service patern, service strictly prohibited to direct access to other service database, if we need the data from other services we need to talk to service it self not talk directly to the database. The question appear, what is the right way to communicate between services in microservices architecture ?

## Type of Communcication Srategies

There are two general strategies in microservices, they call **Synchronos or Sync** & **Asynchronous or Async.** Warning : **This terminology is diferent with JavaScript world**. So JavaScript has its own definition of sync and async right ?. Keep in mind, This is not the same thing, very different terms in microservices world.

1. **Synchronos or Sync Communication**
   meaning service communicate with other using **direct request**.
   Most synchronous communication technologies are built around HTTP, including gRPC, REST or GraphQL.

![pic1](https://res.cloudinary.com/faeshal/image/upload/v1666021610/faeshalcom/Screen-Shot-2022-01-02-at-12-02-06-PM_yabtfx.png)

The advantages of sync communication is :

- Easy to understand
- Suit for operation that need synchronous request / mandatory to wait.

The downside of sync communication is :

- Introduce a dependency between services
- Slow, blocking thread
- if any inter-service request fails, the overal request fails
- The entire request is only as fast as the slowest request
- Can easily introduce webs of request (deep nested request to many services)

2. **Asynchronous or Async Communication**
   meaning service communicate with other using **events**.
   With asynchronous communication, a middleman is added to infrastructure, asynchronous is using something called a **message broker** technology, such as Apache Kafka, RabbitMQ etc, to act as a middleman between services.

![pic2](https://res.cloudinary.com/faeshal/image/upload/v1666021622/faeshalcom/Screen-Shot-2022-01-02-at-12-03-54-PM_p1h6uw.png)

The advantages of async communication is :

- The calling service is not dependent on the called services. If they fail, the calling service will continue to operate
- its Fast, the threads of the calling services aren’t blocked anymore by waiting for a response
- Possibility of using One-To-Many communication, where a client can send a message to multiple services at once

The downside of asyn communication is :

- Not super easy to understand
- Much harder to debug
- Need adding event bus technology to your infrastructure. Although you can make your event bus, but of course it will slow down the development process isn't it.

## Summary

Remember each communication type has advantages and disadvantages. In some case is not suitable to use async or even sync. Always make a decision based on the use case that occurs in your system.

Use synchronous communication if:

1. The operation is a simple query which does not change any state
2. The operation result is needed to move forward in the current process
3. The operation can fail and does not require a complex retry mechanism
4. The operation needs to be synchronous

Use asynchronous communication if:

1. The operation involves multiple services reacting to it
2. The operation must be performed while allowing failures & retries
3. The operation takes a lot of time
