---
title: Will AI replace the code as we know it?
publishedAt: 2025-05-17
editedAt: 2025-05-19
description: 'Two aspects of AI and the role it will play in the future'
author: kpf
tags: [ AI, Vibe coding, MCP, future ]
image:
  url: 'city-and-robot'
  alt: 🤖
draft: false
---

First of all, let’s state the obvious:
AI is transforming software development before our eyes.
We already have a wide range of AI-powered code completion tools,
and new concepts are emerging every day — _vibe coding_ and _MCP_,
to name two recent, and significant examples.

And those two are actually a good illustration of the two main directions in which AI is evolving:

- Generating standard code in existing languages (compiled or interpreted — it doesn’t really matter), 
  where ***the user's action triggers traditional code that gets executed to fulfill the request.***

- Replacing existing code artifacts (methods, functions, procedures, ...)
  with AI calls, meaning ***the user's action triggers an AI that generates the output needed to fulfill the request.***

The first one is well known — it's essentially a more sophisticated engine for IDE auto-completion.
The second one, however, is far more intriguing.
I still remember the first time I encountered this concept — it was Erik Meyer’s presentation,
[Alchemy For the Modern Computer Scientist](https://www.youtube.com/watch?v=6NXHIRyQOC8),
and it was genuinely mind-blowing.

Of course, this isn’t an either-or situation.
In fact, the second approach **must** currently be blended with existing code.
Personally I think that it's actually a nice thing, that we can adopt it gradually,
replacing increasingly larger parts of our software with AI-based components.
That however leads to a question,
whether we’ll eventually reach a point where AI can replace traditional code ***entirely*** (or almost entirely).
Theoretically, we can use AI on any device and call it instead of calling the conventional code.

It sounds feasible — after all, more and more devices get hardware support for AI these days, right?
So is it uninventable and only future?
Is it possible across _all_ types of software, services, and devices?

As you might have guessed,
I think that semiconductor-based devices we use today have some natural and obvious places,
where AI services will not fit, no matter what.
My goal here is to explore those and try to categorize them.

Let's begin with fundamentals:
would an operating system benefit from AI integration?
In some ways, yes.
We could collect behavioral data from users
and apply it to improve battery life, manage resources, and so on.

Can you already see where this solution is hitting the ceiling?
Would it be beneficial to use the AI as the "elementary particles" of our kernel, like system calls?

That doesn’t sound right, does it?
Even if performance and resource consumption weren’t an issue
(which they absolutely are — even with native AI hardware support),
AI is still ***not deterministic***.
And that makes it ***inherently unsafe***.
This is even more relevant when we talk about embedded devices, IoT systems, and similar.

I suppose that highlighting AI limitations in the context of the low-level scenarios wasn't very controversial.
But what about the higher-level code, the one that covers out business logic —
we can replace it totally with AI, right?

Well, again, not quite.
Would you consider the AI-only service for calculating an account balance?
Traditional processors are extremely efficient at numerical operations.
And — just like with OS kernels — low-level code is:

- Fast and power-efficient,
- Safe,
- Deterministic.

That last point is crucial:
we often need to **audit** what happened, 
to inspect the code that executed and understand **why** a particular outcome occurred.

With AI, that’s nearly impossible.
And this issue ***matters a lot*** because of the world we live in.
Now that is true for many, many aspects of our lives. 
Letting your fridge reorder groceries? Sure.
Letting AI make procurement decisions for a company or government?
That’s a different conversation entirely.

What about security? Surveillance?
Do we really want to live in a world like the one depicted in _Minority Report_?


And so on, and so forth.

## Summary

AI is already capable of replacing many services —
the real question is about **boundaries**.

We live in turbulent times, and as always,
legislation is lagging behind technology.
For now, it’s like a wild west: markets and people's creativity drive and the shape adoption boundaries.

Still, I believe the day will come when we collectively agree that we ***do need to codify these boundaries***.
This isn't about developer preferences, IT jobs, or the business interests of hardware vendors.

This is almost a **philosophical** issue,
one that could profoundly impact the future of human civilization.
Let’s hope we get it right🤞.

Cheers! 🖖

