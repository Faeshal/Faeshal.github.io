---
title: What is Open Graph Protocol
date: 2019-02-27 12:35:17
tags:
  - meta
  - seo
category:
  - frontend
---

![](https://faeshal.com/storage/posts/February2019/f8logo (1).png)

##### Everything You Need to Know about Open Graph

Open Graph is a technology first introduced by Facebook in 2010 that allows integration between Facebook and its user data and a website. By integrating Open Graph meta tags into your page's content, you can identify which elements of your page you want to show when someone share's your page.

**This is very important to optimize web page SEO** and the social posts with rich data are far more eye-catching than the ones without.On top of the added visibility, social networks gain further knowledge of your content and are able to make your content more searchable,that's huge.

Now, other social media sites also are taking advantage of social meta tags. All of the other major platforms, Twitter, LinkedIn, and Google+, recognize Open Graph tags.This is basic metadata:

##### How to use open graph to your page

Very Simple , you just need to add some meta tags to your page, and a little bit of HTML.

| Code     | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| og:title | The type of your title                                                 |
| og:type  | The type of your object                                                |
| og:image | The image URL which should represent your object                       |
| og:url   | The canonical URL of your object that will be used as its permanent ID |

Below is an example of how Open Graph meta tags appear on this page to give you a better understanding of how they could be used.I try to give you example with dynamic web page using PHP

    <head>
      <title>{{$post->title}}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

      {{-- meta tags down here --}}
      <meta property="og:title" content="{{$post->title}}" />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="http://www.faeshal.com/post/{{$post->slug}}" />
      <meta property="og:description" content="{{$post->excerpt}}" />
      <meta property="og:image" content="/storage/{{$post->image}}" />

And This is the result when user share post in facebook

![](https://faeshal.com/storage/posts/February2019/result.jpg)

Remeber make sure the link inside **content=" "** meta tags is correct according to your link.If not then content will not appear correctly.This Meta tags also support in whatsapp,twitter,linkedin etc.

For all details and explanation facebook give you very clear documentation.Link down below

- [Open Graph Protocol - Documentation](http://ogp.me/)
- [Facebook Developers - Documentation](https://developers.facebook.com/docs/sharing/webmasters)

Facebook offers an Open Graph debugger too that allows anyone to test their page and determine how it will appear when shared on Facebook. Using this tool can help verify your Open Graph is properly detected, and that there are no other errors you may not be aware of on the page.Link down below.

- [Facebook Debugger](https://developers.facebook.com/tools/debug/)

So , That's all you need to know about open graph protocol , dont forget to check the documentation as always
