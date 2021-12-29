---
title: 'Express Series 4 : Database Integration'
date: 2019-07-14 12:38:06
tags:
- express.js
- express series
category:
- node.js
---
![](https://i.postimg.cc/Xv6MHM74/bannerdatabase.jpg)

##### Introduction

In this short series we wanna talk about Database Integration in Express. How to connect express app with database something like that. As you already know node.js is fully support SQL & NO SQL Databases , According to the Documentation This is the list of DBMS that Express Support :

| No  | DBMS | Type |
| --- | --- | --- |
| 1   | PostgreSQL | SQL |
| 2   | MySQL | SQL |
| 3   | SQL Server | SQL |
| 4   | Oracle | SQL |
| 5   | SQLITE | SQL |
| 6   | Redis | NO SQL |
| 7   | MongoDB | NO SQL |
| 8   | Cassandra | NO SQL |
| 9   | Apache CouchDB | NO SQL |
| & So Much More... |     |     |

##### Connection String

In this example we won't use ORM / ODM liblary for manage the database schema , we just use native connection & native driver & we just give example the most popluar and open source dbms.

###### 1.PostgreSQL

![](https://i.postimg.cc/fTy98pJ3/postgreelogo.png)

Installation

    npm install pg-promise

Example

    var pgp = require('pg-promise')(/* options */)
    var db = pgp('postgres://username:password@host:port/database')
    
    db.one('SELECT $1 AS value', 123)
      .then(function (data) {
        console.log('DATA:', data.value)
      })
      .catch(function (error) {
        console.log('ERROR:', error)
      })
    

###### 2.MySQL

![](https://i.postimg.cc/NF5jxhpB/mysql.jpg)

Installation

    npm install mysql2

Example

    var mysql = require('mysql')
      var connection = mysql.createConnection({
        host: 'localhost',
        user: 'dbuser',
        password: 's3kreee7',
        database: 'my_db'
      })
      
      connection.connect()
      
      connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
        if (err) throw err
      
        console.log('The solution is: ', rows[0].solution)
      })
      
      connection.end()
    

###### 3.SQLite

![](https://i.postimg.cc/SQvsxsxs/lite.jpg)

Installation

    npm install sqlite3

Example

    var sqlite3 = require('sqlite3').verbose()
      var db = new sqlite3.Database(':memory:')
      
      db.serialize(function () {
        db.run('CREATE TABLE lorem (info TEXT)')
        var stmt = db.prepare('INSERT INTO lorem VALUES (?)')
      
        for (var i = 0; i < 10; i++) {
          stmt.run('Ipsum ' + i)
        }
      
        stmt.finalize()
      
        db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
          console.log(row.id + ': ' + row.info)
        })
      })
      
      db.close()
    

###### 4.Redis

![](https://i.postimg.cc/sxqD6nNS/Redis.jpg)

Installation

    npm install redis

Example

    var redis = require('redis')
      var client = redis.createClient()
      
      client.on('error', function (err) {
        console.log('Error ' + err)
      })
      
      client.set('string key', 'string val', redis.print)
      client.hset('hash key', 'hashtest 1', 'some value', redis.print)
      client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print)
      
      client.hkeys('hash key', function (err, replies) {
        console.log(replies.length + ' replies:')
      
        replies.forEach(function (reply, i) {
          console.log('    ' + i + ': ' + reply)
        })
      
        client.quit()
      })
    

###### 5.MongoDB

![](https://i.postimg.cc/zvMkGrVQ/mongodb-logo.png)

Installation

    npm install mongodb

Example

    var MongoClient = require('mongodb').MongoClient
    
      MongoClient.connect('mongodb://localhost:27017/animals', function (err, db) {
        if (err) throw err
      
        db.collection('mammals').find().toArray(function (err, result) {
          if (err) throw err
      
          console.log(result)
        })
      })
    

###### 6.Cassandra

![](https://i.postimg.cc/HLH9x3kT/cassandra-logo1.png)

Installation

    npm install cassandra-driver

Example

    var cassandra = require('cassandra-driver')
      var client = new cassandra.Client({ contactPoints: ['localhost'] })
      
      client.execute('select key from system.local', function (err, result) {
        if (err) throw err
        console.log(result.rows[0])
      })
    

###### 7.Apache CouchDB

![](https://i.postimg.cc/WbddGZHg/couchdb.jpg)

Installation

    npm install nano

Example

    var nano = require('nano')('http://localhost:5984')
      nano.db.create('books')
      var books = nano.db.use('books')
      
      // Insert a book document in the books database
      books.insert({ name: 'The Art of war' }, null, function (err, body) {
        if (err) {
          console.log(err)
        } else {
          console.log(body)
        }
      })
      
      // Get a list of all books
      books.list(function (err, body) {
        if (err) {
          console.log(err)
        } else {
          console.log(body.rows)
        }
      })
    

##### Last Word

That's all about basic database integration , i have make post about building simple project using MongoDB & MySQL DBMS with ODM & ORM Liblary , if you dont know . better you check it . Link down below :

* **[NodeJS + MongoDB (Mongoose ODM)](https://faeshal.com/post/nodejs_atlas)**

* **[NodeJS + MySQL (Sequelize ORM)](https://faeshal.com/post/nodejs_sequelize)**

See you on the next express series , stay curious and never stop learning. Sallam!