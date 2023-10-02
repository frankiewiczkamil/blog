---
title: Composable side effects
publishedAt: 2023-03-19
editedAt: 2023-03-20
description: 'Exploring the art of side effects handling: navigating trade-offs between DRY and complexity.'
author: kpf
tags: [ 'side effects', 'orchestrating', 'composable', 'async', 'redux', 'redux-saga' ]
image:
  url: /img/gears.webp
  placeholder: /img/gears-placeholder.webp
  alt: ⚙️⚙️⚙️
draft: false
---

# Context

Event driven libraries provide a sophisticated set of tools for dealing with async APIs. However, it can easily be overused. It is best to stick to the simplest
possible solution that meets the requirements. From such a perspective sending an event without any other reason beside triggering _one_ function seems to be a
pure overhead - decreasing readability and traceability without any clear benefit out of it.
This is usually the case for low level building blocks that perform one particular side effect. We use such fine grained functions for creating some higher
abstractions that coordinate stuff. It may look like this:

```typescript
async function coordinator() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2(result1);
    const result3 = await sideEffect3(result2);
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
}
```

We have a sequence of side effects, where output of effect can be input for the next one. Now let's try answer the question: is this implementation optimal?
Well, it depends.

# Heuristics

There are many reasons why we might consider our code as poorly designed and/or implemented, though I'd like to highlight two main classes of heuristics that I
see especially useful for rating our side effects orchestrators:

- implementation abstraction level, aka single level of abstraction principle (SLAP) - abstraction level in each function should be consistent, no mixing low
  level stuff with higher level implementation
- implementation reusability, aka don't repeat yourself (DRY)

In this post I'll use only examples for DRY heuristics, because it's easier to present it in a synthetic form and techniques that we will use for redesigning
and refactoring are more or less universal and can be applied regardless the reason.

# Techniques

## Conditionals vs polymorphism

Let's take an example where we have multiple coordinator functions for multiple use cases, like this:

```typescript
async function coordinatorDefault() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2(result1);
    const result3 = await sideEffect3(result2);
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
}

async function coordinatorX() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2X(result1); // 👈
    const result3 = await sideEffect3(result2);
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
}

async function coordinatorY() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2Y(result1); // 👈
    const result3 = await sideEffect3Y(result2); // 👈
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
    await sideEffect6Y(result4); // 👈
}
```

All those coordinator functions are similar, though there are some differences (pointed out).

So is it ok? If you ask me, usually it is, even in terms of DRY. Side effects are already encapsulated in separate functions. However, I bet that many reviewers
would claim that it is not DRY enough.
I understand, that in some cases it's worth to keep particular things in one place, for reasons similar to those for normalizing data in relational databases.
So let's discuss how to achieve that.

From my experience one can (too) often encounter a situation where DRY is achieved by using conditionals, like this:

```typescript
async function coordinator() {
    const result1 = await sideEffect1();
    let result2;
    if (X) {
        result2 = await sideEffect2X(result1);
    } else if (Y) {
        result2 = await sideEffect2Y(result1);
    } else {
        result2 = await sideEffect2(result1);
    }
    let result3 = await sideEffect3(result2);
else
    if (Y) {
        result3 = await sideEffect3Y(result2);
    } else {
        result3 = await sideEffect3(result2);
    }
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
    if (Y) {
        await sideEffect6Y(result4);
    }
}
```

Our example is simple, but I guess you already see or can imagine how complicated this approach may became when more and more features (conditionals!) will be
added. So if I had to choose one of those I would rather pick the first one, less DRY approach.
This is because I prefer to keep each scenario simple and clear, even if some parts are not as DRY as it could be. The reason for that is that this way it's
much easier to read, _maintain_ and _extend_ the code, because we can focus on a specific use case. It helps avoiding the bugs while introducing changes 💚

In fact using 'scenarios approach' is nothing new - in a nutshell it's a good, old strategy pattern, a polymorphic behavior well known in OOP world.

But what about DRY then? Keeping the logic understandable is far more important than _some_ repeating code, though using polymorphism (use case oriented)
approach doesn't mean that we can't have it. So let's talk about the techniques that we can use to achieve both things.

# Refactoring techniques

## Extracting a function

Our previous example wasn't complicated, but I'll use something even simpler in order to be precise while talking about refactoring techniques.

```typescript
async function coordinator() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2(result1);
    const result3 = await sideEffect3(result2); // 👈
    const result4 = await sideEffect4(result3); // 👈
    await sideEffect5(result4);
}
```

