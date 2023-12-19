---
title: 'Next v13: SSR strikes back'
publishedAt: 2023-12-16
# editedAt: 2022-12-?
description: 'Next 13+: evolution or revolution?'
author: kpf
tags: [ 'SWR', 'ssr', 'server side rendering', 'next.js', 'next', 'react', 'client side rendering', 'CSR', 'SSG' ]
image:
  url: rice-plantation
  alt: 🚧
draft: false
---

## Intro

The community's response to the latest Next.js releases (v13 and v14) is very diverse,
with opinions spanning a wide spectrum.

Some people argue, that it brings nothing new,
merely reinventing Server-Side Rendering (SSR) as we know it from template engines like JSP and PHP.
Some people, on the other hand claim, that it's a revolution.
So, who's got it right?

Well, I reckon both sides have a point, but they're also missing a few beats.

There are some significant changes in API that could be seen as a revolution in its own bubble, indeed.

However, in a broader sense, it doesn't introduce anything entirely new.
Instead, it redefines the ways of using existing tools, techniques, and patterns **together**.
Furthermore, it breathes new life into some old concepts that were forgotten in the post-SPA era.

But before we delve into the nitty-gritty of what sets apart Next v13+ from its predecessors and competitors,
let's quickly recap the evolution of the web, as we need to understand the historical context to see the bigger picture.

## Historical context

For our purposes, I'll list some key milestones that,
in my humble opinion,
have played a crucial role in shaping the web as we know it today.

These milestones include:

- static-pages
- pure server-side rendering (SSR) commonly used in PHP, JSP, ASP, CGI, etc
- AJAX calls
- client-side rendering (CSR) - fetching SSR/static-pages, then loading more data using AJAX calls
- REST APIs (structured way of fetching data, usually in JSON format)
- single-page-applications (SPAs) and PWAs (CSR for everything, beside first load)
- static site generation (SSG) and incremental static regeneration (ISR), aka JAMstack -
  essentially on-demand generation of static pages
- homogeneous apps: SSR+SSG+ISR+CSR - all-in-one libraries with js on both sides (next.js, gatsby, remix, etc)

If you think about it, there are basically two main approaches to rendering web pages: server side and client side.
The only difference between SSR, SSG and ISR is **when** the page is rendered.

At least for the mentioned use cases.
Later on, we'll discover that there's more to this equation that deserves consideration.

Controversial statement:
Even though mixing SSR with CSR was possible in early AJAX era,
I think it's fair to say that it became **less** popular with the rise of SPAs.
My understanding of this situation is that mobile apps made us think, that the web should become more like native apps.
Consequently, we started treating HTML not as a document but rather as an entry point to our app through JS.
This naturally led web apps to use the same APIs and the same flow for fetching data.

And those were REST APIs of course.
Now think about this: REST APIs use some sort of language as a data format (usually JSON),
while the traditional web approach was different - it was rather:

- sending data by submitting **html** forms - key-value pairs
- fetching data by following links to other pages - **html** documents

Why did we abandon that? I think that using REST with SPA felt good, as we enjoyed the clear separation between:

- application - it's logic, state, view/styling, offline-first support etc, and
- the data

