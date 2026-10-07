# Find Us Footer Feature

This change adds a managed "Find Us" section to the footer, allowing administrators to configure location and contact links displayed alongside social media. The feature is fully language-aware and tied to the frontend language toggle.

**Watch for:** Verify that the links array is safely deserialized in the backend public endpoint, that the admin panel correctly serializes JSON before storage, and that both frontend components handle missing/empty data gracefully.

**Verdict**: APPROVED

## High-level view

The Find Us section is exposed through a new `/find-us` public endpoint that reads three keys from the SiteSettings table: the Turkish title, English title, and a JSON-encoded links array. The admin panel provides a dedicated tab under System Settings where managers can define and edit the section title in both languages and add multiple links with labels, URLs, and optional icon hints.

In the frontend Footer component, the section only renders when links exist (checked via `findUsData?.links?.length > 0`), placing it as a new column alongside the Platforms (social media) section. Language is detected from i18n state and applied to both titles and link labels. The useFindUsLinks hook follows the same query pattern as other frontend hooks—10-minute stale time, single request key, no retry logic.

The implementation correctly uses getSettingsGroup within updateSettings to read and respond with the fresh state after a PUT, maintaining the pattern established for other setting groups. No intermediate serialization/deserialization issues exist because the admin panel explicitly calls JSON.stringify before sending and the backend stores it as a string, with the public endpoint correctly parsing it back on read.

<details>
<summary>Issues (0)</summary>

No blocking concerns. Implementation is sound.

</details>

<details>
<summary>Details</summary>

### Backend endpoint: Safe JSON handling

The `/find-us` endpoint fetches three SiteSettings keys in parallel and explicitly tries to parse the links value as JSON. If parsing fails (empty, malformed, or missing), it falls back to an empty array—never throwing. This is **confirmed** safe: the try-catch at lines 151–153 in backend/src/routes/index.ts protects against malformed stored data.

The endpoint responds with title_tr/title_en (string) and links (array). Both are guaranteed to be present in the response shape, with sensible defaults ('Bize Ulaşın' and 'Find Us' if keys don't exist). This guards against frontend surprises if the admin has never saved Find Us data.

### Admin panel: Correct JSON serialization

The FindUsTab component loads from `/admin/settings/find_us`. When data is fetched, it runs JSON.parse on the find_us_links value, with a try-catch that defaults to an empty array on parse failure. This is **confirmed** at lines 1520–1524 in admin Settings index.tsx.

On save, the component explicitly calls JSON.stringify(links) before sending the PUT, correctly serializing the array as a string. The endpoint receives it via updateSettings, which calls updateSettingsGroup to store it exactly as sent. This two-way flow—parse on read, stringify on write—is consistent and prevents corruption.

The admin UI seeds with sample data if no links exist, making the experience less daunting for first-time setup. Links are assigned UUID-like IDs (Date.now().toString()), which is sufficient for client-side uniqueness within a single session (unlikely to have collisions in the span of adding a few links).

### Frontend footer: Graceful empty state and language handling

The footer checks `findUsData && findUsData.links && findUsData.links.length > 0` before rendering the section. This is **confirmed** at line 238 in Footer.tsx. If the API returns null, or if links is undefined or empty, the section is not rendered—no layout shift, no console errors.

Language selection is applied correctly: `pageLanguage === 'en' ? findUsData.title_en : findUsData.title_tr` (line 241) for the heading, and `pageLanguage === 'en' ? link.label_en || link.label_tr : link.label_tr` for each link's label. The fallback to label_tr if label_en is missing is pragmatic—if the admin didn't fill in both, showing TR is better than showing blank.

The useFindUsLinks hook returns via React Query with a 10-minute stale time, matching other frontend hooks. It does not specify retry logic, so transient 5xx errors won't trigger retries; however, this is acceptable for non-critical UI (the footer simply omits the section if the fetch fails).

### Code patterns: Consistency with existing features

The admin FindUs tab mirrors the structure of SocialMediaTab and other setting groups—uses the generic updateSettings endpoint with a prefixed group name (find_us), leverages the SectionCard and Field wrapper components, and includes a SaveBar for save/error/success feedback. This is **confirmed** consistent with the Notifications, Payments, and other tabs in the same file.

The frontend hook follows the useSocialLinks pattern: single query key, GET request to a public endpoint, typed response, 10-minute stale time. Locale keys are added correctly to both en.json and tr.json with "footer.findUs" and matching Turkish translation "footer.findUs" → "Bize Ulaşın".

### Locale keys: Complete coverage

The locale file updates add "footer.findUs" entries to both en.json (line in footer section: "findUs": "Find Us") and tr.json ("findUs": "Bize Ulaşın"). These match the admin defaults and provide fallback text if the SiteSettings keys are ever missing or reset. **Confirmed** present in both files; no translation gap exists.

</details>

<details>
<summary>Files changed</summary>

- `backend/src/routes/index.ts` — New `/find-us` public endpoint that fetches and parses Find Us settings from SiteSettings.
- `admin/src/pages/Settings/index.tsx` — New FindUsTab with title and link management UI; integrated into the tab list as 'findus'.
- `frontend/src/hooks/useFindUsLinks.ts` — New query hook that fetches Find Us data; matches existing hook patterns (useSocialLinks, etc.).
- `frontend/src/components/layout/Footer.tsx` — New Find Us section rendered conditionally between Platforms and footer copyright, with language-aware titles and labels.
- `frontend/src/locales/en.json` — Added "footer.findUs": "Find Us".
- `frontend/src/locales/tr.json` — Added "footer.findUs": "Bize Ulaşın".

[Full diff](https://github.com/)

</details>
