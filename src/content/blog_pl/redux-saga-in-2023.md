---
title: Czy redux-saga jedt dobrym wyborem w 2023?
publishedAt: 2022-12-22
editedAt: 2022-12-22
description: Krajobraz rozwiązań do zarządzania stanem w 2023 roku i jak wpływa to na adopcję redux i redux-saga
author: kpf
tags: [ 'redux', 'redux-saga', 'side effects', 'middleware', 'saga', 'x-state' ]
image:
  url: runes
  alt: ᛋᚬᚷᚨ
draft: false
---

## Wstęp

Pierwsza wersja redux'a została wydana w 2015 roku i szybko stała się de facto standardem do zarządzania
stanem w projektach reactowych.
Złożyło się na to kilka powodów, ale z mojej perspektywy najważniejszymi były:

- brak wygodnego (i wydajnego) narzędzia do propagowania stanu do głęboko zagnieżdżonych komponentów - API kontekstu
  było niestabilne w tamtym czasie,
  a hooki (w szczególności `useReducer`) zostały wprowadzone znacznie później
- możliwość podpięcia middleware'ów,
  co pozwala na obsługę wszelkiego rodzaju _cross-cutting-concerns_ i _side effect'ów_
  poprzez przechwytywanie akcji przed, a nawet _po_ wywołaniu reducera, co oznacza,
  że jest to coś więcej niż 'tylko' implementacja wzorca _chain of responsibility_,
  który jest powszechnie stosowany w serwerach webowych (np. w middleware'ach w node.js, filtrach w java ee etc)

Gdy to piszę, mamy prawie 2023 rok i wydaje się, że zarówno API kontekstu,
jak i hooki stały się domyślnym wyborem dla większości projektów reactowych.
Jest tak dlatego, że razem rozwiązują problem propagowania stanu do (głęboko) zagnieżdżonych komponentów.
Co jednak z funkcjonalnością middleware'ów - czy jest ona pokryta przez wbudowane funkcje reacta?

O ile mi wiadomo - nie - i jest na to dobre wytłumaczenie: w react'cie komponent jest centralnym elementem,
więc jeśli trzeba wykonać jakieś _side effect'y_, to dzieje się to bezpośrednio w nim,
poprzez hooki (w komponentach funkcyjnych) lub metody life-cycle (w komponentach klasowych).

Dla większości aplikacji jest to wystarczające, ale moim celem w tym poście jest pokazanie sytuacji,
w których nadal warto rozważyć wybór redux'a z redux-sagą (lub podobnym middleware'em).

## Czym jest redux-saga

