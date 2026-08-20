# Adding a module

1. Create `tools/<slug>/` with a launch `index.html` and a README.
2. Add `wizard.module.json` using `schema/wizard.module.v1.schema.json`.
3. Set `visibility` to `dashboard` only if it belongs on the laboratory surface.
4. Declare only capabilities that exist.
5. Run `node scripts/wizard-lab.mjs generate`.
6. Run `node scripts/wizard-lab.mjs verify`.
7. Keep the direct launch URL stable.

Do not add a card by editing `index.html`. The dashboard reads `modules.generated.js`.
