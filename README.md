# HA Resource Hub (Astro + Decap CMS)

Projekt je migracija `design.html` predloška u strukturirani Astro setup s Decap CMS-om.

## Pokretanje

```bash
npm install
npm run dev
```

Aplikacija je dostupna na `http://localhost:4321`, a CMS na `http://localhost:4321/admin` (radi i `/admin/`).

## Local CMS backend (preporučeno za lokalni rad)

U drugom terminalu pokreni:

```bash
npm run decap
```

## Struktura sadržaja

- `src/content/site/home.yml`: globalni sadržaj i svi statični segmenti stranice.
- `src/content/integrations/*.yml`: dinamične integracije (dodavanje/brisanje kroz CMS).
- `src/content/scripts/*.yml`: dinamične skripte/resursi.
- `src/content/projects/*.yml`: dinamični projekti.
- `public/admin/config.yml`: Decap CMS konfiguracija.

## Napomena za deploy

Decap konfiguracija koristi `git-gateway` backend. Za produkciju treba omogućiti Git Gateway/Identity na platformi gdje deployaš (npr. Netlify) ili prilagoditi `backend` dio u `public/admin/config.yml`.
