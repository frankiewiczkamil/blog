---
title: Reużywalne efekty uboczne (side-effecty)
publishedAt: 2023-03-19
editedAt: 2024-07-02
description: 'Przegląd technik obsługi efektów ubocznych: uzyskiwanie DRY, bez dodatkowej złożoności przypadkowej.'
author: kpf
tags: [ 'side effects', 'orchestrating', 'composable', 'async', 'redux', 'redux-saga', 'reużywalność', 'orkiestracja', 'DRY' ]
image:
  url: gears
  alt: ⚙️⚙️⚙️
draft: false
---

# Kontekst

Biblioteki sterowane zdarzeniami (event-driven)
dostarczają nam pokaźne zestawów narzędzi do obsługi asynchronicznych API.
Problem jednak w tym, że łatwo tego nadużyć.
Jak dobrze wiemy, zwykle najlepiej trzymać się najprostszego możliwego rozwiązania, które realizuje wymagania.
Z tej perspektywy wysyłanie zdarzenia — np. reduxowej akcji czy też wiadomości emitowanej na strumieniu —
tylko po to, by wywołać _jedną_ funkcję, wydaje mi się być rozwiązaniem przekombinowanym,
zmniejszającym czytelność i możliwości debugowania bez uzyskania wymiernych korzyści.
Z taką sytuacją zwykle mamy do czynienia w przypadku tych relatywnie niskopoziomowych kawałków kodu,
które po prostu wykonują/obsługują jeden, konkretny efekt uboczny.
Tych precyzyjnych funkcji używamy do konstruowania wyższych abstrakcji, bardziej złożonych elementów,
które to już _koordynują_ przepływy.
Może to wyglądać np. tak:

```typescript
async function coordinator() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2(result1);
    const result3 = await sideEffect3(result2);
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
}
```

Mamy tu sekwencję wywoływania efektów ubocznych, gdzie wyjście z jednego jest wejściem do kolejnego.
Spróbujmy zatem odpowiedzieć na pytanie:
czy taka implementacja jest optymalna?
No cóż, jak zwykle — to zależy.

# Heurystyki

Jest wiele powodów, dla których można uznać dany kod za kiepsko zaprojektowany i/lub zaimplementowany,
jednak dwie heurystyki wydają mi się szczególnie użyteczne w kontekście oceny orkiestracji obsługi efektów ubocznych.
Są to:

- stopień spójności operowania na tym samym poziomie abstrakcji,
  czyli tzw. SLAP (_single level of abstraction principle_)
- reużywalność kodu, czyli dobrze znana zasada DRY

W tym poście punktem wyjścia dla przykładów będą heurystyki na DRY,
głównie z uwagi na fakt, że trudno na syntetycznym przykładzie omawiać poziomy abstrakcji.
Jednakowoż techniki refaktoringu, których użyjemy, wydają mi się uniwersalne,
tzn. użyteczne niezależnie od przyczyny ich wykorzystania.

# Techniki

## Warunki vs polimorfizm

Weźmy przykład, gdzie mamy kilka funkcji koordynujących obsługę wyspecjalizowanych funkcji efektów ubocznych:

```typescript
async function coordinatorDefault() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2(result1);
    const result3 = await sideEffect3(result2);
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
}

async function coordinatorX() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2X(result1); // 👈
    const result3 = await sideEffect3(result2);
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
}

async function coordinatorY() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2Y(result1); // 👈
    const result3 = await sideEffect3Y(result2); // 👈
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
    await sideEffect6Y(result4); // 👈
}
```

Wszystkie trzy koordynatory są podobne, jednak wciąż są między nimi drobne różnice (wskazane palcem).

Czy ten kod jest ok?
Jak dla mnie — ogólnie tak — nawet w kontekście rzeczonego DRY.
Obsługa efektów ubocznych jest już przecież wydzielona do odpowiednich funkcji.
Niemniej, dobrze wiemy, że wielu oceniających na code review powie, że to nie jest jeszcze _dostatecznie_ DRY.
I w niektórych przypadkach sam bym się przychylił, np. w przypadku gdy chcemy wydzielić ważną logikę do jednego miejsca,
trochę jak w przypadku normalizacji w relacyjnych bazach danych.
Zastanówmy się zatem, co możemy z tym zrobić.

