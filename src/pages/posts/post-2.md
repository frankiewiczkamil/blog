---
layout: ../../layouts/post/PostLayout.astro
title: State modification in function components without sacrificing the performance
publishedAt: 2022-12-15
# editedAt: 2022-12-?
description: How to change state in function components without sacrificing performance
author: kpf
tags: ['function component', 'class component', 'hooks', 'useState', 'reducer', 'howto', 'render', 'performance', 'react']
# image: 
#     url: /img/.jpg
---

## Introduction: react as a fast library for DOM manipulation
I remember the first time when I've heard about react. It was almost 10 years ago and at that time I was using state-of-the-art library: angular.js. Angular.js (aka angular v1) was using the concept of two way data binding. It seemed cool at first, but it had several problems that I've encountered while using it. The most painfull in our work were:
 - debugging issues
 - poor performance

In this circumstances I was very intrigued by the promise of extraordinary performance and simplicity that this new library was adversided as. Then react native was announced which made me even more curious.

Some time later an opportunity to use it finally came: a new project - set of apps for video consuming on various platforms, including 2x web, android and apple devices. We already had some experience in that domain and we knew, that performance is crucial here. We picked react of course, because 'react is super fast'. Except it wasn't. At least not until we learned how to use it properly.

One may ask now: so why it wasn't fast from the beginning?
And my answer would be: because we were not preventing unnecessary renders.

## React performance gotchas


Quick reminder: react is one way data binding library, that detects DOM elements which need to be updated by *comparing* tracked data (state and props of a component). In other words, the rule is more or less that the component is rendered when1:
 - props have changed, and/or
 - state has changed,  and/or
 - parent component has changed and will be re-rendered


Now we need to understand, that the comparison that is performed is *shallow* - reference only, so `{} !== {}`. This is something that we learned quite quickly.
What about callbacks, that we want to use in our components then? Well, functions are first class citizens in js, so the same rules apply here as well: `() => {} !== () => {}`. 
So if we pass a callback that performs state changes (or anything else), it causes a re-render if function reference changes.
And this is not a big deal in class components, because classes have *methods*, and method reference does not change. Of course, there is a _this_ pitfall, so one needs to either bind the method or use a (misleading) arrow syntax for methods instead of wrapping in annonymous functions, because the latter changes reference like it was described above.

However, in function component we don't have methods.  In function components we have hooks, in particular `useState`, which returns a handle to mutating callback function. And guess what: the reference of the function changes on every component call, `useCallback` can't help here. 

Now, one might ask: is this really a problem? The reference to callback will change when the previous callback performs state change, right? 
Right, but that's *not* the only case. In some situations, child component uses a callback from its parent, but does not use a state or uses only a state derivate, meaning there is no need to rerender the child every time parent's state changed. Moreover, a component that defines `useState`'s callback may be re-rendered for reasons not related with this particular state (it can be some other state it has or some props that changed or parent re-render) 

Consider this example: there is a container (aka 'smart component') with a state, containing a 'dumb' component that uses some callback from it's parent - container. 

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

In this situation `isUnder10` is clearly a derivate of state itself, thus it will change only once - when 10 is reached. But the callback on the otherhand is changing all the time.
So what can we do about it? There are severals techniques. 

## Solutions

If one wants to stick to the `useState` without introducing new stuff, then I know two workarounds that can be used. 

First one artificially keeps the prepends the callback reference

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

The second is similar - container needs to refresh current implementation of a increase function, but this time it is not even passed as a prop - it can be accessed if it's defined in the same scope

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

So if we want to stick to the function components, the easiest way that I can recommend is to mimic flux model with `useReducer` hook.
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

It requires defining stuff outside component, but the reader expects that and there are no weird mutations to ~hack~ keep the callback reference. 

Is that all? I guess not - most likely there are more solutions/workarounds, but I'd like to mention one - a custom hook. Sometime ago I asked the internet to check if someone has already written it, and I found a solution that looks more or less like this:

```javascript
type Callback = (...args: unknown[]) => unknown;
type UseCommand = (callback: Callback) => Callback;
const useCommand: UseCommand = (callback) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback((...args) => callbackRef.current(...args), []);
};


function Container(_props) {
  const [count, setCount] = useState(0);
  const isUnder10 = count < 10
  const increase = useCommand(() => setCount(count + 1));
  return <MemoizedComponent isUnder10={isUnder10} increase={increase} />;
}
```

I'll try to link the post that inspired me when I'll find it. The point is we have here something like `useCallback`, but working together with `useState`'s setter 🎉

