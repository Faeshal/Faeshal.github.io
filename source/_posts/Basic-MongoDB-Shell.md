---
title: Basic MongoDB Shell
date: 2019-05-28 12:37:52
tags:
  - database
  - mongodb
  - cli
categories:
  - backend
---

##### Introduction

{% youtuber video -bt_y4Loofg %}{% endyoutuber %}

Today we gonna introduce basic query that MongoDB have. If you dont know what is MongoDB , basicly MongoDB is an NoSQL database management system that store data in JSON format **not in the table** like SQL database. So today we gonna try basic CRUD query and litte bit method that mongodb have. First of all you must install MongoDB Server in your machine and set it up , as always link down below , if you have install , let's get started !

- **[Mongodb - Download](https://www.mongodb.com/download-center/community)**
- **[Installation Step](https://docs.mongodb.com/manual/installation/)**

##### 1.CREATE

There is no Create Database statement in MongoDB like in SQL. To create a database in MongoDB, simply switch to a non-existent database, then insert data into it. To switch databases, run the use statement. If the database doesn't already exist, it will be created.For Example we gonna create database named "school"

    use school

However, the database isn't actually created until you insert data into it. To Create Data + Collection (table in SQL) you can use :

| Syntax                     | Description                                  |
| -------------------------- | -------------------------------------------- |
| db.collection.insertOne()  | Insert exactly 1 document into a collection  |
| db.collection.insertMany() | Inserts multiple documents into a collection |

Let's create collection and input some data into school database

    db.student.insertOne({ name: "faeshal",address:"Riyadh",gender:"man",age:21 })
    db.student.insertOne({ name: "fahad",address:"Jeddah",gender:"man",age:19 })
    db.student.insertOne({ name: "abdullah",address:"Dhahran",gender:"man",age:22 })
    db.student.insertOne({ name: "Lulu",address:"Riyadh",gender:"woman",age:20 })

To Show database & collection you have create , type :

    show dbsshow collections

![](https://i.postimg.cc/vZGd9j5w/mongo-create.jpg)

##### 2.READ

To Read/Fetch Document is pretty simple just use one syntax:

| Syntax               | Description                                |
| -------------------- | ------------------------------------------ |
| db.collection.find() | Find or Show The Record inside Collections |

You can combine with spesial method for better experience , list of complete method you can find in mongodb offical docs , but this is the common method usually i use:

| Method   | Description                                     |
| -------- | ----------------------------------------------- |
| limit()  | To give show limitation based on criteria       |
| pretty() | To give clean view for the record               |
| sort()   | To give sorting functionality based on criteria |

Let's see our record inside student collection

    db.student.find().pretty()

![](https://i.postimg.cc/BbtjqbQN/mongo-find.jpg)

##### 3.UPDATE

Update is little bit tricky , The update method updates values in an existing document.You can specify criteria, or filters, that identify the documents to update. These filters use the same syntax as read operations. In MongoDB you can update in 3 styles like this:

| Syntax                     | Description                                      |
| -------------------------- | ------------------------------------------------ |
| db.collection.updateOne()  | Update exactly 1 record into a collection        |
| db.collection.updateMany() | Update multiple record into a collection         |
| db.collection.replaceOne() | Replaces a single document within the collection |

Let's Update our record for example lulu's city

    db.student.updateOne(
            { name: "Lulu" },
            { $set:{ address: "Tabuk" } })

![](https://i.postimg.cc/2j4kZngv/mongo-update.jpg)

##### 4.DELETE

Again it's still pretty easy to delete a record, In MongoDB, delete operations target a single collection. All write operations in MongoDB are atomic on the level of a single document.For Delete you can use 2 styles like this :

| Syntax                     | Description                              |
| -------------------------- | ---------------------------------------- |
| db.collection.deleteOne()  | Delete exactly 1 record insde collection |
| db.collection.deleteMany() | Delete multiple record inside collection |

Let's Delete student with woman gender, you exactly know Lulu record will be deleted,This is the result:

    db.student.deleteOne({ gender:"woman" })

![](https://i.postimg.cc/bNVwypKF/mongo-delete.jpg)

##### 5.DROP

Drop is super easy,you just add drop method at the end of syntax,let's try drop the student collections and for sure school database will automaticly gone because doesn't have any collections

    db.student.drop()

![](https://i.postimg.cc/KvWQn367/mongo-drop.jpg)

##### Last Word

It's very easy right ? I know you will ask why we not using GUI tools for manage our data, well we will use next for daily day code , **but the basic syntax must be on your deep brain , you must really understand how it works** , how using the syntax etc and then go ahead with GUI (Graphic user interface) tools. Hope i can create some advance mongodb topic in next post. Anyway Dont forget to check MongoDB documentation link down below

- **[MongoDB - Documentation](https://docs.mongodb.com/manual/)**

If you have a question feel free to comment down below . for the last but not least stay curious and never stop learning. Sallam!
