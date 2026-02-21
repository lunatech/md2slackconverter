# md2slackconverter

A browser-based tool that converts standard Markdown to Slack [`mrkdwn`](https://docs.slack.dev/messaging/formatting-message-text/) format.

Paste Markdown on the left, get Slack-ready output on the right. Conversion happens entirely in the browser — no backend, no data sent anywhere.

## Conversion rules

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

## Static build

```bash
cd src
npm run build
```

Outputs a self-contained `src/dist/` folder. Open `src/dist/index.html` directly in a browser or serve it from any static host (GitHub Pages, Netlify, S3, etc.).

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

The `gh-pages` branch now hosts a single-file static experience (`index.html`) that pulls `marked` from CDN and runs entirely in the browser. Open it directly or publish the branch via GitHub Pages to get Markdown → Slack mrkdwn working without any build tooling.
