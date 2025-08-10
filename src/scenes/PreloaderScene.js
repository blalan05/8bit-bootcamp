import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        // Create loading screen
        this.createLoadingScreen();
        
        // For now, we'll create simple colored rectangles as placeholder assets
        // Later these will be replaced with actual 8-bit sprites
        this.createPlaceholderAssets();

        // Try loading pre-rendered marine atlas (if present)
        this.load.atlas('marine_atlas', 'assets/marine.png', 'assets/marine.json');
        
        // Load progress
        this.load.on('progress', (progress) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0x00ff00);
            this.progressBar.fillRect(this.cameras.main.width / 2 - 200, this.cameras.main.height / 2 + 50, 400 * progress, 20);
        });

        this.load.on('complete', () => {
            this.registerAnimationsIfAtlas();
            this.time.delayedCall(600, () => {
                this.scene.start('TitleScene');
            });
        });
    }

    createLoadingScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Title
        this.add.text(centerX, centerY - 100, '8-BIT BOOTCAMP', {
            fontSize: '48px',
            fill: '#00ff00',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(centerX, centerY - 50, 'MARINE RECRUIT TRAINING', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);

        // Loading text
        this.add.text(centerX, centerY + 20, 'LOADING...', {
            fontSize: '18px',
            fill: '#cccccc',
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);

        // Progress bar background
        this.add.rectangle(centerX, centerY + 60, 404, 24, 0x333333).setStrokeStyle(2, 0x666666);
        
        // Progress bar (will be filled in preload)
        this.progressBar = this.add.graphics();
    }

    createPlaceholderAssets() {
        // Create simple colored rectangles as placeholder sprites
        
        // Marine recruit sprite (green rectangle for now)
        this.add.graphics()
            .fillStyle(0x4a7c59)
            .fillRect(0, 0, 32, 48)
            .generateTexture('marine', 32, 48);

        // Ground/floor tiles (brown rectangle)
        this.add.graphics()
            .fillStyle(0x8b7355)
            .fillRect(0, 0, 64, 32)
            .generateTexture('ground', 64, 32);

        // Building/barracks (gray rectangle)
        this.add.graphics()
            .fillStyle(0x5a6c7d)
            .fillRect(0, 0, 128, 96)
            .generateTexture('barracks', 128, 96);

        // Training obstacle (red rectangle)
        this.add.graphics()
            .fillStyle(0xd63031)
            .fillRect(0, 0, 64, 64)
            .generateTexture('obstacle', 64, 64);

        // UI elements
        this.add.graphics()
            .fillStyle(0x2d3436)
            .fillRect(0, 0, 200, 30)
            .generateTexture('ui-panel', 200, 30);
    }

    registerAnimationsIfAtlas() {
        const hasAtlas = this.textures.exists('marine_atlas');
        if (!hasAtlas) return;
        const dirs = ['n','ne','e','se','s','sw','w','nw'];
        const actions = [
            { key: 'idle', start: 1, end: 12, rate: 12, repeat: -1 },
            { key: 'walk', start: 1, end: 12, rate: 12, repeat: -1 }
        ];
        for (const d of dirs) {
            for (const a of actions) {
                const key = `marine_${a.key}_${d}`;
                if (!this.anims.exists(key)) {
                    try {
                        this.anims.create({
                            key,
                            frames: this.anims.generateFrameNames('marine_atlas', { start: a.start, end: a.end, zeroPad: 2, prefix: `${a.key}_${d}_` }),
                            frameRate: a.rate,
                            repeat: a.repeat
                        });
                    } catch {}
                }
            }
        }
    }
} 