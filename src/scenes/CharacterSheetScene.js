import Phaser from 'phaser';
import saveManager from '../utils/saveManager.js';
import { loadPremades, computePillarFromAttributes, BACKGROUND_ATTR_MODS, getBodyCompositionMods, applyAttributeMods } from '../utils/characterUtils.js';

const BACKGROUNDS = [
  { key: 'Athlete', mods: { fitness: 8, discipline: 2, marksmanship: 0, leadership: 2 }, note: 'Stamina advantage' },
  { key: 'ROTC', mods: { fitness: 4, discipline: 6, marksmanship: 0, leadership: 4 }, note: 'Cadence familiarity' },
  { key: 'Range Hobbyist', mods: { fitness: 0, discipline: 2, marksmanship: 8, leadership: 2 }, note: 'Breath control' },
  { key: 'Team Captain', mods: { fitness: 4, discipline: 2, marksmanship: 0, leadership: 8 }, note: 'Coordination' },
  { key: 'Musician', mods: { fitness: 0, discipline: 8, marksmanship: 0, leadership: 4 }, note: 'Rhythm timing' }
];

export default class CharacterSheetScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSheetScene' });
  }

  async create() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(0, 0, width, height, 0x0b0f1a).setOrigin(0);
    this.add.text(24, 24, `Character Sheet`, { fontSize: '22px', fill: '#00ff88', fontFamily: 'Courier New, monospace' });
    this.add.text(24, 54, `Name: ${window.gameState.playerName || 'Recruit'}`, { fontSize: '16px', fill: '#e6e9ef', fontFamily: 'Courier New, monospace' });

    const base = window.gameState.marineStats;
    this.baseStatsText = this.add.text(24, 84, `Base Pillars - Fitness ${base.fitness} | Discipline ${base.discipline} | Marksmanship ${base.marksmanship} | Leadership ${base.leadership}`, { fontSize: '14px', fill: '#9aa4b2', fontFamily: 'Courier New, monospace' });

    // Premade selector
    this.premades = await loadPremades();
    this.pIdx = 0;
    this.renderPremade();

    // Background selection
    this.selectedIdx = 0;
    this.renderBackgrounds();

    // Preview panel
    this.previewText = this.add.text(width - 24, 84, '', { fontSize: '14px', fill: '#e6e9ef', fontFamily: 'Courier New, monospace', align: 'right' }).setOrigin(1, 0);
    this.updatePreview();

    const prompt = this.add.text(width - 24, height - 24, 'ENTER: Confirm  •  ↑/↓: Background  •  ◄/►: Premade', { fontSize: '12px', fill: '#9aa4b2', fontFamily: 'Courier New, monospace' }).setOrigin(1, 1);
    
    this.input.keyboard.on('keydown-UP', () => { this.changeSelection(-1); this.updatePreview(); });
    this.input.keyboard.on('keydown-DOWN', () => { this.changeSelection(1); this.updatePreview(); });
    this.input.keyboard.on('keydown-LEFT', () => { this.changePremade(-1); this.updatePreview(); });
    this.input.keyboard.on('keydown-RIGHT', () => { this.changePremade(1); this.updatePreview(); });
    this.input.keyboard.once('keydown-ENTER', () => this.confirm());

    saveManager.setLastSceneAndSave('CharacterSheetScene');
  }

  renderPremade() {
    if (!this.premades || this.premades.length === 0) return;
    const p = this.premades[this.pIdx];
    this.pText?.destroy();
    this.pText = this.add.text(24, 114, `Premade: ${p.name} (${p.gender}, ${p.age}) • ${p.height}, ${p.weight} lb\nSTR ${p.strength}  DEX ${p.dexterity}  INT ${p.intellect}  CON ${p.constitution}  CHA ${p.charisma}  GRIT ${p.grit}\n${p.background}`, { fontSize: '14px', fill: '#e6e9ef', fontFamily: 'Courier New, monospace', lineSpacing: 4 });
  }

  changePremade(delta) {
    if (!this.premades || this.premades.length === 0) return;
    const len = this.premades.length;
    this.pIdx = (this.pIdx + delta + len) % len;
    this.renderPremade();
  }

  renderBackgrounds() {
    const { width } = this.cameras.main;
    const startY = 174;
    const rowH = 28;

    if (this.rows) this.rows.forEach(r => r.destroy());
    this.rows = [];

    BACKGROUNDS.forEach((bg, i) => {
      const y = startY + i * rowH;
      const color = i === this.selectedIdx ? '#ffffff' : '#9aa4b2';
      const row = this.add.text(24, y, `${i === this.selectedIdx ? '>' : ' '} ${bg.key.padEnd(14)}  +F${bg.mods.fitness}  +D${bg.mods.discipline}  +M${bg.mods.marksmanship}  +L${bg.mods.leadership}  — ${bg.note}`, {
        fontSize: '14px', fill: color, fontFamily: 'Courier New, monospace'
      });
      this.rows.push(row);
    });
  }

  updatePreview() {
    if (!this.premades || this.premades.length === 0) return;
    const premade = this.premades[this.pIdx];

    // Start from premade attributes
    const baseAttrs = {
      strength: premade.strength,
      dexterity: premade.dexterity,
      intellect: premade.intellect,
      constitution: premade.constitution,
      charisma: premade.charisma,
      grit: premade.grit
    };

    // Apply body composition
    const bodyMods = getBodyCompositionMods({ height: premade.height, weight: premade.weight });

    // Apply background attribute mods
    const bgKey = BACKGROUNDS[this.selectedIdx].key;
    const bgAttrMods = BACKGROUND_ATTR_MODS[bgKey] || {};

    const finalAttrs = applyAttributeMods(baseAttrs, bodyMods, bgAttrMods);
    const pillars = computePillarFromAttributes(finalAttrs);

    this.previewText.setText(
      `Final Attributes\n` +
      `STR ${finalAttrs.strength}  DEX ${finalAttrs.dexterity}  INT ${finalAttrs.intellect}  CON ${finalAttrs.constitution}\n` +
      `CHA ${finalAttrs.charisma}  GRIT ${finalAttrs.grit}\n\n` +
      `Derived Pillars\n` +
      `FIT ${pillars.fitness}  DISC ${pillars.discipline}  MARK ${pillars.marksmanship}  LEAD ${pillars.leadership}`
    );
  }

  changeSelection(delta) {
    const len = BACKGROUNDS.length;
    this.selectedIdx = (this.selectedIdx + delta + len) % len;
    this.renderBackgrounds();
  }

  confirm() {
    // Persist chosen premade and computed attributes → pillars
    if (this.premades && this.premades.length > 0) {
      const premade = this.premades[this.pIdx];
      window.gameState.premade = premade;

      const baseAttrs = {
        strength: premade.strength,
        dexterity: premade.dexterity,
        intellect: premade.intellect,
        constitution: premade.constitution,
        charisma: premade.charisma,
        grit: premade.grit
      };
      const bodyMods = getBodyCompositionMods({ height: premade.height, weight: premade.weight });
      const bgKey = BACKGROUNDS[this.selectedIdx].key;
      const bgAttrMods = BACKGROUND_ATTR_MODS[bgKey] || {};
      const finalAttrs = applyAttributeMods(baseAttrs, bodyMods, bgAttrMods);

      const pillars = computePillarFromAttributes(finalAttrs);
      const s = window.gameState.marineStats;
      s.fitness = pillars.fitness;
      s.discipline = pillars.discipline;
      s.marksmanship = pillars.marksmanship;
      s.leadership = pillars.leadership;
    }

    // Apply background pillar modifiers on top
    const bg = BACKGROUNDS[this.selectedIdx];
    window.gameState.background = bg.key;
    const s = window.gameState.marineStats;
    s.fitness += bg.mods.fitness;
    s.discipline += bg.mods.discipline;
    s.marksmanship += bg.mods.marksmanship;
    s.leadership += bg.mods.leadership;

    saveManager.setLastSceneAndSave('PFTRunScene');
    this.scene.start('PFTRunScene');
  }
}
