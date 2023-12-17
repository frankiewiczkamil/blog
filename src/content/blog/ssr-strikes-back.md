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

## Intro

The community's response to the latest next.js releases (v13 and above) is very diverse,
with opinions spanning a wide spectrum.

Some people argue, that it brings nothing new,
merely reinventing Server-Side Rendering (SSR) as we know it from template engines like JSP and PHP.
Some people, on the other hand claim, that it's a revolution.
So, who's got it right?

Well, I reckon both sides have a point, but they're also missing a few beats.

Sure, there are some significant changes in Next.js's API that could be seen as a revolution in its own bubble.

However, in a broader sense, it doesn't introduce anything entirely new, such as a new protocol.
Instead, it redefines the ways of using existing tools, techniques, and patterns **together**.
Furthermore, it breathes new life into some old concepts that were forgotten in the post SPA+REST era.

I'm about to dive into what these big changes mean for me,
but before that, let's rewind a bit and get some historical context.

## Historical context

Before we dive into the nitty-gritty of what sets apart Next v13,
let's recap the evolution of the web.

For our purposes, I'll list some key milestones that,
in my humble opinion,
have played a crucial role in shaping the web as we know it today.

These milestones include:

- static-pages
- pure server-side rendering (SSR) commonly used in PHP, JSP, ASP, CGI, etc
- AJAX calls
- client-side rendering (CSR) - fetching SSR/static-pages, then loading more data using AJAX calls
- REST APIs
- single-page-applications and PWAs (CSR for everything, beside first load)
- static site generation (SSG) and incremental static regeneration (ISR), aka JAMstack -
  essentially automatic/on-demand generation of static pages
- homogeneous apps: SSR+SSG+ISR+CSR - next.js, gatsby, remix, etc

If you think about it, there are basically two main approaches to rendering web pages: server side and client side.
The only difference between SSR, SSG and ISR is **when** the page is rendered.

At least for the mentioned use cases.
Later on, we'll discover there's more to this equation that deserves consideration.

Controversial statement:
Even though mixing SSR with CSR was possible in early AJAX era,
I think it's fair to say that it became **less** popular with the rise of SPAs.
My understanding of this situation is that mobile apps made us think, that the web should become more like native apps.
Consequently, we started treating HTML not as a document but rather as an entry point to our app through JS.
This naturally led web apps to use the same APIs and the same flow for fetching data.

And those were REST APIs of course.
Now think about this: REST APIs use some sort of language as a data format (usually JSON),
while the traditional web model was different - it was:

- sending data by submitting html forms - key-value pairs
- fetching data by following links to other pages - html documents

Why did we change that? I think that using REST with SPA felt good, as we had clear separation between:

- application - it's logic, state, view/styling etc, and
- the data

