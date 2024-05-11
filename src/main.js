// Hasina Esteqlal
// CMPM 120
// Game 2 Gallery Shooter

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    fps: { forceSetTimeOut: true, target: 60 },   // ensure consistent timing across machines
    width: 800,
    height: 600,

    physics: {
        default: 'arcade', 
        arcade: {
            gravity: { y: 300 },
            debug: false 
        }
    },

    scene: [TitleScreen, MainScreen, EndingScreen]
}


const game = new Phaser.Game(config);