# md2slackconverter

A browser-based tool that converts standard Markdown to Slack [`mrkdwn`](https://docs.slack.dev/messaging/formatting-message-text/) format.

Paste Markdown on the left, get Slack-ready output on the right. Conversion happens entirely in the browser — no backend, no data sent anywhere.

## Conversion rules

All source assets live inside the `src/` folder; running `cd src && npm run build` produces the bundled single-page output under `src/dist/` (including the generated `index.html`, JS, and CSS) that you can push to GitHub Pages or any static host.

| Markdown | Slack mrkdwn |
|---|---|
| `**bold**` / `*bold*` | `*bold*` |
| `*italic*` / `_italic_` | `_italic_` |
| `~~strike~~` | `~strike~` |
| `` `inline code` `` | `` `inline code` `` |
| ` ```block``` ` | ` ```block``` ` |
| `[text](url)` | `<url\|text>` |
| `# Heading` | `*Heading*` |
| `> blockquote` | `>blockquote` |
| `- list` / `1. list` | `- item` / `1. item` |
| Literal `&` `<` `>` | `&amp;` `&lt;` `&gt;` |

## Local development

```bash
cd src
npm install
npm audit --audit-level=moderate
npm test
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Docker

```bash
cd src
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

```bash
cd src
docker compose down
```

## Testing

```bash
cd src
npm test
```

Run in watch mode during development:

```bash
npm run test:watch
```

## Static build & deployment

```bash
cd src
npm run build
```

The build step emits a self-contained `src/dist/` folder whose `index.html` is the single-page output you deploy to GitHub Pages (or any static host). Point your Pages workflow/source at `src/dist/` (or push that folder to `gh-pages`) rather than editing a root-level `index.html` by hand.

## Security

Dependencies are pinned to exact versions in `src/package.json`. `src/package-lock.json` is committed to ensure reproducible installs. Docker base images are pinned by digest in `src/Dockerfile`. `src/.dockerignore` limits build context (excludes `node_modules`, `.env`, etc.). Link output allows only `http://` and `https://` URLs.

`npm run build` produces a CycloneDX SBOM at `dist/sbom.json`; the Docker image includes it at `/usr/share/nginx/html/sbom.json`.

Check for vulnerabilities before shipping:

```bash
cd src
npm audit --audit-level=moderate
```

The final Docker image contains only `nginx` and static files — no Node.js, no `node_modules` in production.

## Stack

- [marked](https://github.com/markedjs/marked) — Markdown parser (AST-based, no regex)
- [Vite](https://vitejs.dev/) — build tool (dev only)
- nginx — static file server in Docker

## GitHub Pages

Automate `src/dist/` deployment (for example via `peaceiris/actions-gh-pages` or `gh-pages` branch) so each push to `main` builds the app and publishes the generated `index.html`. Set the Pages source to that branch or folder to serve the converted Slack mrkdwn experience without editing HTML manually.
