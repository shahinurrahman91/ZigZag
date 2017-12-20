var game;
//adding background color as hex value
var bgColors = [0xF16745, 0xFFC65D, 0x7BC8A4, 0x4CC3D9, 0x93648D, 0x7c786a,
 0x588c73, 0x8c4646, 0x2a5b84, 0x73503c];
 var tunnelWidth = 256;
 var shipHorizontalSpeed = 100; // this will determine speed movement horizontally
 var shipMoveDelay = 0;

 window.onload = function() {	
	game = new Phaser.Game(640, 960, Phaser.AUTO, "");
	//Boot state: in the boot state we will make all adjustment to the game to be resized accordingly to browser 
	//resolution and aspect ratio
				// name given(key) , function (state)
     game.state.add("Boot", boot);
	 
	//we will use this state to preload all assets we will use in the game.
	//It's the classic “loading” screen you see in most games 
     game.state.add("Preload", preload);
	
	//the title screen, showing your game name and a play button.
     game.state.add("TitleScreen", titleScreen);
	
	//The game itself
     game.state.add("PlayGame", playGame);
	
	//The game over screen also features a “play again” button to let players restart the game
     game.state.add("GameOverScreen", gameOverScreen);
	 
     game.state.start("Boot"); //starting the first state
}

var boot = function(game){};
boot.prototype = {
	
  	preload: function(){
          this.game.load.image("loading","assets/sprites/loading.png"); //will load or show loading progress 
	},
  	create: function(){
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		// will set scaling method
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// this will pass the state to the next state
		this.game.state.start("Preload");
	}      
}

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
	},
  	create: function(){
		this.game.state.start("TitleScreen");
	}
}

var titleScreen = function(game){};
titleScreen.prototype = {  
     create: function(){
		var titleBG = game.add.tileSprite(0,0,game.width,game.height,
		"backsplash");
		titleBG.tint = bgColors[game.rnd.between(0, bgColors.length -1)];
		//the next line will change background color according to-
		//defined hex value bgColor[game.rnd.between(0, bgColor.length - 1 )]
         game.stage.backgroundColor = bgColors[game.rnd.between(0, bgColors.length - 1)];
         
		 //adding the title or game image
		 var title = game.add.image(game.width / 2, 210, "title");
         title.anchor.set(0.5);
		 //using tween both for title-name and playButton
		 var tween = game.add.tween(title).to({
               width: 420,
               height:420
          }, 4000, "Linear", true, 0, -1); 
          tween.yoyo(true);
		  
		  //could also change the background color
		  //title.tint = bgColors[game.rnd.between(0, bgColors.length -1)];
		 
		 //adding the play game button 
         var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
         playButton.anchor.set(0.5);
		 var tween = game.add.tween(playButton).to({
               width: 220,
               height:220
          }, 1500, "Linear", true, 0, -1); 
          tween.yoyo(true);
     },
     startGame: function(){
          game.state.start("PlayGame");     
     }
}

var playGame = function(game){};
playGame.prototype = {
		create: function(){
			var tintColor = bgColors[game.rnd.between(0,bgColors.length-1)];
			var tunnelBG = game.add.tileSprite(0,0,game.width,game.height,"tunnelbg");
			tunnelBG.tint = tintColor;
			// it is set as left wall of the game world according to game width
			var leftWallBG = game.add.tileSprite(- tunnelWidth / 2, 0, game.width / 2, game.height, "wall");
			leftWallBG.tint = tintColor;
			// it is set as right wall by 
			var rightWallBG = game.add.tileSprite((game.width + tunnelWidth) / 2, 0, game.width / 2, game.height, "wall");
			rightWallBG.tint = tintColor;
			rightWallBG.tileScale.x = -1;
			
			// which is game game.width = 640 tunnelWidth = 256 shipPositions = [224,160]
			this.shipPositions = [(game.width - tunnelWidth) / 2 + 32, (game.width - tunnelWidth) / 2 - 32];
			// this will load the ship on the left side
			this.ship = game.add.sprite(this.shipPositions[0], 860, "ship");
			// to keep track of the side
			this.ship.side =0;
			
			this.ship.canMove = true;
			
			this.ship.anchor.set(0.5);
			// physics.enable(object, system) creates a default physics body on object using system physics system. 
			this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
			//onDown will register player tap or click
			game.input.onDown.add(this.moveShip, this);
		},
		moveShip: function(){
			// only prompt if this.ship.canMove is true 
			if(this.ship.canMove){
				
				// until move animation is completed
				this.ship.canMove = false;
				
				//this is how the side is changed 
				this.ship.side = 1 - this.ship.side;
				var horizontalTween = game.add.tween(this.ship).to({
					x: this.shipPositions[this.ship.side]
				}, shipHorizontalSpeed, Phaser.Easing.Linear.None, true);
				horizontalTween.onComplete.add(function(){
					// this will delay the time between horizontal movement
					game.time.events.add(shipMoveDelay, function(){
					this.ship.canMove = true;
				},this);
			},this);
		}
}

var gameOverScreen = function(game){};
gameOverScreen.prototype = {    
}