Z mojego doświadczenia, (zbyt) częstym sposobem uzyskiwania DRY jest użycie warunków, jak tu:

```typescript
async function coordinator() {
    const result1 = await sideEffect1();
    let result2;
    if (X) {
        result2 = await sideEffect2X(result1);
    } else if (Y) {
        result2 = await sideEffect2Y(result1);
    } else {
        result2 = await sideEffect2(result1);
    }
    let result3;
    if (Y) {
        result3 = await sideEffect3Y(result2);
    } else {
        result3 = await sideEffect3(result2);
    }
    const result4 = await sideEffect4(result3);
    await sideEffect5(result4);
    if (Y) {
        await sideEffect6Y(result4);
    }
}
```

Ten przykład jest prosty, ale pewnie już widzisz lub potrafisz sobie wyobrazić,
jak takie podeście może się skomplikować,
gdy pojawia się coraz więcej kodu, a zatem kolejnych sprawdzeń warunków.
W takiej sytuacji osobiście preferowałbym już raczej poprzednią wersję,
tą mniej DRY, gdzie mamy koordynatory per scenariusz (przypadek użycia).
A to dlatego, że znacznie łatwiej jest czytać, _utrzymywać_ i _rozszerzać_ kod bez tylu IFów,
gdzie możemy się skupić na danym przypadku.
To zwyczajnie pomaga unikać bugów podczas wprowadzania zmian 💚

Po prawdzie koordynator per scenariusz to nic nowego — to po prostu, stary dobry wzorzec strategia,
polimorficzne zachowanie znane i lubiane w świecie programowania obiektowego.

Co zatem z DRY, z wydzieleniem tej "ważnej logiki"?
Zachowanie czytelności jest dużo ważniejsze niż powtarzający się kod,
jednak użycie polimorfizmu nie musi oznaczać rezygnacji z DRY.
Spróbujmy zatem osiągnąć obie rzeczy.

# Techniki refaktoringu

## Wydzielanie funkcji

Poprzedni przykład nie był skomplikowany,
ale użyję czegoś jeszcze prostszego, by móc precyzyjniej analizować omawiane techniki.

```typescript
async function coordinator() {
    const result1 = await sideEffect1();
    const result2 = await sideEffect2(result1);
    const result3 = await sideEffect3(result2); // 👈
    const result4 = await sideEffect4(result3); // 👈
    await sideEffect5(result4);
}
```

Załóżmy, że wywołania `sideEffect2` i `sideEffect3` powtarzają się w wielu scenariuszach (koordynatorach) _i_/_lub_
funkcje te wykonują znacząco bardziej precyzyjną rzecz,
czyli poziom abstrakcji tych funkcji jest niższy niż pozostałych.
W takim przypadku zwyczajnie wydzielamy im funkcję:

```typescript
async function coordinator() {
    const result1 = await sideEffect1();
    const result2 = await coordinatorLowerLevel(result1); // 👈
    const result3 = await sideEffect4(result2);
    await sideEffect5(result4);
}

// this function abstraction level is lower and/or it's a commonly used piece of code
async function coordinatorLowerLevel(input) {
    const result = await sideEffect2(input);
    const result2 = sideEffect3(result);
    return result2;
}
```

Prosta sprawa, ciągle to robimy.
Jest DRY, nie ma IFów — spoko.
To poręczna technika, _ale można jej użyć tylko wtedy, gdy wywołania następują jedno po drugim_.

Co więcej, jak już widzieliśmy w pierwszym przykładzie, może nastąpić sytuacja,
gdzie reużywalne side effecty przeplatane są tymi charakterystycznymi dla danego scenariusza (koordynatora).

## Wydzielanie funkcji wyższego rzędu

Załóżmy, że reużywalne części to: `sideEffect1`, `sideEffect4` i `sideEffect5` (pierwszy, przedostatni i ostatni).
Szczęśliwie, js/ts umożliwia używanie funkcji wyższego rzędu, więc możemy tworzyć fabryki w następujący sposób:

