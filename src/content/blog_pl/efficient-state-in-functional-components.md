---
title: Aktualizowanie stanu w komponentach funkcyjnych bez utraty wydajności
publishedAt: 2022-12-14
editedAt: 2023-09-30
description: Jak zmieniać stan w komponentach funkcyjnych bez utraty wydajności
author: kpf
tags: ['functional component', 'class component', 'hooks', 'useState', 'reducer', 'render', 'performance', 'react']
image:
  url: rocket-launch
  alt: 🚀 🚀 🚀
---

## Wprowadzenie

Dobrze pamiętam moment, gdy po raz pierwszy usłyszałem o react'cie.
Było to prawie 10 lat temu,
i używałem wtedy nowatorskiego na owe czasy rozwiązania jakim był `Angular.js`.

`Angular.js` (znany również jako angular v1) to biblioteka implementująca tzw. dwukierunkowe wiązanie danych.
Technika ta z początku wydawała się znakomitym pomysłem,
lecz z czasem napotkałem na pewne problemy, które się być z nią związane.
Najbardziej uciążliwe były dla mnie:

- problemy z debugowaniem, oraz
- słaba wydajność

W tych okolicznościach bardzo zaintrygowała mnie obietnica niezwykłej wydajności i prostoty,
którymi rzekomo cechować się miała owa nowa biblioteka - react.
Niedługo potem został ogłoszony react native, co jeszcze bardziej mnie zaciekawiło.

Po jakimś czasie nadarzyła mi się w pracy okazja,
aby sprawdzić to w nieco bardziej wymagających okolicznościach:
nowy projekt - zestaw aplikacji serwujących usługi wideo dla różnych platform,
w tym 2x web, android i iOS.
Mieliśmy już pewne doświadczenie w tej dziedzinie i wiedzieliśmy,
że wydajność jest tu kluczowa.
W związku z tym oczywiście wybraliśmy react,
bo przecież _react jest super szybki_.
No, chyba że nie jest.
A przynajmniej nie był dla nas, dopóki nie nauczyliśmy się go właściwie używać.

Dlaczego więc nie był szybki od początku, zapytasz?
Odpowiadam: głównie dlatego, że nie zapobiegaliśmy zbędnym renderowaniom.

## Kiedy następuje render?

Szybkie przypomnienie: `react` to biblioteka implementująca jednokierunkowe wiązanie danych,
a więc wykrywa elementy DOM wymagające aktualizacji poprzez _porównywanie_
śledzonych danych - stanu i propsów komponentu.

Innymi słowy, render następuje, gdy:

- zmieniły się propsy[^1], i/lub
- zmienił się stan[^1], i/lub
- zmienił się rodzic i zostanie ponownie przerenderowany[^2]

Musimy jednak zrozumieć, że porównanie stanu i propsów jest **płytkie** -
samej referencji, więc:

```javascript
({}) === {}; // false
```

A co z callbackami, które chcemy przekazać do komponentów?
Dla anonimowych funkcji uzyskamy ten sam efekt:

```javascript
(x => x) === (x => x); // false
```

Zatem, jeśli przekażemy anonimową funkcję jako props,
to spowoduje to renderowanie komponentu za każdym razem,
gdy owa referencja się zmieni.
Jest to szczególnie ważne w sytuacjach,
gdy chcemy wyekstrahować i zenkapsulować logikę w komponencie nadrzędnym,
i przekazać do komponentu potomnego jedynie callbacki i/lub wartości pochodne, bazujące na stanie.

Weźmy przykład:

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

Jak widać, statyczne referencje dla callbacków nie stanowią problemu w komponentach klasowych,
ponieważ klasy posiadają **metody**, a referencje do metod nie zmieniają się.
Dlatego, o ile używamy metod jako callbacków, jesteśmy bezpieczni.
Musimy jedynie pamiętać o znanym powszechnie problemie z `this`[^3].

To udało mi się zrozumieć i zastosować dość szybko, łatwizna.

