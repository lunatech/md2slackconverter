## CLI DOM Test

- Run Vitest in a `jsdom` environment (set `testEnvironment` or configure `vitest.config.js`) so `main.js` can touch `document`.
- Provide an HTML fixture that mirrors `src/index.html` and assign it to `document.body.innerHTML` before importing `main.js`, ensuring `md-input`, `slack-output`, and `copy-btn` exist.
- Mock `navigator.clipboard.writeText` (and `requestAnimationFrame` if necessary), then simulate input/scroll/click events to assert output syncing, scroll mirroring, and copy-button feedback.
- Focus the new suite on the DOM wiring; the converter logic already has coverage in `converter.test.js`.
