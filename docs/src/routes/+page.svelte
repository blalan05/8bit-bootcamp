<svelte:head>
  <title>8-bit Bootcamp — Game Design Document</title>
  <meta name="description" content="GDD for 8-bit Bootcamp, an isometric 8-bit Marine recruit training game for web and PWA." />
</svelte:head>

<main>
  <div class="header">
    <div>
      <h1 class="title">8-bit Bootcamp</h1>
      <p class="subtitle">Game Design Document</p>
    </div>
    <div class="tag">Web • PWA-ready • Phaser 3 • Vite</div>
  </div>

  <section class="panel">
    <h2>High Concept</h2>
    <p>
      Isometric 8-bit training simulation following a Marine recruit through
      13 weeks of boot camp. Players complete short, replayable minigames
      representing core training pillars—fitness, discipline, marksmanship, and leadership—
      while progressing week-to-week toward graduation.
    </p>
  </section>

  <div class="grid">
    <section class="panel">
      <h2>Vision & Goals</h2>
      <ul>
        <li>Pick-up-and-play sessions (2–5 minutes per minigame)</li>
        <li>Approachable 8-bit aesthetic with clean, readable UI</li>
        <li>Progression across 13 in-game weeks with rising difficulty</li>
        <li>Playable in the browser; supports installable PWA web-view</li>
        <li>Low friction saves; resilient across refreshes and offline play</li>
      </ul>
    </section>

    <section class="panel">
      <h2>Platforms</h2>
      <ul>
        <li><b>Primary</b>: Desktop and Mobile Browser (Chromium, Firefox, Safari)</li>
        <li><b>PWA</b>: Installable; offline-capable via asset caching</li>
      </ul>
      <p class="small">Engine: Phaser 3. Build: Vite. Docs: SvelteKit.</p>
    </section>
  </div>

  <section class="panel">
    <h2>Core Loop</h2>
    <ol>
      <li>Enter week N briefing and objectives</li>
      <li>Complete 1–3 minigames tied to pillars (fitness, discipline, marksmanship, leadership)</li>
      <li>Earn stats, unlock modifiers, and advance to next week</li>
      <li>Periodic evaluations and milestone events</li>
    </ol>
  </section>

  <div class="grid">
    <section class="panel">
      <h2>Pillars & Stats</h2>
      <ul>
        <li><b>Fitness</b>: timed movement/obstacle challenges</li>
        <li><b>Discipline</b>: pattern memory, timing windows, cadence</li>
        <li><b>Marksmanship</b>: aim precision, recoil control, wind/drift</li>
        <li><b>Leadership</b>: quick decision-making, trade-offs, squad buffs</li>
      </ul>
    </section>

    <section class="panel">
      <h2>Progression</h2>
      <ul>
        <li>13 weeks; each week raises difficulty and mixes modifiers</li>
        <li>Weekly evaluations unlock cosmetics and titles</li>
        <li>Failure offers retry paths and training drills</li>
      </ul>
    </section>
  </div>

  <section class="panel">
    <h2>Minigames (Initial Set)</h2>
    <ul>
      <li><b>Obstacle Course</b> (fitness): movement, dashes, stamina lane swaps</li>
      <li><b>Drill & Ceremony</b> (discipline): call-and-response, rhythm accuracy</li>
      <li><b>Rifle Range</b> (marksmanship): targets, wind adjustment, reload cadence</li>
      <li><b>Field Decisions</b> (leadership): timed choices with stat-driven outcomes</li>
    </ul>
  </section>

  <div class="grid">
    <section class="panel">
      <h2>Art & Audio</h2>
      <ul>
        <li>8-bit pixel art; readable silhouettes; limited color palettes</li>
        <li>Isometric playfields with parallax-suggestive tiling</li>
        <li>Chiptune score; retro SFX with subtle modern polish</li>
      </ul>
    </section>

    <section class="panel">
      <h2>Tech Notes</h2>
      <ul>
        <li>Phaser 3, Arcade Physics, pixelArt rendering</li>
        <li>Vite dev/build; PWA via service worker + asset cache</li>
        <li>Data: <code>localStorage</code> / <code>IndexedDB</code> initially; optional server sync</li>
      </ul>
    </section>
  </div>

  <section class="panel">
    <h2>Save System Options</h2>
    <table>
      <thead>
        <tr>
          <th>Option</th>
          <th>Pros</th>
          <th>Cons</th>
          <th>Use When</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>localStorage</b></td>
          <td>Trivial API; good browser support; fast</td>
          <td>~5–10MB; string-only; no true security; easy to clear</td>
          <td>Small save blobs; quick MVPs; single-device play</td>
        </tr>
        <tr>
          <td><b>IndexedDB</b></td>
          <td>Large/quota-based; structured data; transactions</td>
          <td>More boilerplate; quirks on Safari; async</td>
          <td>Larger saves, replays, settings, offline-first PWAs</td>
        </tr>
        <tr>
          <td><b>Cookies</b></td>
          <td>Sent with requests; can be server-read</td>
          <td>~4KB; privacy prompts; perf overhead; not ideal for saves</td>
          <td>Session flags, auth tokens only</td>
        </tr>
        <tr>
          <td><b>Server-side</b></td>
          <td>Cross-device, backups, anti-tamper, analytics</td>
          <td>Backend cost/infra; auth UX; needs connectivity</td>
          <td>Accounts, multi-device continuity, persistence guarantees</td>
        </tr>
        <tr>
          <td><b>Hybrid</b></td>
          <td>Instant local play + cloud sync; offline support</td>
          <td>Complexity (conflict resolution, migrations)</td>
          <td>Best of both: start local; upgrade to cloud on login</td>
        </tr>
      </tbody>
    </table>

    <h3>Recommendation</h3>
    <ul>
      <li><b>Phase 1 (MVP)</b>: Local-first using <code>IndexedDB</code> (fallback to <code>localStorage</code>) with a versioned schema and simple export/import.</li>
      <li><b>Phase 2</b>: Optional account sign-in to enable server sync; resolve conflicts with <code>updatedAt</code> + monotonic revision.</li>
      <li><b>Security</b>: Do not store sensitive data client-side; obfuscation only, not encryption.</li>
      <li><b>PWA</b>: Cache core assets and save APIs for offline continuity.</li>
    </ul>
  </section>

  <div class="grid">
    <section class="panel">
      <h2>Accessibility</h2>
      <ul>
        <li>Color-contrast safe palettes; color-blind friendly indicators</li>
        <li>Remappable controls; reduced motion toggle; text scaling</li>
        <li>Subtitles/captions for all audio cues</li>
      </ul>
    </section>

    <section class="panel">
      <h2>Performance Targets</h2>
      <ul>
        <li>60 FPS on mid-tier mobile; 120 FPS desktop optional</li>
        <li>&lt; 2s first interactive on desktop broadband via code splitting</li>
        <li>PWA install size goal: &lt; 8MB initial cache</li>
      </ul>
    </section>
  </div>

  <section class="panel">
    <h2>Milestones</h2>
    <ol>
      <li>Vertical slice: preloader, main hub, 1 minigame (Obstacle Course)</li>
      <li>Core loop: weekly objectives, evaluations, stat effects</li>
      <li>Content pass: 3–4 minigames, art/audio style lock</li>
      <li>PWA + save system hardening; optional cloud sync</li>
      <li>Public playtest; balancing and polish</li>
    </ol>
  </section>
</main>
