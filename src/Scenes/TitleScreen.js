class TitleScreen extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    preload() {
        // this.load.image("background", "darkPurple.png");
        // font
        // BMFont: https://www.angelcode.com/products/bmfont/
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

    }

    create() {
        // Add background image
        // this.add.image(0, 0, "background").setOrigin(0);

        this.nextScene = this.input.keyboard.addKey("S");

        this.add.text(
            game.config.width / 2,
            100,
            "Space Shooter", 
            { fontFamily: 'Arial', fontSize: 48, color: '#ffffff' }
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            game.config.height - 100,
            "Press S to start", 
            { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' }
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            game.config.height - 150,
            "Press SPACE to shoot", 
            { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' }
        ).setOrigin(0.5);

        // this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // document.getElementById('description').innerHTML = '<h2>Title Screen.js</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("mainScreen");
        }
    }
    
}
