<svelte:head>
  <title>Characters & Stats</title>
  <meta name="description" content="Character attributes for 8-bit Bootcamp: definitions, ranges, and how they influence gameplay." />
</svelte:head>

<main>
  <div class="header">
    <div>
      <h1 class="title">Characters & Stats</h1>
      <p class="subtitle">Attributes, ranges, and gameplay impact</p>
    </div>
    <div class="tag">Design Reference</div>
  </div>

  <section class="panel">
    <h2>Overview</h2>
    <p>
      Player characters have real-world attributes (height, weight, age, gender) and gameplay stats
      that shape performance and progression. We provide 8 premade recruits and support a custom
      character flow.
    </p>
  </section>

  <div class="grid">
    <section class="panel">
      <h2>Core Attributes</h2>
      <ul>
        <li><b>Height</b>: recorded text (e.g., 5'11"). Cosmetic; may influence composition mods.</li>
        <li><b>Weight</b>: numeric (lb). Used for body composition calculation.</li>
        <li><b>Gender</b>: label for narrative/UI.</li>
        <li><b>Age</b>: numeric years; flavor.</li>
      </ul>
      <p class="small">Units: imperial for fiction flavor; internal calcs are unit-agnostic.</p>
    </section>

    <section class="panel">
      <h2>Gameplay Stats (1–10)</h2>
      <ul>
        <li><b>Strength (STR)</b>: raw power; carries, climbs, obstacle force.</li>
        <li><b>Dexterity (DEX)</b>: coordination and precision; rhythm, aim steadiness.</li>
        <li><b>Intellect (INT)</b>: problem solving; ASVAB performance, wind/ballistics adjustment.</li>
        <li><b>Constitution (CON)</b>: endurance and recovery; stamina decay, cooldown speed.</li>
        <li><b>Charisma (CHA)</b>: social leadership; squad buffs, command decisions.</li>
        <li><b>Grit</b>: mental resilience; pressure tolerance, failure recovery, consistency.</li>
      </ul>
    </section>
  </div>

  <section class="panel">
    <h2>Background Attribute Modifiers</h2>
    <p>Choosing a background grants small attribute boosts before pillar derivation.</p>
    <table>
      <thead><tr><th>Background</th><th>Attribute Mods</th></tr></thead>
      <tbody>
        <tr><td>Athlete</td><td>STR +2, CON +1</td></tr>
        <tr><td>ROTC</td><td>INT +2, CHA +1</td></tr>
        <tr><td>Range Hobbyist</td><td>DEX +2, INT +1</td></tr>
        <tr><td>Team Captain</td><td>CHA +2, GRIT +1</td></tr>
        <tr><td>Musician</td><td>DEX +1, INT +1, GRIT +1</td></tr>
      </tbody>
    </table>
  </section>

  <section class="panel">
    <h2>Body Composition Modifiers</h2>
    <p>Derived from BMI and height; applied to attributes, then clamped to 1–10.</p>
    <div class="grid">
      <div class="panel">
        <h3>BMI (Weight vs Height)</h3>
        <ul>
          <li><b>BMI &lt; 18.5</b> (underweight): STR −1, CON −1</li>
          <li><b>25 ≤ BMI &lt; 30</b> (overweight): CON −1, DEX −1, CHA −1</li>
          <li><b>BMI ≥ 30</b> (obese): CON −2, DEX −1, CHA −1</li>
        </ul>
      </div>
      <div class="panel">
        <h3>Height</h3>
        <ul>
          <li><b>≤ 64 in</b> (≤ 5'4"): CHA −1</li>
          <li><b>≥ 75 in</b> (≥ 6'3"): CON −1</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="panel">
    <h2>Attribute → Pillar Derivation</h2>
    <p>Pillars are computed from attributes (after background + composition) and rounded.</p>
    <pre><code>fitness      = round((STR + CON) / 2)
discipline   = round(GRIT + INT / 1.5)
marksmanship = round(DEX  + INT / 1.5)
leadership   = round(CHA  + GRIT / 1.5)</code></pre>
    <p class="small">After deriving pillars, we apply the chosen background's pillar bonuses.</p>
  </section>

  <section class="panel">
    <h2>Application Order</h2>
    <ol>
      <li>Select Premade → base attributes (STR/DEX/INT/CON/CHA/GRIT)</li>
      <li>Apply body composition modifiers (BMI, height) → clamp 1–10</li>
      <li>Apply background attribute modifiers → clamp 1–10</li>
      <li>Derive pillars from attributes</li>
      <li>Apply background pillar bonuses (e.g., Athlete +Fitness, etc.)</li>
      <li>Save result; proceed to PFT</li>
    </ol>
  </section>

  <section class="panel">
    <h2>Premade Recruits</h2>
    <p>
      Eight premade profiles ship with the game (names, background, attributes). These can be tuned later.
      Data source: <code>public/assets/data/premades.json</code>.
    </p>
    <ul>
      <li>Selection is text-only for now (name, background, attributes).</li>
      <li>Character Sheet preview shows final attributes and derived pillars before confirm.</li>
    </ul>
  </section>
</main>
