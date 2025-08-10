import Phaser from 'phaser';
import saveManager from '../utils/saveManager.js';

const QUESTIONS = [
  { q: '12 + 15 = ?', a: ['23', '27', '29'], i: 1 },
  { q: 'Which is a synonym of keen?', a: ['dull', 'eager', 'late'], i: 1 },
  { q: 'Pulley is to lift as lever is to ...', a: ['push', 'turn', 'pivot'], i: 0 }
];

export default class ASVABScene extends Phaser.Scene {
  constructor() { super({ key: 'ASVABScene' }); }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x0b0f1a).setOrigin(0);
    this.add.text(20, 20, 'Simplified ASVAB', { fontSize: '18px', fill: '#00ff88', fontFamily: 'Courier New, monospace' });

    this.idx = 0; this.correct = 0;
    this.renderQuestion();

    saveManager.setLastSceneAndSave('ASVABScene');
  }

  renderQuestion() {
    const { width } = this.cameras.main;
    if (this.textQ) this.textQ.destroy();
    if (this.opts) this.opts.forEach(o => o.destroy());

    if (this.idx >= QUESTIONS.length) return this.finish();

    const { q, a } = QUESTIONS[this.idx];
    this.textQ = this.add.text(24, 70, q, { fontSize: '18px', fill: '#e6e9ef', fontFamily: 'Courier New, monospace', wordWrap: { width: width - 48 } });

    this.opts = a.map((label, i) => {
      const t = this.add.text(24, 120 + i * 26, `${i + 1}. ${label}`, { fontSize: '16px', fill: '#9aa4b2', fontFamily: 'Courier New, monospace' }).setInteractive({ useHandCursor: true });
      t.on('pointerdown', () => this.answer(i));
      this.input.keyboard.once(`keydown-${i + 1}`, () => this.answer(i));
      return t;
    });
  }

  answer(i) {
    const isCorrect = i === QUESTIONS[this.idx].i;
    if (isCorrect) { this.correct += 1; this.flash(0x00ff88); } else { this.flash(0xd63031); }
    this.idx += 1;
    this.renderQuestion();
  }

  flash(color) { this.cameras.main.flash(50, (color >> 16) & 255, (color >> 8) & 255, color & 255); }

  finish() {
    const bonus = this.correct >= 3 ? 2 : this.correct === 2 ? 1 : 0;
    window.gameState.marineStats.discipline += bonus;
    window.gameState.marineStats.leadership += bonus;
    window.gameState.asvab = { correct: this.correct, bonus };
    saveManager.setLastSceneAndSave('MainScene');
    this.scene.start('MainScene');
  }
}
