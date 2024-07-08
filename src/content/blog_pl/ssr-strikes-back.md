---
title: 'Next 13: SSR kontratakuje'
publishedAt: 2023-12-16
editedAt: 2024-07-08
description: 'Next 13+: ewolucja czu rewolucja?'
author: kpf
tags: [ 'RSC', 'ssr', 'server side rendering', 'next.js', 'next', 'react', 'client side rendering', 'CSR', 'SSG', 'suspense' ]
image:
  url: rice-plantation
  alt: 🚧
draft: false
---

## Intro

Reakcja społeczności na najnowsze wydania nexta (13 i 14) okazała się bardzo zróżnicowana,
mamy niemal całe spektrum opinii.

Niektórzy utrzymują, że właściwie nie dostajemy nic nowego,
że odkrywamy na nowo Server-Side Rendering (SSR) znany z szablonów w rodzaju JSP czy PHP.
Z drugiej jednak strony są i tacy, którzy twierdzą, że mamy do czynienia z rewolucją.
Kto ma zatem rację?

Cóż, z mojej perspektywy obie skrajne strony mają swoje argumenty, ale umyka im szerszy kontekst.

Faktycznie, są pewne zmiany w API, które będąc w bańce reacta/nexta możnaby określić jako rewolucyjne.

Jednakże, w szerszej perspektywie nie mamy do czynienia z czymś całkowicie nowym.
Jest to raczej zmiana sposobu użycia już istniejących narzędzi, technik i wzorców **razem**.

Co ciekawe, daje to drugie życie pewnym starym konceptom, zapomnianym w erze (post) SPA.

Zanim jednak zagłębimy się w niuansiki dotyczące różnic między Next 13+ a jego poprzednikami i konkurentami,
spróbujmy skrótowo prześledzić, jak sieć ewoluowała.
Potrzebujemy bowiem historycznego kontekstu, jeśli chcemy ujrzeć pełen obraz.

## Kontekst historyczny

Na potrzeby tego wpisu wylistuję kilka kamieni milowych,
które moim skromnym zdaniem odegrały kluczowe role w kształtowaniu sieci, jaką znamy dziś.

Są to kolejno:

- statyczne strony (static-pages)
- czysty server-side rendering (SSR) używany np. w PHP, JSP, ASP, CGI, etc
- AJAX
- client-side rendering (CSR) — pobieranie SSR/statycznych stron, następnie doładowywanie danych przy użyciu AJAX
- RESTowe API (ustrukturyzowany sposób pobierania danych, zwykle JSONów)
- single-page-application (SPA) i PWA — CSR (client-side-rendering) do wszystkiego, co nie jest statyczne
- static site generation (SSG) i incremental static regeneration (ISR), aka JAMstack —
  czyli generowanie statycznych stron "na żądanie"
- homogeniczne aplikacje: SSR+SSG+ISR+CSR — biblioteki typu "scyzoryk szwajcarski", wszystko w jednym,
  i co symptomatyczne: javascript do backendu i frontendu (next.js, gatsby, remix itd.)

Jeśli się nad tym zastanowić, to mamy właściwie dwa sposoby renderowania stron:
po stronie klienta i po stronie serwera.
Jedyną różnicą między SSR, SSG i ISR jest to, **kiedy** ono następuje.

A przynajmniej we wspomnianych przeze mnie przypadkach.
Wkrótce odkryjemy wszakże, że należy w równaniu uwzględnić coś jeszcze.

Kontrowersyjna opinia:
Pomimo że mieszanie SSR i CSR było możliwe w latach początku AJAXa,
to myślę, że stało się to **mniej** popularne wraz ze wzrostem popularności SPA.
Moje zrozumienie tego stanu rzeczy jest takie,
że aplikacje webowe miały niejako się upodobnić do aplikacji mobilnych/natywnych.
Idąc tym tropem zaczęliśmy traktować HTMLa nie jako dokument, ale raczej wejście do naszej apki.
To w naturalny sposób doprowadziło do uwspólnienia API i sposobu ich użycia.