It was like the box decoupled from the content
(of course we still have to follow the schema, but that's not the point here).

Moreover, there was also another tempting promise, that frontend devs and backend devs can work independently,
that they don't need to know each other's codebase.
Well, maybe, but I think that it was true for simple, CRUD apps.
In more complicated scenarios I've been experiencing (and even committing myself 😳)
[anemic models](https://en.wikipedia.org/wiki/Anemic_domain_model) -
which leads to many issues.
I'll touch on that later.

Anyway, people were happy,
as it seemed that we had some sort of standard architecture here.
But there were some (more) negative consequences as well.
In SPA, if our app (document) is not yet 'installed' (fetched or cached locally),
then we have to wait for it in almost idle state,
as obviously it is not possible to predict which data is needed by SPA upfront.

Of course, static content like our SPA can be easily cached, so it loads quite fast.
But sometimes we need something better, especially when we focus on first time users.
Even if we cache the app (document) in the browser and/or CDN responses are extremely fast,
we still need to analyze what data we need,
before we can fetch it and finally render the final result.
So we still have a cascade of requests that can't be avoided.

There are also some other issues and limitations with SPAs, like SEO, but I won't go into details here,
as it's not the main topic of this post.

# homogeneous apps

At this point we should already notice, that we aim to have the best of both worlds:
the speed of first contentful page from SSR/SSG,
but also interactivity and minimal latency for loading more data from CSR.

That's why we re-discovered the mixed approach.
The difference here is that backend and frontend implementations can reuse the implementation as needed,
because we have the same language on both sides.

So we can use SSR/SSG to quickly render the first contentful page, and load the rest of the app in the background,
using REST API like we did in SPAs.

So does it solve all our problems? Not really.

First of all, we encountered a technical debt.
We needed to pay the price, because modern libraries like react were designed for SPAs,
so we reached a frustrating limitation of [hydration](https://en.wikipedia.org/wiki/Hydration_(web_development)).

Island architecture helped a bit here, as it reduces cost for dynamic part to minimum.
But it's still using the same idea for dynamic parts.

Secondly, it's not significantly different from older non-homogeneous SSR techniques.

So can we do any better? Yes, and now we do.

## Elephant in the room - SWR, Suspense and streaming components

In previous section I've mentioned that historically we had two approaches to rendering web pages:
server side and client side,
and that the only difference between SSR, SSG and ISR is **when** the page is rendered.
That was true for long time, as at some point we decided to use CSR only as a strategy for loading more data.

But what if I told you,
that we can become faster (and get rid of hydration inefficiencies)
by slightly changing our architecture?

The big idea here is, that our dynamic parts can be rendered on the server side as well,
just like we did for the whole page.

And you know what?
It's not only about the dynamic parts -
we can pre-render a part of the requested page, send it to the client,
and then send the rest of the page in the background,
as we get the data from slow resource like DB, another API etc.

Brilliant, isn't it?
It's not a new idea, but it's not reinventing PHP either.

That was the fetching part, but what about sending then?
Well, it's again re-discovering something old, but with some extra sauce.
This thing is **actions**: endpoints seamlessly integrated with our good-old submittable forms.
Again: abandoning REST+JSON and going back to the roots of the web, but also adding something on top of it.

Personally I'm happy that we finally reached this point,
where we were able to see a bigger picture,
fill the gaps and re-use some old ideas instead of creating some new,
hype-driven solution, focused on particular use case.

Of course, in next v13+ one is able of course still to do things like in post-SPA era -
using REST APIs for fetching and sending data, but there is a choice.

## Challenges

So is it all sunshine and rainbows now?
You know the answer - of course not.

First of all, since it's adding features on top of existing ones, it's arguably more complex.
I think this is why authors decided to change the library's API.
The default router is now structure based, and there are no longer getServerSideProps and getStaticProps.
I leave it to you to decide if it's simpler or not, but from what I've seen so far, people tend to like it.

You might also already heard about potential security risks,
especially in the context of example showed during the next.js conf that became a viral.
Many people joked about it, many memes were created,
but most of them were missing the point - it was showing the feature in the simplest possible form.
So jokes regarding bad architecture (calling DB directly in upper layer) were unfair.
On the other hand, jokes about SQL injection were just ignorant,
as even though it was not using parametrized query,
there was a template string, which effectively does something similar -
it splits arguments, and the dangerous part is simply ignored
(you can learn about this particular situation [here](https://youtu.be/2Ggf45daK7k?t=75)).

But indeed, there is a challenge here, as without clear separation in homogenous SSR apps,
we need to be more careful.
But I have some good news for you already - react already brings something called
[taints](https://react.dev/reference/react/experimental_taintObjectReference),
that should help enforcing security by marking an object as server-only.
That's cool, but I think this problem can (or even: should) be also handled on the architectural/design level.
More on that later.

# Opportunities

We already learned about all the benefits related to performance gains,
seamless developer experience, etc.

But there is one more thing that I'd like to point out here.
And I think it's related to security risks I mentioned in previous section.
There is a
[famous anecdote about chinese word for 'crisis'](https://en.wikipedia.org/wiki/Chinese_word_for_%22crisis%22),
which - in a nutshell - says that crisis is an opportunity.

And I think it's true here.
We have an opportunity to re-think how we organize our business logic implementation in node.js apps.
I think, that actions as an **another** entry point is a great opportunity to re-think architecture for people,
who use to have only one entry point before - REST API.

There are plenty of options here, depending on one's preferences and needs.
I've already mentioned the anemic model situation, and this is where I see potential for improvement.
I think that extracting shared logic into a separate being might push devs to think more about the verbs,
and less about the nouns. And in bolder words: about the business and domain, less about the data.

# Summary

I think that next v13+ is a great step forward.
Not because of the new features or API changes,
but rather because it fills the gaps in the existing ecosystem.

It also have a potential to change the way we think about web apps architecture,
and I hope this trend will be adopted by other frameworks as well.
