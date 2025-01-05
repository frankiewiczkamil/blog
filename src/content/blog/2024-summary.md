---
title: 2024 Summary
publishedAt: 2025-01-04
description: 'My 2024 summary: development, experiences, observations, and plans for 2025.'
author: kpf
tags: [ summary, '2024', '2025', plans ]
image:
  url: '2024_2025'
  alt: 🍾🍾🍾
draft: false
---

## 2024

From my perspective, 2024 was primarily a continuation of trends and phenomena,
which were more or less visible in the previous years.
I mean primarily:

- the crisis of funding in the IT industry, especially further waves of layoffs
- the expansion of AI
- shifts in the world of front-end, or rather should I say: in the world of the web

I think that the interaction between the crisis and AI is so multidimensional,
that I find it too complex to analyze and describe this phenomenon thoroughly.
I will refrain from delving into the first two points.

As for the third point, it was an interesting year for me,
because I think we are (still) dealing with experiments and questioning the status quo,
which for a good few years boiled down to _almost every_ new project was a SPA in react/angular/vue using REST API and/or graphql.

However, I hope that the fragmentation and intellectual buzz
we are currently observing will not lead to the victory and domination of yet another fashion,
but rather to the realization by programmers and architects that we are dealing with many, different problems that require
different approaches.

I will go even further: in some cases, SPA is still the most justified choice.
I mean ***actual*** _web applications_, i.e., pages that are highly interactive and often need to support an offline mode.
Such requirements can raise issues related to data synchronization, and this is where we come to the _local-first_ movement.

This summer I explored this topic a bit and I must say that there are many interesting things happening there.
We have a lot of tools, starting from low-level ones that help in data synchronization
([Y.js](https://yjs.dev/),
[Automerge](https://automerge.org/),
[Loro](https://loro.dev/)),
through those focused on a subset of issues (e.g., storage + basic synchronization mechanism),
and ending with "all-in-one" monsters.

It was also an opportunity to delve into slightly more theoretical issues crucial to the implementation of LoFi assumptions,
such as [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
or [logical clocks](https://en.wikipedia.org/wiki/Logical_clock).
For those interested in the state of LoFi in 2024, I recommend [syntax.fm episode on this topic](https://www.youtube.com/watch?v=aKaSOVzquqA),
where a few popular tools are briefly discussed.


On the flip side, we have all sorts of pages with a document or form character.
Fortunately, I had the opportunity to work commercially this year with next.js (13+).
I really like the flexibility we have in this solution.
I mean, for example, the choice of rendering time (AOT during build or JIT server-side/client-side),
support for convenient mutation through
[actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations),
or built-in caching mechanisms.

From other noteworthy things related to technological trends,
I took some steps this year to expand my knowledge of built-in mechanisms for handling multithreading in Java.
I feel like I have gaps in my knowledge in this area, mainly because I was betting on higher-level abstraction solutions —
actors, reactive programming, etc.
The upcoming loom, however, made me decide to work also at the foundations, reading the classic book by Brian Goetz
_Java Concurrency in Practice_. Work in progress.

On a different note, not related to the latest trends (although this is probably debatable),
I finally decided to experiment with [Nix](https://nixos.org/).
The documentation and materials are still not overly friendly,
but based on articles, posts, and other people's configurations
on github, I carved out configurations (yes, plural) for my devices.
For now, only Macs.
The potential stemming from declarativeness and determinism is enormous,
so I plan to continue this adventure despite the difficulties and chaos I think reigns in this ecosystem.

The last thing I checked off my list, which I will mention out of a sense of duty, is learning the basics of LaTeX.
As with Nix, the benefits here come primarily from the paradigm and the greater idea behind the tool,
because in the details there are pitfalls and a multitude of choices to be made.

## 2025

The plans for 2025 include continuing experiments with Nix and catching up on multithreading in Java.
Additionally, I would like to work with HTMX as a simple and efficient alternative to leading but complex front-end tools.
From what I know about this solution, 
it has the potential to fill a niche for simple interfaces that are easy for backend developers to write and maintain.
It seems to me that the crisis and blurring of boundaries between front-end and back-end predestine such a tool to increase its popularity.

I do not intend to plan more for this year, because the situation is dynamic and I want to leave room for flexibility.

I wish myself and you that 2025 will be as inspiring and challenging as 2024,
but at the same time slowly introduce stability and order where possible.

✌️