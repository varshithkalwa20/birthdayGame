const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

const game = new Phaser.Game(config);

let player;
let cursors;
let candles;
let clouds;
let birds;
let messageText;
let surprises;
let speed = 100;
let jumpHeight = -500;
let jumped = false;
let candleCount = 4;
let candlesPassed = 0;
let gameOver = false;
let surpriseCount = 2;
let surprisesPassed = 0;
let snowEmitter;

// Preload assets
function preload() {
    this.load.image('sky', '/assets/sky.png');
    this.load.image('ground', '/assets/ground.png');
    this.load.image('candle', '/assets/candle.png');
    this.load.image('cloud', '/assets/cloud.png');
    this.load.image('bird', '/assets/moon.png');
    this.load.image('friendHead', '/assets/friendHead.png');
    this.load.image('spark', '/assets/spark.png');
    this.load.image('snow', '/assets/snow.png');
    
}

// Create game elements
function create() {
    this.add.image(config.width / 2, config.height / 2, 'sky');

    const platforms = this.physics.add.staticGroup();
    platforms.create(config.width / 2, config.height - 50, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, config.height - 100, 'friendHead').setOrigin(0.5, 0.5).setScale(0.1);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(1000);

    this.physics.add.collider(player, platforms);

    // Create candles, clouds, birds, and surprises
    createCandles.call(this);
    createClouds.call(this);
    createBirds.call(this);
    createSurprises.call(this);

    // Display messages
    messageText = this.add.text(config.width / 2, 50, '', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    messageText.setAlpha(0);

    // Create snow particle emitter for continuous snow effect
    const snowParticles = this.add.particles('snow');
    snowEmitter = snowParticles.createEmitter({
        speed: 20,
        gravityY: 50, // Make snow fall towards the ground
        scale: { start: 0.1, end: 0.1 },
        lifespan: 4000,
        frequency: 100,
        quantity: 1, // Adjusted to emit fewer snow particles
        emitZone: {
            type: 'random',
            source: new Phaser.Geom.Rectangle(0, 0, config.width, 0),
        },
    });

    cursors = this.input.keyboard.createCursorKeys();

    // Spacebar handling for jump
    this.input.keyboard.on('keydown-SPACE', () => {
        if (!gameOver) {
            player.setVelocityY(jumpHeight);
            player.body.allowGravity = false;
        }
    });

    this.input.keyboard.on('keyup-SPACE', () => {
        player.body.allowGravity = true;
    });

    // Set up collision detection between player and candles
    this.physics.add.overlap(player, candles, handleCandleCollision, null, this);
}

// Update game state
function update() {
    if (!gameOver) {
        if (cursors.right.isDown) {
            moveWorld(-speed * 0.1); // Move the world left as the player moves right
        } else if (cursors.left.isDown) {
            moveWorld(speed * 0.1); // Move the world right as the player moves left
        } else {
            stopWorld(); // Stop movement if no keys are pressed
        }

        // Check if the game is over after all candles have been passed
        if (candlesPassed >= candleCount && !gameOver) {
            gameOver = true;
            showBirthdayMessage.call(this); // Show birthday message
            stopWorld(); // Stop movement after showing the birthday message
        }

        if (player.body.touching.down) {
            jumped = false;
        }

        // Debugging output to track game state
        console.log(`Candles Passed: ${candlesPassed}, Surprises Passed: ${surprisesPassed}, Game Over: ${gameOver}`);
    }
}

// Handle candle collision
function handleCandleCollision() {
    if (!gameOver) {
        restartGame.call(this); // Restart the game
    }
}

// Show birthday message with animation
function showBirthdayMessage() {
    // Create the birthday message text
    const birthdayText = this.add.text(config.width / 2, config.height / 4, 'Happy Birthday Kaavyaa!', { fontSize: '64px', fill: '#800080' }).setOrigin(0.5); // Changed fill color to purple
    birthdayText.setAlpha(0); // Start with 0 opacity

    // Create an image below the message
    const birthdayImage = this.add.image(config.width / 2, config.height / 4 , 'friendHead').setOrigin(0.1).setScale(0.2); // Adjust Y-coordinate to position below the text
    birthdayImage.setAlpha(0); // Start with 0 opacity

    // Create sparks particle emitter
   

    // Fade in animation for the message
    this.tweens.add({
        targets: birthdayText,
        alpha: 1,
        duration: 2000,
        ease: 'Power1',
    });
       
            // Fade in the birthday image
            this.tweens.add({
                targets: birthdayImage,
                alpha: 1,
                duration: 2000,
                ease: 'Power1',
            });
        

}

// Restart the game
function restartGame() {
    // Reset all game state variables
    candlesPassed = 0;
    surprisesPassed = 0;
    gameOver = false;

    // Reset player position
    player.setPosition(100, config.height - 100);
    player.setVelocity(0);

    // Reset candles, clouds, birds, and surprises
    candles.children.iterate(candle => {
        candle.setVisible(true);
        candle.enableBody(true, candle.x, candle.y, true, true);
    });

    surprises.children.iterate(surprise => {
        surprise.setVisible(true);
        surprise.setAlpha(1); // Make sure it's fully visible
        surprise.enableBody(true, surprise.x, surprise.y, true, true);
    });

    // Reset message
    messageText.setAlpha(0);
}

// Create candles
function createCandles() {
    candles = this.physics.add.group();
    const candleDistance = 2000;
    const candleHeight = config.height - 60; // Ensure candles are at the correct height
    for (let i = 0; i < candleCount; i++) {
        const candle = candles.create(800 + i * candleDistance, candleHeight, 'candle');
        candle.setScale(0.05);
        candle.setImmovable(true);
    }
}

// Create clouds
function createClouds() {
    clouds = this.physics.add.group();
    const cloudDistance = 600;
    for (let i = 0; i < 10; i++) {
        const cloud = clouds.create(800 + i * cloudDistance, Math.random() * 300, 'cloud');
        cloud.setScale(0.5);
        cloud.setImmovable(true);
    }
}

// Create birds
function createBirds() {
    birds = this.physics.add.group();
    const birdDistance = 1500; // Distance between each bird
    for (let i = 0; i < 5; i++) {
        const birdY = Math.random() * 300; // Random Y position for each bird
        const bird = birds.create(800 + i * birdDistance, birdY, 'bird'); // Create birds spaced out
        bird.setScale(0.1);
        bird.setImmovable(true);
    }
}

// Create surprises
function createSurprises() {
    surprises = this.physics.add.group();
    const surpriseDistance = 3000;
    for (let i = 0; i < surpriseCount; i++) {
        // Place surprises slightly higher than ground level to avoid conflict
        const surprise = surprises.create(1000 + i * surpriseDistance, config.height - 120, 'friendHead');
        surprise.setScale(0.1);
        surprise.setImmovable(true);
    }
}

// Move the world as the player moves (including candles, clouds, birds, and surprises)
function moveWorld(distance) {
    candles.children.iterate(candle => {
        candle.x += distance;
        if (candle.x < player.x - player.width && candle.visible) {
            candlesPassed++;
            candle.setVisible(false);
            candle.disableBody(true, true); // Disable the candle after passing
            console.log('Candle passed!'); // Debugging output
        }
    });

    clouds.children.iterate(cloud => {
        cloud.x += distance * 0.5;
        if (cloud.x < -50) cloud.x = 850;
    });

    // Move birds
    birds.children.iterate(bird => {
        bird.x += distance; // Move the bird with the world
        if (bird.x < player.x - player.width && bird.visible) {
            // Add any specific logic you need when a bird is passed, if necessary
            bird.setVisible(false);
            bird.disableBody(true, true); // Disable the bird after passing
        }
    });

    surprises.children.iterate(surprise => {
        surprise.x += distance;
    });
}

// Stop world movement
function stopWorld() {
    candles.children.iterate(candle => {
        candle.setVelocityX(0);
    });
    clouds.children.iterate(cloud => {
        cloud.setVelocityX(0);
    });
    birds.children.iterate(bird => {
        bird.setVelocityX(0);
    });
}

// Display message
function displayMessage(msg) {
    messageText.setText(msg);
    messageText.setAlpha(1);
    this.time.delayedCall(2000, () => {
        messageText.setAlpha(0);
    }, [], this);
}
