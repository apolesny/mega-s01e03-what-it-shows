# Rendering the page

`rendered/4471-split.html` is generated from the real `.svx` with its components and layout (server-side render).
Nothing in it is typed by hand.

```
npm i svelte@5 vite @sveltejs/vite-plugin-svelte mdsvex     # in an empty scratch folder
node render.mjs <copy-of-repo-root> src/routes/kb/incidents/4471-split/+page.svx out.html
```
