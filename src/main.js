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
let img;
let speed = 100;
let jumpHeight = -500;
let jumped = false;
let candleCount = 6;
let candlesPassed = 0;
let gameOver = false;
let surpriseCount = 2;
let surprisesPassed = 0;
let snowEmitter;

//loadinggggg assettsss
function preload() {
   this.load.image('sky', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/sky.png');
    this.load.image('ground', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/ground.png');
    this.load.image('candle', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/candle.png');
    this.load.image('cloud', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/cloud.png');
    this.load.image('bird', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/moon.png');
    this.load.image('friendHead', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/friendHead.png');
    this.load.image('spark', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/spark.png');
    this.load.image('snow', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/snow.png');
    this.load.image('img1', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/img1.jpeg');
    this.load.image('img2', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/img2.jpeg');
    this.load.image('img3', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/img3.jpeg');
    this.load.image('img4', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/img4.jpeg');
    //this.load.image('birthday', '/assets/birthday.jpeg');
    this.load.image('bdy', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/bdy.png');
    this.load.image('mountain', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/mountain.png');
    this.load.image('skate', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/skate.png');
    this.load.image('teddy', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/teddy.png');
    this.load.image('panda', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/panda.png');
    this.load.image('bts', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/bts.png');
    this.load.image('v', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/v.png');
    this.load.image('oikawa', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/oikawa.png');



    //music doode
    this.load.audio('BGM', 'https://raw.githubusercontent.com/varshithkalwa20/birthdayGame/main/assets/BGM.mp3');





    
}
let image = ['img1', 'img2', 'img3','img4'];
let arr=['teddy','skate','panda','bts','v','oikawa'];

// Creating cute cute game elements
function create() {

    const music = this.sound.add('BGM', { loop: true, volume: 0.5 }); 
    music.play(); 
    this.add.image(config.width / 2, config.height / 2, 'sky');
    this.add.image(config.width / 2, config.height / 1.1, 'mountain');

    const platforms = this.physics.add.staticGroup();
    platforms.create(config.width / 2, config.height - 50, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, config.height - 100, 'friendHead').setOrigin(0.5, 0.5).setScale(0.1);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(1000);

    this.physics.add.collider(player, platforms);

    createCandles.call(this);
    imgs.call(this);
    createClouds.call(this);
    createBirds.call(this);
    createSurprises.call(this);


    messageText = this.add.text(config.width / 2, 50, '', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    messageText.setAlpha(0);

    const snowParticles = this.add.particles('snow');
    snowEmitter = snowParticles.createEmitter({
        speed: 20,
        gravityY: 50, 
        scale: { start: 0.1, end: 0.1 },
        lifespan: 4000,
        frequency: 100,
        quantity: 1, 
        emitZone: {
            type: 'random',
            source: new Phaser.Geom.Rectangle(0, 0, config.width, 0),
        },
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown-SPACE', () => {
        if (!gameOver) {
            player.setVelocityY(jumpHeight);
            player.body.allowGravity = false;
        }
    });

    this.input.keyboard.on('keyup-SPACE', () => {
        player.body.allowGravity = true;
    });


    this.physics.add.overlap(player, candles, handleCandleCollision, null, this);
}


function update() {
    if (!gameOver) {
        if (cursors.right.isDown) {
            moveWorld(-speed * 0.1);
        } else if (cursors.left.isDown) {
            moveWorld(speed * 0.1); 
        } else {
            stopWorld(); 
        }

        
        if (candlesPassed >= candleCount && !gameOver) {
            gameOver = true;
            showBirthdayMessage.call(this); 
            stopWorld(); 
        }

        if (player.body.touching.down) {
            jumped = false;
        }

        console.log(`Candles Passed: ${candlesPassed}, Surprises Passed: ${surprisesPassed}, Game Over: ${gameOver}`);
    }
}


function handleCandleCollision() {
    if (!gameOver) {
        restartGame.call(this); 
    }
}


function showBirthdayMessage() {
    

  
    const birthdayImage = this.add.image(config.width / 3, config.height /3.5 , 'bdy').setOrigin(0.1).setScale(0.5); // Adjust Y-coordinate to position below the text
    birthdayImage.setAlpha(0); 
  
       
            this.tweens.add({
                targets: birthdayImage,
                alpha: 1,
                duration: 2000,
                ease: 'Power1',
            });
        

}


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
    const candleHeight = config.height - 60; 
    for (let i = 0; i < candleCount; i++) {
        const candle = candles.create(800 + i * candleDistance, candleHeight, 'candle');
        candle.setScale(0.05);
        candle.setImmovable(true);
    }
}


function createClouds() {
    clouds = this.physics.add.group();
    const cloudDistance = 600;
    for (let i = 0; i < 10; i++) {
        const cloud = clouds.create(800 + i * cloudDistance, Math.random() * 300, 'cloud');
        cloud.setScale(0.5);
        cloud.setImmovable(true);
    }
}
function imgs() {
    img = this.physics.add.group();
    const candleDistance = 1750;
    const candleHeight = config.height - 150; 
    const scaleFactors = [0.075, 0.1, 0.1, 0.8, 0.15,0.4];
    for (let i = 0; i < arr.length; i++) {
        const candle = img.create(500 + i * candleDistance, candleHeight, arr[i]);
        candle.setScale(scaleFactors[i]);
        candle.setImmovable(true);
    }
}

// Create birds
function createBirds() {
    birds = this.physics.add.group();
    const birdDistance = 1500; 
    for (let i = 0; i < 5; i++) {
        const birdY = Math.random() * 300; 
        const bird = birds.create(800 + i * birdDistance, birdY, 'bird'); 
        bird.setScale(0.1);
        bird.setImmovable(true);
    }
}


function createSurprises() {
    surprises = this.physics.add.group();
    const surpriseDistance = 3000; 
    const surpriseHeight = config.height - 420; 
    for (let i = 0; i < image.length; i++) {
        const surpriseImage = image[i]; 
        const randomX = 1000 + i * surpriseDistance + Math.random() * 500; 
        const surprise = surprises.create(randomX, surpriseHeight, surpriseImage);

        const scaleFactor = 0.25;
        surprise.setScale(scaleFactor); 
        surprise.setImmovable(true);
    }
}




function moveWorld(distance) {
    candles.children.iterate(candle => {
        candle.x += distance;
        if (candle.x < player.x - player.width && candle.visible) {
            candlesPassed++;
            candle.setVisible(false);
            candle.disableBody(false, false); 
            console.log('Candle passed!'); 
        }
    });
    img.children.iterate(image => {
        image.x += distance; 
        if (image.x < player.x - player.width && image.visible) {
          
            console.log('Image passed!'); 
        }
    });

    clouds.children.iterate(cloud => {
        cloud.x += distance * 0.5;
        if (cloud.x < -50) cloud.x = 850;
    });


    birds.children.iterate(bird => {
        bird.x += distance; 
        if (bird.x < player.x - player.width && bird.visible) {
           
            bird.setVisible(false);
            bird.disableBody(true, true); 
        }
    });

    surprises.children.iterate(surprise => {
        surprise.x += distance;
    });
}

function stopWorld() {
    candles.children.iterate(candle => {
        candle.setVelocityX(1);
    });
    clouds.children.iterate(cloud => {
        cloud.setVelocityX(0);
    });
    birds.children.iterate(bird => {
        bird.setVelocityX(0);
    });
}


function displayMessage(msg) {
    messageText.setText(msg);
    messageText.setAlpha(1);
    this.time.delayedCall(2000, () => {
        messageText.setAlpha(0);
    }, [], this);
}
