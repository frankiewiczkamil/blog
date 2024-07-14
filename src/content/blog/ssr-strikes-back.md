---
title: 'Next v13: SSR strikes back'
publishedAt: 2023-12-16
editedAt: 2024-07-08
description: 'Next 13+: evolution or revolution?'
author: kpf
tags: ['RSC', 'ssr', 'server side rendering', 'next.js', 'next', 'react', 'client side rendering', 'CSR', 'SSG', 'suspense']
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

Well, I reckon both extremes have a point, but they're also missing a few beats.

There are some significant changes in API that could be seen as a revolution in its own bubble, indeed.

However, in a broader sense, it doesn't introduce anything entirely new.
Instead, it redefines the ways of using existing tools, techniques, and patterns **together**.

Interestingly, it breathes new life into some old concepts that were forgotten in the (post) SPA era.

But before we delve into the nitty-gritty of what sets apart Next v13+ from its predecessors and competitors,
let's quickly recap the evolution of the web, as we need to understand the historical context to see the full picture.

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
- static site generation (SSG) and incremental static regeneration (ISR), aka JAMstack —
  essentially on-demand generation of static pages
- homogeneous apps: SSR+SSG+ISR+CSR — all-in-one libraries with js on both sides (next.js, gatsby, remix, etc)

If you think about it, there are basically two main approaches to rendering web pages: server side and client side.
The only difference between SSR, SSG and ISR is **when** the page is rendered.

At least for the mentioned use cases.
Later on, we'll discover that there's more to this equation that deserves consideration.

Controversial statement:
Even though mixing SSR with CSR was possible in early AJAX era,
I think it's fair to say that it became **less** popular with the rise of SPAs.
My understanding of this situation is that mobile apps made us think, that the web should become more like native apps.
Consequently, we started treating HTML not as a document but rather as an entry point to our app.
This naturally led web apps to use the same APIs and the same flow for fetching data.

And those were REST APIs of course.
Now think about this: REST APIs use some sort of language as a data format (usually JSON),
while the traditional web approach was different — it was rather:

- sending data by submitting **HTML** forms — key-value pairs
- fetching data by following links to other pages — **HTML** documents

Why did we abandon that?
I think that using REST with SPA felt good, as we enjoyed the clear separation between:

- application — it's logic, state, view/styling, offline-first support etc, and
- the data

It was like the box decoupled from its content.

Also, as already partly stated,
we were able to share same endpoints among different clients.

And finally, there was also that tempting promise, that frontend devs and backend devs can work independently.
Well, maybe, but...

It caused a weird situation,
where we were using almost the same model for backend and frontend.
There was too much logic leaking to the frontend layer, and responsibilities were unclear.