A co z komponentami funkcyjnymi: czy one również mogą pełnić rolę komponentów z logiką (_smart components_)?
Funkcje nie posiadają metod, ale od wersji `v16.8` mamy hooki, które powinny pokryć wszystkie funkcjonalności klas.

W szczególności, mamy `useState`, który zwraca callback'a do modyfikacji wartości stanu.
Jeśli mielibyśmy zaimplementować podobny scenariusz jak powyżej, najprostsza implementacja wyglądałaby mniej więcej tak:

```javascript
function Container(_props) {
  const [count, setCount] = useState(0);
  const increase = () => setCount(count + 1); // 👈 create new instance on every run (!)
  const isUnder10 = count < 10; // 👈 state's derivative, primitive type - new value after 10 calls ☝️
  return <MemoizedComponent isUnder10={isUnder10} increase={increase} />;
}
```

Niestety, nie jest ona optymalna wydajnościowo, ponieważ referencja callback'a zmienia się za każdym razem,
gdy `Container` zostanie przerenderowany.
Ktoś mógłby powiedzieć: "spoko, mamy `useCallback`, który potrafi zapamiętać referencję".
To prawda, ale `useCallback` wymaga tablicy z zależnościami jako argumentu, a więc naiwne użycie wyglądałoby tak:

```javascript
function Container(_props) {
  const [count, setCount] = useState(0);
  const increase = useCallback(() => setCount(count + 1), [count]); // 👈 creates a new instance on every count change
  const isUnder10 = count < 10; // 👈 state's derivative, primitive type - new value after 10 calls ☝️
  return <MemoizedComponent isUnder10={isUnder10} increase={increase} />;
}
```

To nic nie zmienia w naszym przypadku, ponieważ nasz callback zależy od stanu, który ma się zmienić.

Czy to oznacza, że hooki nie mogą osiągnąć tego, co klasy miały od samego początku?
Na szczęście mogą. 😊

