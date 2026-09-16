# Verdigris Ladder Sorter

This local UI sorts whole character reference boards from:

`C:\Users\Alex\Downloads\separate_chars`

into the existing folders under:

`C:\Users\Alex\Downloads\ladders`

Run `launch_ladder_sorter.cmd` or:

```powershell
python ladder_sorter.py
```

The browser opens at `http://127.0.0.1:8766/`.

## Review workflow

- Every character board is assigned independently. A four-download batch does
  not imply shared faction or attribute axis, and `(1)` through `(4)` output
  position does not identify a faction.
- Numbered output position is retained only as feedback metadata.
- The current batch was visually classified one image at a time with an
  explicit confidence and evidence note. These best-effort assignments are
  shown in the review queue before they are treated as confirmed.
- Confirming a guess or changing its faction, axis, or tier records both the
  old and final labels as reusable feedback.
- `Ignore — not a character` moves constructs, contact sheets, and unusable
  boards out of the active ladders into `.ladder-sorter/ignored`. Ignoring is
  logged, visible through `Show reviewed / ignored`, and undoable.
- Destination collisions never overwrite an existing file.
- The last confirmation or correction can be undone after its hash and paths
  are checked.
- Images are moved intact. Character boards with surrounding item studies are
  not cropped or modified.

Every assistant guess, confidence, move, manual correction, note, file hash,
source position, and undo is appended to:

`C:\Users\Alex\Downloads\ladders\.ladder-sorter\feedback.jsonl`

Session state and the undo stack live beside it in `state.json`.