One might say here: whatever, that's what we do 95% of our time — simple CRUDs.
I get it, but even so, what about those 5%?
We tend to use a hammer for everything, if it's already in our hand.
I've done it this way myself as well.
Thus, we end up with
[anemic models](https://en.wikipedia.org/wiki/Anemic_domain_model) on backend side and a lot of logic implemented in
frontend[^1].
Sometimes it's not even consistent.
But I'm getting ahead of myself here — we will get back to this later.

Anyway, overall people seemed happy about the SPA approach,
as it seemed that we had some sort of standard, reusable architecture at last.

But at some point important, negative consequences has been noticed.
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
And they had a good argument here —
what happened, so that we ended up with a worse user experience than we had before?
Like I've already stated, everyone can spot the difference in terms of site's loading speed.

There were also some other issues and limitations with SPAs that were noticed,
like SEO, but I won't go into details here.

# Homogeneous apps

At this point we already know, that in some business areas we needed apps to load faster than SPAs.
But on the other hand, we also wanted the interactivity.
In other words, we aimed to have the best of both worlds:

- the speed of first contentful page from SSR/SSG, but also,
- minimal latency for loading more data from CSR

I guess that's why we re-discovered the mixed approach: SSR+CSR.
What differentiates homogeneous apps from earlier solutions is seamless integration of SSR and CSR parts,
as we no longer have to integrate it backend and fronted pieces (like PHP + angular etc.).
In fact, we can even share the implementation between backend and frontend as needed.

It was very important from DX perspective for sure,
though at the end of the day users care about the result,
and that's why I claim that it was the performance that forced us re-think SPAs (over)usage.

In homogeneous apps we can use SSR/SSG to obtain something meaningful faster,
while still being able to load more data later,
using REST API like we did in SPAs.

Did we reach a perfect solution in such case?
Of course not.

First of all, we encountered a sort of technical debt.

In previous generations of homogenous libs, like next v12 and older,
in order to show something meaningful to the user quickly,
we pre-render HTML on the server side,
but then on the client side we need to let react (or other library) to take over the control and mount everything.

It's called
[hydration](<https://en.wikipedia.org/wiki/Hydration_(web_development)>).

It basically requires server components code to be executed twice: on the server and on the client.
Additionally, there is a gap between the moment when HTML is rendered and visible,
and the moment when interactive stuff is loaded (listeners are attached etc.).

Secondly, if you think about it, handling loading more data using CSR is slightly inefficient at it's core,
as **every** client has to transform the data from JSON to the state and then render it,
even if no interactive support is required.

## Elephant in the room — RSC, Suspense and streaming components

In previous section I've mentioned that historically we had two approaches to rendering web pages:
server side and client side,
and that the only difference between SSR, SSG and ISR is **when** the page is rendered.
That was true for a long time,
as at some point we decided to use only CSR as a strategy for loading more data.

But what if I told you,
that we can become faster (and get rid of hydration inefficiencies)
by slightly changing our mindset?

The idea here is using **components' streaming**, which is possible with React Server Components (RSC).
RSC are components that are truly server-side, meaning no rendering on a client is required.
They can be nested inside other server side components,
but also inside client components (!).
But what is even more interesting,
they are distributed asynchronously,
what we call as **components streaming**.

### On-demand streaming for client components

So if we have a page that has already been loaded,
but we want to implement some interactive, data-dependent action,
like loading more stuff,
or replacing some view without routing (changing the site or
[path](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)),
then inside the client component we can now wrap a server component with the `Suspense`,
and pre-rendered server component will be streamed as `text/x-component`.
This format is not pure HTML, but it contains all the required information about the component's structure,
and it's position inside the whole document,
so it can be immediately mounted, **without redundant, client side render**.

That was interesting, though our initial pain point was the first render, right?
So let's see what can we do about it with RSC.

### Incremental first load for server components

Consider this: requested page consists of some content that is basically static,
but also some content that needs to be fetched from some other resources like DBs, APIs etc.

There might be many things in many places on our page to fetch,
and they may vary in terms of the latency.

As a result, in classical SSR, the requested page is as slow as the slowest piece🐌

But in Next v13+ it doesn't have to be that way.

The idea is, that the requested page might be rendered in chunks,
so client receives 'fast pieces' first (and those might be interactive, ready for usage),
and 'slower pieces' will arrive eventually later.
One just needs to remember about wrapping each component with `Suspense`.

Regarding the data format — just like with on-demand streaming — it's not a pure HTML.
However, it's not `text/x-component` either.
Here, it rather takes advantage of the fact,
that the browser can render HTML even if the whole document is not yet fetched.
You can take a look at `Transfer-Encoding` header, and you will see that it's `chunked`.

Brilliant, isn't it?
And like I stated in the beginning: not a brand-new idea, but it's not reinventing PHP either.
If you want to check my super simple examples for streaming components,
then you can find it [here](https://github.com/frankiewiczkamil/next-exercises).
It covers both scenarios that I've mentioned above,
however please keep in mind that official support for on-demand streaming is slightly limited.
I've described that
[here](../../../blog/next-ssr-limitations/),
and my examples contain a workaround proposal for that.

We have covered the fetching part,
so we can now take a look at flip-side,
and see if there was introduced anything innovative to sending as well.

### Mutations

In previous sections we learned, that for read operations we can trade the flexibility of REST API,
and in turn get some significant gains in performance, so in consequence also in UX.
However, I would say that there are some benefits in terms DX involved as well,
as we don't need to manage so much state required for data fetching.
I suppose that we might call it reducing the accidental, technical complexity,
which is SPA's (or maybe even: AJAX) inherent consequence.

I think that for write operations, it's even more about DX, and this is due the new feature called **actions**.
So with actions we are not using REST as well,
but rather we reuse an established technique, which is submittable forms.
Actually, one doesn't even have to use a form, as actions exist in two flavors — with or without forms —
but the big idea of submitting the data to current URL (like with forms) remains.

Obviously, one might think now:
I see no benefit out of it at this point,
so why would I even want to abandon my beloved REST endpoints for some ancient pattern?
Well, imagine that you don't have to expose an endpoint for any modification operation,
and that you can simply call a function in client component,
that will perform all necessary network calls for you.
Yeah, sort of like RPC. So this is exactly what actions give you.

## Reflections

Of course, in next v13+ one is still able to do things in SPA way,
like using REST APIs for reads and writes,
but new features seem simpler and more efficient,
so it looks like a good set of defaults.

I'm happy that we finally reached this point,
where we were able to see a bigger picture,
fill the gaps, and reuse some old ideas instead of creating another/new,
hype-driven solution, focused on one, particular use case.

### Challenges

So is it all sunshine and rainbows now?
Like always — of course not.

First of all, since it's adding features, it's arguably more complex by definition, because of the choice itself.
I think this is why authors decided to change the library's API.
The default router is now structure based, and there are no longer `getServerSideProps` and `getStaticProps`.
I leave it to you to decide if new API is simpler or not, but from what I've seen so far, people tend to like it.

You might also already have heard about potential security risks,
especially in the context of
[example showed during the next.js conf ](https://youtu.be/9CN9RCzznZc?list=PLBnKlKpPeagl57K9bCw_IXShWQXePnXjY&t=939)
that became a viral.
Many people joked about it, many memes were created,
but most of them were missing the point — it was showing the feature in the simplest possible form.
So jokes regarding bad architecture (calling DB directly in upper layer) were unfair, as it was not the point.
Moreover, accusations and mockery about SQL injection were just ignorant,
as even though it was not using parametrized query,
there was a template string, which effectively does something similar —
it splits arguments, and redundant, potentially dangerous part is simply ignored
You can learn more about this particular situation [here](https://youtu.be/2Ggf45daK7k?t=75).

But indeed, there is a challenge here, as without clear separation in homogenous SSR apps,
we need to be more careful.
But there are already some good news for you — react already brings something called
[taints](https://react.dev/reference/react/experimental_taintObjectReference),
that should help enforcing security by marking an object as server-only.
That's cool, but I think this problem can (or even: should) be also handled on the architectural/design level.
More on that in Opportunities section.

### Opportunities

We already learned about all the benefits related to performance gains,
seamless developer experience, etc.

But there is one more thing that I'd like to point out here.
And I think it's related to security risks I've mentioned in previous section.
There is a
[famous anecdote about chinese word for 'crisis'](https://en.wikipedia.org/wiki/Chinese_word_for_%22crisis%22),
which — in a nutshell — says that crisis is an opportunity.

And I think it's true here.
We have an opportunity to re-think how we organize our business logic implementation in node.js apps.
I think, that actions as **another** entry point is a great opportunity to re-think architecture for people,
who used to have only one entry point before — REST API.

There are plenty of options here, depending on one's preferences and needs.
I've already mentioned the anemic model situation, and this is where I see a potential for improvement.
I think that extracting shared logic into a separate being might push devs to think more about the verbs,
and less about the nouns.
Or in wider terms: more about the features, business and domain, less about the data.

I've performed such exercise myself, you can find it [here](https://github.com/frankiewiczkamil/do-gather).

## Summary

I think that next v13+ is a big step forward.
Not because of the new features or API changes,
but rather because it fills some of the gaps in the existing ecosystem.

It also has a potential to change the way we think about web apps architecture,
and I hope this trend will be adopted by other frameworks as well.

And to be honest, I know that this, or a similar idea is already present in other frameworks,
like [hotwire](https://hotwired.dev/) and [liveview](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html),
but I think that next.js is the first one that brings it to the mainstream.
Moreover, it does it from a different angle, as hotwire and liveview are ruby and elixir based,
respectively, and it has some technical implications in terms of achieving seamless experience.

What is more, those frameworks that I've just mentioned,
together with [island architecture](https://docs.astro.build/en/concepts/islands/)
([astro](https://docs.astro.build/), [fresh](https://fresh.deno.dev/)),
[qwik](https://qwik.builder.io/)
and [solid start](https://start.solidjs.com/getting-started/what-is-solidstart)
are to me like a broader trend in web development.
I see it as an attempt, to make our tools well suited to our needs: sharper and finer-grained.
I think that it's a good direction, and I'm looking forward to see how it will evolve.

Moreover, I believe that asking questions might let us rethink even more fundamental concepts,
like data flow, data ownership, who and when is responsible for ensuring invariants consistency.

I myself keep my fingers crossed for local-first movement,
which might look as something contradictory and incompatible with server-centric approach,
but to me it is rather a complementary piece.
After all, the goal is finding the best solution,
and the way to achieve that is using best suited tools and building bridges between them✌️

Thank you for reading, and see you next time 🖖

[^1]:
    In some cases it might make sense to have logic at frontend —
    like in local-first apps,
    but the point is that invariants shall be verified in appropriate place,
    which would be the server in most cases
