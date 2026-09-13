# Local image prompt library

These tools build a personal, local archive from Codex sessions, saved prompt files,
ChatGPT exports, and explicit prompt-to-image provenance manifests. Do not place
personal archives in a public repository or publish them as part of the lab dashboard.

Requirements: Python 3.11+, ripgrep (`rg`), and Pillow for result thumbnails. The
collector and browser catalog need no API keys or paid generation calls. No historical
code is executed. Source conversations and original images are never modified.

## Collect

Choose an output directory outside a published repository. For example:

```powershell
python scripts/collect-image-prompts.py --output '<archive directory>' --sessions '<Codex home>/sessions' --sessions '<Codex home>/archived_sessions' --files '<project or downloaded asset folder>' --session-index '<Codex home>/session_index.jsonl'
```

Repeat `--files` for additional roots. `--exclude-session <id>` excludes the current
collection task to avoid importing its quoted examples. File discovery includes
ignored prompt folders and excludes dependency directories. Files larger than 20 MB
are excluded from the saved-file scan; session logs are streamed without that limit.

Use `--merge` to retain an existing collection and add sources. A fresh run without
`--merge` rebuilds the index. Output text and thumbnail files are content addressed;
the tools do not delete older files that become unreferenced.

```powershell
python scripts/collect-image-prompts.py --merge --output '<archive directory>' --chatgpt-export '<export.zip or conversations.json>'
```

The ChatGPT importer follows parent links in each conversation branch. It selects
user requests associated with image generation, and captures available image-tool
prompts. It does not guess missing prompts from image titles. Deleted or unavailable
conversations cannot be recovered from a partial export. Browser captures can be
saved under `web-captures/<conversation-id>.json` with `url`, `title`, `messages`
(`role`, `text`, optional `id`), and optional `images` containing visible image labels.
Those labels alone are not used to pair thumbnails.

## Link results

```powershell
python scripts/link-image-prompt-results.py --output '<archive directory>' --generated-root '<Codex home>/generated_images'
python scripts/link-image-prompt-results.py --output '<archive directory>' --generated-root '<Codex home>/generated_images' --manifests-only --manifest '<item_manifest.tsv>' --manifest '<image_provenance.jsonl>'
```

The first pass links returned paths to their tool calls, including deferred
`functions.wait` cells. It scopes call IDs to their source logs. Multiple prompts
within one invocation are labelled as batch associations, not one-to-one pairings.

The manifest pass also reads the JSON/JSONL files already referenced by collected
prompt fields. It accepts explicit prompt text, a matching SHA-256 prompt ID, or a
known `prompt_path`, together with explicit output fields. Reference images are kept
separate from result images. Archived image hashes are checked when supplied; a
mismatch is not displayed as a valid result association. C2PA signatures are not
verified. Unknown mappings stay unknown.

Thumbnails fit within 320×320 pixels and preserve alpha. Originals retain their
file paths, dimensions, and SHA-256 hashes. No full-size images are duplicated.

## Browse and reuse

```powershell
python scripts/render-image-prompt-library.py --output '<archive directory>'
python -m http.server 8768 --bind 127.0.0.1 --directory '<archive directory>'
```

Open `http://127.0.0.1:8768/dist/index.html`, or open `dist/index.html` directly from
the archive directory. Keep the whole archive folder together. Links to original
files work when opened directly; browsers may block `file:` links from a localhost
page, in which case the original path is also shown. The catalog has no external
assets, analytics, network APIs, or account requirement.

- `prompts.jsonl`: exact text and all source evidence; SHA-256 identifies the text.
- `results.jsonl`: result associations and image evidence, including missing files.
- `prompts/`: individual original-text files suitable for copying into a workflow.
- `thumbnails/`: image thumbnails named by original-image SHA-256.
- `prompts.sqlite`: FTS5 prompt search and a `result_links` table after rendering.
- `coverage.json`, `result-coverage.json`: scan scope, counts, errors, and limits.
- `unresolved-calls.jsonl`: dynamic calls whose prompt was not statically recovered.
- `catalog/`, `START_HERE.md`: Markdown views and usage notes.

Submitted calls, archived revised prompts, saved files, user context, and unresolved
invocation candidates remain distinguishable. A saved prompt file is not proof of
a completed generation. Dynamic JavaScript interpolation is preserved as a candidate,
never executed or silently represented as the final prompt. Near duplicates and
revisions remain separate; only byte-identical prompt text is deduplicated.

No automatic schedule is created. Rerun collection, result linking, and rendering
to update the archive. Import additional exports with `--merge`.

## Verify the tools

```powershell
python tests/image-prompt-collector.test.py
python tests/image-prompt-results.test.py
```
