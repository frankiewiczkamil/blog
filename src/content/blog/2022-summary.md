---
title: Lessons learned in 2022 and plans for 2023
publishedAt: 2022-12-29
editedAt: 2022-12-30
description: 'An overview of 2022 from my technical standpoint, encompassing growth, experience, observations, reflections and plans.'
author: kpf
tags: [ summary, '2022', '2023', plans ]
image:
  url: fireworks
  alt: 🍾🍾🍾
draft: false
---

## Introduction

2022 was another strange year for obvious reasons. I am interested in geopolitics and foreign affairs for quite some time, but this year it was my number one
subject as an after hours activity. I am not complaining, I'm still very lucky that it's not me who suffers most due to the war. Anyway, after some time I was
able to resume my 'normal' activities, and this post is partly about that.

I'm going to describe here what I've learned in 2022 (at work and after hours), and what is my plan for 2023, hopefully.

## At work

### Java

It was another year of reactive spring (_webflux_) for me. I've faced some issues, that made me more humble about this topic. This is mainly due problems
related with concurrency and mixing reactive code with blocking code. I used to think, that the main 'cost' of functional reactive code is accidental
complexity - business logic full of monadic bloat. But sadly there's much more, if the use case doesn't fit entirely. My current recommendation is to use
reactive stack only for IO intensive services, like proxies and other capabilities. On the other hand I strongly dissuade it in applications with business
logic (other than plain transformation/processing), especially if one needs transactions support and/or fancy ORM's mappings.

Like I mentioned above, I spent quite some time on concurrency problems, and due to that I've run test suites many, many times. It has lasted for **hours**, and
this is because the default approach for spring web apps is layered architecture, so testing business logic in service layer requires loading spring context and
in-memory DB. In such situation one can either use a stable but sloooow solution like test containers that behave exactly like the real DB, or go with
alternative repository implementation that uses some in memory DB (like h2 or even just plain Map). The latter is faster, but one can't test easily some DB
behaviors like transaction rollbacks, DB triggers etc. I think that the real problem is the design itself, so for apps with non trivial business logic, one
should rather consider something like hexagonal architecture [^1]. I've applied such approach in one of the new services we developed and it helped me a lot
with testing the logic, and as a side effect it made it easier to split the work because of the loose coupling.

### Deno

One of my first task in 2022 was to create a POC for new service. I picked deno and I must say I was satisfied with overall developer experience. It was at the
beginning of the year, so [before node packages support announcement](https://deno.land/manual@v1.17.0/npm_nodejs/compatibility_mode), though I didn't miss
anything - it was more than enough to create a web server with decent SQLite DB support.

### React

In terms of frontend work I had some minor opportunities to stay in touch with react, but no growth and nothing worth to be mentioned.

### Python

I have also took an opportunity to use some python, finally. It was an AWS lambda for some batch data operations, nothing fancy. My overall experience was ok,
but when I was about to do some scripting later, I was (still) picking bash or typescript+deno depending on a use case.

## After hours

### Elixir

The goal for the first part of the year was to learn elixir. There were several reasons for that. The most important one was actor model of course. Moreover, I
was very curious about BEAM's features, like

- the idea of one, consistent toolbox capable of handling all sorts of needs - the inspiration came
  from [this table presented by Saša Jurić](https://www.youtube.com/watch?v=JvBT4XBdoUE&t=2266s), and
- hot deployment

I've built [a simple web application for collecting metadata about new podcast episodes available on spotify](https://github.com/frankiewiczkamil/fomos), and I
used [built-in DB](https://www.erlang.org/doc/man/dets.html) there. It was cool, though I think that the main elixir use case nowadays is performant web servers
with pre-configured stuff. In other words: performant rails.

It was a very interesting experience and I **really** enjoyed the language. It felt very natural to me. I keep my fingers cross
for [the ongoing work around the set-theoretic types](https://twitter.com/josevalim/status/1577680998124470273), because I guess _some_ type guarantees is a
must for a modern, mature language and current types support in elixir is not enough.

### Frontend/javascript

As we know, this year was full of new ideas, projects and events in js world. I've discovered, that beside reading some weekly summaries, another **great** '
source' of knowledge is Ryan Carniato with his [weekly live sessions on yt](https://www.youtube.com/@ryansolid/playlists) and
his [twitter profile](https://twitter.com/RyanCarniato). You might know him as a solid.js creator, but he does more than that. I enjoyed his detailed and
impartial analysis that helped me understand what are the challenges of modern web development and what are the use cases for react+next/remix, solid.js and for
qwik. In fact I've had read and watched his older materials as well, and I highly recommend it to anyone who wants to understand how frontend libraries are
different and what are the tradeoffs.

### Other

Similarly to the previous years I've been following big conferences, like GOTO, Devoxx etc, though I think the most influential videos for me were some 'old'
recordings of Rick Hickey, recommended by [Jakub Neander (aka Zaiste)](https://twitter.com/zaiste) in his series done together
with [Michał Miszczyszyn (Type of Web)](https://typeofweb.com/) in [Programistyczny Rozhowor](https://www.youtube.com/watch?v=4kPpfqJqgNg) (I highly recommend
this series for polish speakers, BTW).

Another interesting perspective for me, was Brian Goetz explaining the direction of Java development. We all know that it's slow, but I've started to appreciate
more the pragmatic and stable approach that Java creators present. I'm really excited about the future of the loom project and adapting structured programming
model into Java, because it became obvious that we need a good defaults for performant, IO intensive services.

## Plans for 2023

### Frontend

I'd like to do more frontend in 2023, though I'm not sure yet which solutions I'll try. I think I should learn about new server side rendering features,
like [render as you fetch](https://17.reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense). Moreover, I'd like to do
something using solid.js, because I'm really curious if the performance is that good there - I have some experience in react+redux tuning so it would be an
interesting comparison. And of course I'll keep using (learning) astro for this blog.

### Backend

There is a project loom that I need to try, but beside that I'd like to focus more on some higher level concepts, so most likely I'll read more about DDD. Maybe
I'll also try clojure, because I've heard so much good about it, and like I mentioned before Rick Hickey - the language creator - made me rethink many things.
I'm impressed with his diagnosis and simplicity he suggests, so I'm intrigued to the point I need to try his stuff.

### ...and

**May the force be with you, happy New Year!** 🥂

[^1]: aka ports and adapters architecture and very similar to uncle Bob's onion architecture
