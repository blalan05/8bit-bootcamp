import Phaser from 'phaser';
import saveManager from '../utils/saveManager.js';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Sky/background
    this.add.rectangle(0, 0, width, height, 0x0b0f1a).setOrigin(0);

    // Building face
    this.add.rectangle(width / 2, height / 2, 500, 300, 0x1f2937).setOrigin(0.5);

    // Posters
    this.add.rectangle(width / 2 - 180, height / 2 + 10, 90, 140, 0x2b3545).setStrokeStyle(2, 0x41506a);
    this.add.text(width / 2 - 180, height / 2 - 50, 'USMC', { fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New, monospace' }).setOrigin(0.5);

    this.add.rectangle(width / 2 + 180, height / 2 + 10, 90, 140, 0x2b3545).setStrokeStyle(2, 0x41506a);
    this.add.text(width / 2 + 180, height / 2 - 50, 'Honor', { fontSize: '18px', fill: '#00ff00', fontFamily: 'Courier New, monospace' }).setOrigin(0.5);

    // Door (center)
    this.door = this.add.rectangle(width / 2, height / 2 + 20, 120, 220, 0x374151).setOrigin(0.5);
    this.door.setStrokeStyle(2, 0x6b7280);

    // Prompt
    const prompt = this.add.text(width / 2, height - 60, 'Click/Tap to step forward', { fontSize: '14px', fill: '#cccccc', fontFamily: 'Courier New, monospace' }).setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.3, yoyo: true, repeat: -1, duration: 800 });

    this.input.once('pointerdown', () => this.openDoor());

    saveManager.setLastSceneAndSave('IntroScene', saveManager.getActiveSlot() || 1);
  }

  openDoor() {
    // Simple door opening effect via scaleX
    this.tweens.add({
      targets: this.door,
      scaleX: 0.1,
      duration: 700,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        saveManager.setLastSceneAndSave('RecruitDialogueScene', saveManager.getActiveSlot() || 1);
        this.time.delayedCall(300, () => this.scene.start('RecruitDialogueScene'));
      }
    });
  }
}