Jest kilka sposobów, aby osiągnąć ten cel, ale jeden jest zdecydowanie najlepszy.
Możesz znaleźć go na [samym końcu](#jedyny-słuszny-sposób-użycia-usestate), lub sprawdzić jakie inne rozwiązania,
a raczej: obejścia, musiałem stosować zanim znalazłem to najlepsze. 🫣

## Obejścia

Jest wiele sposobów, aby osiągnąć statyczną referencję do callback'a.
Możesz znaleźć moje eksperymenty
[tutaj](https://github.com/frankiewiczkamil/react-performance-kata/tree/main/packages/react-18/src).
Niektóre z nich są naprawdę pokręcone, pozwól, że przedstawię kilka z nich.

### Statyczna referencja "na piechotę"

Pomysł polega na stworzeniu fasady (wrapper'a) ze statyczną referencją, która wywoła właściwy callback.
W ten sposób właściwy callback może być zmieniony, podczas gdy referencja fasady pozostaje nietknięta.

```javascript
let currentIncreaseCallback = () => {};

// this reference does not change
const increaseRef = () => currentIncreaseCallback();

function Container(_props) {
  const [count, setCount] = useState(0);
  currentIncreaseCallback = () => setCount(count + 1);
  const isUnder10 = count < 10;
  return <MemoizedComponent isUnder10={isUnder10} increase={increaseRef} />;
}
```

Pewnie już widzisz, że ma to wiele wad, a największą jest pewnie to,
że wprowadza to dodatkową złożoność, jeśli mielibyśmy wiele komponentów potomnych.

Zobaczmy, co możemy z tym zrobić.

### `useCallback` + fabryka (domknięcia)

Pomysł polega na stworzeniu funkcji przy pierwszym uruchomieniu (pusta tablicy zależności jako argument)
i śledzeniu stanu gdzie indziej.

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

Jakie problemy mamy tutaj?
Na pewno nie jest to bardzo czytelne i intuicyjne rozwiązanie.
Ale jest jeszcze jeden, nawet większy problem:
fabryka musi być jedyną funkcją odpowiedzialną za zmianę stanu,
w przeciwnym razie rozjedzie nam się stan właściwy z tym utrzymywanym w domknięciu.
Nie do przyjęcia.

### Hooki

Pewnie już zauważyłeś, że najlepiej byłoby trzymać się samych hooków.
Chcemy zmemoizować callback, ale też utrzymać stałą referencję.
Wydawałoby się, że mamy hooki do obu tych celów, więc zobaczmy, jak możemy z nich skorzystać.

```javascript
function Container(_props) {
  const [count, setCount] = useState(0);
  const stateRef = useRef(count);
  stateRef.current = count; // it needs to be assigned here, outside useCallback in case sth else changes the state (consistency!)
  const increment = useCallback(function increment() {
    setCount(++stateRef.current);
  }, []);

  return <MemoizedChildComponent isBelowThreshold={count < THRESHOLD} increment={increment} />;
}
```

W tym przykładzie zdefiniowaliśmy callback przy pierwszym uruchomieniu,
ale potrzebny stan jest brany z refa, który jest aktualizowany przy każdym uruchomieniu.

Wygląda na solidne rozwiązanie, ale (raczej) niezbyt czytelne.
Ale to nic, bo przecież wiemy co robić w takich sytuacjach: wyekstrahować to do nowego, własnego hooka. 😎

#### Własny hook złożony z `useRef` i `useCallback`

Szczerze mówiąc na tego typu rozwiązanie natknąłem się kiedyś w internecie.
Niestety nie mogę znaleźć już tego posta, aby go podlinkować. Ale do rzeczy.

Narzędzia, których używamy są dokładnie takie same jak w poprzednim przykładzie,
aczkolwiek chcemy, aby rozwiązanie było bardziej ogólne,
więc do refa wrzucamy cały callback.

```javascript
const useCommand = callback => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback((...args) => callbackRef.current(...args), []);
};

function Container(_props) {
  const [count, setCount] = useState(0);
  const increment = useCommand(() => setCount(count + 1));
  return <MemoizedChildComponent isBelowThreshold={count < THRESHOLD} increment={increment} />;
}
```

Możemy zauważyć, że to podejście jest dość podobne do [pierwszego](#statyczna-referencja-na-piechotę),
bo pomysł jest dokładnie taki sam.
Po prostu użyliśmy nieco innych narzędzi.

Udało nam się osiągnąć cel,
ale musieliśmy użyć przynajmniej 2 wbudowanych hooków i stworzyć jeden własny,
aby kod był w miarę czytelny.

Czy mamy w zanadrzu coś jeszcze lepszego, zanim przejdziemy do najlepszego rozwiązania?

#### `useReducer` + `useCallback`

Słyszałeś(łaś) kiedyś o `redux`ie?
Jest hook, który naśladuje model `flux`, który możemy użyć, i całkiem dobrze pasuje w naszym przypadku.

Spójrzmy na to:

```javascript
const reducer = (state: number, action: { type: 'INCREMENT' } | { type: 'DECREMENT' }) => state + (action.type === 'INCREMENT' ? 1 : -1);

function Container(_props) {
    const [count, dispatch] = useReducer(reducer, 0);
    const increment = useCallback(() => dispatch({type: 'INCREMENT'}), []);
    return (<MemoizedChildComponent isBelowThreshold={count < THRESHOLD} increment={increment}/>);
}

```

Interesujące, co? Jest to technika podobna bardziej do architektury CQRS, niż CRUD.
Tak, wprowadza pewną złożoność.
Jednak w bardziej skomplikowanych scenariuszach zaczyna błyszczeć, i wg mnie warto w to iść.

Podsumowując, mamy tu jeden hook, ale z drugiej strony musieliśmy nieco zwiększyć złożoność.
Bardzo podoba mi się to rozwiązanie, ale mogę być stronniczy, bo dużo rzeźbiłem w `redux`ie.

W tym momencie muszę powiedzieć, że jestem pod wrażeniem, jeśli dotarłeś(łaś) aż tutaj.
Wspomniałem na samym początku, że jest jasny zwycięzca.
Zatem bez dalszych ceregieli, przejdźmy w końcu do niego. 😊

### `useState++`

Ale najpierw muszę się do czegoś przyznać.
Na początku, celowo nie wspomniałem o jednym ficzerku `useState`a.
Właściwie to dopiero niedawno się o nim dowiedziałem, więc proszę o wybaczenie.

Chodzi o to, że większość starych przykładów, które można znaleźć w internecie wygląda mniej więcej tak:

```javascript
const [count, setCount] = useState(0);
const increment = setCount(count + 1);
//...
increment(); // 1
```

Jednakowoż, react w wersji 18 przyniósł batchowanie.
W związku z tym, nie możemy już używać `useState`a w ten sposób, ponieważ skończyłoby się to tak:

```javascript
const [count, setCount] = useState(0);
const increment = setCount(count + 1);
///...
increment(); // 1
increment(); // still 1, instead of 2 💩
```

I tu ciekawostka: od samego początku hooków istniał alternatywny sposób użycia `useState`.
Ten z callbackiem jako argumentem (zamiast wartości).

Spójrzmy:

```javascript
const [count, setCount] = useState(0);
const increment = setCount(prev => prev + 1);
//...
increment(); // 1
increment(); // 2 💪
```

Pewnie już widzisz, dokąd to zmierza.

Zaimplementujmy zatem nasz przypadek użycia ostatni raz.

### Jedyny słuszny sposób użycia `useState`

```javascript
function Container(_props) {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount(prevCount => prevCount + 1), []);
  return <MemoizedChildComponent isBelowThreshold={count < THRESHOLD} increment={increment} />;
}
```

Genialne, prawda?

Wprawdzie wciąż musimy użyć `useCallback` celem memoizacji,
ale wydaje mi się,
że dla większości ludzi jest to bardziej intuicyjne rozwiązanie niż `useReducer` (którego uwielbiam 💚).

Co do memoizacji, to szczerze mówiąc, w komponentach klasowych też musieliśmy się pilnować,
aby nie wprowadzić anonimowych funkcji.
Możemy zatem uznać, że w kwestii optymalizacji wydajnościowych funkcyjne komponenty mogą być na równi z klasowymi.

Dodatkowo myślę, że powinniśmy wyrobić sobie nawyk używania funkcji jako argumentu `useState`a zamiast wartości,
ponieważ jest to po prostu konieczne przy automatycznym batchowaniu.

## Podsumowanie

Przeszedłem długą drogę, aby odkryć, że najlepsze rozwiązanie było tuż pod nosem, na wyciągnięcie ręki.
Ale nie żałuję, bo to było ciekawe ćwiczenie i myślę, że lepiej zrozumiałem hooki.
Co więcej, z mojego punktu widzenia `useReducer` wciąż może być lepszym rozwiązaniem,
szczególnie jeśli ktoś jest już zaznajomiony z tą techniką i przypadek nie jest trywialny od samego początku.

Oczywiście, cały ten zamęt dotyczy **bardzo** niszowych przypadków użycia,
gdzie chcemy uniknąć **każdego** zbędnego renderowania.
W takich przypadkach warto rozważyć również nieco bardziej dostosowane do tego rodzaju problemów narzędzia,
takie jak [solid.js](https://www.solidjs.com/)
czy [svelte](https://svelte.dev/).

---

[^1]: chyba, że zapobiegniemy używając: `shouldComponentUpdate()`

[^2]: chyba, że zapobiegniemy używając: `PureComponent`, `memo()`, `shouldComponentUpdate()`

[^3]:
    żeby zapobiec problemowi z `this`, trzeba albo zbindować metodę, albo użyć (IMO mylącej) składni arrow function
    dla metod zamiast używania funkcji anonimowych, bo te zmieniają referencję jak już wiemy
