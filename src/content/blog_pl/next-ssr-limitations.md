---
title: 'Ograniczenia SSR w next.js'
publishedAt: 2024-06-27
editedAt: 2024-07-03
description: 'Ograniczenia przeplatania komponentów serwerowych i klienckich'
author: kpf
tags:
  ['component streaming', 'components mixing', 'components interleaving', 'ssr', 'server side rendering', 'next.js', 'next', 'react', 'client side rendering']
image:
  url: layered-cake
  alt: 🍰
draft: false
---

Trzynasta wersja nexta była reklamowana jako rozwiązanie kompletne,
w szczególności zacierająca granice między serwerowymi i klienckimi komponentami,
umożliwiająca ich dowolne przeplatanie.
Sam testowałem ją i opisałem swoje doświadczenia w
[tym poście](../../../blog/ssr-strikes-back/) z grudnia 2023.
Już wtedy zauważyłem, że w konsoli są jakieś nieznane mi warningi,
ale nie przejąłem się tym, bo zwykle tego typu ostrzeżenia to drobnostki łatwe i szybkie do naprawienia.

Jednakże, gdy wróciłem do tematu nieco później, w komercyjnym projekcie,
to przekonałem się, że tu ostrzeżenia przekazują nam coś istotniejszego,
bowiem mówią o użyciu API biblioteki w _niewspierany_ sposób.

Owe ostrzeżenia wyglądają mniej więcej tak:

```text
clientWrapper.tsx:27 Warning: Cannot update a component (`Router`) while rendering a different component (`ClientWrapper`).
To locate the bad setState() call inside `ClientWrapper`,
follow the stack trace as described in https://reactjs.org/link/setstate-in-render
```

A problem ów pojawia się, gdy próbujemy zawołać komponent serwerowy w komponencie klienckim jak poniżej:

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

Dokumentacja wspomina, że wspierane jest:

> _Passing Server Components to Client Components as Props_

Jednakże jest to prawdą jedynie wtedy,
gdy serwerowy komponent wołamy na serwerze i przekazujemy rezultat propsem do klienckiego komponentu, jak tu:

```js
function ClientComponent({ serverComponentResult }) {
  return (
    <>
      <Suspense fallback={'loading'}>{serverComponentResult}</Suspense>
    </>
  );
}
```

Wydaje się to jedynie drobnym ograniczeniem na pierwszy rzut oka, prawda?
Co za różnica?

Ano taka, że co wobec tego z serwerowym komponentem, który zależy propsów _z klienta_?

Powstał już zresztą na to topic
[na reddit'cie](https://www.reddit.com/r/nextjs/comments/18qdk4s/how_to_pass_props_from_client_component_to_server/)
i większość dyskutujących zdaje się zgadzać, że w tej sytuacji po prostu trzeba wołać API, jak w SPA.
Można nawet wołać nextowe akcje,
ale to API jest przecież pomyślane do mutowania, więc dla mnie to w pewnym sensie jeszcze gorsze rozwiązanie.

Czuję się więc nieco rozczarowany,
bo liczyłem na coś porównywalnego do możliwości Hotwire i LiveView,
gdzie w ramach wsparcia słynnego _strumieniowania komponentów_ (component streaming)
mógłbym dostać na kliencie wstępnie zrenderowany komponent, zamiast wołać endpoint itd.

Czy nadzieja umarła?
Właściwie, to nie jestem pewien.
Cofnijmy się na moment.
Jak już wspomniałem, jest warning, niemniej jakoś _działa_.

Co więcej, poświęciłem trochę czasu i udało mi się pozbyć tego ostrzeżenia,
jak i rozwiązać pewnie pomniejsze problemy,
które napotkałem używając API w niewspierany (rzekomo) sposób.

Można to znaleźć [tu](https://github.com/frankiewiczkamil/next-exercises/blob/main/app/clientWrapper.tsx).
Wiem, że kod jest paskudny (jak to workaround), ale fakt, że działa sprawia,
że myślę, czy może jest planowane oficjalne wsparcie dla tej funkcjonalności _w przyszłości_.

Trzymam za to kciuki,
bo jest to dla mnie element poszerzania granic,
a więc umożliwiania pisania kodu tak, jak nam to najlepiej pasuje.

Pozdro i do następnego 🖖
