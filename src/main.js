import Phaser from 'phaser';
import { PreloaderScene, MainScene, TitleScene, IntroScene, RecruitDialogueScene, CharacterSheetScene, PFTRunScene, PFTSitupsScene, PFTPullupsScene, ASVABScene } from './scenes/index.js';
import saveManager from './utils/saveManager.js';

// Initialize global state and try to load existing save from active slot
window.gameState = saveManager.createDefaultState();
saveManager.loadActiveIfAny();

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity for isometric view
            debug: false
        }
    },
    scene: [PreloaderScene, TitleScene, IntroScene, RecruitDialogueScene, CharacterSheetScene, PFTRunScene, PFTSitupsScene, PFTPullupsScene, ASVABScene, MainScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 512,
            height: 384
        },
        max: {
            width: 1920,
            height: 1080
        }
    }
};

// Hide loading text when game starts
document.getElementById('loading-text').style.display = 'none';

// Create and start the game
const game = new Phaser.Game(config);

export default game; 