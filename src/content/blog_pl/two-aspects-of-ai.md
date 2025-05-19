---
title: Czy AI zastąpi kod?
publishedAt: 2025-05-17
editedAt: 2025-05-19
description: 'Dwa główne kierunki rozwoju AI w kontekście oprogramowania'
author: kpf
tags: [ AI, Vibe coding, MCP, future ]
image:
  url: 'city-and-robot'
  alt: 🤖
draft: false
---

Zacznijmy od oczywistej oczywistości:
sztuczna inteligencja zmienia sposób tworzenia oprogramowania na naszych oczach.
Mamy już cały wachlarz narzędzi wspierających programowanie,
a każdego dnia pojawiają się nowe rozwiązania — 
wymieńmy choćby _vibe coding_ i _MCP_ jako dwa świeże, acz znaczące przykłady.

Wybrałem je zresztą nie przypadkiem, bo dobrze ilustrują one dwa główne kierunki rozwoju AI:

- Generowanie klasycznego kodu w istniejących językach
  (kompilowanych lub interpretowanych — bez różnicy),
  gdzie ***akcja użytkownika uruchamia tradycyjny kod, który realizuje zapytanie.***

- Zastępowanie istniejących artefaktów kodu (metod, funkcji, procedur, ...)
  wywołaniami AI, czyli ***akcja użytkownika uruchamia sztuczną inteligencję,
  która generuje wynik dla zapytania.***

Pierwszy kierunek jest już nam dobrze znany — to właściwie bardziej zaawansowana wersja podpowiadania składni w IDE.
Drugi jest jednak znacznie ciekawszy.
Pamiętam, gdy pierwszy raz zetknąłem się z tą koncepcją — 
było to w prezentacji Erika Meyera,
[Alchemy For the Modern Computer Scientist](https://www.youtube.com/watch?v=6NXHIRyQOC8) —
i zrobiło na mnie podówczas niesamowite wrażenie.

Oczywiście, nie jest to dylemat zero-jedynkowy.
Właściwie, to drugi kierunek **musi** być obecnie łączony z istniejącym kodem.
Myślę zresztą, że to dobrze, że możemy to adaptować stopniowo,
zastępując kolejne fragmenty naszego oprogramowania wywołaniami AI.
Prowadzi to jednak do pytania, czy w końcu osiągniemy moment,
gdzie tradycyjny kod zostanie ***całkowicie*** (lub niemal całkowicie) zastąpiony przez wywołania AI.
Wszak teoretycznie możemy korzystać z AI na dowolnym urządzeniu i wywoływać ją zamiast klasycznego kodu.

Brzmi to tym bardziej realistycznie, że przecież coraz więcej urządzeń ma dziś wsparcie sprzętowe dla AI, nie?
Czy jest to zatem tylko kwestia czasu?
Czy możliwe jest to dla _wszystkich_ typów oprogramowania i urządzeń?

Jak się pewnie już domyślasz, uważam raczej,
że urządzenia oparte na półprzewodnikach, z których dziś korzystamy,
mają naturalne i oczywiste obszary,
gdzie AI się po prostu nie sprawdzi — niezależnie od rozwoju AI i sprzętu.
Chciałbym się temu przyjrzeć i spróbować je sklasyfikować.

Zacznijmy od podstaw:
czy systemy operacyjne mogłyby skorzystać na integracji z AI?
W pewnym sensie — tak.
Możemy choćby zbierać dane o zachowaniach użytkownika i wykorzystywać je do poprawy żywotności baterii,
zarządzania zasobami itd.

Choć pewnie dostrzegasz już kres sensowności takiego myślenia, prawda?
Czy byłoby racjonalnym użycie AI jako "cząstek elementarnych" kernela — np. do obsługi systemowych wywołań?

Coś tu nie gra, nie?
Nawet gdyby zużycie zasobów i wydajność nie stanowiły problemu
(a stanowią — nawet z natywnym wsparciem sprzętowym),
AI nadal jest z natury ***niedeterministyczna***.
A to z kolei czyni ją ***immanentnie niebezpieczną***.
Jest to jeszcze ważniejsze, gdy mówimy o systemach wbudowanych, IoT itd.

Przypuszczam, że wytknięcie ograniczeń AI w kontekście niskopoziomowych scenariuszy nie było specjalnie kontrowersyjne.
Co zatem z wysokopoziomowym ficzerami, tymi realizującymi logikę biznesową?
Tu pewnie już możemy zastąpić kod wywołaniami AI, prawda?

I znowu — nie do końca.
Czy zastąpiłbyś kod przeliczający saldo konta bankowego przez AI?
Tradycyjne procesory są niezwykle wydajne w operacjach numerycznych.
Podobnie jak w przypadku kernela, kod jest tu:

- Szybki i energooszczędny,
- Bezpieczny,
- Deterministyczny.

Ten ostatni punkt jest kluczowy, bo nader często musimy mieć możliwość **audytu**,
czyli sprawdzenia, jaki kod się wykonał i dlaczego uzyskano taki, a nie inny wynik.

Z AI to praktycznie niemożliwe.
A ten problem ***jest naprawdę ważny*** ze względu na to, w jakim świecie żyjemy.
Autonomiczne zamawianie zakupów przez lodówkę? Spoko.
Podejmowanie decyzji zakupowych przez AI dla firmy lub rządu?
To już zupełnie inna historia.

A co z bezpieczeństwem? Systemami kontroli?
Czy naprawdę chcemy żyć w świecie rodem z _Raportu mniejszości_?

Itd.

## Podsumowanie

AI już dziś potrafi zastąpić wiele usług —
prawdziwe pytanie dotyczy **granic**.

Żyjemy w burzliwych czasach, a prawo jak zwykle, nie nadąża za technologią.
Na razie jest to istny dziki zachód: to rynek i ludzka pomysłowość kształtują granice adopcji.

Niemniej jednak sądzę, że przyjdzie taki dzień,
gdy zgodzimy się wszyscy, że ***trzeba określić granice***.
To nie jest kwestia preferencji programistów,
zatrudnienia w IT ani interesów producentów sprzętu.

Jest to niemal **filozoficzna** kwestia,
mogąca głęboko wpłynąć na przyszłość naszej cywilizacji.
Obyśmy to zrobili dobrze 🤞

Pozdro! 🖖
