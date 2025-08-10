import Phaser from 'phaser';
import saveManager from '../utils/saveManager.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.setupBackground();
        this.createMarine();
        this.setupControls();
        this.createUI();
        this.createTrainingAreas();
        
        // Welcome message
        this.showWelcomeMessage();

        // Pause menu
        this.input.keyboard.on('keydown-ESC', () => this.togglePauseMenu());
        this.createSaveIndicator();
        saveManager.setLastSceneAndSave('MainScene');

        this.currentDir = 'e';
        this.usingAtlas = this.textures.exists('marine_atlas');
    }

    createSaveIndicator() {
        const { width } = this.cameras.main;
        this.saveIndicator = this.add.text(width - 12, 12, '', { fontSize: '12px', fill: '#9aa4b2', fontFamily: 'Courier New, monospace' }).setOrigin(1, 0);
        const show = (msg) => {
            this.saveIndicator.setText(msg);
            this.saveIndicator.alpha = 1;
            this.tweens.add({ targets: this.saveIndicator, alpha: 0, delay: 800, duration: 300 });
        };
        this.onSaved = () => show('Saved');
        this.onCleared = () => show('Save cleared');
        window.addEventListener('game:saved', this.onSaved);
        window.addEventListener('game:saveCleared', this.onCleared);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            window.removeEventListener('game:saved', this.onSaved);
            window.removeEventListener('game:saveCleared', this.onCleared);
        });
    }

    togglePauseMenu() {
        if (this.pausePanel) {
            this.pausePanel.destroy();
            this.pauseText?.destroy();
            this.btnSave?.destroy();
            this.btnReset?.destroy();
            this.btnResume?.destroy();
            this.pausePanel = null;
            return;
        }

        const { width, height } = this.cameras.main;
        this.pausePanel = this.add.rectangle(width / 2, height / 2, 460, 220, 0x0a0f14, 0.95).setStrokeStyle(2, 0x223041);
        this.pauseText = this.add.text(width / 2, height / 2 - 60, 'Paused', { fontSize: '18px', fill: '#e6e9ef', fontFamily: 'Courier New, monospace' }).setOrigin(0.5);
        this.btnResume = this.add.text(width / 2, height / 2 - 10, 'Resume', { fontSize: '16px', fill: '#ffffff', fontFamily: 'Courier New, monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.btnSave = this.add.text(width / 2, height / 2 + 30, 'Save Now', { fontSize: '16px', fill: '#00ff88', fontFamily: 'Courier New, monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.btnReset = this.add.text(width / 2, height / 2 + 70, 'Reset Save', { fontSize: '16px', fill: '#ff6b6b', fontFamily: 'Courier New, monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.btnResume.on('pointerdown', () => this.togglePauseMenu());
        this.btnSave.on('pointerdown', () => saveManager.save());
        this.btnReset.on('pointerdown', () => { saveManager.clear(); window.gameState = saveManager.createDefaultState(); });
    }

    setupBackground() {
        // Create a simple grid pattern for the training ground
        const tileSize = 64;
        const rows = Math.ceil(this.cameras.main.height / (tileSize / 2)) + 2;
        const cols = Math.ceil(this.cameras.main.width / tileSize) + 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * tileSize + (row % 2) * (tileSize / 2);
                const y = row * (tileSize / 2);
                this.add.image(x, y, 'ground').setOrigin(0.5, 1);
            }
        }
    }

    createMarine() {
        const hasAtlas = this.textures.exists('marine_atlas');
        if (hasAtlas) {
            this.marine = this.add.sprite(512, 300, 'marine_atlas');
            this.marine.setScale(0.6);
            this.marine.play('marine_idle_e');
        } else {
            this.marine = this.physics.add.sprite(512, 300, 'marine');
            this.marine.setCollideWorldBounds(true);
            this.marine.setScale(1.5);
            this.marine.setTint(0x4a7c59);
        }
    }

    setupControls() {
        // Create cursor keys for movement
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // WASD keys as alternative
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Interaction key (spacebar)
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createUI() {
        // Create UI panel
        const uiPanel = this.add.rectangle(10, 10, 300, 120, 0x000000, 0.7);
        uiPanel.setOrigin(0, 0);
        uiPanel.setStrokeStyle(2, 0x00ff00);

        // Week display
        this.weekText = this.add.text(20, 20, `WEEK: ${window.gameState.week}/${window.gameState.maxWeeks}`, {
            fontSize: '16px',
            fill: '#00ff00',
            fontFamily: 'Courier New, monospace'
        });

        // Stats display
        const stats = window.gameState.marineStats;
        this.statsText = this.add.text(20, 45, 
            `FITNESS: ${stats.fitness}\nDISCIPLINE: ${stats.discipline}\nMARKSMANSHIP: ${stats.marksmanship}\nLEADERSHIP: ${stats.leadership}`, {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Courier New, monospace',
            lineSpacing: 2
        });

        // Instructions
        this.add.text(this.cameras.main.width - 10, 10, 
            'ARROW KEYS: Move\nSPACE: Interact\nESC: Pause', {
            fontSize: '12px',
            fill: '#cccccc',
            fontFamily: 'Courier New, monospace',
            align: 'right'
        }).setOrigin(1, 0);
    }

    createTrainingAreas() {
        // Create different training areas
        
        // Barracks
        const barracks = this.add.image(200, 200, 'barracks');
        barracks.setInteractive();
        barracks.on('pointerdown', () => this.enterArea('barracks'));
        
        // Obstacle course
        const obstacle1 = this.add.image(600, 300, 'obstacle');
        obstacle1.setInteractive();
        obstacle1.on('pointerdown', () => this.enterArea('obstacle-course'));
        
        const obstacle2 = this.add.image(700, 300, 'obstacle');
        obstacle2.setInteractive();
        
        const obstacle3 = this.add.image(800, 300, 'obstacle');
        obstacle3.setInteractive();

        // Training areas labels
        this.add.text(200, 150, 'BARRACKS', {
            fontSize: '14px',
            fill: '#ffff00',
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);

        this.add.text(700, 250, 'OBSTACLE COURSE', {
            fontSize: '14px',
            fill: '#ffff00',
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);
    }

    showWelcomeMessage() {
        const welcomeText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
            'WELCOME TO MARINE BOOT CAMP, RECRUIT!\n\nYou have 13 weeks to complete your training.\nMove around and interact with training areas.\n\n[SPACE] to dismiss', {
            fontSize: '18px',
            fill: '#00ff00',
            fontFamily: 'Courier New, monospace',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 20, y: 15 },
            stroke: '#333333',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Dismiss welcome message
        const dismissWelcome = () => {
            welcomeText.destroy();
            this.spaceKey.off('down', dismissWelcome);
        };
        
        this.spaceKey.on('down', dismissWelcome);
    }

    enterArea(areaType) {
        switch(areaType) {
            case 'barracks':
                this.showMessage('BARRACKS: Rest and prepare for training.\n[Coming soon: Sleep and equipment management]');
                break;
            case 'obstacle-course':
                this.showMessage('OBSTACLE COURSE: Test your physical fitness!\n[Coming soon: Fitness minigame]');
                break;
        }
    }

    showMessage(text) {
        const message = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 100, text, {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Courier New, monospace',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 }
        }).setOrigin(0.5);

        // Auto-dismiss after 3 seconds
        this.time.delayedCall(3000, () => {
            message.destroy();
        });
    }

    update() {
        // Handle marine movement
        this.handleMovement();
        if (this.usingAtlas) this.updateAnimation();
    }

    updateAnimation() {
        const vx = this.cursors.left.isDown || this.wasd.A.isDown ? -1 : this.cursors.right.isDown || this.wasd.D.isDown ? 1 : 0;
        const vy = this.cursors.up.isDown || this.wasd.W.isDown ? -1 : this.cursors.down.isDown || this.wasd.S.isDown ? 1 : 0;

        let dir = this.currentDir;
        if (vx === 0 && vy === 0) {
            const idleKey = `marine_idle_${dir}`;
            if (this.marine.anims?.currentAnim?.key !== idleKey) this.marine.play(idleKey, true);
            return;
        }

        // Determine 8-way direction
        if (vx > 0 && vy < 0) dir = 'ne';
        else if (vx > 0 && vy === 0) dir = 'e';
        else if (vx > 0 && vy > 0) dir = 'se';
        else if (vx === 0 && vy > 0) dir = 's';
        else if (vx < 0 && vy > 0) dir = 'sw';
        else if (vx < 0 && vy === 0) dir = 'w';
        else if (vx < 0 && vy < 0) dir = 'nw';
        else if (vx === 0 && vy < 0) dir = 'n';

        this.currentDir = dir;
        const walkKey = `marine_walk_${dir}`;
        if (this.marine.anims?.currentAnim?.key !== walkKey) this.marine.play(walkKey, true);
    }

    handleMovement() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        // Check for input
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            velocityX = -speed;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            velocityX = speed;
        }

        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            velocityY = -speed;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            velocityY = speed;
        }

        // Apply movement
        if (this.marine.body) {
            this.marine.setVelocity(velocityX, velocityY);
        } else {
            this.marine.x += velocityX * (1/60);
            this.marine.y += velocityY * (1/60);
        }

        // Update location in game state based on marine position
        this.updateLocation();
    }

    updateLocation() {
        const x = this.marine.x;
        const y = this.marine.y;
        
        // Simple location detection based on position
        if (x < 300 && y < 300) {
            window.gameState.currentLocation = 'barracks';
        } else if (x > 500 && y > 250 && y < 350) {
            window.gameState.currentLocation = 'obstacle-course';
        } else {
            window.gameState.currentLocation = 'training-ground';
        }
    }
} 