---
title: Will AI replace the code as we know it?
publishedAt: 2025-05-18
description: 'Two aspects of AI and the role it will play in the future'
author: kpf
tags: [ AI, Vibe coding, MCP ]
image:
  url: 'future-city'
  alt: 🤖
draft: false
---

First of all, let's state the obvious: AI changes software development before our eyes.
We have all sorts of AI based code completion tools, but also new concepts arise every day:
_vibe coding_, _MCP_
to name the two new, and significant ones.

And those two are actually a good example of two general ways in which AI will go:

- generating "classical" code in exising languages (compiled, interpreted - doesn't really matter),
where ***user's action triggers some code that will be executed in order to fulfill the user's request***
- replacing services that use the "classical" code with AI-based services, 
meaning ***user's action triggers AI that will output something needed for fulfilling the user's request***

The first one is obvious and can help for arguably any existing project.
The second one, however, is actually a more tricky one. 
I remember the first time when I heard about this idea: it was the Erik Meyer's presentation 
[Alchemy For the Modern Computer Scientist](https://www.youtube.com/watch?v=6NXHIRyQOC8),
and it was a mind-blowing experience for me at that time.
The interesting question here is if AI can replace the "classical" code ***totally***.
Theoretically, we can embed AI on any device and call it instead of calling a function/method.

More and more devices get hardware supported for that these days.
But is it uninventable and only future?
Is that true for _every_ type of software/service/device?

As you may already suspect, 
I think that semiconductor-based devices we use today have some natural and obvious places,
where AI services would not make that much sense.
My goal here is to explore those and try to categorize them somehow.

Let's start with fundamentals:
would we benefit from native, AI-based support in the software like OS?
Well, in some scenarios, surely. We can optimize battery life, reduce power consumption, 
turn services on and off based on user's behavior and so on.

But would it be beneficial to use AI in "elementary particles" of our kernel, like system calls?
Doesn't sound right, does it?
Even if performance and resource consumption is not an issue (but it is, actually, even with native hardware support),
***it's not deterministic***, and that means that it is actually ***unsafe*** at is core.  
And all that will be true for any "embedded" device, like IoT etc.

Ok, so we will have some low-level code written once, but then we can use AI for any higher-level code, right?

You guessed it: I don't think so.
Would asking AI about the balance in our bank account be a good idea?
"Normal" processors are actually quite good in mathematical operations.
Just like with OS'es:
It's time and power efficient. 
It's safe.
It's deterministic.

And there is one very important consequence of the latter here:
as humans, we often need to audit the already executed code, to see why certain outcome was achieved.

That's almost not possible with AI.
And this thing is a big deal, because of civilisation we live in.
Now that is true for many, many aspects of our lives.
We might allow our fridge to order the food,
but would we trust it to request stuff on a say: company level, or government level?
What about security and surveillance?
Do we want the world from _Minority Report_?

And so on and so on.

## Summary

We know that AI is capable of replacing many services, the question is about the boundaries.

Times are volatile, and - like always - law is behind the technology, 
so it's market and people's will what shapes it now.

However, I bet that sooner or later, we will reach the point where we will agree that we need to codify that.
It's not about programmers preference, IT jobs, or manufacturers business.

It's rather a philosophical question that may influence the future of the humanity. 
Let's hope we will make it right.
