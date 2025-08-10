import Phaser from 'phaser';
import saveManager from '../utils/saveManager.js';

export default class PFTSitupsScene extends Phaser.Scene {
  constructor() { super({ key: 'PFTSitupsScene' }); }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x0b0f1a).setOrigin(0);
    this.add.text(20, 20, 'PFT: Sit-ups (Rhythm)', { fontSize: '18px', fill: '#00ff88', fontFamily: 'Courier New, monospace' });

    this.combo = 0;
    this.score = 0;
    this.timer = 0;

    this.marker = this.add.rectangle(width / 2, height / 2, width - 160, 6, 0x223041).setOrigin(0.5);
    this.target = this.add.rectangle(width / 2, height / 2, 10, 22, 0x00ff88).setOrigin(0.5);
    this.note = this.add.rectangle(width / 2 - (width - 160) / 2, height / 2, 8, 18, 0xffffff).setOrigin(0.5);

    this.add.text(20, height - 24, 'SPACE: Perform Sit-up on target', { fontSize: '12px', fill: '#9aa4b2', fontFamily: 'Courier New, monospace' }).setOrigin(0, 1);

    this.input.keyboard.on('keydown-SPACE', () => this.hit());

    saveManager.setLastSceneAndSave('PFTSitupsScene');
  }

  update(_, dt) {
    const { width } = this.cameras.main;
    this.timer += dt / 1000;

    const lane = this.marker.width;
    const speed = 220; // px/s
    const startX = width / 2 - lane / 2;
    const endX = width / 2 + lane / 2;

    const x = (this.note.x + (speed * dt / 1000));
    this.note.x = x > endX ? startX : x;

    if (this.timer > 35) {
      this.finish();
    }
  }

  hit() {
    const distance = Math.abs(this.note.x - this.target.x);
    if (distance < 8) {
      this.score += 3; this.combo += 1; this.flash(0x00ff88);
    } else if (distance < 20) {
      this.score += 1; this.combo = 0; this.flash(0xffe066);
    } else {
      this.combo = 0; this.flash(0xd63031);
    }
  }

  flash(color) {
    this.cameras.main.flash(50, (color >> 16) & 255, (color >> 8) & 255, color & 255);
  }

  finish() {
    const disciplineGain = Math.min(8, Math.round(this.score / 4));
    window.gameState.marineStats.discipline += disciplineGain;
    window.gameState.pft = { ...(window.gameState.pft || {}), situpsScore: this.score, disciplineGain };
    saveManager.setLastSceneAndSave('PFTPullupsScene');
    this.scene.start('PFTPullupsScene');
  }
}
