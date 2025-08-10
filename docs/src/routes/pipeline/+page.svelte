<svelte:head>
  <title>3D → Sprite Pipeline</title>
  <meta name="description" content="Blender to Phaser spritesheet pipeline: camera setup, rendering, packing with Python." />
</svelte:head>

<main>
  <div class="header">
    <div>
      <h1 class="title">3D → Sprite Pipeline</h1>
      <p class="subtitle">Blender renders → spritesheet + JSON atlas → Phaser animations</p>
    </div>
    <div class="tag">Blender • PIL • Phaser</div>
  </div>

  <section class="panel">
    <h2>Overview</h2>
    <p>
      We model/animate in Blender, render frames to PNG with transparent backgrounds,
      then pack them into a single spritesheet and JSON atlas consumed by Phaser.
    </p>
  </section>

  <div class="grid">
    <section class="panel">
      <h2>Blender Setup</h2>
      <ul>
        <li>Camera: Orthographic; Rot X=60°, Y=0°, Z=45°; Film → Transparent</li>
        <li>Engine: Workbench (flat) or Eevee with Toon shading</li>
        <li>Resolution per frame: 256×256 (downscale later)</li>
        <li>Lighting: simple; or emission/shadeless for retro look</li>
        <li>Naming: frames like <code>idle_e_01.png</code>, <code>walk_ne_07.png</code></li>
      </ul>
    </section>

    <section class="panel">
      <h2>Directions & Actions</h2>
      <ul>
        <li>Directions: n, ne, e, se, s, sw, w, nw</li>
        <li>Actions: idle (12f), walk (12f). Frame indices start at 01.</li>
      </ul>
      <p class="small">More actions can be added later; follow the same naming.</p>
    </section>
  </div>

  <section class="panel">
    <h2>Packing</h2>
    <p>Run the Python packer (Pillow required):</p>
    <pre><code>pip install pillow
python scripts/packer.py --src renders/marine --out public/assets --cols 12 --tile 256 --downscale 2</code></pre>
    <p>Outputs: <code>public/assets/marine.png</code> and <code>public/assets/marine.json</code>.</p>
  </section>

  <section class="panel">
    <h2>Phaser Integration</h2>
    <ul>
      <li>Loader tries to load atlas; falls back to placeholders if not found</li>
      <li>Animations registered: <code>marine_idle_&#123;dir&#125;</code> and <code>marine_walk_&#123;dir&#125;</code></li>
      <li>Main scene switches direction and idle/walk based on input</li>
    </ul>
  </section>

  <section class="panel">
    <h2>Tips</h2>
    <ul>
      <li>Keep feet locked to a reference pixel row to avoid jitter</li>
      <li>Use nearest-neighbor downscale for crisp pixels</li>
      <li>Optional: quantize colors to 16–32 for stronger 8-bit feel</li>
      <li>Split large atlases by action if size grows</li>
    </ul>
  </section>
</main>
