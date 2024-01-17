---
title: Podsumowanie 2022 i plany na 2023
publishedAt: 2022-12-29
editedAt: 2022-12-30
description: 'Podsumowanie 2022 pod kątem technicznym. Rozwój, zdobyte doświadczenia, obserwacje i plany na 2023.'
author: kpf
tags: [ summary, '2022', '2023', plans ]
image:
  url: fireworks
  alt: 🍾🍾🍾
draft: false
---

## Wstęp

Rok 2022 był kolejnym dziwnym rokiem, z oczywistych powodów.
Interesuję się geopolityką i sprawami zagranicznymi już od jakiegoś czasu,
ale w tym roku stały się one moim głównym zajęciem po godzinach.
Nie skarżę się, ostatecznie mam dużo szczęścia, że to nie ja jestem bezpośrednio dotknięty wojną.
W każdym razie, musiało minąć trochę czasu nim udało mi się powrócić do moich "normalnych" zajęć po godzinach.

W tym poście opiszę, czego nauczyłem się w 2022 roku (zarówno w pracy, jak i poza nią - stąd ten wstęp),
oraz jakie cele wyznaczam sobie na 2023 rok.

## W pracy

### Java

To był mój kolejny rok przygód z reaktywnym programowaniem (_webflux_).
Napotkałem pewne problemy, które sprawiły, że stałem się bardziej pokorny wobec tego tematu.
Głównie wynika to z kwestii związanych z obsługą wielowątkowości i łączeniem reaktywnego kodu z blokującym kodem.
Kiedyś myślałem, że głównym "kosztem" funkcyjnego, reaktywnego kodu jest złożoność przypadkowa którą wprowadza -
logika biznesowa zaciemniona monadami i funkcyjnym żargonem.
Niestety, ale doświadczyłem, że jest o wiele więcej problemów, jeśli przypadki użycia nie wpasowują się dobrze.

Moja obecna rekomendacja to używanie stosu reaktywnego tylko dla usług o intensywnym wykorzystaniu wejścia-wyjścia,
takich jak proxy i inne serwisy typu _capabilities_.
Z drugiej strony zdecydowanie odradzam go w aplikacjach z logiką biznesową (poza prostą transformacją/przetwarzaniem),
zwłaszcza jeśli wymagane jest wsparcie dla transakcji i/lub zaawansowanych odwzorowań w ORM.

Jak już wspomniałem wcześniej, poświęciłem sporo czasu na rozwiązywanie problemów z wielowątkowością,
co związane było z wielokrotnym uruchamianiem testów.
Były to całe **godziny**, a to dlatego,
że domyślne podejście do aplikacji webowych Springa (i nie tylko) opiera się na architekturze warstwowej,
więc testowanie logiki biznesowej w warstwie serwisów wymaga ładowania kontekstu Springa i bazy danych w pamięci.
W takiej sytuacji można albo użyć stabilnego, ale wolnego rozwiązania, takiego jak test containers,
które zachowuje się dokładnie jak prawdziwa baza danych, albo zastosować alternatywną implementację repozytorium,
która używa bazy danych w pamięci (jak h2 lub nawet zwykła mapa).
To drugie jest szybsze, ale trudniej przetestować niektóre zachowania bazy danych, takie jak wycofywanie transakcji,
triggery bazodanowe itp.
Myślę, że prawdziwym problemem jest tutaj to jak rozwiązanie jest zaprojektowane i dla aplikacji z niebanalną logiką
biznesową warto rozważyć coś w rodzaju architektury heksagonalnej [^1] celem uniknięcia couplingu i uproszczenia testów.
Zastosowałem takie podejście w jednym z nowych serwisów,
który stworzylismy i bardzo mi to pomogło przy testowaniu logiki,
a dodatkowo ułatwiło podział pracy.

### Deno

