---
title: 'next v13: SSR strikes back'
publishedAt: 2023-12-16
# editedAt: 2022-12-?
description: 'Next 13+: evolution or revolution?'
author: kpf
tags: [ 'ssr', 'server side rendering', 'next.js', 'next', 'react' ]
image:
  url: avenue
  alt: 🚧
draft: true
---

# Intro

It seems that next v13 release was very important not only for the next.js community, but also for the whole frontend
world, or maybe even for the whole web. Sounds like exaggeration, a clickbait, fishy header, doesn't it?
But I truly mean it, as it questions some paths that we've been following for years.
It's not introducing a new protocol or something like that - sure.
It does something else - it rather introduces new ways of using and existing tools, techniques and patterns.
And some of those are so old, that younger developers may not even know about (if they started they journey after SPA
revolution).

Moreover, Next 13 looks like a well-thought-out solution.
Not a hammer, that treats every problem as a nail, not a new fashion, that tells you that the only right way is to does
things is like they do.
It's rather an all-in-one solution, that gives one a lot of power and allows to choose how particular parts of one's app
should work, depending on one's needs.
Plus it gives a new life to some old concepts, that were forgotten in REST API dominance era.

If you feel intrigued, read on, so you can decide, if all those bold statements above make sense for you as well.

## Historical context

Before we start talking about the details of what's so different about next v13, let's recap the evolution of the web.
For our needs I will enumerate some of the most important milestones that shaped the web as we know it today (IMO).

These are:

- static pages
- heterogeneous server side rendering - PHP, JSP, ASP, CGI, etc (SSR)
- AJAX calls and client side rendering (CSR, but also possible with SSR)
- REST APIs
- single page applications and PWA (CSR by design)
- static site generation (SSG) and incremental static regeneration (ISR), aka JAMstack
- homogeneous apps: SSR+CSR - next.js, gatsby, remix, etc

If you think about it, there are basically two main approaches to rendering web pages: server side and client side.
The only difference between SSR, SSG and ISR is **when** the page is rendered.
And here comes my first controversial statement:
even though mixing SSR with CSR was possible in early AJAX era,
I think it's fair to say that it became less popular with the rise of SPAs.
My understanding of this situation is that mobile apps made us think, that the web should become more like native apps.
The natural consequence of that was that web apps were using the same APIs, the same flow for fetching the data.

There is also one interesting technical nuance here. From my experience SPA and mobile apps went hand in hand with REST
APIs.
And REST APIs usually use JSON as a data format, while the traditional way of sending data in early web was submitting
html forms, thus sending key-value pairs, not json.

Anyway, using REST with SPA felt good, as we had clear separation between document and data.

However, there were some consequences.
It meant that if our document was not 'installed' (fetched or cached),
then we had to wait for it, and it was not possible fetch the data in parallel as we could not predict which data we
will need in our SPA.
Static content caches well, but sometimes this experience was not good enough.
It was bad for SEO, and it was bad for first time users.
That was especially bad for e-commerce, where the first impression is crucial.

So we re-discovered mixed approached. We also forged some new, related patterns to make it even more efficiently,
like islands architecture or micro frontends.

The interesting part is that we wanted to have the best of both worlds:
speed of first contentful page from SSR but also interactivity and minimal latency for loading more data from CSR.

Homogeneous apps were step forward in that direction, but they have some drawbacks.
One of the most infamous limitations was the double hydration issue.
It was the price for seamless developer experience.
Island architecture helped a bit here, as it reduces cost for dynamic part to minimum.
But it's still using same idea of sort.
As you can already see, we want to make each part of our app as fast as possible,
and that means that some things we want to be pre-rendered like SSG, some things we want to render on the fly like SSR,
and some things we want to render on the client side like CSR.

But can it become even better, can we make it even more efficient? Yes, we can.

# Elephant in the room - SWR, Suspense and streaming components

# Challenges

- complexity
- security risks

# Opportunities

- all in one
- performance
- reconsider architecture (modularity)

# Summary
