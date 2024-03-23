---
title: "Integration Testing : Mocha-Chai vs Jest-Supertest"
date: 2022-06-08 17:01:14
tags:
  - Testing
  - QA
  - CI/CD
---

![ut2](https://res.cloudinary.com/faeshal/image/upload/v1666021343/faeshalcom/unittest_croeub.png)

## Intro Unit Testing ✨

Fast recap, Unit Testing is a type of software testing where individual units or components of a software are tested. The purpose is to validate that each unit of the software code performs as expected. Unit Testing is done during the development of an application by the developers. In this post i will just focus on the implementetion of unit testing for REST API.

Advantages to unit testing include:

- The earlier a problem is identified, the fewer compound errors occur.
- Costs of fixing a problem early can quickly outweigh the cost of fixing it later.
- Debugging processes are made easier.
- Make CI/CD flow solid.

## Unit Test Implementation 🚜

As a test case in this example i will testing a simple REST API and show you how to write a test in Mocha-Chai style and Jest-Supertest style, so you can have an idea to choose which one you prefer based on the syntax style for your next project. You can get the full code from [Node-Mocha](https://github.com/Faeshal/node-mocha) & [Node-Jest](https://github.com/Faeshal/node-jest)

```
import * as categoryService from "../../services/category";
import * as categoryRepo from "../../repositories/category";
import { Category } from "../../entities/Category";
import log4js from "log4js";
const log = log4js.getLogger("test:unit:category");
log.level = "info";

// style 1 (mock all)
jest.mock("../../repositories/category");

// style 2 (mock only the method needed)
// jest.mock("../repositories/category", () => ({
//   create: jest.fn(),
//   findAll: jest.fn(),
//   destroy: jest.fn(),
// }));

describe("UNIT:CATEGORY", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("add category", () => {
    it("should add a new category", async () => {
      // input
      const mockBody = { tag: "Test Category" };

      // expected output
      const mockCreatedCategory: Category = {
        id: "1", // Mocked UUID
        tag: mockBody.tag,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(0),
        incomes: [],
      };

      // Mocking the repository method
      (categoryRepo.create as jest.Mock).mockResolvedValue(mockCreatedCategory);

      // call service
      const result = await categoryService.addCategory(mockBody);

      // expect result
      expect(categoryRepo.create).toHaveBeenCalledWith(mockBody);
      expect(result).toEqual(mockCreatedCategory);
    });
  });

  describe("getCategories", () => {
    it("should get categories", async () => {
      const mockCategories: Category[] = [
        {
          id: "1",
          tag: "Category 1",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(0),
          incomes: [],
        },
        {
          id: "2",
          tag: "Category 2",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(0),
          incomes: [],
        },
      ];

      const mockBody = { limit: 10, offset: 0, filter: {} };

      // Mocking the repository method
      (categoryRepo.findAll as jest.Mock).mockResolvedValue(mockCategories);

      const result = await categoryService.getCategories(mockBody);

      expect(categoryRepo.findAll).toHaveBeenCalledWith(
        mockBody.limit,
        mockBody.offset,
        mockBody.filter
      );
      expect(result).toEqual(mockCategories);
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category", async () => {
      const mockCategoryId = "1";

      // Mocking the repository method
      (categoryRepo.destroy as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await categoryService.deleteCategory(mockCategoryId);

      expect(categoryRepo.destroy).toHaveBeenCalledWith({ id: mockCategoryId });
      expect(result).toEqual({ affected: 1 });
    });
  });
});
```

## Conclusion 🔅

Personally i love using Mocha-Chai, just because i already used it many times for daily project. Doesn't means Jest is bad, Jest is pretty good too, really cool especially if you play with React.js ecosystem. All depends on your needs, the point is dont forget to write unit test, peace out ✌️
