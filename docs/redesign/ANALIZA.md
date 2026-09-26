# Analiza danielmilewski.com: SEO i design (wrzesień 2026)

## SEO: co jest dobrze

- Metadane per strona (`buildMetadata`), canonical, hreflang `en` / `pl` / `x-default`.
- JSON-LD: Person, WebSite, ProfilePage, BlogPosting, BreadcrumbList, FAQPage, Service.
- Sitemap z `lastModified`, RSS, `robots.txt` z Content-Signal, `llms.txt`, dynamiczne OG images.
- Strony statyczne (`force-static`), lokalne fonty, obrazy WebP.

Technicznie strona jest w lepszym stanie niż większość portfolio. Najwięcej do zyskania jest w treści i pozycjonowaniu na frazę.

## SEO: problemy (od najważniejszych)

1. **Brak frazy docelowej w title i H1.** Title to `Daniel Milewski — Software Engineer`, a H1 to „I build reliable backend systems, APIs, and software for real products.”. Nigdzie w kluczowych miejscach nie ma „Senior Python Developer”, chociaż to rola, której szukasz. Proponuję:
   - title: `Daniel Milewski — Senior Python Developer (FastAPI, Backend, AI)`
   - H1 z imieniem i rolą, np. „Daniel Milewski — Senior Python Developer”.
2. **Niespójny jobTitle.** `personSchema` ma `jobTitle: "Software Engineer"`, strona About ma „Senior Python Developer”, a meta description mówi „Software engineer”. Wybierz jedną wersję i używaj jej wszędzie.
3. **Komunikat o dostępności działa przeciwko Tobie.** Hero i About mówią „Not open to new full-time engagements”. Rekruter, który trafi na stronę, uzna, że nie ma po co pisać. Jeśli szukasz roli, zmień to na np. „Open to senior Python roles · remote EU”.
4. **Root `/` robi redirect 307** (`src/app/(redirects)/page.tsx`). 307 jest tymczasowy. Dla stałego przekierowania na `/en` lepszy jest 308/301 (np. przez `redirects()` w `next.config.ts`), żeby moc linków do domeny głównej trafiała na `/en`.
5. **Nieprawidłowy SearchAction.** `websiteSchema` deklaruje wyszukiwarkę `/blog?q=`, a blog nie obsługuje parametru `q`. Google i tak wycofał sitelinks search box (2024). Do usunięcia.
6. **Mało i nieświeżej treści.** 3 posty z 2024 roku i 2 case studies. Treść jest dla portfolio najsilniejszym sygnałem SEO. Pomysły na posty pod frazy rekrutacyjne i long-tail: „FastAPI + SQLAlchemy 2 async w produkcji”, „FIFO cost basis w Pythonie” (z InvestTrackera), „Testowanie pipeline'ów danych w pytest”.
7. **Krótka meta description** (~90 znaków). Warto wykorzystać 140–160 znaków i dodać frazy: Python, FastAPI, PostgreSQL, remote.
8. **BlogPosting** ma `dateModified = datePublished` i nie ma `image`. Warto dodać obraz OG posta i prawdziwą datę modyfikacji.
9. **Zbędne pliki** w `public/`: `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` (pozostałości po create-next-app).
10. **Person schema** można wzbogacić o `worksFor` / `alumniOf`, `address` (Gdańsk) i `hasOccupation`.

## Design: diagnoza

- **Szablonowy wygląd.** Teal + pomarańcz, dot-grid, zaokrąglone karty z identycznym obramowaniem, pill-badge. Strona wygląda jak wiele stron z Tailwind UI i niczym się nie wyróżnia.
- **Za dużo sekcji o tej samej wadze.** Strona główna ma 9 sekcji (hero, strip, trust, projekty, expertise, about, writing, FAQ, CTA) i każda to „H2 + siatka kart”. Brak hierarchii, zbyt długi scroll.
- **Brak zdjęcia na stronie głównej.** Masz dobre zdjęcie portretowe, ale pojawia się tylko na About. Przy szukaniu pracy twarz buduje zaufanie.
- **Projekty są schowane.** Screeny InvestTrackera to najmocniejszy dowód umiejętności, a na stronie głównej są małe, obok ściany tekstu.
- **Baner cookies zasłania CTA w hero** przy pierwszym wejściu.
- **Emoji jako ikony** w sekcji Expertise (w danych `en.json`).
- **Logo** (monitor z `</>`) jest generyczne i nie pasuje do reszty identyfikacji.

## 3 nowe kierunki

Pliki HTML w tym katalogu (prototypy strony głównej, light + dark, responsywne):

| Wersja | Plik | Idea |
|---|---|---|
| A. Datasheet | `v1-datasheet.html` | Strona jako karta katalogowa podzespołu elektronicznego: numer części, Features, schemat blokowy, tabele parametrów, „revision history” jako doświadczenie. IBM Plex, czerwony akcent. |
| B. Poster | `v2-poster.html` | Odważny plakat: kobaltowy hero, szeroki krój Archivo Expanded, zdjęcie w duotonie, duże case studies z screenami na pierwszym planie, wielki e-mail w stopce. |
| C. API Reference | `v3-reference.html` | Strona jako dokumentacja Pythona: sidebar, sygnatura klasy, Parameters, Quickstart z `>>>`, Changelog jako doświadczenie. Kolory Pythona (niebieski/żółty). |

Wszystkie trzy mają jedno H1 z imieniem i „Senior Python Developer”, status dostępności na górze i zdjęcie na stronie głównej.
