---
title: Implementing JWT with RSA Key Pair
date: 2022-06-08 17:01:14
tags:
tags:
  - jwt
  - backend
  - security
---

![](https://i.postimg.cc/SKrGNJQb/jwk.png)

INTRO

I wrote this note because today I was exploring JWT with RSA key pair implementation in Node.js for office project and while my memory is good, I'm writing recap here. So quick introduction JSON Web Token or JWT, is an open standard used to share security information between two parties - a client and a server. Each JWT contains encoded JSON objects, including a set of claims. JWTs are signed using a cryptographic algorithm to ensure that the claims cannot be altered after the token is issued.

Way to generate token

Basically there is 2 way to generate including verify a token , first we can using :

Symmetric algorithm

In a Symmetric algorithm, a single key is used to encrypt the data. When encrypted with the key, the data can be decrypted using the same key. for example, Fahad encrypts a message using the key “my-secret-key321” and sends it to Zaid, he will be able to decrypt the message correctly if and only if he uses the same key which is “my-secret-key321”. That's it.

Asymmetric algorithms

In an Asymmetric algorithm, two keys are used to encrypt and decrypt messages. a Priovate key & a Public Key. Private key is used to digitally sign the message and the Public key can only be used to verify the authenticity of the signature. Usually this approach call RSA. RSA is an asymmetric encryption and digital signature algorithm. What asymmetric algorithms bring to the table is the possibility of verifying or decrypting a message without being able to create a new one. This is key for certain use cases.

Implementation in Node.js

ok, todo list :

1. we need setup nodejs project (a REST API)
2. install mandatory dependecy :
3. Generate Public & Private
4. Generate JWK & store in secure place
