var game;
var bgColors = [0xF16745, 0xFFC65D, 0x7BC8A4, 0x4CC3D9, 0x93648D, 0x7c786a, 0x588c73, 0x8c4646, 0x2a5b84, 0x73503c];
var tunnelWidth = 256;
var shipHorizontalSpeed = 100;
var shipMoveDelay = 0;
var shipVerticalSpeed = 15000; 
var swipeDistance = 10;
var barrierSpeed = 280;
var barrierGap = 120;
var shipInvisibilityTime = 1000;

var users = 2;
var String = ['Online Chat Room', 'Available Users: '];
var userString = ['sumit: ', 'sajib: '];
// var userString = localStorage.getItem("auth_user");
var content_sumit = [
    " ",
    "kire koi tui??",
    "khida lagse amar, kisu ase",
    " ",
    "Kon shala ei game banaise",
    " ",
    "game e kono level nai",
    "bal game e ball er matha kharap",
    "    "
];
var content_sajib = [
    "  ",
    "Manzke kono mark e dibo na",
    "duniya te ar kono game chilo na",
    " ",
    "na khelle ghuma ga ...",
    "    ",
    "ami khelum na baler game",
    "jaiga bye",
    "   "
];

var remotetext1;
var remotetext2;
var index = 0;
var condex = 0;
var line_sumit = '';
var line_sajib = '';

window.onload = function() {	
    game = new Phaser.Game(640, 960, Phaser.AUTO, "");
                // ("Key", state)
    game.state.add("Boot", boot);
    game.state.add("Preload", preload); 
    game.state.add("TitleScreen", titleScreen);
    game.state.add("PlayGame", playGame);
    game.state.add("GameOverScreen", gameOverScreen);
    
    game.state.start("Boot");//to start all the state
}

//This will make all the adjustment to the game according to browser-
//resolution and aspectratio
var boot = function(game){};

boot.prototype = {
  	preload: function(){          this.game.load.image("loading","assets/sprites/loading.png"); 
	},
  	create: function(){
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.state.start("Preload");
	}
}

//To load all our assets 
var preload = function(game){};
preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loading");
          loadingBar.anchor.setTo(0.5);
          game.load.setPreloadSprite(loadingBar);
          game.load.image("title", "assets/sprites/title.png");
          game.load.image("playbutton", "assets/sprites/playbutton.png");
          game.load.image("backsplash", "assets/sprites/backsplash.png");
          game.load.image("tunnelbg", "assets/sprites/tunnelbg.png");
          game.load.image("wall", "assets/sprites/wall.png");
          game.load.image("ship", "assets/sprites/ship.png");
          game.load.image("smoke", "assets/sprites/smoke.png");
          game.load.image("barrier", "assets/sprites/barrier.png");
	},
  	create: function(){
		this.game.state.start("TitleScreen");
	}
}

//For showing game name and play button
var titleScreen = function(game){};

titleScreen.prototype = {  
     create: function(){  
         //Background
         var titleBG = game.add.tileSprite(0, 0, game.width, game.height, "backsplash");
          titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
         
         //Start button
          var title = game.add.image(game.width / 2, 210, "title");
          title.anchor.set(0.5);
          var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
          playButton.anchor.set(0.5);
          var tween = game.add.tween(playButton).to({
               width: 220, //properties, duration, ease, autostart, delay,repeat
               height:220
          }, 1500, "Linear", true, 0, -1); 
          tween.yoyo(true);
     },
     startGame: function(){
          game.state.start("PlayGame");     
     }
}

