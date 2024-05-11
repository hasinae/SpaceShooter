class MainScreen extends Phaser.Scene {
    constructor() {
        super("mainScreen");

        this.my = {sprite: {}, text: {}};

        this.playerHealth = 100;
        this.playerLives = 3;

        this.enemyProjectiles = [];
        
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;     
        
        this.my.sprite.meteors = [];
        
        this.myScore = 0;
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("player", "playerShip3_red.png");
        this.load.image("playerLaser", "laserBlue13.png");
        this.load.image("enemy", "enemyBlack1.png");
        this.load.image("lives", "playerShip3_red.png");


        this.load.image("explosion01", "spaceEffects_08.png");
        this.load.image("explosion02", "spaceEffects_012.png");
        this.load.image("explosion03", "spaceEffects_013.png");
        this.load.image("explosion04", "spaceEffects_016.png");
        
        this.load.image("meteor1", "meteorGrey_big1.png");
        this.load.image("meteor2", "meteorGrey_big2.png");
        this.load.image("meteor3", "meteorGrey_big3.png");
        this.load.image("meteor4", "meteorGrey_big4.png");

        this.load.image("enemyLaser", "laserRed02.png");

        // font
        // BMFont: https://www.angelcode.com/products/bmfont/
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // sound asset
        // https://kenney.nl/assets/sci-fi-sounds 
        this.load.audio("explodeSound", "explosionCrunch_003.ogg");
    }

    create() {
        let my = this.my;


        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "player");
        my.sprite.player.setScale(0.7);

        // // allowing physics
        // this.physics.world.enable(this.my.sprite.enemy);

        // player health
        my.text.health = this.add.bitmapText(10, 10, "rocketSquare", "Health: " + this.playerHealth);

        this.my.text.lives = this.add.bitmapText(10, 30, "rocketSquare", "Lives: " + this.playerLives);

        this.createEnemies();

        const numEnemies = 8;
        const enemyY = 100;
        const spacing2 = 120;
    
        if (!my.sprite.enemies || my.sprite.enemies.length === 0) {
            my.sprite.enemies = [];
    
            for (let i = 0; i < numEnemies; i++) {
                const enemyX = (game.config.width / 2) + (i - Math.floor(numEnemies / 2)) * spacing2;
                let enemy = this.add.sprite(enemyX, enemyY, "enemy");
                enemy.setScale(0.5);
                enemy.scorePoints = 25;
                my.sprite.enemies.push(enemy);
            }
        } else {
            my.sprite.enemies = my.sprite.enemies.filter(enemy => enemy.active);
        }

        // meteors
        const meteorY = 470;
        const numMeteors = 4;
        const spacing = 150;
    
        my.sprite.meteors = [];

        for (let i = 0; i < numMeteors; i++) 
        {
            const meteorX = (game.config.width / 2) + (i - Math.floor(numMeteors / 2)) * spacing;
            let meteor = this.add.sprite(meteorX, meteorY, "meteor" + (i + 1));
            meteor.setScale(0.5);
            my.sprite.meteors.push(meteor);
        }

        this.anims.create({
            key: "puff",
            frames: [
                { key: "explosion00" },
                { key: "explosion01" },
                { key: "explosion02" },
                { key: "explosion03" },
            ],
            frameRate: 20,  
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        // // update HTML description
        // document.getElementById('description').innerHTML = '<h2>Space Shooters Screen.js</h2><br>A: left // D: right // Space: fire'

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "playerLaser")
                );
            }
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
       
        // this.enemyShoot();

        if (my.sprite.enemies) {
            for (let enemy of my.sprite.enemies) {
                if (this.collides(enemy, my.sprite.player)) {
                    this.playerHealth -= 10; 
                    my.text.health.setText("Health: " + this.playerHealth);
        
                    if (this.playerHealth <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
        

        for (let bullet of my.sprite.bullet) {
            // enemy collision
            for (let enemy of my.sprite.enemies) {
                if (this.collides(enemy, bullet)) {
                    this.handleCollision(enemy, bullet);
                }
            }

            // meteor collision
            for (let meteor of my.sprite.meteors) {
                if (this.collides(meteor, bullet)) {
                    this.handleCollision(meteor, bullet);
                }
            }
        }


        for (let projectile of this.enemyProjectiles) {
            if (projectile && projectile.body && projectile.body.velocity) { 
                let angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, this.my.sprite.player.x, this.my.sprite.player.y);
                this.physics.velocityFromRotation(angle, 200, projectile.body.velocity); 
            }
        }
        

        this.updatePlayerHealth();

        this.checkPlayerCollision();

        if (this.my.sprite.enemies) {
            this.enemyShoot();
        }



        // // Game over check
        // if (this.playerHealth <= 0) {
        //     this.gameOver();
        // }
        if (this.playerHealth <= 0) {
            this.playerLives--;
            this.my.text.lives.setText("Lives: " + this.playerLives);
            if (this.playerLives <= 0) {
                this.gameOver();
            } else {
                this.playerHealth = 100;
            }
        }

        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        // if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
        //     this.scene.start("endingScene");
        // }
        if (this.myScore >= 250) {
            this.registry.set("finalScore", this.myScore);
    
            this.scene.start("endingScreen");
        }
    }

    // createEnemies() {
    //     // enemies
    //     const enemyCoordinates = [
    //         [135, 142],
    //         [299, 143],
    //         [453, 147],
    //         [598, 143],
    //         [727, 138]
    //     ];
    
    //     this.my.sprite.enemies = [];
    
    //     for (let i = 0; i < enemyCoordinates.length; i++) {
    //         const [x, y] = enemyCoordinates[i];
    //         let enemy = this.add.sprite(x, y, "enemy");
    //         enemy.setScale(0.5);
    //         enemy.scorePoints = 25;
    //         this.my.sprite.enemies.push(enemy);
    //     }
    // }
    createEnemies() {
        const enemyCoordinates = [];
        const numEnemies = 8; 
        const enemyY = 100;
        const spacing2 = 120;
    
        for (let i = 0; i < numEnemies; i++) {
            let enemyX = (game.config.width / 2) + (i - Math.floor(numEnemies / 2)) * spacing2;
    
            let meteorCollision = false;
            for (let meteor of this.my.sprite.meteors) {
                if (Math.abs(enemyX - meteor.x) < 100) { 
                    meteorCollision = true;
                    break;
                }
            }
    
            if (!meteorCollision) {
                enemyCoordinates.push([enemyX, enemyY]);
            }
        }
    
        this.my.sprite.enemies = [];
        for (let i = 0; i < enemyCoordinates.length; i++) {
            const [x, y] = enemyCoordinates[i];
            let enemy = this.add.sprite(x, y, "enemy");
            enemy.setScale(0.5);
            enemy.scorePoints = 25;
            this.my.sprite.enemies.push(enemy);
        }
    }
    
    enemyShoot() {
        if (this.my.sprite.enemies) {
            for (let enemy of this.my.sprite.enemies) {
                if (Math.random() < 0.01) {
                    let projectile = this.add.sprite(enemy.x, enemy.y, "enemyLaser");
                    this.physics.moveToObject(projectile, this.my.sprite.player, 200);
                    this.enemyProjectiles.push(projectile);
                }
            }
        }
    }
    


    checkPlayerCollision() {
        for (let projectile of this.enemyProjectiles) {
            if (this.collides(projectile, this.my.sprite.player)) {
                this.playerHealth -= 10;
                projectile.destroy();
            }
        }
    }
    

    updatePlayerHealth() {
        for (let projectile of this.enemyProjectiles) {
            if (this.collides(projectile, this.my.sprite.player)) {
                this.playerHealth -= 10; // Example reduction in health
                this.my.text.health.setText("Health: " + this.playerHealth);
                projectile.destroy();
            }
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    handleCollision(object, bullet) {
        if (object.texture.key.includes("meteor")) {

            this.myScore -= 1;
            this.updateScore();

            this.puff = this.add.sprite(object.x, object.y, "explosion02").setScale(0.75).play("puff");
            object.visible = false;
            object.x = Phaser.Math.Between(50, game.config.width - 50); 
            this.sound.play("explodeSound", {
                volume: 1 
            });
            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                object.visible = true;
                object.x = Phaser.Math.Between(50, game.config.width - 50); 
            }, this);
        } 
        else 
        {
            this.puff = this.add.sprite(object.x, object.y, "explosion02").setScale(0.75).play("puff");
            bullet.y = -100;
            object.visible = false;
            object.x = Phaser.Math.Between(50, game.config.width - 50); 
            this.myScore += object.scorePoints;
            this.updateScore();
            this.sound.play("explodeSound", {
                volume: 1 
            });
            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                object.visible = true;
                object.x = Phaser.Math.Between(50, game.config.width - 50); 
            }, this);
        }
    }

    updateScore() {
        this.my.text.score.setText("Score " + this.myScore);
    }   

}
         