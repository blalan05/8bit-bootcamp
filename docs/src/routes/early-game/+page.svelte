<svelte:head>
  <title>8-bit Bootcamp — Early Game Design</title>
  <meta name="description" content="Design for the early-game experience: recruiting center intro, dialogue, character sheet, and initial PFT/ASVAB." />
</svelte:head>

<main>
  <div class="header">
    <div>
      <h1 class="title">Early Game</h1>
      <p class="subtitle">From New Game → Recruiter → Character Sheet → Initial PFT (+ASVAB)</p>
    </div>
    <div class="tag">Intro Flow</div>
  </div>

  <section class="panel">
    <h2>Purpose</h2>
    <p>
      Establish tone and player identity in a first-person sequence, capture name/background,
      and set initial stats via onboarding minigames before entering Week 1.
    </p>
  </section>

  <section class="panel">
    <h2>Flow Overview</h2>
    <ol>
      <li>New Game → Fade in to first-person outside a Marine recruiting center</li>
      <li>Door opens → Recruit greets player; dialogue choices determine tone</li>
      <li>Name capture → Character Sheet (name, background, starting stats)</li>
      <li>Initial PFT: 1-mile run, sit-ups, pull-ups → baseline stats</li>
      <li>Optional: simplified ASVAB → influences discipline/leadership modifiers</li>
      <li>Save checkpoint → Transition to Week 1 hub</li>
    </ol>
  </section>

  <div class="grid">
    <section class="panel">
      <h2>Opening Scene: Recruiting Center</h2>
      <ul>
        <li><b>POV</b>: First-person camera; ambient city/street audio</li>
        <li><b>Visuals</b>: Front door, USMC posters, flag, warm interior lighting</li>
        <li><b>Action</b>: Tap/Click to step forward → door opens (whoosh, bell chime)</li>
        <li><b>Transition</b>: Recruit steps into view and opens dialogue</li>
      </ul>
    </section>

    <section class="panel">
      <h2>Dialogue: The Recruit</h2>
      <p>Recruit: "You ready to start your journey?"</p>
      <ul>
        <li>“Yes, sir.” → proceed to name capture</li>
        <li>“Maybe. What does it take?” → brief explainer, then proceed</li>
        <li>“I’m not sure yet.” → reassurance + option to go back or continue</li>
      </ul>
      <p class="small">UI: bottom dialogue box, 2–3 choices, keyboard (1–3) or click/tap.</p>
    </section>
  </div>

  <section class="panel">
    <h2>Character Sheet</h2>
    <ul>
      <li><b>Name</b>: free text, 2–24 chars, A–Z, space, hyphen; auto-capitalization</li>
      <li><b>Background</b>: pick one archetype (affects starting stats)</li>
      <li><b>Premades</b>: choose from 8 recruits; preview attributes and pillars</li>
      <li><b>Rules</b>: see <a href="/characters">Characters & Stats</a> for background and body composition modifiers</li>
    </ul>

    <table>
      <thead>
        <tr><th>Background</th><th>Fitness</th><th>Discipline</th><th>Marksmanship</th><th>Leadership</th><th>Notes</th></tr>
      </thead>
      <tbody>
        <tr><td>Athlete</td><td>+8</td><td>+2</td><td>0</td><td>+2</td><td>Stamina advantage</td></tr>
        <tr><td>ROTC</td><td>+4</td><td>+6</td><td>0</td><td>+4</td><td>Cadence familiarity</td></tr>
        <tr><td>Range Hobbyist</td><td>0</td><td>+2</td><td>+8</td><td>+2</td><td>Breath control</td></tr>
        <tr><td>Team Captain</td><td>+4</td><td>+2</td><td>0</td><td>+8</td><td>Callouts/coordination</td></tr>
        <tr><td>Musician</td><td>0</td><td>+8</td><td>0</td><td>+4</td><td>Rhythm timing</td></tr>
      </tbody>
    </table>

    <p class="small">Confirm sheet → autosave checkpoint (Name, Background, starting stats).</p>
  </section>

  <section class="panel">
    <h2>Initial PFT (Baseline)</h2>
    <h3>1-Mile Run (Fitness)</h3>
    <ul>
      <li><b>Mechanic</b>: Maintain pace within a green zone using left/right taps to correct drift; stamina bar drains if sprinting.</li>
      <li><b>Scoring</b>: Time bands → Fitness +0 to +10; medal feedback.</li>
      <li><b>Duration</b>: ~45–60s.</li>
    </ul>

    <h3>Sit-ups (Discipline)</h3>
    <ul>
      <li><b>Mechanic</b>: Rhythm hits on markers; perfect/good/late windows.</li>
      <li><b>Scoring</b>: Combo and accuracy → Discipline +0 to +8.</li>
      <li><b>Duration</b>: ~30–45s.</li>
    </ul>

    <h3>Pull-ups (Leadership)</h3>
    <ul>
      <li><b>Mechanic</b>: Hold-and-release timing on a rising meter; overhold fatigues.</li>
      <li><b>Scoring</b>: Successful reps → Leadership +0 to +6.</li>
      <li><b>Duration</b>: ~30s.</li>
    </ul>

    <p class="small">Aggregate: convert results to stat adjustments; store best-of attempts for baseline.</p>
  </section>

  <section class="panel">
    <h2>Simplified ASVAB (Optional)</h2>
    <ul>
      <li><b>Format</b>: 6–10 quick questions across arithmetic, word knowledge, mechanics</li>
      <li><b>Mechanic</b>: 20–30s per question; 3 choices; immediate feedback optional</li>
      <li><b>Impact</b>: Small modifiers to Discipline/Leadership or a hidden Aptitude that gates optional challenges</li>
    </ul>
  </section>

  <div class="grid">
    <section class="panel">
      <h2>UX & Accessibility</h2>
      <ul>
        <li>Readable text, input via keyboard/mouse/touch, skip dialogue option</li>
        <li>Color-safe indicators; haptics on mobile (optional)</li>
        <li>Toggle reduced motion for door/scene transitions</li>
      </ul>
    </section>

    <section class="panel">
      <h2>Implementation Notes</h2>
      <ul>
        <li>Scenes: IntroScene → RecruitDialogueScene → CharacterSheetScene → PFTRun/Situps/Pullups → ASVABScene → Week1</li>
        <li>Autosaves after: Character Sheet, PFT completion, ASVAB</li>
        <li>MVP saves: IndexedDB/localStorage; later opt-in server sync</li>
      </ul>
    </section>
  </div>
</main>