// For playing game -add player, block, player movment
var playGame = function(game){};
playGame.prototype = {  
     create: function(){
          tintColor = bgColors[game.rnd.between(0, bgColors.length - 1)]
          var tunnelBG = game.add.tileSprite(0, 0, game.width, game.height, "tunnelbg");
          tunnelBG.tint = tintColor;
         
         //leftwall placement
          var leftWallBG = game.add.tileSprite(- tunnelWidth / 2, 0, game.width / 2, game.height, "wall");
          leftWallBG.tint = tintColor;
         
         //rightwall placement
          var rightWallBG = game.add.tileSprite((game.width + tunnelWidth) / 2, 0, game.width / 2, game.height, "wall");
          rightWallBG.tint = tintColor;
          rightWallBG.tileScale.x = -1;
         
          this.barrierGroup = game.add.group(); 
          this.addBarrier(this.barrierGroup, tintColor);
          
          // Virtual Chat Room

          
         
          var Text1 = game.add.text(5, 5, String[0], { font: '25px Courier', fill: '#ff0000'});
          var Text2 = game.add.text(5, 25, String[1] + users, { font: '20px Courier', fill: '#FFC65D'});
          var userText1 = game.add.text(5, 45, userString[0], { font: '20px Courier', fill: '#00ffff'});
          remotetext1 = game.add.text(5, 65, '', { font: "15pt Courier", fill: "#00ffff"});
          var userText2 = game.add.text(5, 85, userString[1] , { font: '20px Courier', fill: '#00ff11'});         
          nextLine_sumit();
          
          // Test on Virtual Chat
          remotetext2 = game.add.text(5, 105, '', { font: "15pt Courier", fill: "#00ff11"});
          //nextLine_sajib();
         
         //adding ship/player
          this.shipPositions = [(game.width - tunnelWidth) / 2 + 32, (game.width + tunnelWidth) / 2 - 32];
          this.ship = game.add.sprite(this.shipPositions[0], 860, "ship");
         
         //start from zero as initially is placed on the left side
          this.ship.side = 0;
         
          this.ship.destroyed = false;
         
         //
          this.ship.canMove = true;
         
         //
          this.ship.canSwipe = false;
         
          this.ship.anchor.set(0.5);
          game.physics.enable(this.ship, Phaser.Physics.ARCADE);
         
          game.input.onDown.add(this.moveShip, this);
         
          game.input.onUp.add(function(){
               this.ship.canSwipe = false;
          }, this);
         
          this.smokeEmitter = game.add.emitter(this.ship.x, this.ship.y + 10, 20);
          this.smokeEmitter.makeParticles("smoke");
         
         //horizontal and vertical speed of each particle
          this.smokeEmitter.setXSpeed(-15, 15);
          this.smokeEmitter.setYSpeed(50, 150);
         
         //Changing the transparency
          this.smokeEmitter.setAlpha(0.5, 1);
          this.smokeEmitter.start(false, 1000, 40);
         
         //Adding rising effect
          this.verticalTween = game.add.tween(this.ship).to({
               y: 0
          }, shipVerticalSpeed, Phaser.Easing.Linear.None, true);
     },
     moveShip: function(){
          this.ship.canSwipe = true;
         //left and right movement of ship
          if(this.ship.canMove && !this.ship.destroyed){
              
               this.ship.canMove = false;
               this.ship.side = 1 - this.ship.side;
               var horizontalTween = game.add.tween(this.ship).to({ 
                    x: this.shipPositions[this.ship.side]
               }, shipHorizontalSpeed, Phaser.Easing.Linear.None, true);
              
              //ship movement delay
               horizontalTween.onComplete.add(function(){
                    game.time.events.add(shipMoveDelay, function(){
                         this.ship.canMove = true;
                    }, this);
               }, this);
              
              
              //Adding effect for ship movement
               var ghostShip = game.add.sprite(this.ship.x, this.ship.y, "ship");
               ghostShip.alpha = 0.5;
               ghostShip.anchor.set(0.5);
               var ghostTween = game.add.tween(ghostShip).to({
                    alpha: 0
               }, 350, Phaser.Easing.Linear.None, true);
               ghostTween.onComplete.add(function(){
                    ghostShip.destroy();
               });
          }          
     },
     update: function(){
         
          this.smokeEmitter.x = this.ship.x;
          this.smokeEmitter.y = this.ship.y;
         
         //adding swipe functionalities
          if(this.ship.canSwipe){
             if(Phaser.Point.distance(game.input.activePointer.positionDown, game.input.activePointer.position) > swipeDistance){
                    this.restartShip();          
               }   
          }
         
          if(!this.ship.destroyed && this.ship.alpha == 1){
               game.physics.arcade.collide(this.ship, this.barrierGroup, null, function(s, b){
                    this.ship.destroyed = true
                    this.smokeEmitter.destroy();
                    var destroyTween = game.add.tween(this.ship).to({
                         x: this.ship.x + game.rnd.between(-100, 100),
                         y: this.ship.y - 100,
                         rotation: 10
                    }, 1000, Phaser.Easing.Linear.None, true);
                    destroyTween.onComplete.add(function(){
                         var explosionEmitter = game.add.emitter(this.ship.x, this.ship.y, 200);
                         explosionEmitter.makeParticles("smoke");
                         explosionEmitter.setAlpha(0.5, 1);
                         explosionEmitter.minParticleScale = 0.5;
                         explosionEmitter.maxParticleScale = 2;
                         explosionEmitter.start(true, 2000, null, 200);
                         this.ship.destroy();
                         game.time.events.add(Phaser.Timer.SECOND * 2, function(){
                              game.state.start("GameOverScreen");
                         });
                    }, this);
               }, this)
          }
     },
     restartShip: function(){
          if(!this.ship.destroyed && this.ship.alpha == 1){
               this.ship.canSwipe = false;
               this.verticalTween.stop();
              
               this.ship.alpha = 0.5;
              //stoping the vertical tween and reposition after swipe
               this.verticalTween = game.add.tween(this.ship).to({
                    y: 860  
               }, 100, Phaser.Easing.Linear.None, true);
              
              //after repositioning again start the vertical tween
               this.verticalTween.onComplete.add(function(){
                    this.verticalTween = game.add.tween(this.ship).to({
                         y: 0
                    }, shipVerticalSpeed, Phaser.Easing.Linear.None, true);
                   //adding Invisibility to the ship
                    var alphaTween = game.add.tween(this.ship).to({
                         alpha: 1     
                    }, shipInvisibilityTime, Phaser.Easing.Bounce.In, true);        
               }, this) 
          }
     },
     addBarrier: function(group, tintColor){
          var barrier = new Barrier(game, barrierSpeed, tintColor);
          game.add.existing(barrier);
          group.add(barrier); 
     }   
}