Mowa tu oczywiście o API RESTowych.
I zastanówmy się nad tym: RESTowe API używają jakiegoś formatu danych (zwykle JSONa),
podczas gdy pierwotne podejście w sieci było inne — było to raczej:

- wysyłanie danych poprzez **HTMLowe** formularze, w postaci par klucz-wartość
- pobieranie danych odbywało się przez podążanie kolejnymi linkami do stron,
  czyli dokumentów **HTML**

Dlaczego porzuciliśmy to podejście?
Myślę, że przede wszystkim podobało nam się używanie RESTa z SPA,
z uwagi na separację między:

- aplikacją — jej logiką, stanem, widokiem/stylowaniem, wsparciem offline-first itd., a
- danymi

Było to jak oddzielenie opakowania od jego zawartości.

Ponadto, jak już zostało to poniekąd wspomniane,
mogliśmy współdzielić implementację endpointów pomiędzy różnymi klientami.

No i na deser, doszła kusząca obietnica,
że umożliwi to usprawnienie pracy poprzez uniezależnienie wysiłków nad backenedem i frontendem.
Cóż, może i tak, ale...

Doprowadziło to do dziwnej sytuacji,
gdzie używamy tego samego modelu na backendzie i frontendzie.
Dużo logiki wyciekało do warstwy prezentacji,
a odpowiedzialność komponentów się rozmyła.

