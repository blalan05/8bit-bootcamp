# Recruiting Station — Environment Description (Asset Brief)

Purpose
- First-person intro scene outside a Marine recruiting station
- Mood: respectful, aspirational, clean, retro-modern 8-bit aesthetic when downscaled

Overall Style
- Low-poly, clean silhouettes, flat/toon shading
- Strong read at small sizes; avoid microdetail
- Color palette: deep blues/charcoal exterior; interior warm amber glow
  - Accents: neon-like green (#00FF88 / #00FF00) for signage highlights

Scale & Framing
- Player POV ~1.65 m height
- Door height ~2.1 m, width ~0.95 m
- Posters ~0.6 m × 0.9 m each
- Sidewalk tiles ~0.6 m squares

Exterior (Street Side)
- Facade: dark painted brick or smooth stucco (low-frequency normal), charcoal (#1f2937)
- Door: single-pane glass in metal frame; center of facade; handle on right; darker metal frame (#374151)
- Windows: one narrow window panel left/right of door (optional), slight reflection
- Signage: subtle USMC text/insignia above door (flat emissive), no legal marks/logos
- Flag: simple rectangle on short pole; slight idle sway (animation-friendly)
- Posters: two framed posters flanking door, under glass
  - Left: “USMC” bold text, retro style
  - Right: “HONOR • COURAGE • COMMITMENT” (choose one word for readability)
- Pavement: sidewalk tile strip; curb hint; no cars/complex props

Interior (Seen Through Door When Opening)
- Warm ambient light (soft amber) spilling outward as door opens
- Hints of interior: reception desk silhouette, wall with framed certificates, muted colors
- Subtle dust motes in light shaft (particles)

Props (Optional, Keep Minimal)
- Doorbell/chime puck above door
- Small planter to one side (simple cylinder + leaves)

Lighting
- Exterior: overcast skybox feel; soft directional from above/front-left
- Interior: emissive rectangular area light behind door; ramps brighter during door-open animation

Materials
- Door glass: transparent with low-reflection; no sharp caustics
- Metal frames: matte
- Posters: diffuse under glass (specular sweep optional in animation)

Animation Cues (for 3D→Sprite render sequences)
- Idle loop: extremely subtle parallax/ambient (optional for environment)
- Interaction: door opens on hinge from right; rotation ~80°
  - Time curve: ease-in-out ~0.7 s
  - Interior glow ramps up during open
  - Light dust motes appear (low count ~24, slow rise)

Camera (for reference)
- Orthographic, ISO: X=60°, Y=0°, Z=45°, Film Transparent
- Framing: door centered; posters visible left/right; include sidewalk bottom edge
- Output per-frame PNG 256×256 (to be downscaled later)

Color Reference (sRGB)
- Facade dark: #1f2937
- Door frame: #374151
- Poster frame: #2b3545
- Poster highlight text: #00FF00
- Interior glow: #FFDCA8 (~20–40% intensity)
- Sidewalk: #3a3f4a

Level of Detail Targets
- Tri count: keep very low; prioritize big shapes
- No tiny text besides the poster headline word (legible at ~32 px height)

Deliverables
- Blender .blend with simple rig (empty for door pivot), orthographic camera set
- Render frames if needed (see naming below)
- If animating: action `door_open` 8–12 frames recommended

Naming
- Environment renders (if any): `env_door_open_01.png`, ...
- Keep environment static where possible; character sprite will provide motion

Notes
- Avoid trademarks/seals; use generic “USMC” text or abstract insignia shapes
- Ensure composition reads when downscaled to 128×128 or smaller
