import Phaser from 'phaser';
import saveManager from '../utils/saveManager.js';

export default class RecruitDialogueScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RecruitDialogueScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background panel
    this.add.rectangle(0, 0, width, height, 0x0c1117).setOrigin(0);

    // Recruit placeholder
    this.add.rectangle(width / 2, height / 2 - 60, 180, 220, 0x4a7c59).setOrigin(0.5).setStrokeStyle(2, 0x2e4d36);

    // Dialogue box
    this.box = this.add.rectangle(width / 2, height - 120, width - 120, 160, 0x0a0f14, 0.95).setOrigin(0.5).setStrokeStyle(2, 0x223041);
    this.text = this.add.text(this.box.x - this.box.width / 2 + 20, this.box.y - this.box.height / 2 + 16,
      '', {
        fontSize: '18px',
        fill: '#e6e9ef',
        fontFamily: 'Courier New, monospace',
        wordWrap: { width: this.box.width - 40 }
      });

    this.createChoices([
      { label: 'Yes, sir.', next: 'name' },
      { label: 'Maybe. What does it take?', next: 'explain' },
      { label: "I’m not sure yet.", next: 'reassure' }
    ]);

    this.typeText("Recruit: You ready to start your journey?");
    
    saveManager.setLastSceneAndSave('RecruitDialogueScene');
  }

  typeText(full, speedMs = 18) {
    if (this.typeTimer) this.typeTimer.remove();
    this.text.setText('');
    this.typing = { full, idx: 0 };

    const tick = () => {
      if (!this.typing) return;
      this.typing.idx += 1;
      this.text.setText(full.slice(0, this.typing.idx));
      if (this.typing.idx >= full.length) {
        this.typeTimer?.remove();
        this.typing = null;
        return;
      }
    };

    this.typeTimer = this.time.addEvent({ delay: speedMs, loop: true, callback: tick });

    const skip = () => {
      if (this.typing) {
        this.text.setText(full);
        this.typeTimer?.remove();
        this.typing = null;
      }
    };
    this.input.keyboard.once('keydown-SPACE', skip);
    this.input.once('pointerdown', skip);
  }

  createChoices(options) {
    if (this.choices) this.choices.forEach(c => c.destroy());
    this.choices = [];

    options.forEach((opt, idx) => {
      const btn = this.add.text(this.box.x - this.box.width / 2 + 20, this.box.y + 10 + idx * 26, `${idx + 1}. ${opt.label}`, {
        fontSize: '16px', fill: '#9aa4b2', fontFamily: 'Courier New, monospace'
      }).setInteractive({ useHandCursor: true, pixelPerfect: true });
      btn.on('pointerdown', () => this.handle(opt.next));
      this.input.keyboard.once(`keydown-${idx + 1}`, () => this.handle(opt.next));
      this.choices.push(btn);
    });
  }

  handle(next) {
    switch (next) {
      case 'explain':
        this.typeText('Recruit: Commitment, discipline, and heart. If you have those, we can shape the rest. Ready?');
        this.createChoices([
          { label: 'Let’s do this.', next: 'name' },
          { label: 'Tell me more later.', next: 'name' }
        ]);
        break;
      case 'reassure':
        this.typeText('Recruit: Doubt is normal. You’ll find your pace. Let’s start with the basics. What should I call you?');
        this.createChoices([{ label: 'Okay.', next: 'name' }]);
        break;
      case 'name':
        this.startNameCapture();
        break;
    }
  }

  startNameCapture() {
    const { width } = this.cameras.main;
    this.typeText('Recruit: What’s your name, recruit?');
    this.createChoices([]);

    // Simple name capture via DOM element
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your name';
    input.maxLength = 24;
    input.style.position = 'absolute';
    input.style.left = `${(width / 2) - 160}px`;
    input.style.top = '60%';
    input.style.width = '320px';
    input.style.padding = '10px';
    input.style.fontFamily = 'Courier New, monospace';
    input.style.fontSize = '16px';
    input.style.zIndex = 1000;
    document.body.appendChild(input);
    input.focus();

    const finish = () => {
      const name = (input.value || 'Recruit').trim();
      document.body.removeChild(input);
      window.gameState.playerName = name;
      saveManager.setLastSceneAndSave('CharacterSheetScene');
      this.scene.start('CharacterSheetScene');
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') finish();
    });
  }
}
