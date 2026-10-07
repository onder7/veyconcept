# Implementation Plan: Add 'Find Us / Bize Nereden Ulaşırsınız' Section to Footer

## Overview
Add a managed 'Find Us' section to the frontend footer, with admin panel controls in System Settings. The feature allows admins to set section title (TR/EN) and manage links with labels, URLs, and optional icons. The section displays conditionally in the footer (next to Platformlar) when data exists.

Storage and API pattern follow existing conventions: settings stored as JSON strings in SiteSettings KV table using prefix `find_us_`, public API endpoint at `/api/find-us`, admin endpoints using existing `/api/admin/settings/:group` pattern with group `find_us`.

---

## Implementation Steps

### Backend Implementation

- [ ] 1. Add `/api/find-us` public endpoint in backend to read Find Us data.
      Read `find_us_links` and `find_us_title_<lang>` from SiteSettings via `getSettingsGroup('find_us_')`.
      Return structured data: `{ title_tr, title_en, links: [] }` where each link is `{ label_tr, label_en, url, icon }`.
      If not yet configured, return empty structure (title defaults to empty, links is empty array).
      Files: `c:/Users/OHOME/Documents/node/veyconcept/backend/src/routes/index.ts`
      Verify: Restart backend dev server and test `curl http://localhost:5000/api/find-us` — should return valid JSON.

- [ ] 2. Admin backend endpoints are already covered by the generic `/api/admin/settings/:group` pattern.
      No changes needed; the pattern already supports group `find_us` via `getSettings('find_us')` and `updateSettings('find_us')`.
      The service layer stores JSON in `find_us_links` and individual keys `find_us_title_tr`, `find_us_title_en`.
      Files: No changes (existing pattern sufficient)
      Verify: Conceptual — will be verified in admin tab implementation.

### Admin Panel Implementation

- [ ] 3. Add 'Bize Ulaşın' tab to admin Settings page with management UI for Find Us links.
      Add to TabKey union type: `'findUs'`.
      Add to TABS array with label 'Bize Ulaşın' and an appropriate icon (e.g., map pin or help icon).
      Create `FindUsTab()` component following the SocialMediaTab pattern:
        - Load settings from `/admin/settings/find_us` on mount.
        - Manage form state: `find_us_title_tr`, `find_us_title_en`, `find_us_links` (stored as JSON string internally).
        - Display two text inputs for titles (TR and EN).
        - Render an editable list of links. Each link row: label_tr input, label_en input, url input, icon input (optional), delete button.
        - Add "Add Link" button to append new link objects.
        - Parse `find_us_links` JSON string from API response; serialize it back before save.
        - Use SaveBar for save/reset/status.
      Files: `c:/Users/OHOME/Documents/node/veyconcept/admin/src/pages/Settings/index.tsx`
      Verify: Open admin panel, navigate to Settings → Bize Ulaşın tab. Form loads without errors. Add a test link (label_tr='Ofis', label_en='Office', url='https://...', icon='MapPin'), save, refresh, confirm data persists.

### Frontend Hook Implementation

- [ ] 4. Create `useFindUsLinks` hook in frontend, modeled after `useSocialLinks`.
      Hook calls `/api/find-us`, caches with 10-minute stale time.
      Returns `{ title_tr?: string, title_en?: string, links: Array<{ label_tr: string; label_en: string; url: string; icon?: string }> }`.
      Files: `c:/Users/OHOME/Documents/node/veyconcept/frontend/src/hooks/useFindUsLinks.ts`
      Verify: Create a simple test file `frontend/src/hooks/useFindUsLinks.test.ts` or manually test by importing the hook in a component and logging its data.

### Frontend Footer Component Update

- [ ] 5. Integrate Find Us section into Footer component.
      Import `useFindUsLinks` hook.
      Call hook to fetch data. Render section conditionally if data exists and links array is not empty.
      Section placed next to (after) the Platformlar (social links) section in the grid.
      Update grid from `md:grid-cols-5` to `md:grid-cols-6` to accommodate the new section (or use conditional column count).
      Render section with:
        - Title from `find_us_links.title_tr` (Turkish) or `find_us_links.title_en` (English) based on i18n language.
        - List of links: each link is an anchor (`<a>`) with:
          - Display text: `link.label_tr` or `link.label_en` based on language.
          - href: `link.url`.
          - icon (if provided): display as text or map to a simple icon component (optional; can start with text label).
      Style links consistently with existing footer links (hover effects, text-muted-foreground, etc.).
      Files: `c:/Users/OHOME/Documents/node/veyconcept/frontend/src/components/layout/Footer.tsx`
      Verify: Build frontend and navigate to footer. Confirm new section is not visible initially (no data), then add data in admin panel, refresh, and confirm section appears with correct title and links.

### Locale Keys Addition

- [ ] 6. Add locale keys for the Find Us section label in both TR and EN locale files.
      Add to `tr.json` under `footer` section: `"findUs": "Bize Ulaşın"`.
      Add to `en.json` under `footer` section: `"findUs": "Find Us"`.
      Files: 
        - `c:/Users/OHOME/Documents/node/veyconcept/frontend/src/locales/tr.json`
        - `c:/Users/OHOME/Documents/node/veyconcept/frontend/src/locales/en.json`
      Verify: Search for the new keys in both files and confirm they are present and correctly nested.

### Deployment

- [ ] 7. Commit changes to feature branch and push to trigger CI/CD.
      Create commit with message: "feat: Add Find Us section to footer with admin management"
      Push to branch (not directly to main/master).
      Verify: CI/CD pipeline runs and passes (check `.github/workflows/deploy.yml` logs).

---

## Summary of Files to Create or Modify

**Create:**
- `c:/Users/OHOME/Documents/node/veyconcept/frontend/src/hooks/useFindUsLinks.ts`

**Modify:**
- `c:/Users/OHOME/Documents/node/veyconcept/backend/src/routes/index.ts` — add `/api/find-us` endpoint
- `c:/Users/OHOME/Documents/node/veyconcept/admin/src/pages/Settings/index.tsx` — add FindUsTab, update TabKey, update TABS array
- `c:/Users/OHOME/Documents/node/veyconcept/frontend/src/components/layout/Footer.tsx` — integrate Find Us section
- `c:/Users/OHOME/Documents/node/veyconcept/frontend/src/locales/tr.json` — add footer.findUs
- `c:/Users/OHOME/Documents/node/veyconcept/frontend/src/locales/en.json` — add footer.findUs

---

## Design Decisions

1. **Storage in SiteSettings with prefix `find_us_`**: Follows existing social links pattern. Keys: `find_us_title_tr`, `find_us_title_en`, `find_us_links` (JSON array).
   
2. **JSON array for links**: Each link object is `{ label_tr, label_en, url, icon }`. Stored as single JSON string in `find_us_links` key for simplicity and atomicity.

3. **Public API endpoint `/api/find-us`**: Simple read-only endpoint, no auth required, matches social-links pattern. Enables frontend to fetch independently of admin configuration state.

4. **Admin tab added to existing Settings page**: Reuses existing tab infrastructure (`useSave` hook, `SaveBar`, etc.) to minimize custom code and maintain UI consistency.

5. **Conditional rendering in footer**: Section only displays if `find_us_links` is provided and contains data. Grid columns adjusted or conditional to maintain responsive layout.

6. **Icon field optional**: Stored as string (e.g., icon name or emoji). Can be displayed as text or later mapped to icon components without requiring migration of existing data.

7. **Bilingual titles (TR/EN)**: Titles and link labels support both languages. Frontend selects based on i18n language. Admin panel provides inputs for both.
