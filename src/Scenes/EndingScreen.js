class EndingScreen extends Phaser.Scene {
    constructor() {
        super("endingScreen");
    }

    create() {
        this.add.text(
            game.config.width / 2,
            game.config.height / 2 - 50,
            "Game Over",
            { fontFamily: 'Arial', fontSize: 48, color: '#ff0000' }
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            game.config.height / 2,
            "Final Score: " + this.registry.get("finalScore"),
            { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' }
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            game.config.height / 2 + 100,
            "Click here to restart",
            { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            this.resetGame();
        });
    }

    resetGame() {
        this.registry.set("finalScore", 0);

        this.init_game();

        this.scene.start("titleScreen");
    }

    init_game() {
        this.playerHealth = 100;
    
        this.playerLives = 3;
    
        this.myScore = 0;
    }
    
}