```typescript
type InAndOut<T> = (arg: T) => Promise<T>;

function createSpecificImpl(sideEffect3Impl: InAndOut) {
    return async function reusableCoordinator() {
        const result1 = await sideEffect1();
        const result2 = await sideEffect2(result1);
        const result3 = await sideEffect3Impl(result2); // customized effect 💉
        const result4 = await sideEffect4(result3);
        await sideEffect5(result4);
    };
}

const coordinator = createSpecificImpl(sideEffect3);
```

Nieźle, nie?
Co jednak gdy sprawy się bardziej komplikują i potrzebujemy więcej niż jednego poziomu reużywalnej logiki i/lub
więcej niż jednego reużywalnego kawałka?

## Ciekawe przypadki — wielokrotne zagnieżdżenie

Wyobraźmy sobie, że są 2 warstwy, które chcemy wydzielić: `sideEffect1`+`sideEffect5` i `sideEffect2`+`sideEffect4`

```typescript
async function coordinator() {
    const result1 = await sideEffect1(); // reusable 🍐
    const result2 = await sideEffect2(result1); // reusable 🍎
    const result3 = await sideEffect3(result2); // customized effect 💉
    const result4 = await sideEffect4(result3); // reusable 🍎
    await sideEffect5(result4); // reusable 🍐
}
```

Dobra wiadomość jest taka, że możemy użyć tej samej techniki co poprzednio:

```typescript
function createMiddleCoordinator(sideEffect3Impl: InAndOut) {
    return async function middleCoordinator(result1: number) {
        const result2 = await sideEffect2(result1);
        const result3 = await sideEffect3Impl(result2);
        const result4 = await sideEffect4(result3);
        return result4;
    };
}

function createOuter(nestedCoordinator: InAndOut) {
    return async function middleCoordinator() {
        const result1 = await sideEffect1();
        const result4 = await nestedCoordinator(result1);
        const result5 = await sideEffect5(result4);
    };
}

const coordinator = createOuter(createMiddleCoordinator(sideEffect3));
```

Ten przykład pokazuje jednak jeszcze jedną rzecz: fabryki mogą być traktowane również jako wstrzykiwane zależności —
`createMiddleCoordinator` jest tu przykładem.
To trochę jak klasa implementująca dwa interfejsy albo dwustronny strumień, który zarówno czyta, jak i emituje.

### Bonus tip

Jeśli siedzisz w paradygmacie funkcyjnym, a masz więcej takiego generycznego kodu do wydzielania,
to dla zwiększenia czytelności polecam rozważyć użycie pomocniczych operatorów umożliwiających pisanie
w stylu [point-free](https://en.wikipedia.org/wiki/Tacit_programming).
If you are into fp and there are more functions that you need to extract and compose like this, then you can consider
Poniżej kilka przykładów ze znanych bibliotek:

```typescript
// lodash-fp flow
const coordinator = flow([
    createMiddleCoordinator,
    createOuter,
    // ...more higher order functions
])(sideEffect3);
```

```typescript
// redux
const coordinator = compose(createOuter, createMiddleCoordinator)(sideEffect3);
```

```typescript
// fpts
const coordinator = pipe(sideEffect3, createMiddleCoordinator, createOuter);
```

# Podsumowanie

Nauczyliśmy się, że jak mamy dużo instrukcji warunkowych w koordynatorach (orkiestratorach),
to lepiej wydzielić odrębne funkcje reprezentujące mniej skomplikowane przepływy.
Pomaga to bowiem w utrzymaniu kodu.

Idąc dalej, jeśli chcemy jednocześnie mieć wysoki współczynnik DRY, to możemy:

- wydzielać funkcje agregujące sekwencje kilku side-effectów (łatwe, ale ograniczona użyteczność)
- tworzyć fabryki (funkcje wyższego rzędu),
  których można użyć do tworzenia funkcji na bazie wzorca przyjmującego argumenty,
  czyli wstrzykiwanie tych "różniących się" side-effectów

Wszystkie przykłady używają `async-await`,
ale używałem z powodzeniem tych technik organizacji side-effectów również w redux-saga (czyli z `yield`ami).

Co więcej, myślę, że techniki te powinny być również użyteczne dla backendowych klocków,
takich jak sagi, proces menedżery i podobne serwisy ogarniające orkiestrację side-effectów.
