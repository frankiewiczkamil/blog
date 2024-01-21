---
title: Podsumowanie 2023 i plany na 2024
publishedAt: 2024-01-21
description: 'Podsumowanie 2023 pod kątem technicznym. Rozwój, zdobyte doświadczenia, obserwacje i plany na 2023.'
author: kpf
tags: [ summary, '2023', '2024', plans ]
image:
  url: "2023_2024"
  alt: 🍾🍾🍾
draft: false
---

## 2023

Każdy kto obserwuje rynek IT wie, że 2023 nie był rokiem koniunktury znanej z lat poprzednich.
Sam mimo śledzenia portali branżowych nie zdawałem sobie do końca sprawy z tego, jak bardzo,
dopóki nie dotknęło to mnie samego.
Ale po kolei.

Już 2022 był pełen zawirowań.
Wiedząc o tym, postanowiłem w 2023 upiec 2 pieczenie na jednym ogniu:
zmienić projekt na bardziej stabilny a przy okazji również stos technologiczny.

Dołączyłem do zespołu utrzymującego SDK przeglądarkowe do wideokonferencji.
Jest to bardzo ciekawy obszar, dużo się nauczyłem o samym WebRTC i technologiach powiązanych.
Dodatkowo, praca nad SDK była ciekawym doświadczeniem pod kątem dyscypliny, organizacji pracy i planowania wdrożeń.
Wyzwania w samym kodzie kręciły się głównie wokół asynchroniczności i obsługi side effectów,
więc bardzo mi to odpowiadało.
Udało się trochę poukładać wiedzę, którą nabyłem pracując przy obsłudze rozwiązań tv/vod,
ale również wzbogacić ją,
bo w końcu to nieco inny kontekst i akcenty są siłą rzeczy gdzie indziej.

Niespodziewanie, w drugiej połowie roku mimo wszystko okoliczności zmusiły mnie również do zmiany pracy.
Jak już wcześniej nadmieniłem, nie spodziewałem się skali problemu.
Jakby ktoś nie wiedział, to czasy rynku pracownika (IT) minęły.
Wiele projektów zredukowało zespoły, rekrutacje są zawieszane w połowie procesu itp.
Miałem coś w rodzaju deja-vu z lat '10 XXI wieku, kiedy to wchodziłem na rynek pracy.

W związku z tym, postanowiłem swoje cele techniczne lekko dostosować do nowej sytuacji.

Szczęśliwie dla mnie, najmniej pragmatyczny cel jakim było rozpoznanie świata Clojure/Lisp,
realizowałem wcześniej - latem.
Wprawdzie miałem do tego tematu wrócić, ale minimum uważam za zaliczone.
W szczególności interesował mnie obszar concurrency i różnice między modelem aktorów a klożurowym modelem agentów.
Koncepty na pierwszy rzut oka wydają się bardzo podobne, ale w praktyce są dość różne.
Moją uwagę zwróciły również niemutowalne struktury danych, które są _wbudowane_ w Clojure.
Pod maską jest magia sprawiająca, że jest to (podobno) super wydajne,
ale nie potrafię ocenić,
na ile jest to lepsze (jeśli w ogóle) w porównaniu do rozwiązań w rodzaju vavr czy immutable.js.
Podsumowując: temat zawieszony, chętnie do niego wrócę, ale nie jest to priorytet.

Innym celem na 2023 było zapoznanie się z nowinkami w świecie SSR, zaprezentowanymi w nowej wersji next.js.
Sytuacja była o tyle niestandardowa,
że nie pisałem wcześniej w next.js - znałem jedynie teorię.
Sam fakt istnienia dwóch linii next.js był jednak dla mnie wręcz pomocny,
bo łatwiej mi zrozumieć coś porównując to do czegoś innego.
Tu warto dodać, że next 13 potrafi działać z dwiema konfiguracjami routingu:
zarówno z nowym app (v13+)
jak i klasycznym pages (<=v12).

