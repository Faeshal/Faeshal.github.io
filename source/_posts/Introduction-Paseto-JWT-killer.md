---
title: Introduction Paseto - The JWT killer ?
date: 2022-10-17 18:42:08
tags:
  - paseto
  - security
  - token
categories:
  - backend
---

![](https://res.cloudinary.com/faeshal/image/upload/v1666148167/faeshalcom/paseto_d4pnff.png)

## What is Paseto ? 🪴

**[Paseto](https://paseto.io/)** is a specification and reference implementation for secure stateless tokens. In General Paseto is more secure than JWT and offers a simpler implementation. As a result, many developer communities started accepting it as a better alternative to JWT, including me. JWT uses weak signing algorithms and a poor implementation can make the whole system vulnerable. Also, it is easy to extract the signing algorithm from JWT’s header. That's why Paseto come.

## JWT Problems 🔥

![](https://res.cloudinary.com/faeshal/image/upload/v1666182948/faeshalcom/An_Introduction_to_PASETO_Tokens_page-0019_wy1osu.jpg)

1. Weak Algorithm

JWT gives developers too many algorithms to choose, including the algorithms that are already known to be vulnerable like RSA with PKCSv1.5 or ECDSA. For developers without deep experience in security it would be hard for them to know which algorithm is the best to use.

Unlike JWT Paseto gives you "versioned protocols" so **developers don’t have to choose the algorithm anymore**. Instead, they **only need to select the version** of Paseto they want to use. It's incredibly unlikely that you'll be able to use Paseto in an insecure way.

2. Trivial Forgery

One bad thing about JWT is that it includes the signing algorithm in the token header. Because of this, we have seen in the past, an attacker can just set the alg header to none to bypass the signature verification process.

Paseto successfully addresses all these JWT issues. Paseto provides a strong cipher suite with each version. This resolves the JWT’s weak algorithm issues. Moreover, users just need to choose a version of Paseto and the library will take care of the encryption. On top of that, Paseto also makes token forgery a lot more difficult and users will not be able retrieve any algorithm related data from the token headers.

![](https://res.cloudinary.com/faeshal/image/upload/v1666184852/faeshalcom/An_Introduction_to_PASETO_Tokens_page-0010_m8ovcy.jpg)

## Paseto Type & Version 🌿

![](https://res.cloudinary.com/faeshal/image/upload/v1666184586/faeshalcom/An_Introduction_to_PASETO_Tokens_page-0013_qppuca.jpg)
In this case same with JWT, there is [two way to genereate token](https://www.faeshal.com/posts/JWT-with-RSA-Key-Pair-29bd74850c88/#Way-to-generate-token-%F0%9F%94%91) in Paseto they called:

1. Local (symmetric)

Use this technique for local or internal services. If you use a local symmetric-key, the payload is now encrypted, not just encoded, so it’s impossible for hackers to read or change the data stored in the token without knowing the server’s secret key.

![](https://res.cloudinary.com/faeshal/image/upload/v1666186093/faeshalcom/An_Introduction_to_PASETO_Tokens_page-0015_ip5bgv.jpg)

2. Public (asymmetric)

Use this technique for microservices or public / third party integration usecase. The private key is used to sign the token, the public key is used only to verify it. Therefore, we can easily share our public key with any external third-party services without worrying about leaking our private key.

![](https://res.cloudinary.com/faeshal/image/upload/v1666186053/faeshalcom/An_Introduction_to_PASETO_Tokens_page-0017_bgxez3.jpg)

What about paseto version ? until this post was released paseto have 4 version, according to **[Paseto Nodejs Library](https://www.npmjs.com/package/paseto)**. Remember always pick newer version if you build the project from scratch & make sure your sign technique supported.

![](https://res.cloudinary.com/faeshal/image/upload/v1666183282/faeshalcom/Screen_Shot_2022-10-19_at_7.40.13_PM_mono3q.png)

## Paseto In Action 🍀

Very simple to using paseto library, if you're using public strategy you just need to use "sign" to generate token & "verify" to consume it. If you're using local strategy just use "encypt" & "decrypt". Example using Nodejs library:

```
const paseto = require('paseto')
const { V3 } = paseto // set the version

const privateKey = <your private key location>
const publicKey = <your public key location>


// Producing tokens (Public Strategy)
(async () => {
  {
    const token = await sign({ name: "faeshal", role: "admin" }, privateKey,{expiresIn: "1d",})
    // v3.public.eyJzdWIiOiJqb2huZG9lIiwiaWF0IjoiMjAyMS0wOC0wM1QwNTozOTozNy42NzNaIn3AW3ri7P5HpdakJmZvhqssz7Wtzi2Rb3JafwKplLoCWuMkITYOo5KNNR5NMaeAR6ePZ3xWUcbO0R11YLb02awO
  }
})()

// Consuming tokens (Public Strategy)
(async (token) => {
  {
    const payload = await verify(token, publicKey)
    // { name: "faeshal", role: "admin" , iat: '2022-07-01T15:22:47.982Z' }
  }
})()

// Producing tokens (Local Strateg)
(async () => {
  {
    
    // generate secret key for the first time only then you store to env for use on every request (PASETO_SECRET_KEY)
    // const genSecret = await V3.generateKey("local", { format: "paserk" });
    // console.log("secret key string:", genSecret);

    // local paseto strategy
    const token = await V3.encrypt({payload:"some payload data"}, process.env.PASETO_SECRET_KEY, {
      expiresIn: "1d",
    });
    // v3.local.eyJzdWIiOiJqb2huZG9lIiwiaWF0IjoiMjAyMS0wOC0wM1QwNTozOTozNy42NzNaIn3AW3ri7P5HpdakJmZvhqssz7Wtzi2Rb3JafwKplLoCWuMkITYOo5KNNR5NMaeAR6ePZ3xWUcbO0R11YLb02awO
  }
})()

// Consuming tokens (Local Strategy)
(async (token) => {
  {
    const decoded = await V3.decrypt(token, process.env.PASETO_SECRET_KEY);
  }
})()


```

## Final Words 🦚

{% youtuber video I7gQTBYmEEg %}{% endyoutuber %}

Personally i would recommend you to use Paseto for the next project, but if you current project already using JWT & need more time for migration, dont worry you can still use it, but make sure you add extra security layer on top of it. Here is some resource that might be useful ⬇️

- **[JWT HANDBOOK by AUTH0](https://assets.ctfassets.net/2ntc334xpx65/o5J4X472PQUI4ai6cAcqg/13a2611de03b2c8edbd09c3ca14ae86b/jwt-handbook-v0_14_1.pdf)**

- **[JWT Brute Forcing Tools](https://owasp.org/www-chapter-vancouver/assets/presentations/2020-01_Attacking_and_Securing_JWT.pdf)**
