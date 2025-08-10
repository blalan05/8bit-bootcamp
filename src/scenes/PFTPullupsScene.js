import Phaser from 'phaser';
import saveManager from '../utils/saveManager.js';

export default class PFTPullupsScene extends Phaser.Scene {
  constructor() { super({ key: 'PFTPullupsScene' }); }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x0b0f1a).setOrigin(0);
    this.add.text(20, 20, 'PFT: Pull-ups (Hold & Release)', { fontSize: '18px', fill: '#00ff88', fontFamily: 'Courier New, monospace' });

    this.bar = this.add.rectangle(width / 2, height / 2, 360, 16, 0x223041);
    this.zone = this.add.rectangle(width / 2, height / 2, 80, 20, 0x1b4332).setStrokeStyle(2, 0x00ff88);
    this.marker = this.add.rectangle(width / 2 - 180, height / 2, 8, 22, 0xffffff);

    this.holding = false;
    this.reps = 0;
    this.fatigue = 0;

    this.add.text(20, height - 24, 'HOLD SPACE: Pull  •  RELEASE: Count Rep', { fontSize: '12px', fill: '#9aa4b2', fontFamily: 'Courier New, monospace' }).setOrigin(0, 1);

    this.input.keyboard.on('keydown-SPACE', () => (this.holding = true));
    this.input.keyboard.on('keyup-SPACE', () => this.release());

    saveManager.setLastSceneAndSave('PFTPullupsScene');
  }

  update(_, dt) {
    const speed = 240; // px/s
    const delta = speed * dt / 1000;

    if (this.holding) {
      this.marker.x = Math.min(this.bar.x + this.bar.width / 2, this.marker.x + delta * (1 - this.fatigue));
      this.fatigue = Math.min(0.9, this.fatigue + 0.0015);
    } else {
      this.marker.x = Math.max(this.bar.x - this.bar.width / 2, this.marker.x - delta);
      this.fatigue = Math.max(0, this.fatigue - 0.003);
    }
  }

  release() {
    this.holding = false;
    const inZone = Math.abs(this.marker.x - this.zone.x) < (this.zone.width / 2);
    if (inZone) {
      this.reps += 1; this.flash(0x00ff88);
    } else {
      this.flash(0xd63031);
    }

    if (this.reps >= 10) this.finish();
  }

  flash(color) {
    this.cameras.main.flash(50, (color >> 16) & 255, (color >> 8) & 255, color & 255);
  }

  finish() {
    const leadershipGain = Math.min(6, this.reps);
    window.gameState.marineStats.leadership += leadershipGain;
    window.gameState.pft = { ...(window.gameState.pft || {}), pullupsReps: this.reps, leadershipGain };
    saveManager.setLastSceneAndSave('ASVABScene');
    this.scene.start('ASVABScene');
  }
}