W każdym razie, na nexta poświęciłem nieco więcej czasu -
poza samym rozpoznaniem
[klepałem projekcik](https://github.com/frankiewiczkamil/do-gather) i
[napisałem artykuł](../../../blog/ssr-strikes-back/).

Żeby było jeszcze ciekawiej, w rzeczonym projekcie dokonałem świadomie i z premedytacją overengineeringu,
celem wypróbowania wzorca agregat opartego o event sourcing.
Zainspirowała mnie [prelekcja Oskara Dudycza _Odchudź swoje aggregaty_ z wrocławskiego
JUGa](https://www.youtube.com/watch?v=UVsen5qKQoM&t=3773s&pp=ygUMb3NrYXIgZHVkeWN6).
Jednocześnie wpisywało się to niejako w zaniedbany przeze mnie inny cel na 2023 - naukę DDD.
Na swoją obronę mogę dodać,
że w ramach realizacji owego celu dopisałem również zalążek zbliżonego pod względem funkcjonalności
[projektu w Javie](https://github.com/frankiewiczkamil/do-gather-java),
jednak w oparciu o bardziej klasyczne podejście do projektowania agregatów.

Jak już jesteśmy przy bibliotekach JSowych, 2023 przyniósł 2 major upgrade'y w astro.
Nauka tej technologii również była na mojej liście celów, więc zmigrowałem swój blog.
Było to na szczęście bezbolesne, pewnie również z uwagi na mały stopień skomplikowania mojego kodu.

Trzymając się wątku bloga, to pod względem funkcjonalności właściwie nic nie dodałem,
jednak dokonałem pewnych zmian ulepszeń szeroko rozumianego UX.
W szczególności, rozszerzyłem obsługę grafik.
Po pierwsze użyłem taga ```<picture>``` i oferowane są kolejno: avif,webp, jpg.
Obsługa wielu formatów jest deklaratywna i odbywa się automatycznie w oparciu o funkcjonalność
``` <Picture>``` z astro (w repo jest tylko jeden obrazek, astro ogarnia resztę).
Po wtóre, widok główny ładuje grafiki w 2 rozmiarach: przeskalowaną miniaturkę (efekt rozmycia) oraz pełną wersję,
która podmienia miniaturkę (doszedł krótki kawałek JSa).

Oprócz tego, grafiki, tytuły i daty postów wzbogaciłem o użycie
[przejść]('https://docs.astro.build/en/guides/view-transitions/'),
które zaoferowało nowe astro.

Załóżmy więc, że jakieś minimum pracy z astro również zaliczone.

Będąc wciąż przy frontendzie, nadmienię również,
że z uwagi na przygotowania do rozmów na fullstackwe pozycje,
odkurzyłem, a nawet pogłębiłem swoją wiedzę w obszarach które *nie* były na liście celów.
W szczególności w CSSie pochyliłem się nad flexem i gridem, a w react'cie nad hookami i kontekstem.
Hitem okazało się moje 'odkrycie', że `setState` jako argument może przyjmować funkcję,
co rozwiązuje potencjalną nieoptymalność którą opisałem w
[tym artykule](../../../blog/efficient-state-in-functional-components/).

Kończąc wątek weryfikacji celów na 2023, trzeba wspomnieć o tych niezrealizowanych.
W kwestii solida nie zrobiłem prawie nic, poza okazjonalnym śledzeniem poczynań Ryna Carniato.

Drugim niewykonanym celem jest zagłębienie się w projekt loom.

To już koniec podsumowań realizacji celów na 2023.
Chciałbym jednak wspomnieć o jednym istotnym aspekcie który zmienił się w moim podejściu do pracy.
Nie będzie tu zaskoczenia - AI.
Przeprowadziłem wiele "rozmów" z GPT podczas nauki.
Subskrybuję również copilota.
Doświadczenia pracy z tymi narzędziami sprawia,
że z pełnym przekonaniem mogę powiedzieć, że AI rewolucjonizuje produktywność programisty.

Taki był mój 2023, co zatem w planach na 2024?

## 2024

Po pierwsze, przechodzą cele z 2023: loom, DDD oraz next.
Zagadnienia te są na tyle obszerne, że najpewniej wystarczą na z naddatkiem na cały rok.
W przypadku looma planuję również odświeżyć i pogłębić istniejące rozwiązania współbieżności w Javie.

Z nieco lżejszych zadań które sobie stawiam, planuję wprowadzić polską wersję bloga.
Do tej pory pisałem wyłącznie po angielsku.
Praca jest już w toku, a ten post jest pierwszym,
który piszę po polsku i dopiero przetłumaczę na angielski.
Chyba mocnym argumentem za pokuszeniem się o rozszerzenie formatu jest wsparcie AI.
Wprawdzie przekonałem się już, że tłumaczenie z angielskiego na polski technicznych postów działa przeciętnie,
ale liczę, że w drugą stronę pójdzie lepiej.

Tym optymistycznym zdaniem zakończę.

Życzę sobie i Wam, żeby 2024 uporządkował nieco chaos który nam towarzyszył w ostatnich latach,
a ferment intelektualny który ów chaos wywołał, zaaowocował i wzmocnił społeczności.

*Do następnego* 🖖
