var game = new Phaser.Game(800, 800, Phaser.AUTO);

var MainMenu = function(game) {};
MainMenu.prototype = {
	init: function() {

	},
	preload: function() {
		game.load.audio('effect', ['assets/audio/effect.mp3', 'assets/audio/effect.ogg']);
	},
	create: function() {

		game.stage.backgroundColor = "#000";

		game.add.text(300, 300, 'REM', { fontSize: '32px', fill: '#FFF' });
		game.add.text(300, 500, 'Click to play', { fontSize: '32px', fill: '#FFF' });
		game.input.mouse.capture = true;
		effect = game.add.audio('effect');

	},
	update: function() {
		// main menu logic
		if(game.input.mousePointer.isDown) {
			// pass this.level to next state
			effect.play(null, 6);
			game.state.start('GamePlay', true, false, this.level);
		}
	}
}


var mouseX = 50;
var move = false;
var faceLeft = false;
var currEmpty = 0;
var nextEmpty = 1;

var GamePlay = function(game) {};
GamePlay.prototype = {
	preload: function() {
		// preload assets
		game.load.atlas('player', 'assets/img/playerSprite.png', 'assets/img/playerSprite.json');
		game.load.image('bg', 'assets/img/background.png');
		game.load.image('key', 'assets/img/key.png');
		game.load.image('clip', 'assets/img/clip.png');
		game.load.image('towel', 'assets/img/towel.png');
		game.load.image('shirt', 'assets/img/Yellow_Shirt_0.png');
		game.load.image('door', 'assets/img/doorDorm.png');
		game.load.image('inv', 'assets/img/inventoryPH.png');
	},

	create: function() {
		// place your assets
		game.world.setBounds(0, 0, 2400, 600);
		game.add.image(0, 0, 'bg');

		player = game.add.sprite(50, game.height - 326, 'player');
		game.physics.arcade.enable(player);
		player.anchor.set(.5);
		player.body.bounce.y = .1;
		player.animations.add('walk', [0, 1, 2, 3], 10, true);

		inv = game.add.image(150, 600, 'inv');
		inv.fixedToCamera = true;

		var keyItem = new Item(game, 200, game.height - 350, 'key');
		game.add.existing(keyItem);
		keyItem.scale.setTo(.5, .5);
		var clipItem = new Item(game, 500, game.height - 350, 'clip');
		game.add.existing(clipItem);
		clipItem.scale.setTo(.3, .3);
		var towelItem = new Item(game, 800, game.height - 350, 'towel');
		game.add.existing(towelItem);
		towelItem.scale.setTo(.3, .3);
		var shirtItem = new Item(game, 1200, game.height - 350, 'shirt');
		game.add.existing(shirtItem);
		shirtItem.scale.setTo(.8, .8);


		game.camera.follow(player);
		game.camera.deadzone = new Phaser.Rectangle(200, 0, 300, 800);

		game.input.mouse.capture = true;
	},

	update: function() {
		// run game loop
		if(game.input.mousePointer.isDown){
			mouseX = game.input.mousePointer.x + game.camera.x;
			move = true;
			if(mouseX < player.x && !faceLeft){
				faceLeft = true;
				player.scale.x *= -1;
			}
			else if(mouseX > player.x && faceLeft){
				faceLeft = false;
				player.scale.x *= -1;
			}
		}
		if(player.x < mouseX + 25 && player.x > mouseX - 25){
			move = false;
			player.animations.stop();
			player.frame = 3;
			player.body.velocity.x = 0;
		}
		if(move){
			player.animations.play('walk');
			game.physics.arcade.moveToXY(player, mouseX, player.y, 200);
		}

	},	
}

game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.start('MainMenu');

function clicked(item){
		if(game.input.activePointer.leftButton.isDown){
			if(!item.inInventory){
				item.inInventory = true;
				if(currEmpty == 4){
					return;
				}
				item.invPos = currEmpty;
				if(item.invPos == 0){
					item.x = inv.x + 75 - game.camera.x;
					item.y = inv.y + 100;
					item.fixedToCamera = true;
					item.invPos = 0;
				}
				if(item.invPos == 1){
					item.x = inv.x + 200 - game.camera.x;
					item.y = inv.y + 100;
					item.fixedToCamera = true;
					item.invPos = 1;
				}
				if(item.invPos == 2){
					item.x = inv.x + 325 - game.camera.x;
					item.y = inv.y + 100;
					item.fixedToCamera = true;
					item.invPos = 2;
				}
				if(item.invPos == 3){
					item.x = inv.x + 450 - game.camera.x;
					item.y = inv.y + 100;
					item.fixedToCamera = true;
					item.invPos = 3;
				}
				currEmpty = nextEmpty;
				nextEmpty++;
			}
			else{
				item.inInventory = false;
				item.fixedToCamera = false;
				item.x = player.x;
				item.y = player.y;
				nextEmpty = currEmpty;
				currEmpty = item.invPos;
				item.invPos = -1;
			}
		}
		else{
			if(!item.inInventory){

			}
			else{

			}
		}
	}