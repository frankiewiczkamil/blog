---
title: 'Limitations of next.js SSR'
publishedAt: 2024-06-27
editedAt: 2024-07-03
description: 'Components interleaving limitations'
author: kpf
tags:
  ['component streaming', 'components interleaving', 'ssr', 'server side rendering', 'next.js', 'react', 'client side rendering']
image:
  url: layered-cake
  alt: 🍰
draft: false
---

The 13th generation of next was advertised as an ultimate solution,
that among other things will make it possible to mix client and server components freely.
I've tried it and even described my experience in
[this article](../../../blog/ssr-strikes-back/) from December 2023.
At that point, I've noticed that there are some strange warnings,
but I didn't pay attention, as it seemed like some minor issues to me.
However, when I tried it again in a commercial project,
I've found out, that the warning is quite important,
as it says that I'm attempting to do something that is _not supported_.

Here's an example of such a warning:

```text
clientWrapper.tsx:27 Warning: Cannot update a component (`Router`) while rendering a different component (`ClientWrapper`).
To locate the bad setState() call inside `ClientWrapper`,
follow the stack trace as described in https://reactjs.org/link/setstate-in-render
```

This problem appears when one calls the server component inside a client component, like that:

```js
function ClientComponent({ ServerComponent }) {
  return (
    <>
      <Suspense fallback={'loading'}>
        <ServerComponent />
        // or {ServerComponent()}
      </Suspense>
    </>
  );
}
```

The doc says, that the supported pattern is:

> _Passing Server Components to Client Components as Props_

However, it is true only if you call the component on a server,
and pass the result to the client component, like that:

```js
function ClientComponent({ serverComponentResult }) {
  return (
    <>
      <Suspense fallback={'loading'}>{serverComponentResult}</Suspense>
    </>
  );
}
```

It may seem like a minor issue at first glance, right?
What's the difference after all?
Well, so what about a server component, that requires props _from a client_?

There's already a topic for that
[at reddit](https://www.reddit.com/r/nextjs/comments/18qdk4s/how_to_pass_props_from_client_component_to_server/),
and it seems that majority agrees on using API instead, just like for SPAs.
You can of course use next's actions as well,
but it's an API meant for mutations, so for me, it seems even worse.

So I feel slightly disappointed,
as I was hoping for experience similar to Hotwire and LiveView,
so as a part of the famous _component streaming_ feature
I would be able to get a prerendered component from a server on a client side,
instead of calling API and doing all the dance.

So is it all lost?
Actually, I'm not so sure.
Let's take a step back for a minute.
I've already mentioned, that there's a warning, but still the thing _works_.

Moreover, I spent some time and managed to get rid of the warnings,
and also some other issues that I haven't mentioned here.
You can find the code [here](https://github.com/frankiewiczkamil/next-exercises/blob/main/app/clientWrapper.tsx).
I'm totally aware that it's ugly, just like any other workaround, but the point is that it still works,
which makes me think that maybe it _will_ be officially supported at some point in the future.

So I keep my fingers crossed,
so we can push the boundaries and write the code in a way that suits as best.

Cheers 🖖
