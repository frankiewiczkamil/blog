---
title: Wyzwania oprogramowania opartego o AI 
publishedAt: 2025-08-02
editedAt: 2025-08-02
description: 'Wyzwania płynące z proliferacji udziału AI w procesie wytwarzania i dostarczanie oprogramowania'
author: kpf
tags: [ AI, Vibe coding, black-box, future, challenges ]
image:
  url: 'ai-robot-and-programmer'
  alt: 🤖
draft: false
---

Jak ustaliliśmy w poprzednim wpisie, AI może nam pomóc w naszym oprogramowaniu na z grubsza dwa sposoby:

- Generowanie klasycznego kodu w istniejących językach
- Zastępowanie istniejących artefaktów kodu wywołaniami AI

W tym wpisie skupię na konsekwencjach płynących z ich użycia oraz rozszerzę nieco ten podział.

Nie ulega wątpliwości, że niezależnie od naszego poziomu umiejętności, AI sprawia,
że możemy dostarczać szybciej i więcej.
Taka sytuacja jest w ogólności pozytywna, jakkolwiek niesie ze sobą również pewne wyzwania.
Powód jest prozaiczny: więcej kodu to większa złożoność, a gdzie większa złożoność, tam trudniej wprowadzać zmiany.
Jest to istotne, bo unikalną cechą oprogramowania jest niemal nieskończona możliwość wprowadzania zmian[^1].

A przynajmniej teoretycznie, bo w praktyce produkt ma dla nas wartość jedynie wtedy,
gdy realizuje funkcjonalności zgodnie z naszymi oczekiwaniami.

Ryzyko wprowadzenia regresji nie jest oczywiście niczym nowym,
ale tempo i rodzaj wprowadzanych zmian to nieco inny temat.
Skala regresji wydaje się przyrastać szybciej niż wzrost funkcjonalności systemu,
podobnie jak wraz z powiększaniem systemu wydłuża się czas wprowadzania zmian.
Jest to powszechnie znana prawidłowość.

Co więcej, na naszych oczach popularność zdobywa coś, 
co zbiorczo nazwę podejściem typu black-box do wytwarzania oprogramowania.
Mam tu na myśli vibe coding, agenty i inne wariacje na temat wypuszczania kodu, 
w których ludzki udział ogranicza się do specyfikacji wymagań.

Warto zauważyć, że wytwarzanie kodu metodą black-box niepokojąco przypomina to, 
co nazwałem _zastępowaniem istniejących artefaktów kodu wywołaniami AI_.
Jest w pewnym sensie po prostu bardziej efektywnym obliczeniowo i bardziej przewidywalnym odpowiednikiem.
Trochę jak z różnicą między kodem kompilowanym a skryptem.

Oczywiście, AI może nas również proaktywnie wspierać w kontroli jakości, mitygując ryzyka regresji.
Jednak skuteczność tego połączenia jest dla mnie wciąż nieznana,
tzn. nie wiem, czy kontrola jakości będzie nadążać w typowych warunkach.
Mówiąc klasykiem: czas pokaże.

W następnym wpisie postaram się zaproponować główne założenia i techniki radzenia sobie z tymi wyzwaniami, 
a tymczasem pozdro! 🖖

---

[^1]: Będąc bardziej precyzyjnym nie chodzi jedynie o łatwość wprowadzenia zmian w samym kodzie --
projekty konstrukcji maszyn czy budynków pewnie też relatywnie łatwo zmienić.
Chodzi tu przede wszystkim o łatwość migracji istniejących wdrożeń produktu do nowych wersji, czyli utrzymania.