Można by tu powiedzieć: no i co z tego, 95% naszych aplikacji to i tak CRUDy.
Tak, a co z pozostałymi 5%?
Używamy tego samego młotka, który już mamy w ręce.
W efekcie kończymy z
[anemicznymi modelami](https://en.wikipedia.org/wiki/Anemic_domain_model)
na backendzie i (zdublowaną) logiką na froncie[^1].
Czasem nawet niespójną.
Zaczynam jednak wybiegać zbyt naprzód, do tego wątku jeszcze wrócimy.

W każdym razie ludzie wydawali się zadowoleni z podejścia opartego o SPA,
bo zdawało się to przynosić w końcu jakiś rodzaj standardowej, uniwersalnej architektury.

Pojawiły się jednak pewne istotne, negatywne konsekwencje.
W SPA, jeśli nasza aplikacja (dokument) nie jest jeszcze 'zainstalowana'
(pobrana lub skeszowana), to musimy czekać praktycznie bezczynnie,
bo przecież nie da się przewidzieć przed wywołaniem kodu aplikacji, co jej będzie potrzebne.

Oczywiście, statyczny kontent jak SPA ładnie się keszuje, więc ładowanie może być szybkie.
Jednak czasami to wciąż za mało (czy raczej: za dużo w kontekście czasu ładowania),
szczególnie gdy mamy do czynienia z użytkownikami pierwszorazowymi.
Chyba każdy użytkownik jest w stanie powiedzieć,
czy jego doświadczenie z produktem jest zadowalające w kontekście opóźnień i szybkości działania.

Więc nawet gdy skeszujemy apkę/dokument w przeglądarce i/lub CDN odpowiada super szybko,
to wciąż musimy każdorazowo podejmować decyzję jakich danych potrzebujemy,
zanim je pobierzemy, zrenderujemy i zaprezentujemy ostateczny rezultat.
Wciąż więc zostaje problem kaskady requestów, której nie da radu uniknąć.

Domyślam się, że 'biznes' nie był zbyt szczęśliwy, szczególnie w obszarze e-commerce.
Mieli bowiem dobre argumenty —
co tu się stało, że skończyliśmy z **gorszym** efektem, niż mieliśmy w poprzednich latach?
Jak już wspomniałem, każdy zauważy różnicę w szybkości ładowania strony.

Dostrzeżono też inne ograniczenia SPA,
jak choćby SEO, ale nie będę się na tym skupiał w tym wpisie.

# Homogeniczne aplikacje

Jak już ustaliliśmy, w wielu obszarach istnieje biznesowa potrzeba ładowania stron szybciej, niż dzieje się to w SPA.
Z drugiej jednak strony, nie chcemy tracić interaktywności.
Innymi słowy: chcielibyśmy uzyskać to, co najlepsze z obu światów:

- szybkość pierwszego wczytania (first contentful page) jak w SSR/SSG, ale również
- szybkie doładowywanie danych

I pewnie dlatego odkryliśmy na nowo podejście łączone: SSR+CSR.
Tym, co jednak odróżnia homogeniczne aplikacje, od starszych rozwiązań jest to,
że granica między SSR i CSR się zaciera, nie musimy bowiem kleić części backend i frontend z dwóch technologii
(np. PHP + angular itp.), a wręcz możemy nawet używać tych samych komponentów tu i tu.

Wspomniane aspekty to jednak wyłącznie DX, perspektywa programisty,
a dla użytkowników końcowych istotny jest jedynie rezultat i stąd moja teza,
że do refleksji nad nadużywaniem SPA zmusiły nas przede wszystkim problemy z wydajnością.

W homogenicznych aplikacjach możemy używać SSR/SSG do szybkiego wczytania podstawowej treści,
z możliwością doładowywania jak w SPA.

Czy to zatem koniec drogi, święty graal?
Oczywiście, że nie.

Przede wszystkim, natrafiliśmy na coś w rodzaju długu technicznego.

W przypadku pierwszych generacji homogenicznych aplikacji, takich jak next 12 i wcześniejszych,
w celu pokazania czegoś sensownego szybko przy użyciu SSR, HTML jest prerenderowany po stronie serwera,
jednak po stronie klienta musi nastąpić przejęcie kontroli i zamontowanie tego wszystkiego.

Jest to nazywane [nawadnianiem (hydration)](https://en.wikipedia.org/wiki/Hydration_(web_development)).

Chodzi po prostu o to, że kod komponentów serwerowych musi wykonać się dwa razy:
na serwerze i na kliencie.
Dodatkowo jest luka między momentem gdy HTML jest widoczny i tym gdy jest już w pełni interaktywny,
czyli ma podłączone odpowiednie listenery itd.

Po wtóre, jeśli się nad tym zastanowić,
obsługa dociągania danych używając czystego CSR jest ze swojej natury nieco nieoptymalna,
bo przecież **każdy** klient musi przemapować sobie dane z JSONa do swojego stanu i to zrenderować,
nawet jeśli nie potrzebuje żadnej interaktywności.

## Słoń w pokoju — RSC, Suspense i component streaming

W poprzednich sekcjach wspomniałem, że historycznie mieliśmy dwa podejścia do renderowania stron:
po stronie klienta i po stronie serwera,
a jedyną różnicą między SSR, SSG i ISR było **kiedy** strona jest renderowana.
Było to sensowne rozróżnienie przez długi czas,
a sprzyjało pewnie temu,
że w pewnym momencie przerzuciliśmy się niemal całkowicie na CSR.

I tu dochodzimy do sedna:
aby pójść dalej — przyspieszyć nasze apki i pozbyć się nieoptymalności (rehydracji) —
musimy trochę zmienić naszą perspektywę.

Chodzi tu o **strumieniowanie komponentów**, możliwe w React Server Components (RSC).
Komponenty RSC są prawdziwie serwerowe, tzn. nie renderują się na kliencie.
Mogą być osadzone zarówno wewnątrz innych komponentów serwerowych, jak i w klienckich (!).
Co jednak jeszcze ciekawsze,
ich dystrybucja odbywa się asynchronicznie,
co nazywamy **strumieniowaniem**.

### Dosyłanie na żądanie w komponentach klienckich

Jeśli mamy zatem załadowaną stronę i chcemy wywołać jakąś interakcję zależną od danych,
np. doładować więcej treści albo podmienić jakiś komponent bez przeładowania strony i
[ścieżki](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState),
to w komponencie klienckim możemy teraz to zrobić opakowując komponent serwerowy w `Suspense`,
a wyrenderowany wstępnie komponent zostanie wysłany jako `text/x-component`.
Nie jest to czysty HTML, ale zawiera wszystkie informacje na temat struktury i pozycji w dokumencie,
potrzebne do bezzwłocznego zamontowania, czyli **bez zduplikowanego rendera na kliencie**.

Ciekawe, jednak źródłem problemów było pierwsze wczytanie, prawda?
Zobaczmy zatem, co mamy do dyspozycji i na tę okoliczność.

### Przyrostowe, pierwsze ładowanie komponentów serwerowych

Zastanówmy się nad taką kwestią:
zawartość ładowanej strony składa się zarówno ze 'statycznej' części (struktura i niezmienne dane),
jak i dynamicznej, gdzie zazwyczaj musimy pociągnąć dane z jakiegoś API, bazy danych itp.

Ta dynamiczna zawartość może być rozrzucona po stronie i wymagać wielu requestów,
a te z kolei mogą mieć różne opóźnienia.

W rezultacie, w klasycznym SSR ładowanie strony zajmuje tyle,
ile jest potrzebne do pobrania wszystkich elementów, w szczególności tych najwolniejszych🐌

Ale w next 13 nie musi tak być.

Koncepcja jest taka, że pierwszy render może następować w częściach,
dzięki czemu klient najpierw otrzymuje te 'szybsze kawałki' (i są one od razu gotowe do użycia),
a te wolniejsze sobie wlatują w swoim tempie, później.
Trzeba jedynie pamiętać o opakowaniu tych komponentów w `Suspense`.

Co do formatu danych — podobnie jak w przypadku doładowywania 'na żądanie' —
nie jest to czysty HTML.
Nie jest to jednak również `text/x-component`.
W tym przypadku bowiem wykorzystana jest pewna cecha renderowania HTMLa przez przeglądarkę,
a mianowicie to, że potrafi ona wyświetlać niepełny dokument,
tj. taki gdzie tagi nie są jeszcze domknięte, bo dokument jeszcze się pobiera.
Gdy spojrzymy na nagłówek `Transfer-Encoding`,
to w tym przypadku zobaczymy, że użyte jest w tym celu `chunked`.

Genialne, nie?
I jak już na wstępie zaznaczyłem:
niby nie nowy pomysł, ale jednak nie jest to również wymyślanie na nowo PHP.

Jeśli chcesz, to możesz zerknąć na moje proste przykłady użycia strumieniowania
[tutaj](https://github.com/frankiewiczkamil/next-exercises).
Obejmują one dwa opisane przykłady,
przy czym w przypadku doładowywania na żądanie jest pewne ograniczenie dla oficjalnego wsparcia,
co opisałem
[tu](../../../pl/blog/next-ssr-limitations/),
a we wspomnianych przykładach pokazuję, jak da się to obejść.

Skoro temat pobierania mamy już za sobą,
spójrzmy na nowości w wysyłaniu,
żeby zobaczyć, czy i tam mamy do czynienia z innowacjami.

### Mutacje

W poprzednich sekcjach dowiedzieliśmy się,
że w przypadku odczytów możemy poświęcić elastyczność, jaką dają API RESTowe,
w zamian za znaczące zyski w wydajności, czyli w konsekwencji UX.
Jednocześnie, zaryzykowałbym tezę, że zyskujemy również w obszarze DX,
a to dlatego, że nie musimy troszczyć się o zarządzanie stanem potrzebnym do obsługi pobierania danych.
Myślę, że można to nazwać redukcją złożoności przypadkowej (technicznej),
jaka jest konsekwencją i immanentną właściwością SPA, lub nawet szerzej: AJAXa.

W kontekście zapisów nowości w v13+ nakierowane są w mojej opinii jeszcze bardziej na DX,
z uwagi na wprowadzenie **akcji**.
W akcjach również nie używamy RESTa, ale raczej wracamy do sprawdzonej techniki,
jaką są wysyłalne (submittable) formularze.
Właściwie, to nawet nie chodzi o same formularze (akcji można używać nawet bez nich),
ale o koncepcję wysyłania danych pod obecny URL.

Oczywiście nasuwa się myśl:
po co rezygnować z ukochanego RESTa na rzecz jakiegoś starożytnego wzorca?
Spróbujmy odpowiedzieć na to w ten sposób:
wyobraź sobie, że nie musisz wystawiać endpointa dla każdej jednej operacji modyfikacji,
bo zamiast tego możesz po prostu wywołać z klienckiego komponentu funkcję,
a całą obsługą po stronie sieciowej zajmie się biblioteka.
Tak, coś jakby RPC.
I to właśnie dają akcje.

## Przemyślenia

Jest jasnym, że w next 13+ możemy wciąż robić to wszystko, co robiliśmy w SPA,
w szczególności używać RESTa do odczytów i zapisów,
jednak nowy zestaw ficzerów oferuje prostotę i wydajność,
które wydają się sensownym ustawieniem domyślnym.

Cieszę się, że dotarliśmy do miejsca,
gdzie udało się uchwycić szerszy wycinek rzeczywistości,
wypełnić luki i wykorzystać sprawdzone rozwiązania,
zamiast tworzyć kolejne napędzane hajpem i skupione na jednym aspekcie.

### Wyzwania

Wiemy już o benefitach, ale jak wiadomo,
wszystko ma swoją cenę.

Po pierwsze, dodawanie nowych funkcjonalności w oczywisty sposób zwiększa złożoność,
choćby z uwagi na konieczność dokonywania wyborów.
Podejrzewam, że mogło to skłonić autorów do wprowadzenia zmian API właśnie teraz.
Nowy router bazuje na strukturze plików i nie ma już `getServerSideProps` i `getStaticProps`.
Każdy może sam ocenić, czy nowe API jest prostsze, czy nie,
a z moich obserwacji wynika, że społeczność zdaje się pochwalać ten kierunek.

Możliwe, że słyszeliście już o zagrożeniach bezpieczeństwa w kontekście
[przykładu pokazanego na konferencji nexta](https://youtu.be/9CN9RCzznZc?list=PLBnKlKpPeagl57K9bCw_IXShWQXePnXjY&t=939),
który stał się viralem.
Wielu ludzi drwiło i powstało wiele memów,
sęk w tym, że większość z nich było kulą w płot —
demo przedstawiało funkcjonalność w najprostszy możliwy sposób.
Żarty ze złej architektury (wołanie bazy ze zbyt wysokiej warstwy) są więc nieuczciwe, bo nie o to chodziło.
Z kolei zarzuty i szyderstwa dotyczące SQL injection, to zwyczajna ignorancja,
bo pomimo braku jawnego użycia parametryzowanej kwerendy (parametrized query),
zastosowana tam technika — template string —
działa w podobny sposób, czyli rozbija argumenty,
a dodatkowe, potencjalnie niebezpieczne wstawki są ignorowane.
Więcej o tym konkretnym przypadku znajdziesz [tutaj](https://youtu.be/2Ggf45daK7k?t=75).

Jestem jednak skłonny przyznać,
że z uwagi na brak narzuconej separacji w homogenicznych aplikacjach,
musimy sami być bardziej ostrożni.
Mam tu jendak dobrą wiadomość —
react już ma pewne zabezpieczenie, zwane
[taints](https://react.dev/reference/react/experimental_taintObjectReference),
które umożliwia wymuszanie bezpieczeństwa poprzez oznaczanie obiektów jak serwerowych.
Bardzo pożyteczna rzecz, choć sam uważam,
że ten problem może (a może nawet: powinien)
być również obsłużony na poziomie architektury.
Więcej o tym w następnej sekcji.

### Nowe szanse

Wiemy już o tych wszystkich korzyściach dla użytkowników i programistów płynących z użycia nowych ficzerów.

Chciałbym jednak wskazać na jeszcze jedną rzecz.
Jest ona w mojej opinii pośrednio związana z zagrożeniami wspomnianymi w poprzedniej sekcji.
Jest pewna
[słynna anegdota na temat chińskiego słowa 'kryzys'](https://en.wikipedia.org/wiki/Chinese_word_for_%22crisis%22).
W skrócie chodzi o to, że słowo kryzys oznacza również 'szansa'.

Sądzę, że może to mieć zastosowanie w sytuacji, którą tu omawiamy.
Mamy bowiem szansę przemyśleć na nowo sposób organizacji kodu logiki biznesowej w aplikacjach node'owych,
bo akcje jako **dodatkowy** punkt wejściowy może być świetną okazją do przemyślenia architektury przez ludzi,
którzy do tej pory znali tylko jeden entry-point: API RESTowe.

Mamy tu wiele możliwości, zależnie od preferencji i potrzeb.
Wspominałem już wcześniej,
o problemach z anemicznymi modelami i w tym miejscu upatrywałbym potencjału do poprawy tego stanu rzeczy.
Wydzielanie współdzielonej logiki może skłonić programistów do myślenia bardziej czasownikami niż rzeczownikami.
Lub nawet ogólniej: bardziej o funkcjonalnościach i domenie, mniej o strukturze danych.

Sam wykonałem takie ćwiczenie, można to podejrzeć
[tu](https://github.com/frankiewiczkamil/do-gather).

## Podsumowanie

Myślę, że next 13+ to duży krok naprzód.
Nawet nie ze względu na konkretne ficzery,
ale fakt, że wypełnia luki w ekosystemie.

Dodatkowo wprowadza on potencjał zmiany w myśleniu o architekturze i mam nadzieję,
że ten trend udzieli się również w innych rozwiązaniach.

A skoro już przy innych rozwiązaniach —
zdaję sobie sprawę, że pewne podobne pomysły już zostały zrealizowane w innych bibliotekach,
jak [hotwire](https://hotwired.dev/) czy [liveview](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html),
ale myślę, że next.js ma szansę wprowadzić je do mainstreamu.
Co więcej, robi to z nieco innej pozycji choćby dlatego,
że wymienione hotwire i liveview przynależą do ekosystemów odpowednio: ruby'ego i elixira,
co ma techniczne implikacje w kontekście (braku) uzyskania pełnej homogeniczności.

Idąc dalej, wspomniane biblioteki razem z [island architecture](https://docs.astro.build/en/concepts/islands/)
([astro](https://docs.astro.build/), [fresh](https://fresh.deno.dev/)),
[qwik](https://qwik.builder.io/)
i [solid start](https://start.solidjs.com/getting-started/what-is-solidstart)
zdają się być częścią szerszego trendu.
Widzę to jako próbę jeszcze lepszego dostosowania narzędzi do naszych potrzeb,
przez bardziej granularne podeście.
Podoba mi się ten kierunek i czekam, jak się to będzie rozwijało.

Na koniec jeszcze wspomnę,
że takie stawianie pytań może prowadzić do kwestionowania nawet bardziej fundamentalnych konceptów,
jak przepływ danych, kto jest ich właścicielem, gdzie i kiedy zapewniana jest spójność niezmienników.

Sam trzymam kciuki również za ruch local-first,
który na pierwszy rzut oka może się wydawać sprzeczny i niekompatybilny z architekturą serwerocentryczną,
jednak dla mnie w istocie jest bardziej dopełnieniem.
Celem jest bowiem dobre rozwiązanie,
a środkiem używanie adekwatnych narzędzi do problemu i budowanie mostów między nimi✌️

Dziękuję, za Twój czas i do następnego razu🖖

[^1]: W niektórych przypadkach logika na froncie może mieć sens —
jak w przypadku aplikacji typu local-first,
jednak co do zasady niezmienniki powinny być pilnowany w jednym miejscu,
którym w większości biznesów (e-commerce itd) jest jednak serwer
