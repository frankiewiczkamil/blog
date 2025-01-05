---
title: Podsumowanie 2024
publishedAt: 2025-01-04
description: 'Moje podsumowanie 2024: rozwój, zdobyte doświadczenia, obserwacje i plany na 2025.'
author: kpf
tags: [ summary, '2024', '2025', plans ]
image:
  url: '2024_2025'
  alt: 🍾🍾🍾
draft: false
---

## 2024

Z mojej perspektywy 2024 był przede wszystkim rozwinięciem zjawisk,
które mniej lub bardziej widoczne były w latach ubiegłych.
Mam tu na myśli głównie:

- kryzys finansowania w branży IT, w szczególności dalsze fale zwolnień
- ekspansja AI
- przetasowania w świecie front-endu, czy raczej należałoby powiedzieć: w świecie web'a

Sądzę, że to jak kryzys i AI wpływają na siebie, jest na tyle wielowymiarowe,
że nie jestem w stanie rzetelnie przeanalizować i opisać tego zjawiska.
Uchylę się więc od perorowania na temat dwóch pierwszych punktów.

Co zaś do trzeciego punktu, to był to dla mnie to ciekawy rok,
bowiem wydaje mi się, że mamy (wciąż) do czynienia z eksperymentami i podważaniem status quo,
które przez ładnych parę lat (nieco upraszczając) sprowadzało się do tego, że
_niemal każdy_ nowy projekt to SPA w react/angular/vue korzystające z REST API i/lub graphql.

Mam jednak nadzieję, że rozdrobnienie i ferment intelektualny,
jaki obecnie obserwujemy, nie doprowadzą do zwyciężania i dominacji kolejnej mody,
ale raczej do uświadomienia programistom i architektom, że mamy do czynienia z różnymi problemami, które wymagają
różnych podejść.

Powiem więcej: w pewnych przypadkach SPA jest nadal najbardziej uzasadnionym wyborem.
Mam tu na myśli ***faktyczne*** _aplikacje webowe_, czyli strony, które są mocno interaktywne i częstokroć muszą wspierać tryb offline.
Takie wymagania mogą rodzić problemy związane z synchronizacją danych i tu dochodzimy do ruchu _local-first_.

Latem tego roku eksplorowałem trochę ten temat i muszę powiedzieć, że dzieje się tam sporo ciekawych rzeczy.
Mamy mnóstwo narzędzi, począwszy od tych nisko-poziomowych, pomagających w synchronizacji danych 
([Y.js](https://yjs.dev/), 
[Automerge](https://automerge.org/),
[Loro](https://loro.dev/)),
poprzez takie skoncentrowane na podzbiorze zagadnień (np. storage + podstawowy mechanizm synchronizacji),
a skończywszy na "wszystkomających" kombajnach.
Było to również pretekstem do pochylenia się nad nieco bardziej teoretycznymi zagadnieniami kluczowymi do realizacji założeń LoFi,
takich jak [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) 
czy [zegary logiczne](https://en.wikipedia.org/wiki/Logical_clock).
Zainteresowanym temat stanu LoFi na 2024 polecam [odcinek syntax.fm na ten temat](https://www.youtube.com/watch?v=aKaSOVzquqA),
gdzie po krótce omówionych jest kilka popularnych narzędzi.

Po drugiej stronie tego podziału mamy oczywiście wszelkiej maści strony o charakterystyce dokumentów czy formularzy.
Szczęśliwie miałem okazję popracować w tym roku komercyjnie z next.js (13+). 
Bardzo mi się podoba elastyczność, jaką mamy do dyspozycji w tym rozwiązaniu.
Mam tu na myśli choćby dobór momentu renderowania (AOT podczas budowania lub JIT server-side/client-side),
wsparcie do wygodnego mutowania poprzez 
[akcje](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations),
czy wbudowane mechanizmy cache'owania. 
Z drugiej strony należy tu wszakże zauważyć, że tak potężne narzędzie może okazać się overkillem,
bo mniej wymagające interfejsy można z powodzeniem zrealizować przy użyciu prostszych narzędzi.
Więcej o tym w sekcji planów na 2025.

Z innych rzeczy wartych odnotowania związanych z trendami technologicznymi,
to poczyniłem pewne kroki w kierunku rozszerzenia mojej wiedzy na temat wbudowanych mechanizmów obsługi wielowątkowości w javie.
Czuję w tym obszarze braki, a wynika to głównie z tego, że stawiałem na rozwiązania na wyższym poziomie abstrakcji — 
aktory, reaktywne programowanie, itd.
Nadejście looma sprawiło jednak, że postanowiłem popracować również u fundamentów, czytając kultową już książkę Brian Goetz'a 
_Java Concurrency in Practice_. Temat w toku.

Z zupełnie innej beczki, niezwiązanej tak z najnowszymi trendami (choć to pewnie dyskusyjne),
postanowiłem w końcu poeksperymentować z [Nixem](https://nixos.org/).
Dokumentacja i materiały nadal nie są przesadnie przyjazne, 
ale w oparciu o artykuły, wpisy i cudze konfiguracje na githubie wyrzeźbiłem konfiguracje (tak, liczba mnoga) dla swoich urządzeń. 
Na razie tylko maci.
Potencjał płynący z deklaratywności i determinizmu jest ogromny,
więc planuję kontynuować tę przygodę pomimo trudności i chaosu, jaki moim zdaniem panuje w tym ekosystemie.
Być może pokuszę się nawet o podsumowanie na blogu swoich doświadczeń z narzędziami, których użyłem do tej pory.

Ostatnią zrealizowaną rzeczą, którą z kronikarskiego obowiązku wspomnę jest nauczenie się podstaw LaTeXa.
Podobnie jak w przypadku Nixa, korzyści płyną tu przede wszystkim z paradygmatu i większej idei stojącej za narzędziem,
bo w szczegółach kryją się pułapki i mnogość wyborów, których trzeba dokonać. 

## 2025

Do planów na 2025 zaliczam kontynuację eksperymentów z Nixem i nadrabiania zaległości w wielowątkowości w javie.
Dodatkowo chciałbym również popracować z HTMXem, jako prostą i efektywną alternatywą do wiodących, lecz złożonych narzędzi front-endowych.
Z tego, co wiem o tym rozwiązaniu, ma ono potencjał do wypełnienia segmentu prostych interfejsów, 
łatwych do napisania i utrzymywania przez backendowców.
Wydaje mi się, że kryzys i zacieranie się granic między front-endem a back-endem predestynują takie narzędzie do zwiększenia swojej popularności.

Nie zmierzam w tym roku planować więcej, bo sytuacja jest dynamiczna i chcę sobie zostawić miejsce na elastyczność.

Życzę sobie i Wam, żeby 2025 był równie inspirujący i pełen wyzwań jak 2024, 
ale jednocześnie powoli wprowadzał stabilizację i porządek tam, gdzie to możliwe.

✌️