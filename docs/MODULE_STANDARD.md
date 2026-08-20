# Module standard

Every public or classified module declares itself with `tools/<slug>/wizard.module.json` against `schema/wizard.module.v1.schema.json`.

## Required fields

schema version, stable `id`, `slug`, `title`, `description`, `status`, `visibility`, `category`, `group`, `launch`, `readme`, `moduleVersion`, `stateVersion`, Verdigris targets, capabilities, tags. `preview` is optional and must exist on disk when set.

## Honesty

Do not claim `adapter`, `annotations`, `fixtures`, `events`, or similar capabilities before the feature exists. Prefer `unsupportedMethods` over fake methods.

## Visibility

| visibility | Meaning |
|---|---|
| `dashboard` | Active laboratory card |
| `legacy` | Kept for reference, no primary card |
| `internal` | Dependency or utility, no public card |
| `archive` | Files kept, absent from active surfaces |

The generated registry is the only active-card inventory. See `docs/ADDING_A_MODULE.md` and `docs/GENERATED_FILES.md`.
