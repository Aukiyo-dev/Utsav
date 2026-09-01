# Utsav V6 — Vercel Web Analytics

Added the static HTML Vercel Web Analytics bootstrap to all festival pages and the homepage.

Pages updated:
- index.html
- durga-puja-countdown/index.html
- kali-puja-countdown/index.html
- mahalaya-countdown/index.html

The following script block is present once per page, inside `<head>`:

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

Also included:
- package.json
- package-lock.json
- .gitignore

No festival/SEO/player functionality was intentionally removed.
