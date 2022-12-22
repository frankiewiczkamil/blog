---
layout: ../../layouts/post/PostLayout.astro
title: Should I use redux-saga in 2023?
publishedAt: '2022-12-22'
# editedAt: 2022-12-?
description: State management solutions landscape in 2023 and how does it affect adoption of redux and redux-saga in particular  
author: kpf
tags: ['redux', 'redux-saga', 'side effects', 'middleware', 'saga', 'x-state']
image: 
    url: /img/runes.webp
    alt: runes
draft: false
---
## Introduction
The first version of redux library was released in 2015, and it quickly became a de facto standard for state management in react projects. There are several reasons for that, but I think that the most important one were:
- react missed a handy (and efficient) tool for propagating the state to deeply nested components - context API was unstable at that time and hooks (`useReducer` in particular) were introduced much later
- redux' ability to plug in middleware, which allows handling all sorts of cross cutting concerns and side effects by intercepting actions before and even after reducer is called, meaning it's something more than 'just' the implementation of then _chain of responsibility_ pattern which is commonly used in web servers (think about middleware in node.js, filters in java ee etc)

It's almost 2023 while I'm writing it, and it seems both: context API and hooks became a default for most of react projects. This is because together they solve the problem of propagating the state to (deeply) nested components. But how about middleware feature - is it covered by react built-in features? 

AFAIK it is not, and there is a good reason for that - in react a component is the core, so if one needs to perform some side effects, then hooks or lifecycle methods is the solution.
It is enough for most applications, but my goal in this post is to show you the reasons for which you might still considering picking up redux with redux-saga (or similar middleware).

## What is saga
[Redux-saga](https://redux-saga.js.org/) is one of the most popular middlewares for managing side effects in redux ecosystem - for the time I am writing it, according to npm-trends it has around 1 million downloads a day. For a comparison: redux-thunk has around 2 times more, and redux-observable 5 times less. I must admit though, that it reached that level in 2021 and it more or less stays that way. I have some ideas why is that but I'll share it in a summary. 

The idea behind the project is tightly related to its name - saga is a commonly used [pattern](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) for events orchestration, similar to process-manager. So basically it is about grouping a sequence of related events into a construct, that is responsible for coordinating the whole process step by step, and deal with the errors if there are any [^1].
I think redux-saga is a quite accurate name, because the library provides a powerful API for listening and coordinating events (or actions if you will), just like in the saga pattern.

But enough with this chronicles stuff, let's see what does it offer and if it's worth it.

## What is saga good for
Generally speaking: orchestrating all kinds of side effects, especially those _async_. But to be more precise I'm gonna point out some more concrete use cases:
- managing step based processes - think about forms splitted into multiple steps, like: _shopping card_ ➝ _shipping_ ➝ _payment_ ➝ _status_
- integrating all sorts of 3rd party APIs (plugins, libraries etc), like: players, maps, visualisations, chats etc. All this is possible, because beside listening on redux events, saga is capable of integrating other sources of events through a feature called `channels`.
- spawning background processes to deal with things like deleting old data, fetching actual data, sending heartbeats, refreshing tokens, etc. This is especially useful for SPAs and react native apps, mainly because of a longer lifecycle of such applications
- improving performance, by providing a handle for calling something __without__ touching the state (no renders!) - one might even skip dispatching the redux action to avoid calling reducers by using another type of _channels_, and call a dispatch function _after_ performing some operations defined in the saga. Think about some intensive streams of user inputs, like scrolling, deleting text etc

It is worth to mention here, that the code created with saga is **readable**, because of it's imperative nature and lack of artificial types (like observables). One may argue that observables are also readable **if** one knows how to use functional programming in its reactive flavor. Yeah, maybe, but from my experience it's a bad idea to assume that every team member is (or will be) fluent in this style of programming. Perhaps I'll write another post on that in the future.

Lastly, I have one more observation: due to the flexibility that was already mentioned, the library allows to mimic different async models, like: pub-sub (of course), channels, structured concurrency or even the actor model without introducing new toys. 

## Is it worth it?

I hope that I proved that redux-saga can be still useful, though is it the only library capable of performing this sort of stuff? The honest answer is **no**. I used to work with redux-saga a lot, and I think it's really powerful, however AFAIK most of the use cases I've described in previous section can be also covered in this quite new, built-in redux toolkit feature called [listener](https://redux-toolkit.js.org/api/createListenerMiddleware). Moreover, if one wants to try a decentralized state management, it might be a good idea to try [x-state](https://xstate.js.org) - a library implementing the _finite state machines_ pattern. According to npm-trends it has recently overtake redux-saga in terms of popularity, and I suspect it is one of the reasons of redux-saga stagnation. Fun fact: one of the core members in x-state used to be a redux-saga maintainer.

That being said, I think redux-saga **is still a very good library to try**, because even if it's not the hottest one (anymore), it still has an elegant, simple[^2], and flexible API that can help develop your skills and understanding of advanced async techniques. 

---
[^1]: It is called _compensating action_ and it serves similar purpose as a rollback. In it's essence it works like a _contra entry_ from the finance world (aka _storno_ in some languages)
[^2]: remember: simple != easy


