---
title: "Microservices series 2 : Database per service pattern"
date: 2022-01-01 10:24:22
tags:
  - microservices
  - architecture
category:
  - backend
---

### Data in microservices

![https://i.postimg.cc/63FRKVq0/Screen-Shot-2022-01-01-at-1-51-11-PM.png](https://i.postimg.cc/63FRKVq0/Screen-Shot-2022-01-01-at-1-51-11-PM.png)

Microservice sounds easy right? You just have to separate features then create a separate service and that's it. **Unfortunately, it's not that simple**. The bigggest challange with microservices architecture is **Data Management between services**.

It is a huge obstacle to effectively using microservices. When I say data management, I'm talking about the way we store the data inside of a service and how we communicate that data between different services.

### Database Per Service Patern

![https://i.postimg.cc/9XsJpZmC/Screen-Shot-2022-01-01-at-10-09-33-AM.pngMicroservice](https://i.postimg.cc/9XsJpZmC/Screen-Shot-2022-01-01-at-10-09-33-AM.png)

with microservices, the way we store & access data is little bit strange compare to monolitich app. Because In general, **each service will have its own database** and between services is **strictly forbidden direct access to other services database**. Example use case why we should not direct access other service db is because database structure will change unexpectedly.

![https://i.postimg.cc/D0GQDpvF/Screen-Shot-2022-01-01-at-1-33-09-PM.pngfor](https://i.postimg.cc/D0GQDpvF/Screen-Shot-2022-01-01-at-1-33-09-PM.png)

for example service A direct access to service B database for getting user name data, the developer team from service A handle it with field called "name". At some point, the developer team at service B changed the "name" field to "firstName" and forgot to inform the developer from service A, this 100% will break service A, service A will go down.

![https://i.postimg.cc/Hs53Pnn5/Screen-Shot-2022-01-01-at-12-58-11-PM.pngfor](https://i.postimg.cc/Hs53Pnn5/Screen-Shot-2022-01-01-at-12-58-11-PM.png)
another use case is, if service A doing direct access to service B, what happen if service B was down ? we're dead.

Service A & B will crash at the same time, because it depends on other service. What's the point of building microservices if there are still big dependencies on each service, right? That's why the dependencies between services is the thing we must eliminate in microservice architecture.

So the point we use database per services patern is :

- We want each service must be able to run independent (not depend on other services)
- hard to scale if we use one database for all services
- Some service might function more efficiently with different types of DB's (might be some service using SQL and other using NoSQL database).

Thats why we use this patern...
