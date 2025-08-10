import Phaser from 'phaser';
import saveManager from '../utils/saveManager.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 2 - 120, '8-BIT BOOTCAMP', {
      fontSize: '48px',
      fill: '#00ff00',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.createSlotSelector();
    this.createMenu();
    this.createSaveIndicator();
  }

  createSlotSelector() {
    const { width } = this.cameras.main;
    this.selectedSlot = saveManager.getActiveSlot() || 1;
    const slots = saveManager.listSlots();

    const baseY = 300;
    this.slotTexts = slots.map((s, i) => {
      const line = this.renderSlotLine(s, i, baseY);
      return line;
    });

    this.input.keyboard.on('keydown-LEFT', () => this.changeSlot(-1));
    this.input.keyboard.on('keydown-RIGHT', () => this.changeSlot(1));
  }

  renderSlotLine(s, i, baseY) {
    const { width } = this.cameras.main;
    const isSelected = (i + 1) === this.selectedSlot;
    const label = `Slot ${i + 1}`;
    const meta = s.exists ? `${s.meta.playerName} • Week ${s.meta.week} • ${s.meta.lastScene || '—'}` : 'Empty';
    const text = this.add.text(width / 2, baseY + i * 26, `${isSelected ? '>' : ' '} ${label} — ${meta}`, {
      fontSize: '16px',
      fill: isSelected ? '#ffffff' : '#9aa4b2',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    text.on('pointerdown', () => { this.selectedSlot = i + 1; this.refreshSlots(); });
    return text;
  }

  refreshSlots() {
    const slots = saveManager.listSlots();
    this.slotTexts?.forEach(t => t.destroy());
    const baseY = 300;
    this.slotTexts = slots.map((s, i) => this.renderSlotLine(s, i, baseY));
  }

  changeSlot(delta) {
    this.selectedSlot = ((this.selectedSlot - 1 + delta + 3) % 3) + 1;
    this.refreshSlots();
  }

  createMenu() {
    const { width, height } = this.cameras.main;
    const slots = saveManager.listSlots();
    const has = slots.find(s => s.slot === this.selectedSlot)?.exists;

    const opts = [];
    if (has) opts.push({ label: 'Continue', action: () => this.continueGame() });
    opts.push({ label: has ? 'New Game (overwrite)' : 'New Game', action: () => this.newGame() });
    if (has) opts.push({ label: 'Reset Save', action: () => this.resetSave() });

    this.menu?.forEach(m => m.destroy());
    this.menu = opts.map((opt, i) => {
      const t = this.add.text(width / 2, height / 2 + 60 + i * 26, opt.label, { fontSize: '16px', fill: '#ffffff', fontFamily: 'Courier New, monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      t.on('pointerdown', opt.action);
      return t;
    });

    this.input.keyboard.removeAllListeners('keydown-ONE');
    this.input.keyboard.removeAllListeners('keydown-TWO');
    this.input.keyboard.removeAllListeners('keydown-THREE');

    if (has) {
      this.input.keyboard.once('keydown-ONE', () => this.continueGame());
      this.input.keyboard.once('keydown-TWO', () => this.newGame());
      this.input.keyboard.once('keydown-THREE', () => this.resetSave());
    } else {
      this.input.keyboard.once('keydown-SPACE', () => this.newGame());
      this.input.once('pointerdown', () => this.newGame());
    }

    // Re-render menu when slot changes
    this.events.on('updateMenu', () => this.createMenu());
  }

  createSaveIndicator() {
    const { width } = this.cameras.main;
    const indicator = this.add.text(width - 12, 12, '', { fontSize: '12px', fill: '#9aa4b2', fontFamily: 'Courier New, monospace' }).setOrigin(1, 0);
    const show = (msg) => {
      indicator.setText(msg);
      indicator.alpha = 1;
      this.tweens.add({ targets: indicator, alpha: 0, delay: 800, duration: 300 });
    };
    this.onSaved = (e) => { if (e?.detail?.slot === this.selectedSlot) show('Saved'); };
    this.onCleared = (e) => { if (e?.detail?.slot === this.selectedSlot) show('Save cleared'); };
    window.addEventListener('game:saved', this.onSaved);
    window.addEventListener('game:saveCleared', this.onCleared);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('game:saved', this.onSaved);
      window.removeEventListener('game:saveCleared', this.onCleared);
    });
  }

  continueGame() {
    const slot = this.selectedSlot;
    if (saveManager.load(slot)) {
      this.scene.start(window.gameState.lastScene || 'IntroScene');
    }
  }

  newGame() {
    const slot = this.selectedSlot;
    const exists = saveManager.hasSave(slot);
    const start = () => {
      window.gameState = saveManager.createDefaultState();
      saveManager.setActiveSlot(slot);
      saveManager.setLastSceneAndSave('IntroScene', slot);
      this.scene.start('IntroScene');
    };
    if (exists) {
      this.showConfirm('Overwrite this slot?', () => { saveManager.clear(slot); start(); });
    } else {
      start();
    }
  }

  resetSave() {
    const slot = this.selectedSlot;
    this.showConfirm('Delete save in this slot?', () => { saveManager.clear(slot); this.refreshSlots(); this.createMenu(); });
  }

  showConfirm(message, onYes) {
    const { width, height } = this.cameras.main;
    const panel = this.add.rectangle(width / 2, height / 2, 420, 160, 0x0a0f14, 0.95).setStrokeStyle(2, 0x223041);
    this.add.text(panel.x, panel.y - 30, message, { fontSize: '16px', fill: '#e6e9ef', fontFamily: 'Courier New, monospace' }).setOrigin(0.5);
    const yes = this.add.text(panel.x - 60, panel.y + 30, 'Yes', { fontSize: '16px', fill: '#00ff88', fontFamily: 'Courier New, monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const no = this.add.text(panel.x + 60, panel.y + 30, 'No', { fontSize: '16px', fill: '#ffffff', fontFamily: 'Courier New, monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    yes.on('pointerdown', () => { panel.destroy(); yes.destroy(); no.destroy(); onYes?.(); });
    no.on('pointerdown', () => { panel.destroy(); yes.destroy(); no.destroy(); });
  }

  update() {
    // Update menu when slot selection changes
    this.events.emit('updateMenu');
  }
}
