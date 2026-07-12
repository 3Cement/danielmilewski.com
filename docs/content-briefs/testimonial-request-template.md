# Asking for a real testimonial

The audit flagged that `TrustSection` on the homepage lists company names,
roles, and domains, but no actual quote from a real person — which is the
strongest trust signal available and currently missing. This isn't something
I can fill in for you: a testimonial only works (and is only honest) if it's
a real sentence from a real person who worked with you. Fabricating one, or
attaching schema.org `Review`/`AggregateRating` markup to a self-published
quote, is also explicitly against Google's guidelines (see the audit report).

Below is a short, low-friction message you can send as-is (or adapt) to
people from the `trust.companies` list in `messages/en.json` — an Energy
Aspects / JIT Team / Equiti contact, the DeMāre Studio owner, or anyone else
who directly experienced the work.

## English version

> Hi [Name] — quick favor. I'm updating my portfolio site and want to add a
> short quote from someone who's actually worked with me, instead of just
> listing companies. Would you be up for writing 1-2 sentences about what it
> was like working together, or what stood out about the work? Totally fine
> to keep it short and informal — I'll only use it with your name/role and
> your OK on the exact wording first.

## Polish version

> Cześć [Imię] — mała prośba. Aktualizuję swoje portfolio i chciałbym dodać
> krótką opinię od kogoś, z kim faktycznie współpracowałem, zamiast samego
> wypisywania firm. Miałbyś/Miałabyś ochotę napisać 1-2 zdania o tym, jak Ci
> się ze mną współpracowało albo co zapadło Ci w pamięć? Może być krótko i
> nieformalnie — użyję tego dopiero po Twojej akceptacji dokładnej treści.

## Once you have 1-3 real quotes

Send them to me with: the person's name, their role/company (only what
they're comfortable being public), and confirmation they're OK with it being
published. I'll add them to `TrustSection` as plain attributed text — **not**
wrapped in `Review`/`AggregateRating` schema, per the audit's guidance — and
keep the wording exactly as given.