It was like the box decoupled from its content
(of course we still have to follow the schema, but that's not the point here).

Also, we were able to share same endpoints between different clients, like mobile apps, web apps, etc.

Moreover, there was also that tempting promise, that frontend devs and backend devs can work independently.
Well, maybe, but...

It was finally causing a weird situation,
where we were using almost the same model/dto for backend and frontend.
Responsibilities were unclear, there was often too much logic leaking to the frontend layer.
And one might say: whatever, that's what we do 95% of our time - simple, CRUD apps.
I get it, but even so, what about those 5%?
From my experience we tend to using a hammer for everything, if it's already in our hand.
So in more complicated scenarios I've been experiencing (and even committing myself 😳)
the consequences of this mindset, and we were ending up with
[anemic models](https://en.wikipedia.org/wiki/Anemic_domain_model) on backend side and leaking logic
(or even worse: inconsistent logic).
But I'm getting ahead of myself here - we will get back to this later.

Anyway, overall people seemed happy about the SPA approach,
as it seemed that we had some sort of standard, reusable architecture at last.

But there were some more urgent, negative consequences as well.
In SPA, if our app (document) is not yet 'installed' (fetched or cached locally),
then we have to wait for it in almost idle state,
as obviously it's not possible to predict which data is needed by the SPA upfront.

Of course, static content like our SPA can be easily cached, so it loads quite fast.
But sometimes we need something better, especially when we focus on first time users.
I suppose that every user can tell, if app experience is good or not in terms of the latency.

So even if we cache the app (document) in the browser and/or CDN responses are extremely fast,
we still need to analyze what data we need,
before we can fetch it and finally render the final result.
So we still have a cascade of requests that can't be avoided.

I suppose, that business people were very unhappy about that, especially in e-commerce world.
And they had a good argument here -
what happened, so that we ended up with a worse user experience than we had in the past?
Like I've already stated, everyone can spot the difference in terms page loading speed.

There are also some other issues and limitations with SPAs, like SEO, but I won't go into details here.
I'll focus on the performance aspect, as I think that it caused the need for change.

# Homogeneous apps

At this point we already know, that we needed apps to load faster.
But on the other hand, we also wanted the interactivity from SPAs.
In other words, we aimed to have the best of both worlds:

- the speed of first contentful page from SSR/SSG, but also,
- minimal latency for loading more data from CSR

That's why we re-discovered the mixed approach: SSR+CSR.
What differentiates homogeneous apps from earlier solutions is,
that backend and frontend can reuse the implementation as needed,
because we have the same language on both sides.

I suppose that it was very important from DX perspective,
though at the end of the day users care about the result,
and that's why I claim that it was the performance that forced us re-think SPAs (over)usage.

In homogeneous apps we can use SSR/SSG to obtain meaningful content faster,
while still being able to load more data later,
using REST API like we did in SPAs.
Alternatively, we can load another page using SSR/SSG again.

Did we reach a perfect solution in such case?
Of course not.

First of all, we encountered a technical debt.
In order to show something meaningful to the user quickly,
we pre-render html on the server side,
but then on the client side we need to tell somehow react to take over the control.

It's called
[hydration](https://en.wikipedia.org/wiki/Hydration_(web_development)).
It basically requires some code to be executed twice: on the server and on the client.
And there is a gap between the moment when html is rendered and visible,
and the moment when interactive stuff is loaded (listeners are attached etc).

Secondly, if you think about it, handling loading more data using CSR is slightly inefficient at it's core,
as **every** client has to transform the data from JSON to the state and render it.

## Elephant in the room - RSC, Suspense and streaming components

In previous section I've mentioned that historically we had two approaches to rendering web pages:
server side and client side,
and that the only difference between SSR, SSG and ISR is **when** the page is rendered.
That was true for a long time, as at some point we decided to use only CSR as a strategy for loading more data.

But what if I told you,
that we can become faster (and get rid of hydration inefficiencies)
by slightly changing our mindset?

The idea here is using React Server Components (RSC) -
truly server side components that can be streamed to the client.

The way to achieve that is to embed the server component inside a client component.
There is a small nuance here, as server streams the data as `text/x-component` which is neither HTML nor JSON,
as this component might contain another components inside.
But it's definitely a step towards a classical, HTML direction,
as the server takes care of preparing html tags that are ready to be used by the client,
instead of sending raw data that needs to be transformed into the state just like in REST requests.

And you know what?
It's not only about the dynamic parts.
Consider this: requested page usually consists of some content that is basically static,
but also some more dynamic content that needs to be fetched from some resource(s), APIs etc.
There might be many things to fetch,
and they may vary in terms of latency.

As a result, the requested page is as slow as the slowest piece.

But in Next v13+ it doesn't have to be that way.

The idea is, that the server-specific part of the page might be rendered in chunks as well,
so client receives 'fast pieces' first,
and 'slower pieces' will arrive eventually later. One just needs to wrap each component with `Suspense`.
It reduces the need for cascade of requests and in fact it's easier to reason about.

Brilliant, isn't it?
And like I told in the beginning: not a brand-new idea, but it's not reinventing PHP either.
If you want to check my super simple examples for streaming components,
then you can find it [here](https://github.com/frankiewiczkamil/next-exercises).

That was the fetching part, but what about sending then?
Well, it's again re-discovering something old, but with some extra sauce.
This thing is **actions**: endpoints seamlessly integrated with our good-old submittable forms.
Again: abandoning REST+JSON and going back to the roots of the web, but also adding something on top of it.

Personally I'm happy that we finally reached this point,
where we were able to see a bigger picture,
fill the gaps and re-use some old ideas instead of creating some new,
hype-driven solution, focused on particular use case.

Of course, in next v13+ one is still able to do things like in post-SPA era -
using REST APIs for fetching and sending data, but there is a choice.

## Challenges

So is it all sunshine and rainbows now?
You know the answer - of course not.

First of all, since it's adding features on top of existing ones, it's arguably more complex.
I think this is why authors decided to change the library's API.
The default router is now structure based, and there are no longer `getServerSideProps` and `getStaticProps`.
I leave it to you to decide if it's simpler or not, but from what I've seen so far, people tend to like it.

You might also already heard about potential security risks,
especially in the context of
[example showed during the next.js conf ](https://youtu.be/9CN9RCzznZc?list=PLBnKlKpPeagl57K9bCw_IXShWQXePnXjY&t=939)
that became a viral.
Many people joked about it, many memes were created,
but most of them were missing the point - it was showing the feature in the simplest possible form.
So jokes regarding bad architecture (calling DB directly in upper layer) were unfair.
Moreover, jokes about SQL injection were just ignorant,
as even though it was not using parametrized query,
there was a template string, which effectively does something similar -
it splits arguments, and the dangerous part is simply ignored
(you can learn about this particular situation [here](https://youtu.be/2Ggf45daK7k?t=75)).

But indeed, there is a challenge here, as without clear separation in homogenous SSR apps,
we need to be more careful.
But there are already some good news for you - react already brings something called
[taints](https://react.dev/reference/react/experimental_taintObjectReference),
that should help enforcing security by marking an object as server-only.
That's cool, but I think this problem can (or even: should) be also handled on the architectural/design level.
More on that in Opportunities section.

## Opportunities

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
who used to have only one entry point before - REST API.

There are plenty of options here, depending on one's preferences and needs.
I've already mentioned the anemic model situation, and this is where I see a potential for improvement.
I think that extracting shared logic into a separate being might push devs to think more about the verbs,
and less about the nouns. Or in wider terms: more about the business and domain, less about the data.

I've performed such exercise myself, you can find it [here](https://github.com/frankiewiczkamil/do-gather).

## Summary

I think that next v13+ is a big step forward.
Not because of the new features or API changes,
but rather because it fills the gaps in the existing ecosystem.

It also have a potential to change the way we think about web apps architecture,
and I hope this trend will be adopted by other frameworks as well.

And to be honest, I know that this idea is already present in other frameworks,
like [hotwire](https://hotwired.dev/) and [liveview](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html)
but I think that next.js is the first one that brings it to the mainstream.
Moreover, it does it from a different angle, as hotwire and liveview are ruby and elixir based, respectively.

In fact those frameworks that I mentioned,
together with [island architecture](https://docs.astro.build/en/concepts/islands/)
([astro](https://docs.astro.build/), [fresh](https://fresh.deno.dev/)),
[qwik](https://qwik.builder.io/)
and [solid start](https://start.solidjs.com/getting-started/what-is-solidstart)
are to me like a new trend in web development.
I see it as an attempt, to make our tools well suited to our needs, sharper and fine-grained.
I think that it's a good direction, and I'm looking forward to see how it will evolve.

Thank you for reading, and see you next time 🖖
