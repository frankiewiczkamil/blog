---
layout: ../../layouts/post/PostLayout.astro
title: State modification in functional components without sacrificing the performance
publishedAt: '2022-12-14'
editedAt: '2022-12-16'
description: How to change state in functional components without sacrificing performance
author: kpf
tags: ['functional component', 'class component', 'hooks', 'useState', 'reducer', 'howto', 'render', 'performance', 'react']
image: 
    url: /img/rocket-launch.webp
    alt: rocket launch
---
## Introduction

I remember the first time when I heard about react. It was almost 10 years ago and at that time I was using a state-of-the-art library: angular.js. 

Angular.js (aka angular v1) is a two-way data binding library. It seemed cool at first, but I've encountered several kinds of problems while using it. The most painful were:
 - debugging issues, and
 - poor performance

In this circumstances, I was very intrigued by the promise of extraordinary performance and simplicity that this new library was advertised as. Then react native was announced which made me even more curious.

Sometime later an opportunity to use it finally came: a new project - a set of video-related apps for various platforms, including 2x web, android and apple devices. We already had some experience in that domain and we knew, that performance is crucial here. We picked react of course, because 'react is super fast'. Except it wasn't. At least not until we learned how to use it properly.

One may ask now: so why it wasn't fast from the beginning?
And my answer would be: because we were not preventing unnecessary renders.

## When does it render

Quick reminder: react is one-way data binding library, that detects DOM elements that need to be updated by *comparing* tracked data (state and props of a component). In other words, the rule is more or less that the component is rendered when:
 - props have changed [^1], and/or
 - state has changed [^1],  and/or
 - parent component has changed and will be re-rendered [^2]


Now we need to understand, that the comparison that is performed is **shallow** - reference only, so:
```javascript
{} === {} // false
```
What about callbacks, that we want to use in our components then? Well, functions are first class citizens in js, so the same rules apply here:
 ```javascript
(x => x) === (x => x) // false
 ```


So if we pass a callback as a prop, it will cause a re-render everytime function reference changes.
And this is not a big deal in class components, because classes have **methods**, and method reference does not change. Of course, there is a `this` caveat, so one needs to either bind the method or use a (misleading) arrow syntax for methods instead of using anonymous functions because the latter changes reference as we have already seen above. That's something I've learned quite quickly, easy-peasy.

Now, what about functional components? Functions don't have methods, but since v16.8 we have hooks, that should serve more or less the same purpose as methods (including those extended from `Component` class). In particular, there is a `useState`, which returns a handle to mutating callback function. The reference of this function doesn't change - cool, we are safe. But are we? Sometimes we want to encapsulate some logic that will decide *what* to save, instead of passing down the state and callback to the child component. And in such situations we have to create an anonymous function, thus, a new reference. But one might say now: that's fine, we have `useCallback` that is capable of memoizing a reference, by ignoring every change on a state value not defined as a dependency. 

And that is true, but we might need this value in our callback, and in such case reference **will** change, sot the effect will remain the same: unnecessary renders.

But is this really a problem? A reference to a callback will change when the previous callback performs the state change that we are interested in, right? 
Yes and no. In some situations, the prop that we need in a child component can be some sort of a derivate of our state, or even we might not need this state at all. In such cases, there is no need to re-render the child every time parent's state has changed, but we can't avoid it due to the limitation that I've pointed out.

I guess it might be a little confusing at this point, so let's consider an example: there is a container (aka 'smart component') with a state, containing a 'dumb' component that uses some callback from its parent - container. 

It may look like this:
```javascript
function Container(_props) {
  const [count, setCount] = useState(0);
  const increase = () => setCount(count + 1); // <- create new instance on every run (!)
  const isUnder10 = count < 10; // <- primitive type, new value after 10 calls ☝️
  return <MemoizedComponent isUnder10={isUnder10} increase={increase} />;
}

const MemoizedComponent = memo(ChildComponent);
function ChildComponent(props: { isUnder10: boolean; increase: MouseEventHandler<HTMLButtonElement>; }) {
  console.log("render child component", props.isUnder10);
  return (
    <>
        {props.isUnder10 ? <div>under 10 </div> : <div>above 10 </div>}
        <button onClick={props.increase}>increment</button>
    </>
  );
}

```

In this situation `isUnder10` is clearly a derivate of the state itself, thus it will change only once - when 10 is reached. But the callback on the other hand is changing all the time.
So what can we do about it? There are several techniques. 

