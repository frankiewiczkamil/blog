---
title: State modification in functional components without sacrificing the performance
publishedAt: 2022-12-14
editedAt: 2023-09-30
description: How to change state in functional components without sacrificing performance
author: kpf
tags:
  [ 'functional component', 'class component', 'hooks', 'useState', 'reducer', 'howto', 'render', 'performance', 'react' ]
image:
  url: /img/rocket-launch.webp
  alt: 🚀 🚀 🚀
---

## Introduction

I remember the first time when I heard about `react`. It was almost 10 years ago and at that time I was using a state-of-the-art library: `Angular.js`.

`Angular.js` (aka angular v1) is a two-way data binding library.
It seemed cool at first, but I've encountered several kinds of problems while using it. The most painful were:

- debugging issues, and
- poor performance

In these circumstances, I was very intrigued by the promise of extraordinary performance and simplicity that this new library - react - was advertised as.
Then react native was announced which made me even more curious.

Sometime later an opportunity to use it seriously finally came: a new project - a set of video-related apps for various platforms, including 2x web, android and
apple devices.
We already had some experience in that domain, and we knew, that performance is crucial here.
We've picked react of course, because 'react is super fast'. Except it wasn't.
At least not until we learned how to use it properly.

One may ask now: so why it wasn't fast from the beginning?
And my answer would be: because we were not preventing unnecessary renders.

## When does it render

Quick reminder: `react` is one-way data binding library, that detects DOM elements that need to be updated by _comparing_ tracked data (state and props of a
component).
In other words, the rule is more or less that the component is rendered when:

- props have changed[^1], and/or
- state has changed[^1], and/or
- parent component has changed and will be re-rendered[^2]

However, we need to understand, that the comparison is **shallow** - reference only, so:

```javascript
({}) === ({}) // false
```

What about callbacks, that we want to use in our components then? Well, for new/anonymous functions it will work in a very same way:

```javascript
(x => x) === (x => x); // false
```

So if we pass a *new* callback as a prop, it will cause a re-render everytime function reference changes.
This becomes important in scenarios where we want to extract and encapsulate some logic in parent component and pass down only some callbacks and derivative of
a state (or even no state at all).

Let's take an example:

```javascript
class Container extends Component {
    constructor(props: Props) {
        super(props);
        this.state = {count: 0};
        this.increment = this.increment.bind(this);
    }

    increment() {
        this.setState({count: this.state.count + 1});
    }

    render() {
        return <Child
            increment={this.increment} // 👈 callback with a static reference - the class' method
            isBelowThreshold={this.state.count < THRESHOLD} // 👈 state's derivative, primitive type - new value after 10 calls ☝️
        />;
    }
}

const Child = memo(function ChildComponent(props: { isUnder10: boolean, increment: MouseEventHandler<HTMLButtonElement> }) {
    return (<>
        <div>{props.isUnder10 ? 'under' : 'above'} 10</div>
        <button onClick={props.increment}>increment</button>
    </>);
});

```

As we see, static references for callback-props is not a big deal in class components, because classes have **methods**, and methods' references do not change.
So as long as we use methods for callback props, we are safe. We just need to remember about an infamous `this` caveat[^3].

And that was something I've learned quite quickly, easy-peasy.

Now, what about functional components: can those serve as smart components too?
Functions don't have methods, but since `v16.8` we have hooks, that should cover more or less all the `Component` class features.

In particular, there is a `useState`, which returns a handle (callback) for mutating given state value.
If we were to implement a similar scenario as stated in previous listing, the simplest implementation would look like this:

```javascript
function Container(_props) {
    const [count, setCount] = useState(0);
    const increase = () => setCount(count + 1); // 👈 create new instance on every run (!)
    const isUnder10 = count < 10; // 👈 state's derivative, primitive type - new value after 10 calls ☝️
    return (<MemoizedComponent isUnder10={isUnder10} increase={increase}/>);
}
```

Unfortunately, it has the performance vulnerability, because callback's reference changes every time `Container` component renders.
One might say now: that's fine, we have `useCallback` that is capable of memoizing a reference.
That's true, but the callback requires the dependency array, thus a naive implementation would look like this:

```javascript
function Container(_props) {
    const [count, setCount] = useState(0);
    const increase = useCallback(() => setCount(count + 1), [count]); // 👈 creates a new instance on every count change
    const isUnder10 = count < 10; // 👈 state's derivative, primitive type - new value after 10 calls ☝️
    return (<MemoizedComponent isUnder10={isUnder10} increase={increase}/>);
}
```

It solves nothing in our case, due our callback depends on a state it is about to change.

So does it mean that hooks can't achieve the quality that classes have since the very beginning?
Fortunately, they can. 😊

There are several workarounds that I was using before I've found the one that is unquestionable number one.
You can find it at the [very end](#the-only-right-way-of-using-usestate), or you can check what other solutions, or rather: workarounds, I had to MacGyver
before I found the best one. 🫣

## Workarounds

There are many ways to achieve a static callback reference.
You might find all of them [here](https://github.com/frankiewiczkamil/react-performance-kata/tree/main/packages/react-18/src).
Some of them are really dizzy, but let me show a few here.

### Self made reference

The idea in this approach is to create a facade/wrapper with a static reference, that will call the real callback.
This way the real callback might be changed, while wrappers reference stays untouched.

```javascript
let currentIncreaseCallback = () => {
};

// this reference does not change
const increaseRef = () => currentIncreaseCallback();

function Container(_props) {
    const [count, setCount] = useState(0);
    currentIncreaseCallback = () => setCount(count + 1);
    const isUnder10 = count < 10;
    return (<MemoizedComponent isUnder10={isUnder10} increase={increaseRef}/>);
}
```

I bet you already see, that it has many downsides, where arguably the main one is that it would require some extra complexity if we were to have many child
components.

So let's see what can we do about it.

### React's `useCallback` + factory (closures)

The idea here is to create a function on the first run (empty dependencies array) and track the state somewhere else.

```javascript
function createFunctions(initialCount: number, setCount: Function) {
    let _count = initialCount; // closure
    return {
        increment: () => {
            _count++;
            setCount(_count);
        }
    };
}

function Container(_props) {
    const [count, setCount] = useState(0);
    const functions = createFunctions(count, setCount);
    const increment = useCallback(functions.increment, []);
    return (<MemoizedChildComponent isBelowThreshold={count < THRESHOLD} increment={increment}/>);
}
```

What's the problem here? It's not very readable and intuitive, for sure.
But there is one, even bigger issue:
the factory needs to be the only function responsible for state change, otherwise we will drive into inconsistent state situation.
Not acceptable.

### Hooks only

I guess you already see, that it would be best to stick to the hooks alone. We want to memoize the callback, but also keep the reference.
We have hooks for both, so let's see how we can make use of it.

```javascript
 function Container(_props) {
    const [count, setCount] = useState(0);
    const stateRef = useRef(count);
    stateRef.current = count; // it needs to be assigned here, outside useCallback in case sth else changes the state (consistency!)
    const increment = useCallback(function increment() {
        setCount(++stateRef.current);
    }, []);

    return (<MemoizedChildComponent isBelowThreshold={count < THRESHOLD} increment={increment}/>);
}
```

In this example we've defined the callback at first run, but the state is taken from a ref, which is updated on every run.

Seems solid, but not very readable.
But that's fine, we know what to do in situations like this: extract it to a new, custom hook. 😎

#### Custom hook made by combining `useRef` and `useCallback`

This is something that I've found sometime in the internet. Unfortunately I can't find that post anymore to link it here.

The tools we use are the very same as above, though since we want the solution to be generic, we rather put the whole callback to the `useRef` hook.

```javascript
const useCommand = (callback) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    return useCallback((...args) => callbackRef.current(...args), []);
};

function Container(_props) {
    const [count, setCount] = useState(0);
    const increment = useCommand(() => setCount(count + 1));
    return (<MemoizedChildComponent isBelowThreshold={count < THRESHOLD} increment={increment}/>);
}
```

In fact, you might find this approach quite similar in terms of the idea to the [first one](#self-made-reference), as
the idea is exactly the same. It's just we used slightly different tools.

We achieved the goal, the usage is more or less readable, but we needed to use at least 2 hooks and create a custom one to make it readable.
Do we have something even better, before we get to the best solution?

#### One hook: `useReducer`

Ever heard about `redux`? There is a hook that mimics the flux model that we can use, and it fits quite well in this case.

Just take a look:

```javascript
const reducer = (state: number, action: { type: 'INCREMENT' } | { type: 'DECREMENT' }) => state + (action.type === 'INCREMENT' ? 1 : -1);

function Container(_props) {
    const [count, dispatch] = useReducer(reducer, 0);
    const increment = useCallback(() => dispatch({type: 'INCREMENT'}), []);
    return (<MemoizedChildComponent isBelowThreshold={count < THRESHOLD} increment={increment}/>);
}

```

Interesting, huh? It's sort of CQRS-like technique rather than CRUD. Yes, it introduces some complexity. It shines in complicated scenarios, though.

I really like this solution, but I might be biased since I used to do a lot of `redux` in the past.

So, we have one hook, but on the other hande we had to slightly increase the complexity.

At this point, I must say that I'm amazed if you went this far. I mentioned at the very beginning, that there is a clear winner.
So without further ado, let's see it. 😊

### One hook: `useState`

I must confess something. I deliberately haven't mentioned one `useState`'s feature. In fact, I've just recently learnt about it, so please forgive me.

The thing is, most of the old examples one can find in the internet looks like this:

```javascript
const [count, setCount] = useState(0);
const increment = setCount(count + 1);
//...
increment(); // 1
```

However, in react v18 automatic batching has arrived. Thus, we cannot use `useState` like that anymore, because it would end up like this:

```javascript
const [count, setCount] = useState(0);
const increment = setCount(count + 1);
///...
increment(); // 1
increment(); // still 1, instead of 2 💩
```

And guess what: there is an alternative way of using `useState` from the very beginning, since hooks were introduced.
The one with *functions*.

Please take a look:

```javascript
const [count, setCount] = useState(0);
const increment = setCount(prev => prev + 1);
//...
increment(); // 1
increment(); // 2 💪
```

I guess you already see where it's going. Just like I did when I learnt about it.

So let's implement the efficient counter one last time.

### The only right way of using `useState`

```javascript
function Container(_props) {
    const [count, setCount] = useState(0);
    const increment = useCallback(() => setCount((prevCount) => prevCount + 1), []);
    return (<MemoizedChildComponent isBelowThreshold={count < THRESHOLD} increment={increment}/>);
}
```

Brilliant, isn't it?

That's true, that we needed to use 2 hooks here, but it's arguably still easier to comprehend for most people than `useReducer` (which I love 💚).
And to be honest, in class components we had a similar situation: we needed to be careful not to introduce an anonymous function.
So in terms of performance optimizations I can confidently call it a tie here.

I think that we should make it a habit to use a function argument while using `useState`'s setter instead of a value.
It is simply mandatory while using automatic batching.

## Conclusion

I've come a long way to discover that the best solution was right there all along, at my fingertips.
But I don't regret, as it was an interesting exercise and I think that I understand hooks better now.
Moreover, from my perspective `useReducer` might still be a better solution,
especially if one is already familiar with this technique and the complexity is not trivial from the start.

And of course, all this fuss is about a **very** niche use cases, where one wants to avoid **every** unnecessary render.
But in such case it might be also wise to consider a better tool for the job - with performance opt-in, like [solid.js](https://www.solidjs.com/)
or [svelte](https://svelte.dev/).

---

[^1]: unless prevented by using: `shouldComponentUpdate()`
[^2]: unless prevented by using on of: `PureComponent`, `memo()`, `shouldComponentUpdate()`
[^3]: in order to mitigate the `this` caveat one needs to either bind the method or use a (misleading) arrow syntax for methods instead of using anonymous
functions because the latter changes reference as we have already seen above.