[Redux-saga](https://redux-saga.js.org/) to jeden z najpopularniejszych middleware'ów do zarządzania _side effect'ami_ w
ekosystemie redux - według npm-trends ma ona około 1 miliona pobrań dziennie.
Dla porównania: redux-thunk ma około 2 razy więcej, a redux-observable 5 razy mniej.
Muszę jednak przyznać, że osiągnęła ten poziom w 2021 roku i w zasadzie tak zostało.
Mam zresztą kilka pomysłów, dlaczego tak jest, ale podzielę się nimi dopiero w podsumowaniu.

Koncepcja tego projektu jest ściśle związana z jego nazwą - _saga_ to powszechnie używany
[wzorzec](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) do orkiestracji obsługi zdarzeń,
podobny do _process-manager'a_.
W skrócie, chodzi o grupowanie sekwencji powiązanych zdarzeń w byt,
który jest odpowiedzialny za koordynację całego procesu krok po kroku i ewentualną obsługę błędów,
jeśli takowe wystąpią [^1].
Myślę, że nazwa jest więc dość trafna,
ponieważ biblioteka dostarcza potężne API do nasłuchiwania i koordynacji zdarzeń (akcji) - tak jak we wzorcu saga.

Ale dość tej archeologii, spójrzmy, co konkretnie biblioteka oferuje i czy warto ją wybrać.

## Do czego saga się nada

Ogólnie rzecz biorąc: do orkiestracji wszelkiego rodzaju _side effect'ów_, zwłaszcza tych _async_.
Ale żeby być bardziej precyzyjnym, wymienię kilka konkretnych zastosowań:

- zarządzanie wieloetapowymi procesami - pomyśl o formularzach podzielonych na wiele kroków, np:
  _koszyk_ ➝ _dostawa_ ➝ _płatność_ ➝ _status_
- integracja z różnego rodzaju zewnętrznymi API (pluginy, biblioteki itp),
  np: odtwarzacze audio/wideo, mapy, wizualizacje, czaty itp.
  Jest to możliwe, ponieważ oprócz nasłuchiwania na zdarzenia redux'a,
  saga ma nożliwość integracji innych źródeł zdarzeń poprzez funkcjonalność kanałów (`channels`).
- uruchamianie procesów w tle do obsługi takich rzeczy jak usuwanie starych danych, pobieranie aktualnych danych,
  wysyłanie _heartbeat'ów_, odświeżanie tokenów itp.
  Jest to szczególnie przydatne dla aplikacji SPA i react native,
  bo mają one dłuższy cykl życia (są używane dłużej niż klasyczne aplikacje webowe, często w tle).
- poprawa wydajności, poprzez dostarczenie narzędzia do wywoływania czegoś **bez** dotykania stanu (bez renderów!) -
  można nawet pominąć wywołanie samej akcji redux'a, aby uniknąć wywołania reducer'ów,
  korzystając z _kanałów_ i wywołać aktualizację stanu (puścić akcję) _po_ wykonaniu operacji zdefiniowanych w sadze.
  Przydatne np. przy dużych wolumenach zdarzeń generowanych przez interakcję użytkownika,
  takich jak przewijanie, usuwanie tekstu itp.

Warto tu wspomnieć, że kod stworzony z pomocą sagi jest **czytelny**
ze względu na swoją imperatywną naturę i brak zaciemniaczy w rodzaju reaktywnych strumieni (observable).
Można by się kłócić, że reaktywne strumienie są też czytelne,
**jeśli** ktoś potrafi programować w stylu funkcyjnym.
Możliwe, ale z mojego doświadczenia to zły pomysł zakładać,
że każdy członek zespołu jest (lub będzie) biegły w tym stylu programowania.
Być może napiszę o tym posta w przyszłości.

Na koniec jeszcze jedno przemyślenie: dzięki elastyczności, o której już wspomniałem,
biblioteka pozwala na naśladowanie różnych modeli obsługi asynchronicznej, takich jak: pub-sub (wiadomix), kanały,
_structured-concurrency_ czy nawet model aktorów, **bez** wprowadzania dodatkowych narzędzi.

## Czy warto?

Mam nadzieję, że udało mi się udowodnić, że redux-saga nadal może być użyteczna.  
Ale czy jest to jedyna biblioteka zdolna do wykonywania tego rodzaju zadań?
Szczerą odpowiedzią byłoby: **nie**.
Pracowałem z sagą przez długi czas i uważam, że jest to naprawdę potężna biblioteka,
ale, o ile mi wiadomo, większość zastosowań, które opisałem w poprzednim punkcie,
może być również pokryta przez nową, wbudowaną funkcję w redux toolkit -
[listener](https://redux-toolkit.js.org/api/createListenerMiddleware).
Co więcej, jeśli ktoś chce spróbować zdecentralizowanego zarządzania stanem,
może warto spróbować [x-state](https://xstate.js.org) - biblioteki implementującej wzorzec _finite-state-machine_.
Według npm-trends, w ostatnim czasie zyskała ona na popularności i podejrzewam,
że jest to jedna z przyczyn stagnacji redux-sagi.
Ciekawostka: jeden z członków core team'u x-state był maintainer'em sagi.

Podsumowując, uważam, że redux-saga **nadal jest bardzo dobrą biblioteką do wypróbowania**,
ponieważ nawet jeśli nie jest (już) najgorętszą technologią,
to nadal ma do zaoferowania eleganckie, proste[^2] i elastyczne API,
które może pomóc w rozwijaniu umiejętności i zrozumienia zaawansowanych technik obsługi asynchroności.

---

[^1]: Zwane _akcją kompensacyjną_ i służy do wycofywania (_rollback_).
W swojej istocie działa to jak _contra entry_ lub _storno_ w branży finansowej
[^2]: pamiętaj: proste != łatwe
