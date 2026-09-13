---
title: "Express 5 Is Finally Here"
date: 2026-09-13 22:00:00
tags:
  - express.js
  - node.js
category:
  - node.js
---

<div style="width:100%;height:0;padding-bottom:55%;position:relative;"><iframe src="https://giphy.com/embed/PypcG4qBuMqDOny5vp" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>

I've been using Express since 2019. It's not an exaggeration to say I'm one of its biggest fans, I even used it for my undergraduate thesis project back then. Fast forward to 2026, I'm now a Tech Lead, and I'm still reaching for Express to solve real, production-grade problems, effectively and without drama. Few frameworks earn that kind of loyalty from a developer for seven straight years.

For the longest time though, I genuinely wondered why Express never moved past version 4. Other frameworks kept shipping new major versions, chasing new patterns and paradigms, while Express just... stayed at v4, year after year. My honest theory back then was simple: it's already good enough. Rock solid, minimal, unopinionated, does exactly what it needs to do, so what else is there to update? Turns out I wasn't entirely wrong, but the Express team clearly had more in mind, and now it's finally here: **Express 5 has been officially released.**

If you want the full details straight from the source, the official migration guide is here: [expressjs.com/en/guide/migrating-5](https://expressjs.com/en/guide/migrating-5/). But let me walk you through what actually matters if you're upgrading an existing v4 app.

## The Headline Feature: Native Async/Await Error Handling

This is, in my opinion, the single biggest quality-of-life improvement in Express 5. In Express 4, if your route handler was an `async` function and the promise rejected, Express had no idea what to do with it. You had to manually wrap everything in `try/catch` and call `next(err)` yourself, or the error would just vanish into an unhandled rejection.

```javascript
// Express 4 — manual catch required
app.get("/user/:id", (req, res, next) => {
  getUserById(req.params.id)
    .then((user) => res.send(user))
    .catch(next);
});
```

In Express 5, rejected promises from `async` handlers are automatically forwarded to your error-handling middleware. No wrapper libraries, no boilerplate `.catch(next)` sprinkled everywhere:

```javascript
// Express 5 — just await it
app.get("/user/:id", async (req, res) => {
  const user = await getUserById(req.params.id);
  res.send(user);
});
```

Honestly, this alone would have been worth the wait.

## Routing Syntax Changes (path-to-regexp v8)

This is the change most likely to break your existing app, since Express 5 bumped `path-to-regexp` to a new major version with stricter, more explicit syntax:

- Wildcards must now be named: `/*` becomes `/*splat`
- Optional parameters use curly braces instead of question marks: `/:file.:ext?` becomes `/:file{.:ext}`
- You can no longer use regex-style alternation in a single path like `/[discussion|page]/:slug`, you have to pass an array of paths instead: `['/discussion/:slug', '/page/:slug']`

Wildcard params also come back as arrays now instead of strings, and unmatched optional params are simply omitted from `req.params` instead of showing up as `undefined`.

## Cleanup of Long-Deprecated APIs

Express 5 also finally removes a bunch of methods that had been deprecated (and console-warning you) for years:

- `app.del()` → use `app.delete()`
- `req.acceptsCharset()`, `req.acceptsEncoding()`, `req.acceptsLanguage()` → now properly pluralized (`acceptsCharsets`, `acceptsEncodings`, `acceptsLanguages`)
- `req.param(name)` → removed entirely, forcing you to be explicit about where a value comes from: `req.params.id`, `req.query.id`, or `req.body.id`
- `res.sendfile()` → `res.sendFile()` (camelCase)
- `res.redirect('back')` → removed, use `res.redirect(req.get('Referrer') || '/')` instead

## Behavior Changes Worth Double-Checking

A few smaller but important changes that can bite you silently if you're not aware:

- `res.json(obj, status)`, `res.send(body, status)` and `res.redirect(url, status)` no longer accept a status code as a trailing argument. Use `res.status(status).json(obj)` / `res.status(status).send(body)` / `res.redirect(status, url)` instead.
- `express.urlencoded()` now defaults to `extended: false` instead of `true`.
- Static file serving no longer serves dotfiles by default, you need to opt in explicitly with the `dotfiles` option.
- `req.body` is now `undefined` before any body-parsing middleware runs, instead of an empty object `{}`.
- `req.query` is now read-only, mutating it directly will throw.
- `req.host` now correctly includes the port number, this is actually a bug fix from Express 4's behavior.

## Migrating an Existing App

The Express team was kind enough to ship automated codemods for most of these changes, so you don't have to hunt through your whole codebase by hand:

```bash
npx codemod@latest @expressjs/v5-migration-recipe
```

There are also individual codemods if you only need to fix one specific thing, like `@expressjs/route-del-to-delete` or `@expressjs/explicit-request-params`. Just remember Express 5 requires Node.js 18 or newer.

## Closing Thoughts

Seven years in, and Express still hasn't lost me to the next shiny framework. Express 5 doesn't reinvent the wheel, and honestly, that's exactly the point. It quietly fixes the rough edges that have been there since forever (looking at you, manual promise `.catch(next)`), cleans up the API surface, and keeps the same minimal, unopinionated philosophy that made me fall in love with it in the first place.

If you're maintaining a v4 app, read the [official migration guide](https://expressjs.com/en/guide/migrating-5/) properly before upgrading, some of these changes are subtle enough to pass your tests and still break in production. But if you ask me, this upgrade is well worth it.
