# Rejected first paint trial

These are retained diagnostics, not demo/game assets. They predate the owner's
corrected 48-pixel base-cell / 96x96 sprite contract.

Two paint calls used clean Blender pose sheets plus the approved character
appearance reference. Both returned RGB checkerboard failures. A targeted
transparency edit then returned RGB again for the male and native RGBA for the
female. Four built-in calls total; no local background removal was performed.

The user then required an explicit background=transparent setting. Generation
is paused because the available built-in imagegen schema exposes only prompt,
referenced_image_paths and num_last_images_to_include. No background parameter
is callable through that interface, and no OPENAI_API_KEY is set in this shell.
No more prompt-only retries are authorized by this correction.

These images have not passed Pixel Respecter reconstruction or camera parity
verification. Do not resize, color-key or silently promote them. The new
calibrated Blender references are under ../blender/; prompts for this older
trial and raw tool outputs remain here for provenance.
