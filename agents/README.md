# Asset Agent Workflow

Purpose: Enable an external AI (or human) asset agent to produce stylized 3D→sprite assets that plug directly into the game pipeline.

What the agent delivers
- Blender `.blend` file(s) per asset
- Rendered PNG frames (RGBA, transparent) named `action_dir_##.png` (e.g., `idle_e_01.png`)
- Optional: low-poly FBX/GLB exports

Folder conventions
- Input renders: `renders/<assetName>/...`
- Packed atlas output: `public/assets/<assetName>.png` + `public/assets/<assetName>.json`
- Packer script: `python scripts/packer.py --src renders/<assetName> --out public/assets --cols 12 --tile 256 --downscale 2`

Game integration
- Loader tries to load atlas at runtime. If present, animations are auto-registered as:
  - `marine_idle_{n|ne|e|se|s|sw|w|nw}` (12 fps)
  - `marine_walk_{n|ne|e|se|s|sw|w|nw}` (12 fps)
- Naming is critical for auto-wiring.

Usage
1) Place renders in `renders/<assetName>/` with correct naming.
2) Run the packer (see above) to produce atlas + JSON.
3) Refresh the game; the asset should be used automatically where coded (e.g., marine in `MainScene`).

See also
- `agents/asset_agent_spec.json`: machine-readable spec for an asset agent
- `agents/style_guide.md`: stylistic constraints and technical targets
- `agents/jobs/tasks.jsonl`: job queue for asset requests
