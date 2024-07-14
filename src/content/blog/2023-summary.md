---
title: 2023 Summary and 2024 Plans
publishedAt: 2024-01-22
description: 'An overview of 2023 from my technical standpoint, encompassing growth, experience, observations, reflections and plans.'
author: kpf
tags: [summary, '2023', '2024', plans]
image:
  url: '2023_2024'
  alt: 🍾🍾🍾
draft: false
---

## 2023

Anyone observing the IT market knows that 2023 was not a year of prosperity known from previous years.
Despite following tech industry portals, I myself didn't fully realize how much until it directly affected me.
But let's go in order.

Even in 2022, there were a lot of upheavals.
Knowing this, I decided in 2023 to kill two birds with one stone:
to switch to a more stable project and, at the same time, change the technological stack.

I joined a team maintaining a browser SDK for video conferencing.
It's a very interesting area, and I learned a lot about WebRTC itself and related technologies.
Additionally, working on the SDK was an interesting experience in terms of discipline,
work organization, and releases' planning.
The coding challenges mainly revolved around asynchronous operations and handling side effects, which suited me well.
I managed to organize the knowledge I gained while working on TV/VOD solutions,
and even enrich it because it's a slightly different context with different emphases.

Unexpectedly, in the second half of the year, circumstances forced me to change jobs.
As mentioned earlier, I didn't expect the scale of the IT jobs issue.
In case someone doesn't know, the times of an employee's market (in IT) are over.
Many projects reduced teams, recruitments are suspended halfway through the process, etc.
I had a kind of déjà vu from the 2010s when I entered the job market.

In such circumstances, I decided to slightly adjust my technical goals to align with the new situation.

Fortunately,I had pursued the least pragmatic goal, which was to explore the world of Clojure/Lisp,
earlier - in the summer.

I was particularly interested in the area of concurrency,
so the differences between the actor model and the Clojure agent model caught my attention.
The concepts seem very similar at first glance, but in practice they are quite different.
My attention was also drawn to immutable data structures, which are _built in_ into Clojure.
There is magic under the hood that makes it (supposedly) super efficient,
but I can't say how much better (if at all) it is compared to solutions like vavr or immutable.js.

Summing up: the topic is suspended, I will be happy to come back to it, but it is not a priority now.
I consider the minimum for _learn some clojure in 2023_ fulfilled.

Another goal for 2023 was to get acquainted with the novelties in the world of SSR,
presented in the new version of next.js.
The situation was unusual in that I had not written in next.js before - I was familiar with the theory only.
It is worth adding that next 13 can work with two routing configurations:
both with the new app (v13+) and the classic pages (<=v12).
This actually helped me,
because it's easier for me to understand something by comparing it to something else.

In any case, I spent quite some time on next.js -
besides the research itself, I've also written
[a small project](https://github.com/frankiewiczkamil/do-gather)
and
[an article about it](../../../blog/ssr-strikes-back/).

To make things even more interesting, I deliberately over-engineered that project,
as I wanted to explore event sourcing based aggregate pattern.
I was inspired by
[Oskar Dudycz's lecture _Odchudź swoje
aggregaty_ from Wrocław's JUG](https://www.youtube.com/watch?v=UVsen5qKQoM&t=3773s&pp=ygUMb3NrYXIgZHVkeWN6).

At the same time, this somewhat aligned with another goal for 2023 that I had neglected,
which was learning more about DDD.

In my defense, I can add that in order to achieve this goal I've also written a similar
[project in Java](https://github.com/frankiewiczkamil/do-gather-java),
but based on a more classic approach to aggregate design.

But let's move back for a sec to JS libraries.
2023 brought 2 major releases in astro library.
Experimenting with Astro was also on my goals list, so I upgraded astro in my blog.
Fortunately, it was painless, probably due to the early stage of the project.

Staying on the blog thread, in terms of features, I didn't really add anything.
However, I made certain changes to enhance the overall UX.

In particular, I extended the graphics support.
First of all, I used the `<picture>` tag and the following formats are offered now: avif, webp, jpg.
The support for multiple formats is declarative, and it is done automatically based on the astro's
`<Picture>` - there is only one image in the repo, astro handles the rest.
Secondly, the main view loads graphics in 2 sizes: a scaled-down thumbnail (blur effect) and a full version,
which replaces the thumbnail (a short piece of JS was added).

Besides that, I added some effects for the graphics, titles and dates of posts by using
[transitions API]('https://docs.astro.build/en/guides/view-transitions/'),
which is supported now in astro.

So let's assume that some minimum astro workout is also checked.

Still on the frontend field, I will also mention that due to preparations for fullstack interviews,
I dusted off and even deepened my knowledge in areas that were _not_ on the goals list.
In particular, in CSS I looked into flex and grid, and in react into hooks and context.
The most impressive discovery to me was that `setState` can take a function as an argument,
which solves the potential inefficiency I described in
[this article](../../../blog/efficient-state-in-functional-components/).

Concluding the thread on goal verification for 2023,
it's necessary to mention the unrealized ones.
Regarding Solid, I haven't done almost anything, except for occasionally keeping track of Ryan Carniato's activities.

Another unfulfilled goal is to delve into the loom project.

And that would be all for the 2023 goals summary.
However, I would like to mention one important aspect that has changed in my approach to the programmer's work.
No surprise here - AI.
I've had many "conversations" with GPT during my learning adventures.
I also subscribed a copilot service.
This experience of working with such tools makes me say with full conviction
that AI indeed is revolutionizing programmer productivity.

So that was my 2023, what about the plans for 2024?

## 2024

First of all, some of the 2023's goals: loom, DDD, next, are still valid.
These topics are so extensive that they likely provide more than enough material for an entire year, if not more.
In case of loom, I also plan to start with refreshing some fundamentals of java's concurrency model.

As for slightly lighter tasks that I set for myself, I plan to introduce a Polish version of the blog.
So far, I've only written in English.

The work is already in progress,
and this post is the first one I'm writing in Polish and will translate it into English later.
I think it was AI support that convinced me to extend the format.
Although I've already found out that translating technical posts from English to Polish works on average,
I hope it will work better the other way around.

I'll end with this optimistic statement.

I wish to all of us that 2024 will bring some order to the chaos that has accompanied us in recent years.
May the intellectual ferment stirred by this chaos bear fruit and strengthen communities.

*Until next time* 🖖