Jednym z pierwszych zadań w 2022 roku było stworzenie POC dla nowego serwisu.
Wybrałem deno i muszę przyznać, że byłem zadowolony z developer experience.
Był to początek roku, więc
[przed ogłoszeniem wsparcia dla node packages](https://deno.land/manual@v1.17.0/npm_nodejs/compatibility_mode),
ale nie brakowało mi niczego -
było to więcej niż wystarczające do stworzenia serwera webowego z przyzwoitą obsługą bazy SQLite.

### React

W kontekście frontendu miałem kilka pomniejszych okazji do utrzymania kontaktu z reactem,
ale nie było to nic godnego wspomnienia tutaj.

### Python

Natrafiła się również okazja do użycia pythona, w końcu.
Była to lambda na AWS do batchowego przetwarzania danych, nic specjalnego.
Moje ogólne wrażenia były ok, ale kiedy później miałem do zrobienia jakieś skrypty,
to wciąż wybierałem bash lub typescript+deno w zależności od przypadku użycia.

## Po godzinach

### Elixir

Celem na pierwszą część roku było nauczenie się elixira.
Nazbierało się kilka powodów ku temu.
Najważniejszym z nich był oczywiście model aktorów.
Ponadto byłem bardzo ciekawy pewnych funkcjolaności i własciwości BEAM, a w szczególności:

- koncepcja jednego, spójnego narzędzia do obsługi różnych potrzeb - tu inspiracją
  była [tabelka zaprezentowana przez Sašę Jurića](https://www.youtube.com/watch?v=JvBT4XBdoUE&t=2266s),
- hot deployment

W ramach ćwiczenia zbudowałem
[prostą aplikację webową do zbierania metadanych o nowych odcinkach podcastów dostępnych na spotify](https://github.com/frankiewiczkamil/fomos),
gdzie jako warstwę persystencji użyłem narzędzia wbudowanego w BEAMa - [dets](https://www.erlang.org/doc/man/dets)
a całość oparłem o [phoenixa](https://www.phoenixframework.org/).
Moje wrażenia były bardzo pozytywne, choć nadal uważam,
że obecnie głównym przypadkiem użycia dla elixira są wysoko wydajne serwery webowe o charakterze
_convention over configuration_.
Czyli innymi słowy: wydajne railsy.

Było to bardzo ciekawe doświadczenie i **bardzo** podobała mi się praca z tym językiem.
Pisało mi się w nim bardzo naturalnie.
Trzymam kciuki za
[trwającą prace nad typami zbiorowymi (set-theoretic types)](https://twitter.com/josevalim/status/1577680998124470273),
ponieważ uważam, że _jakieś_ wsparcie typów jest niezbędne w nowoczesnym, dojrzałym języku,
a obecne wsparcie w elixirze nie jest wystarczające.

### Frontend/javascript

Jak wiemy, ten rok był pełen nowych pomysłów, projektów i wydarzeń w świecie JSa.
Odkryłem, że oprócz czytania podsumowań tygodniowych, kolejnym **świetnym** źródłem wiedzy jest Ryan Carniato z jego
[tygodniowymi sesjami na yt](https://www.youtube.com/@ryansolid/playlists) oraz jego
[profilem na twitterze](https://twitter.com/RyanCarniato).
Możecie go znać jako twórcę solid.js, ale robi on znacznie więcej.
Przypadła mi do gustu jego szczegółowa i bezstronna analiza,
pomogająca zrozumieć jakie są wyzwania nowoczesnego web developmentu i jakie są przypadki użycia dla react+next/remix,
solid.js i dla qwik.
Właściwie to przeczytałem i obejrzałem również jego starsze materiały i gorąco je polecam każdemu,
kto chce zrozumieć jak różnią się pomiędzy sobą biblioteki frontendowe i jakie są ich tradeoffy.

### Inne

Podobnie jak w poprzednich latach śledziłem duże konferencje, takie jak GOTO, Devoxx itp,
choć myślę, że najbardziej wpływowami nagraniami w tym roku były dla mnie pewne starsze nagrania Ricka Hickeya,
polecane przez
[Jakuba Neandera (aka Zaiste)](https://twitter.com/zaiste) w jego serii zrobionej wspólnie z
[Michałem Miszczyszynem (Type of Web)](https://typeofweb.com/)

- [Programistyczny Rozhowor](https://www.youtube.com/watch?v=4kPpfqJqgNg) (bardzo polecam).

Inną ciekawą perspektywą dla mnie był Brian Goetz wyjaśniający kierunek rozwoju Javy.
Wszyscy znamy tempo rozwoju tego języka 🐢,
ale dzięki tym nagraniom zacząłem bardziej doceniać pragmatyczne i stabilne podejście prezentowane przez twórców.
Jestem bardzo podekscytowany przyszłością projektu loom i adaptacją modelu _structurred concurrency_,
ponieważ stało się oczywiste, że potrzebujemy dobrych domyślnych rozwiązań dla serwisów wykorzystujących intensywnie IO.

## Plany na 2023

### Frontend

Chciałbym w 2023 roku porobić więcej przy frontendzie, choć jeszcze nie jestem pewien jakich rozwiązań spróbuję.
Myślę, że powinienem poznać nowe możliwości renderowania po stronie serwera, takie jak
[render as you fetch](https://17.reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense).

Ponadto chciałbym zrobić coś używając solid.js, ponieważ jestem bardzo ciekawy czy wydajność jest tam tak dobra,
jak się o niej mówi - mam trochę doświadczenia w tuningu react+redux, więc byłoby to ciekawe porównanie.
Oczywiście będę też używał (uczył się) astro do tego bloga.

### Backend

Jest wspominany projekt loom, który muszę wypróbować,
ale poza tym chciałbym skupić się bardziej nieco bardziej wysokopoziomowych koncpetach,
więc najprawdopodobniej będę doczytywał o DDD.
Może spróbuję też clojure, bo słyszałem o nim tyle dobrego,
a jak wspomniałem wcześniej Rick Hickey - twórca tego języka - sprawił, że zacząłem inaczej patrzeć na pewne sprawy.
Jestem pod wrażeniem jego diagnoz i prostoty którą proponuje, przez co jestem zaintrygowany do tego stopnia,
że muszę spróbować jego narzędzi.

### ...i

**Niech moc będzie z wami, szczęśliwego Nowego Roku!** 🥂

[^1]: znanej również jako architektura portów i adapterów i bardzo podobnej do _onion architecture_ wujka Boba (aż dziw,
że nie zrobiła kariery w naszym kraju 🧅)
