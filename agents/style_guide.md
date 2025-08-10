# 8-bit Bootcamp Asset Style Guide

Aesthetic
- Retro-modern 8-bit: clean silhouettes, limited palette, crisp pixels
- Low-poly geometry; avoid noisy textures and microdetails
- Emphasize readable shapes and contrast over fine detail

Palette & Materials
- Limited colors per asset; prefer flat or toon shading
- Use emission for signage/glow; avoid glossy PBR looks
- Backgrounds subdued; character accents use #00FF88/#00FF00 sparingly

Camera & Framing
- Orthographic isometric (X=60°, Z=45°)
- Keep character centered; feet on consistent reference pixel row
- Allow slight headroom; avoid cropping extremities

Animation
- 12 fps idle and walk; small breathing on idle, clear locomotion on walk
- Loop cleanly; consistent stride length
- Keep motion arcs readable at downscaled resolution

Export & Naming
- PNG RGBA with transparent background
- `action_dir_##.png` (e.g., `idle_e_01.png`)
- Directions: n, ne, e, se, s, sw, w, nw

Performance
- Favor simple materials; avoid expensive post effects
- Target sheet after downscale: ≤ 2048×2048 where possible
- Optimize by splitting actions into separate atlases if needed

QA Checklist
- Transparent background present
- Feet alignment consistent frame-to-frame
- Naming and frame counts match spec
- Sheet packs with `scripts/packer.py` and loads in-game
