# Component conventions

- `svelte/src/App.svelte` owns site-wide UI such as `Header` and `BottomCorners`. Keep fixed frame elements there, not inside individual page sections.
- Page templates live in `svelte/src/templates/`; reusable homepage sections live in `svelte/src/components/home/` and receive their data from the template.
- CKEditor chunks are rendered in `svelte/src/components/cke/`: `Cke.svelte` dispatches chunks to components such as `Image.svelte` and `Buttons.svelte`, while `Richtext.svelte` wraps the output. Keep image markup in `Image.svelte`, not inline in `Cke.svelte`.
- When adding a CKEditor chunk type, query its fields in `svelte/src/queries/entry.graphql` and preserve it in `svelte/src/lib/queriesUtils.ts` before rendering it.
