---
title: Implementing JWT with RSA Key Pair in Node.JS
date: 2022-06-08 17:01:14
tags:
  - jwt
  - backend
  - security
---

![](https://i.postimg.cc/przdB56m/jwt3.png)

## Introduction 🍹

I wrote this note after exploring JWT with RSA key pair for my office project today and i'm thinking why not i write the recap here. So quick introduction JSON Web Token or JWT, is an open standard used to share security information between two parties - a client and a server. Each JWT contains encoded JSON objects, including a set of claims. JWTs are signed using a cryptographic algorithm to ensure that the claims cannot be altered after the token is issued.

## Way to generate token 🔑

Basically there is 2 way to generate & verify the token, we can using :

### 1. Symmetric Algorithm

In a Symmetric Algorithm, a single key is used to encrypt the data. When encrypted with the key, the data can be decrypted using the same key. for example, Fahad encrypts a message using the key “my-secret-key321” and sends it to Zaid, he will be able to decrypt the message correctly if and only if he uses the same key which is “my-secret-key321”. That's it.

### 2. Asymmetric Algorithms

In an Asymmetric Algorithm, two keys are used to encrypt and decrypt messages. a Private key & a Public Key. **Private key is used to encrypt** digitally sign the message and the **Public key is use for decrypt** or verify the authenticity of the signature. Usually this approach call RSA. RSA is an asymmetric encryption and digital signature algorithm. What asymmetric algorithms bring to the table is the possibility of verifying or decrypting a message **without being able to create a new one**. This is key for certain use cases.

## Implementation in Node.js 👷‍♀️

Today we gonna focusing on Asymmetric Algo or using RSA style, **usually this approach is use in Microservices Architecure** when we build auth service and need to verify in another service in secure way. So the TODO list is:

![](https://i.postimg.cc/sXtXS4wF/jwk.png)

1. We need setup nodejs project (a REST API server) doesn't matter what framework you use, it's up to you.

2. Install mandatory dependency

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : use for generate / verify the token
- [rsa-pem-to-jwk](https://www.npmjs.com/package/rsa-pem-to-jwk) : use for converting pem to jwk json (is optional but more secure compare to using naked public.pem)
- [jwk-to-pem](https://www.npmjs.com/package/jwk-to-pem) : use for converting jwk back to original public key (for decryption)

3. Generate Private & Public key

in your project directory type here to generate private & public pem:

```
openssl genrsa -out private.pem 3072

openssl rsa -in private.pem -pubout -out public.pem
```

4. Generate JWT Token with private.pem

It's time to generate JWT token, this code called when your client hit the register / login endpoint.

```
const jwt = require("jsonwebtoken");
const fs = require("fs");
const secret = fs.readFileSync(__dirname + "/../cert/private.pem");

exports.generateAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secret,
      {
        expiresIn: "10m",
        algorithm: "RS256",
      },
      (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(new Error("Error:" + err));
        }
        resolve(token);
      }
    );
  });
};

```

That's it. When you wanna decrypt the token simply bring the public.pem copy paste it to another services and you ready to go for verification process. The code look like this:

```
const jwt = require("jsonwebtoken");
const fs = require("fs");

const publicPem = fs.readFileSync(__dirname + "/../cert/public.pem");

const decoded = jwt.verify(token, publicPem, { algorithms: ["RS256"] });

```

5. Generate JWK & Store in secure place 🗃️

This is optional, you can just stop in previous step and use naked public.pem. But i think it's more secure if we use JWK. A JWK or JSON Web Key is a JSON data structure that represents a set of public keys. After we generate JWK we can store on some secure place, for example AWS S3 or something, so we dont need bring public.pem file / copy paste in each service anymore when doing decryption process. To generate PEM to JWK i'm using [rsa-pem-to-jwk](https://www.npmjs.com/package/rsa-pem-to-jwk) library, here is the code:

```
const fs = require("fs");

const rsaPemToJwk = require("rsa-pem-to-jwk");

const privateKey = fs.readFileSync(\_\_dirname + "/../cert/private.pem");

const jwk = rsaPemToJwk(privateKey, { use: "sig" }, "public");

console.log(jwk);

```

After that, we just execute the file with node filename.js and will print out the JWK on the console. Grab that JWK object, save as a json file and put on your trusted place, for the simple way i'm storing on Google Cloud Storage and expose the token so our microservice can grab the token with axios or another http call library.

![](https://i.postimg.cc/Bn1KVtPB/Screen-Shot-2022-06-08-at-7-48-12-PM.png)

![](https://i.postimg.cc/rFjnwnfP/Screen-Shot-2022-06-08-at-7-41-20-PM.png)

6. Verify the JWK 🚪

Last thing we need verify the JWK, this middleware will execute when your client hit a protected route. grabJwk() function basically is http call function that targeting to our JWK url. The code look like this:

```
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const grabJwk = require("../util/grabJwk");

exports.protect = asyncHandler(async (req, res, next) => {
try {
let token;
if (
req.headers.authorization &&
req.headers.authorization.startsWith("Bearer")
) {
token = req.headers.authorization.split(" ")[1];
}

    if (!token) {
      console.log("Not authorized to access this route");
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // * Verify Token From Cert
    const jwkJson = await grabJwk(JWK_URL);
    const publicConvert = jwkToPem(jwkJson.data);
    const decoded = jwt.verify(token, publicConvert, { algorithms: ["RS256"] });

    req.user = decoded;
    next();

} catch (err) {
console.log("error:", err);
return res.status(401).json({
success: false,
message: "unauthorized",
});
}
});

```

That's it, ready to use in every service. Hope this recap useful for you and for me personally because sometimes i forget this basic theory. Thanks 👋