Let's assume that sideEffect2 and sideEffect3 are repeated in several scenarios _and/or_ those functions perform some significantly more detailed thing,
meaning: the level of abstraction is much lower than other calls in coordinator function.
Either way, we will solve that by extracting those side effects to another function, like this:

```typescript
async function coordinator() {
    const result1 = await sideEffect1();
    const result2 = await coordinatorLowerLevel(result1); // 👈
    const result3 = await sideEffect4(result2);
    await sideEffect5(result4);
}

// this function abstraction level is lower and/or it's a commonly used piece of code
async function coordinatorLowerLevel(input) {
    const result = await sideEffect2(input);
    const result2 = sideEffect3(result);
    return result2;
}
```

Easy peasy, we do that all the time. It's simple and very handy if we have a sequence of statements, meaning operations that must be called one after another.
DRY, use case oriented code without conditionals - cool.

However, as we already seen in our first example - life is rarely that simple. It is often the case that our side effects need to vary in multiple places, and
scenario intertwines a common (aka reusable) part with some more specific parts.

## Extracting a higher order function

Let's assume, that our reusable part includes: sideEffect1, sideEffect4 and sideEffect5 (first, last but one and the last one). Fortunately js/ts allows us
using higher order functions, so we can create a specific implementation factory like this:

```typescript
type InAndOut<T> = (arg: T) => Promise<T>;

function createSpecificImpl(sideEffect3Impl: InAndOut) {
    return async function reusableCoordinator() {
        const result1 = await sideEffect1();
        const result2 = await sideEffect2(result1);
        const result3 = await sideEffect3Impl(result2); // customized effect 💉
        const result4 = await sideEffect4(result3);
        await sideEffect5(result4);
    };
}

const coordinator = createSpecificImpl(sideEffect3);
```

Cool, huh? But what if things are slightly more complicated and we need more than one level of reusable logic and/or more than one piece of reusable code?

## Tricky cases - multiple nesting

Imagine, that there are 2 layers that we want to be extracted - sideEffect1+sideEffect5 and sideEffect2+sideEffect4

```typescript
async function coordinator() {
    const result1 = await sideEffect1(); // reusable 🍐
    const result2 = await sideEffect2(result1); // reusable 🍎
    const result3 = await sideEffect3(result2); // customized effect 💉
    const result4 = await sideEffect4(result3); // reusable 🍎
    await sideEffect5(result4); // reusable 🍐
}
```

Good news: to solve this one, we can use the very same technique:

```typescript
function createMiddleCoordinator(sideEffect3Impl: InAndOut) {
    return async function middleCoordinator(result1: number) {
        const result2 = await sideEffect2(result1);
        const result3 = await sideEffect3Impl(result2);
        const result4 = await sideEffect4(result3);
        return result4;
    };
}

function createOuter(nestedCoordinator: InAndOut) {
    return async function middleCoordinator() {
        const result1 = await sideEffect1();
        const result4 = await nestedCoordinator(result1);
        const result5 = await sideEffect5(result4);
    };
}

const coordinator = createOuter(createMiddleCoordinator(sideEffect3));
```

This example shows also one more thing: our reusable factories can be treated at the same time as dependencies and as common templates - createMiddleCoordinator
is a good example. It's sort of like a class that implements two interfaces, a duplex stream that can handle input and emit an output.

### Tip

If you are into fp and there are more functions that you need to extract and compose like this, then you can consider using also some helper operator to achieve
a better readability with point free style. Here are some examples from popular libraries:

```typescript
// lodash-fp flow
const coordinator = flow([
    createMiddleCoordinator,
    createOuter,
    // ...more higher order functions
])(sideEffect3);

// redux
const coordinator2 = compose(createOuter, createMiddleCoordinator)(sideEffect3);

// fpts
const coordinator2 = pipe(sideEffect3, createMiddleCoordinator, createOuter);
```

# Summary

We have learned that if we have many conditional statements in our side effects coordinators (orchestrators), then it's best to extract functions that represent
less complicated flows. This helps keep it maintainable. Then, if we need to make our code more DRY we can:

- extract functions that gather a sequence of side effects
- create factories (higher order functions) that will be used to create functions from a template with placeholders for 'moving parts', by injecting the custom
  side effects' implementations

All the examples here are using async-await, but I have also used this techniques to organize side effects with redux-saga and it served me well.
Moreover, I guess it might be also true and useful for some backend building blocks, like sagas, process managers and similar services that deal with
orchestrating side effects.
