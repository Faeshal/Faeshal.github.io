---
title: "Mocking Databases for flawless unit tests with TypeORM"
date: 2022-06-07 15:01:14
tags:
  - Testing
  - QA
  - CI/CD
---

![ut2](https://bucket.faeshal.com/unit.png)

## Intro Unit Testing ✨

Unit Testing is a type of software testing where individual units or components of a software are tested. The purpose is to validate that each unit of the software code performs as expected. Unit Testing is done during the development of an application by the developers. In this post i will just focus on the implementetion of unit testing for REST API.

Advantages of unit testing:

- The earlier a problem is identified, the fewer compound errors occur.
- Costs of fixing a problem early can quickly outweigh the cost of fixing it later.
- Debugging processes are made easier.
- Make CI/CD flow solid.

## Why we should mock the database ? 🪲

Mocking the database when performing unit testing in REST APIs is generally recommended. Here is why:

- **Speed**: Mocking the database speeds up test execution, eliminating slow database interactions.
- **Isolation**: It isolates tests from external dependencies, ensuring consistent and reliable results.
- **Flexibility**: Enables testing without reliance on specific database configurations or data states.
- **Control**: Allows precise control over test scenarios, facilitating comprehensive test coverage.
- **Efficiency**: Reduces setup and teardown complexity, streamlining the testing process.

## Unit Test Implementation 🚜

In this example i will testing a simple TypeScript REST API and show you how to write a unit test. You can use whatever test library, the concept is the same but this time I will use Jest + Supertest. Lets say we wanna test category service.

First install [**Jest**](https://jestjs.io/) & [**Supertest**](https://www.npmjs.com/package/supertest) on the project. After that write [**config file**](https://jestjs.io/docs/configuration)on root directory.

**jest.config.ts**
```
import type { Config } from "@jest/types";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env.test.local",
});

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

export default config;
```

Don't forget to add test command script to **package.json** so you can **npm run test** later.
```
"scripts": {
    "test": "jest --watchAll --detectOpenHandles --runInBand --forceExit",
},
```

**category.ts** (category model / typeorm entity inside entities folder)
```
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  DeleteDateColumn,
} from "typeorm";
import { Income } from "./Income";
import dayjs from "dayjs";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tag: string;

  @CreateDateColumn({
    precision: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        const date = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
        return date;
      },
    },
  })
  createdAt: Date;

  @UpdateDateColumn({
    precision: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        const date = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
        return date;
      },
    },
  })
  updatedAt: Date;

  @DeleteDateColumn({
    precision: 0,
  })
  deletedAt: Date;

  @ManyToMany(() => Income, (income: any) => income.categories)
  incomes: Income[];
}
```

Then inside test folder on **category.test.ts**  you can write whatever test based on your imported service.
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

  describe("get categories", () => {
    it("should get all categories", async () => {
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

  describe("delete category", () => {
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

That's it. After that you can run the test **npm run test** and the result will pop up on the terminal.

![img](https://bucket.faeshal.com/unit-test-result.png)

For complete code you can see here 👉 [Unit test repository](https://github.com/Faeshal/nodets-layered-architecture)
Want to know about other types of tests, read here 👉 [Integration test in action](https://www.faeshal.com/posts/integration-testing-comparison-mocha-chai-vs-jest-supertest%20copy-58d17d35057e/)


## Conclusion 🔅

Unit test especially in REST API development is vital for ensuring software reliability and scalability. Mocking the database in unit tests offers speed, isolation, and control, improving test coverage and enabling developers to catch bugs early. Embracing unit testing and mocking techniques enhances overall software quality, enabling teams to deliver robust products with confidence.
