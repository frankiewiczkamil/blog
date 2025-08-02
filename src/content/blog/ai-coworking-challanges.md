---
title: Challenges of AI-based software
publishedAt: 2025-08-02
editedAt: 2025-08-02
description: 'Challenges arising from the growing involvement of AI in the software development and delivery process'
author: kpf
tags: [ AI, Vibe coding, black-box, future, challenges ]
image:
  url: 'ai-robot-and-programmer'
  alt: 🤖
draft: false
---

As we established in the previous post, as of now AI can help us in our software in roughly two ways:

- Generating traditional code in existing programming languages
- Replacing existing code artifacts with AI calls

In this post, I’ll focus on the consequences of using these approaches and expand this classification a bit.

There’s no doubt that, regardless of our skill level, AI enables us to deliver faster and more.
While this is generally a good thing, it does introduce a few challenges as well.
The reason is simple: more code means more complexity — and the more complex the system,
the harder it is to introduce changes.
This matters because a unique characteristic of software is its virtually unlimited capacity for change[^1].

At least theoretically, since in practice, the service matters only if it fulfills the functionalities we expect.

Regression risks are nothing new; however, the rate and kind of changes being introduced today are a different story.
The scale of regressions seems to be increasing faster than the growth of system functionality,
much like how the time needed to implement changes grows as the system expands.
This is a well-known fact.

Furthermore, we are seeing the growing adoption of an approach that I’ll refer to as ***black-box*** software development.

By this, I mean vibe coding, agents, 
and other variations of code generation where human involvement is limited to specifying requirements.

It’s worth noting that black-box code generation closely mirrors what I referred to as
_replacing existing code artifacts with AI calls_.


It’s, in a way, simply a more computationally efficient and more predictable counterpart.
Somewhat like the difference between compiled code and a script.

It’s natural to assume that AI will become more involved in quality assurance, 
actively assisting in minimizing regression risks.
Just like in any other aspect.

However, the effectiveness of this combination is still unknown to me — meaning, 
I’m not sure if AI driven QA can keep up under typical conditions.
Time will tell I suppose.

In the next post, I’ll try to propose the main principles and techniques for dealing with these challenges. 
Meanwhile, cheers! 🖖

---

[^1]: To be more precise, it’s not just about the ease of making changes to the code itself — after all,
designs for machines or buildings can likely be modified relatively easily as well.
What truly matters here is the ease of migrating existing deployments of a product to new versions —
in other words: maintainability.