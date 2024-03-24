---
title: "Integration Testing : Mocha-Chai vs Jest-Supertest"
date: 2022-06-08 17:01:14
tags:
  - Testing
  - QA
  - CI/CD
---

![ut2](https://bucket.faeshal.com/integration.png)

## Intro Integration Testing ✨

Fast recap, Integration Testing is a type of software testing where individual software modules or components are combined and tested as a group to ensure they work together seamlessly as intended. It focuses on verifying the interactions and interfaces between these modules to detect any defects or inconsistencies that may arise when they are integrated. In this post i will just focus on the implementetion of integration testing for REST API.

## Misconception Unit or Integration test ?

Many articles on the internet spread false information. Some explain unit test by providing integration test implementations. Thats a FATAL mistake!. The main difference between unit tests and integration tests in REST API projects is seen from whether is use external component or not ? in this case a database.

![missconcept](https://bucket.faeshal.com/integvsunit.png)

**If a test uses or connect to a database it means it is an integration test NOT a Unit test**. Unit tests are strictly prohibited using a real database. **Everything must be mocked in unit testing** even there is a database operation on the code base.

Learn more about unit test here 👉 []()

## What is Mocha-Chai & Jest-Supertest ? 🪴

**[Mocha](https://mochajs.org/) similiar with [Jest](https://jestjs.io/) is basically a JavaScript Test Framework** running on Node. js and in the browser. it allows asynchronous testing, test coverage reports and use of any assertion library.Whereas **[Chai](https://www.chaijs.com/) & [Supertest](https://www.npmjs.com/package/supertest) is an assertion library** for NodeJS and the browser that can be delightfully paired with any javascript testing framework. So in short **you can use any assertion library and combine it with testing framework like mocha, jest etc** as long as has the ability to call http service. But in general the biggest combo name in the integration testing field for REST API is Mocha combine with Chai and Jest combine with Supertest.

## Integration Test Implementation 🚜

As a test case in this example i will testing a simple REST API and show you how to write a test in Mocha-Chai style and Jest-Supertest style, so you can have an idea to choose which one you prefer based on the syntax style for your next project. You can get the full code from [Node-Mocha](https://github.com/Faeshal/node-mocha) & [Node-Jest](https://github.com/Faeshal/node-jest).

**🆘 Beware : make sure you're using testing database when doing integration test on REST API project, don't forget to setup .env correctly!**

### Mocha-Chai

```
require("dotenv").config();
process.env.NODE_ENV = "test";
const server = require("../server");
const incomeService = require("../services/income");
const chai = require("chai");
const chaiHttp = require("chai-http");
const log = require("log4js").getLogger("test:income");
log.level = "debug";
chai.should();
chai.expect();
chai.use(chaiHttp);

describe("Income API", () => {
  // ** GET /api/v1/incomes
  describe("GET /api/v1/incomes", () => {
    it("It should GET all the income", (done) => {
      chai
        .request(server)
        .get("/api/v1/incomes")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(true);

          res.body.should.have.property("data").to.be.an("array");
          done();
        });
    });

    it("It should NOT GET all the income", (done) => {
      chai
        .request(server)
        .get("/api/v1/income")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  // ** POST /api/v1/incomes
  describe("POST /api/v1/incomes", () => {
    it("it should POST an income ", async () => {
      let body = {
        name: "sell cocacola",
        value: Math.floor(Math.random() * 101),
      };
      const res = await chai.request(server).post("/api/v1/incomes").send(body);
      res.should.have.status(201);
      res.body.should.be.a("object");
      res.body.should.have.property("success").eq(true);
      res.body.should.have.property("message");
    });

    it("it should not POST an income without value field", async () => {
      let body = {
        name: "buy cocacola",
      };
      const res = await chai.request(server).post("/api/v1/incomes").send(body);
      res.should.have.status(400);
      res.body.should.be.a("object");
      res.body.should.have.property("success").eq(false);
      res.body.should.have.property("message");
    });
  });

  // ** GET /api/v1/incomes/:id
  describe("GET /api/v1/incomes/:id", () => {
    it("it should GET an income by id", async () => {
      const id = 6;
      const res = await chai.request(server).get(`/api/v1/incomes/${id}`);
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("success").eq(true);
      res.body.should.have.property("data").to.be.an("object");
    });

    it("it should not GET an income by id without numeric params", async () => {
      const id = "x";
      const res = await chai.request(server).get(`/api/v1/incomes/${id}`);
      res.should.have.status(400);
      res.body.should.be.a("object");
      res.body.should.have.property("success").eq(false);
      res.body.should.have.property("message");
    });
  });

  // ** PUT /api/v1/incomes/:id
  describe("PUT /api/v1/incomes/:id", () => {
    it("it should PUT an income", async () => {
      // create the data first
      const result = await incomeService.add({
        name: "income property",
        value: Math.floor(Math.random() * 101),
      });
      const { id } = result.dataValues;
      // then update with new data
      const body = {
        name: "passive income property",
        value: Math.floor(Math.random() * 101),
      };
      const res = await chai
        .request(server)
        .put(`/api/v1/incomes/${id}`)
        .send(body);
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("success").eq(true);
      res.body.should.have.property("message");
    });

    it("it should NOT PUT an income with non numeric value field", async () => {
      // create the data first
      const result = await incomeService.add({
        name: "sell ticket",
        value: Math.floor(Math.random() * 101),
      });
      const { id } = result.dataValues;
      // update with wrong data value
      const body = {
        name: "buy cocacola",
        value: "$900",
      };
      const res = await chai
        .request(server)
        .put(`/api/v1/incomes/${id}`)
        .send(body);
      res.should.have.status(400);
      res.body.should.be.a("object");
      res.body.should.have.property("success").eq(false);
      res.body.should.have.property("message");
    });
  });

  // ** DELETE /api/v1/incomes/:id
  describe("DELETE /api/v1/incomes/:id", () => {
    it("it should DElETE an income", async function () {
      // create the data first
      const result = await incomeService.add({
        name: "passive income property",
        value: Math.floor(Math.random() * 101),
      });
      const { id } = result.dataValues;
      // than delete
      const res = await chai.request(server).delete(`/api/v1/incomes/${id}`);
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("success").eq(true);
      res.body.should.have.property("message");
    });

    it("it should NOT DELETE an income with invalid id", async () => {
      const id = 0;
      const res = await chai.request(server).delete(`/api/v1/incomes/${id}`);
      res.should.have.status(400);
      res.body.should.be.a("object");
      res.body.should.have.property("success").eq(false);
      res.body.should.have.property("message");
    });
  });
});
```

### Jest-Supertest

```
require("dotenv").config();
process.env.NODE_ENV = "test";
const server = require("../server");
const incomeService = require("../services/income");
const request = require("supertest");
const toBeType = require("jest-tobetype");
const log = require("log4js").getLogger("test:income");
log.level = "debug";
expect.extend(toBeType);

describe("Income API", () => {
  afterEach(async () => {
    await server.close();
  });

  // ** GET /api/v1/incomes
  describe("GET /api/v1/incomes", () => {
    it("It should GET all the income", async () => {
      const res = await request(server).get("/api/v1/incomes");
      expect(res.statusCode).toBe(200);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(typeof res.body).toBe("object");
      // * for some reason using typeOf can't dig inside object (res.body.data)
      // so i install 3rd party library to check data type more cleaner
      expect(res.body.data).toBeType("array");
    });

    it("It should NOT GET all the income", async () => {
      const res = await request(server).get("/api/v1/income");
      expect(res.statusCode).toBe(404);
    });
  });

  // ** POST /api/v1/incomes
  describe("POST /api/v1/incomes", () => {
    it("it should POST an income ", async () => {
      let body = {
        name: "sell cocacola",
        value: Math.floor(Math.random() * 101),
      };
      const res = await request(server).post("/api/v1/incomes").send(body);
      expect(res.statusCode).toBe(201);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message");
    });

    it("it should not POST an income without value field", async () => {
      let body = {
        name: "buy cocacola",
      };
      const res = await request(server).post("/api/v1/incomes").send(body);
      expect(res.statusCode).toBe(400);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message");
    });
  });

  // ** GET /api/v1/incomes/:id
  describe("GET /api/v1/incomes/:id", () => {
    it("it should GET an income by id", async () => {
      const id = 6;
      const res = await request(server).get(`/api/v1/incomes/${id}`);
      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("data");
    });

    it("it should not GET an income by id without numeric params", async () => {
      const id = "x";
      const res = await request(server).get(`/api/v1/incomes/${id}`);
      expect(res.statusCode).toBe(400);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message");
    });
  });

  // ** PUT /api/v1/incomes/:id
  describe("PUT /api/v1/incomes/:id", () => {
    it("it should PUT an income", async () => {
      // create the data first
      const result = await incomeService.add({
        name: "income property",
        value: Math.floor(Math.random() * 101),
      });
      const { id } = result.dataValues;
      // then update with new data
      const body = {
        name: "passive income property",
        value: Math.floor(Math.random() * 101),
      };
      const res = await request(server).put(`/api/v1/incomes/${id}`).send(body);
      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message");
    });

    it("it should NOT PUT an income with non numeric value field", async () => {
      // create the data first
      const result = await incomeService.add({
        name: "sell ticket",
        value: Math.floor(Math.random() * 101),
      });
      const { id } = result.dataValues;
      // update with wrong data value
      const body = {
        name: "buy cocacola",
        value: "$900",
      };
      const res = await request(server).put(`/api/v1/incomes/${id}`).send(body);
      expect(res.statusCode).toBe(400);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message");
    });
  });

  // ** DELETE /api/v1/incomes/:id
  describe("DELETE /api/v1/incomes/:id", () => {
    it("it should DElETE an income", async function () {
      // create the data first
      const result = await incomeService.add({
        name: "passive income property",
        value: Math.floor(Math.random() * 101),
      });
      const { id } = result.dataValues;
      // than delete
      const res = await request(server).delete(`/api/v1/incomes/${id}`);
      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message");
    });

    it("it should NOT DELETE an income with invalid id", async () => {
      const id = 0;
      const res = await request(server).delete(`/api/v1/incomes/${id}`);
      expect(res.statusCode).toBe(400);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message");
    });
  });
});
```

## Conclusion 🔅

Personally i love using Mocha if the project using Javascript and love to use Jest if the project based on Typescript. Always pick the right tool on the right time. The important point is dont forget to write integration test, peace out ✌️
