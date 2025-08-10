import Phaser from 'phaser';
import saveManager from '../utils/saveManager.js';

export default class PFTRunScene extends Phaser.Scene {
  constructor() { super({ key: 'PFTRunScene' }); }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x0b0f1a).setOrigin(0);
    this.add.text(20, 20, 'PFT: 1-Mile Run', { fontSize: '18px', fill: '#00ff88', fontFamily: 'Courier New, monospace' });

    this.timer = 0; // seconds
    this.pace = 0.5; // target 0..1
    this.drift = 0; // -1..1

    this.track = this.add.rectangle(width / 2, height / 2, width - 120, 120, 0x101827).setStrokeStyle(2, 0x223041);
    this.marker = this.add.rectangle(width / 2, height / 2, 8, 110, 0x00ff88);

    this.add.text(20, height - 24, 'LEFT/RIGHT: Correct Pace Drift  •  SPACE: Finish Early', { fontSize: '12px', fill: '#9aa4b2', fontFamily: 'Courier New, monospace' }).setOrigin(0, 1);

    this.input.keyboard.on('keydown-LEFT', () => (this.drift = Math.max(-1, this.drift - 0.08)));
    this.input.keyboard.on('keydown-RIGHT', () => (this.drift = Math.min(1, this.drift + 0.08)));
    this.input.keyboard.once('keydown-SPACE', () => this.finish());

    saveManager.setLastSceneAndSave('PFTRunScene');
  }

  update(_, dt) {
    const seconds = dt / 1000;
    this.timer += seconds;

    // Natural drift toward edges
    this.drift += (Math.random() - 0.5) * 0.02;
    this.drift = Phaser.Math.Clamp(this.drift, -1, 1);

    const { width } = this.cameras.main;
    const half = (this.track.width / 2) - 12;
    this.marker.x = width / 2 + this.drift * half;

    // Invisible progress toward 1 mile based on how close you are to center
    const efficiency = 1 - Math.abs(this.drift); // 0..1
    this.progress = (this.progress || 0) + efficiency * (seconds / 30); // ~30s target

    if (this.progress >= 1) {
      this.finish();
    }
  }

  finish() {
    const time = this.timer;
    let fitnessGain = 0;
    if (time < 35) fitnessGain = 10; // elite
    else if (time < 45) fitnessGain = 7;
    else if (time < 55) fitnessGain = 4;
    else fitnessGain = 2;

    window.gameState.marineStats.fitness += fitnessGain;
    window.gameState.pft = { ...(window.gameState.pft || {}), runTime: Math.round(time), fitnessGain };
    saveManager.setLastSceneAndSave('PFTSitupsScene');
    this.scene.start('PFTSitupsScene');
  }
}