function updateLine_sumit() {

    if (line_sumit.length < content_sumit[index].length)
    {
        line_sumit = content_sumit[index].substr(0, line_sumit.length + 1);
        // text.text = line;
        remotetext1.setText(line_sumit);
    }
    else
    {
        //  Wait 2 seconds then start a new line
        game.time.events.add(Phaser.Timer.SECOND * 5, nextLine_sumit, this);
    }

}

function nextLine_sumit() {

    index++;

    if (index < content_sumit.length)
    {
        line_sumit = '';
        game.time.events.repeat(80, content_sumit[index].length + 1, updateLine_sumit, this);
    }

}

function updateLine_sojib() {

    if (line_sojib.length < content_sojib[condex].length)
    {
        line_sojib = content_sojib[condex].substr(0, line_sojib.length + 1);
        // text.text = line;
        remotetext2.setText(line_sojib);
    }
    else
    {
        //  Wait 2 seconds then start a new line
        game.time.events.add(Phaser.Timer.SECOND * 5, nextLine_sojib, this);
    }

}

function nextLine_sojib() {

    condex++;

    if (condex < content_sojib.length)
    {
        line_sojib = '';
        game.time.events.repeat(80, content_sojib[condex].length + 1, updateLine_sojib, this);
    }

}

var gameOverScreen = function(game){};
gameOverScreen.prototype = {
     create:function(){
          console.log("game over");
     }    
}

Barrier = function (game, speed, tintColor) {
     var positions = [(game.width - tunnelWidth) / 2, (game.width + tunnelWidth) / 2];
     var position = game.rnd.between(0, 1);
	Phaser.Sprite.call(this, game, positions[position], -100, "barrier");
     var cropRect = new Phaser.Rectangle(0, 0, tunnelWidth / 2, 24);
     this.crop(cropRect);
	game.physics.enable(this, Phaser.Physics.ARCADE);
     this.anchor.set(position, 0.5);
     this.tint = tintColor;     
     this.body.immovable = true;
     this.body.velocity.y = speed;
     this.placeBarrier = true;
};

Barrier.prototype = Object.create(Phaser.Sprite.prototype);
Barrier.prototype.constructor = Barrier;

Barrier.prototype.update = function(){
     if(this.placeBarrier && this.y > barrierGap){
          this.placeBarrier = false;
          playGame.prototype.addBarrier(this.parent, this.tint);
     }   
     if(this.y > game.height){
          this.destroy();
     }
}