## Solutions

If one wants to stick to the `useState` without introducing new stuff, then I know two workarounds that can be used. 

The first one artificially keeps the prepends the callback reference

```javascript
let currentIncreaseCallback = () => {
};

// this reference does not change
const increaseRef = () => currentIncreaseCallback();

export function Container(_props) {
  const [count, setCount] = useState(0);
  currentIncreaseCallback = () => setCount(count + 1);
  const isUnder10 = count < 10;
  return <MemoizedComponent isUnder10={isUnder10} increase={increaseRef} />;
  // ...
```

The second is similar - a container needs to refresh the current implementation of an increase function, but this time it is not even passed as a prop - it can be accessed if it's defined in the same scope

```javascript
let currentIncreaseCallback = () => {
};

// this reference does not change
const increaseRef = () => currentIncreaseCallback();

function Container(_props) {
  const [count, setCount] = useState(0);
  currentIncreaseCallback = () => setCount(count + 1);
  const isUnder10 = count < 10;
  return <MemoizedComponent isUnder10={isUnder10} />;
}

const MemoizedComponent = memo(ChildComponent);
function ChildComponent(props: { isUnder10: boolean }) {
  console.log("render component", props.isUnder10);
  return (
    <>
        {props.isUnder10 ? <p>under 10 </p> : <p>above 10 </p>}
        <button onClick={increaseRef}>increment</button>
    </>
  );
}

```

I don't like both ~solutions~ workarounds. I'm aware that components with a state are not true functions anymore and that's fine - container components have a state anyway. But this implementation smells and it's unreadable.

Can we do better? Sure, what would be the point of writing all this if there wasn't a solution ;)

So if we want to stick to the functional components, the easiest way that I can recommend is to mimic flux model with `useReducer` hook.
It may look like this:
```javascript
const initialState = 0;
const reducer = (state: number, _action: any) => state + 1;

function Container(_props) {
    const [count, dispatch] = useReducer(reducer, initialState);
    const under10 = count < 10;
    return <MemoizedComponent under10={under10} increase={dispatch} />;
}
// ...
```

It requires defining stuff outside the component, but the reader expects that and there are no weird mutations to ~hack~ keep the callback reference. 

Is that all? I guess not - most likely there are more solutions/workarounds, but I'd like to mention one that uses hooks. Some time ago I asked the internet to check if someone has already written it, and I found a solution that was using a custom hook with `useRef` and `useCallback` inside (unfortunately I can't find this post anymore to link it here). 

To make it as simple as possible I'll present this idea here without the additional, generic hook, but you can find it [on my github](https://github.com/frankiewiczkamil/react-performance-kata/blob/main/packages/react-18/src/StateHookExample3.tsx) 

```javascript
function Container(_props) {
  const [count, setCount] = useState(0);
  const isUnder10 = count < 10
  const increase = () => setCount(count + 1);
  const callbackRef = useRef(increase);
  callbackRef.current = increase;
  const memoizedIncrease = useCallback(() => callbackRef.current(), []);
  return <MemoizedComponent isUnder10={isUnder10} increase={increase} />;
}
```
If you think about it, this solution follows very similar idea to the first two examples (the ugly ones), but it's using only hooks. 

You may also wonder, if useCallback is required here. In fact I was playing with useRef alone before I found this ☝️ solution, but it didn't work me. 

```javascript
function Container(_props) {
  const [count, setCount] = useState(0);
  const increase = () => {
    // count remains the same: 0, an initial value
    () => setCount(count + 1);
  };
  const increaseRef = useRef(increase);  
  increaseRef.current = increase;
  const isUnder10 = count < 10;
  return <MemoizedComponent isUnder10={isUnder10} increase={increaseRef} />;
}
```
I guess it is due it's not entirely inline with [hook rules hooks](https://reactjs.org/docs/hooks-rules.html).

## Conclusion
I think that our winners are `useRef` + `useCallback` and the one with `useReducer`, though , I prefer the latter. 

And of course, all this fuss is about a **very** niche use case, where one wants to avoid **every** unnecessary render. But in such case it would likely be better to invest the time into a better tool for the job, like [solid.js](https://www.solidjs.com/) or [svelte](https://svelte.dev/). 

---
[^1]: unless prevented by using: `shouldComponentUpdate()`
[^2]: unless prevented by using on of: `PureComponent`, `memo()`, `shouldComponentUpdate()`