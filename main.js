var game = new Phaser.Game(800, 800, Phaser.AUTO);

var MainMenu = function(game) {};
MainMenu.prototype = {
	init: function() {

	},
	preload: function() {
	},
	create: function() {

		game.stage.backgroundColor = "#000";

		game.add.text(300, 300, 'REM', { fontSize: '32px', fill: '#FFF' });
		game.add.text(300, 500, 'Click to play', { fontSize: '32px', fill: '#FFF' });
		game.input.mouse.capture = true;

	},
	update: function() {
		// main menu logic
		if(game.input.mousePointer.isDown) {
			// pass this.level to next state
			game.state.start('GamePlay', true, false, this.level);
		}
	}
}


var mouseX = 50;
var move = false;
var faceLeft = false;
var invArray = [-1, -1, -1, -1];
var index = 0;
var items = new Array();

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
		game.load.image('bed', 'assets/img/Bed_0.png');
		game.load.image('desk', 'assets/img/desk_0.png');
		game.load.image('comp', 'assets/img/computer_off_0.png');
		game.load.image('monitor', 'assets/img/Monitor_off_0.png');
		game.load.image('plant', 'assets/img/plant2_0.png');
		game.load.image('closet', 'assets/img/Closet_0.png');
	},

	create: function() {
		// place your assets
		game.world.setBounds(0, 0, 2400, 600);
		game.add.image(0, 0, 'bg');

		inv = game.add.image(150, 600, 'inv');
		inv.fixedToCamera = true;

		game.add.sprite(1200, 310, 'door');
		game.add.sprite(50, 474, 'bed');
		game.add.sprite(350, 425, 'desk');
		game.add.sprite(470, 474, 'comp');
		game.add.sprite(350, 325, 'monitor');
		game.add.sprite(620, 405, 'plant');
		game.add.sprite(800, 350, 'closet');

		game.add.sprite(1590, 425, 'desk');
		game.add.sprite(1860, 474, 'bed');
		game.add.sprite(2130, 350, 'closet');

		var keyItem = new Item(game, 850, 345, 'key');
		items.push(keyItem);
		game.add.existing(keyItem);
		keyItem.scale.setTo(.5, .5);
		var clipItem = new Item(game, 450, game.height - 225, 'clip');
		items.push(clipItem);
		game.add.existing(clipItem);
		clipItem.scale.setTo(.3, .3);
		var towelItem = new Item(game, 200, game.height - 290, 'towel');
		items.push(towelItem);
		game.add.existing(towelItem);
		towelItem.scale.setTo(.3, .3);
		var shirtItem = new Item(game, 920, game.height - 370, 'shirt');
		items.push(shirtItem);
		game.add.existing(shirtItem);
		shirtItem.scale.setTo(.8, .8);

		player = game.add.sprite(50, game.height - 326, 'player');
		game.physics.arcade.enable(player);
		player.anchor.set(.5);
		player.body.bounce.y = .1;
		player.animations.add('walk', [0, 1, 2, 3], 10, true);

		game.camera.follow(player);
		game.camera.deadzone = new Phaser.Rectangle(200, 0, 300, 800);

		game.input.mouse.capture = true;
	},

	update: function() {
		// run game loop
		if(game.input.mousePointer.isDown && game.input.mousePointer.y < 600){
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
			index = 0;
			while(invArray[index] != -1){
				index++;
				if(index >= 4){
					return;
				}
			}
			
			invArray[index] = item;
			if(index == 0){	
				item.x = inv.x + 75 - game.camera.x;
				item.y = inv.y + 100;
				item.fixedToCamera = true;
				item.invPos = 0;
			}
			else if(index == 1){
				item.x = inv.x + 200 - game.camera.x;
				item.y = inv.y + 100;
				item.fixedToCamera = true;
				item.invPos = 1;
			}
			else if(index == 2){
				item.x = inv.x + 325 - game.camera.x;
				item.y = inv.y + 100;
				item.fixedToCamera = true;
				item.invPos = 2;
			}
			else if(index == 3){
				item.x = inv.x + 450 - game.camera.x;
				item.y = inv.y + 100;
				item.fixedToCamera = true;
				item.invPos = 3;
			}
			
		}
		else{
			index = 0;
			while(invArray[index] != item){
				index++;
			}
			if(index == 4){
				return;
			}
			invArray[index] = -1;
			item.inInventory = false;
			item.fixedToCamera = false;
			item.x = player.x;
			item.y = player.y;
			
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

function canCombine(item1, item2){
	item1.combinable.push(item2);
	item2.combinable.push(item1);
}

function combine(item1, item2){
	var isThisPossible = false;
	for(var i = 0; i < item1.combinable.length; i++){
		if(item1.combinable[i] == item2){
			isThisPossible = true;
			break;
		}
	}
	if(!isThisPossible){
		return -1;
	}
	var newID = item1.itemID + item2.itemID;
	var newItem = item1;
	for(var i = 0; i < items.length; i++){
		if(items[i].itemID == newID){
			newItem = items[i];
		}
	}
	var newIndex = item1.invPos;
	invArray[item1.invPos] = -1;
	item1.inInventory = false;
	item1.fixedToCamera = false;
	item1.invPos = -1;
	invArray[item2.invPos] = -1;
	item2.inInventory = false;
	item2.fixedToCamera = false;
	item2.invPos = -1;
	item1.x = newItem.x;
	item1.y = newItem.y;
	item2.x = newItem.x;
	item2.y = newItem.y;
	if(newIndex == 0){	
		newItem.x = inv.x + 75 - game.camera.x;
		newItem.y = inv.y + 100;
		newItem.fixedToCamera = true;
		newItem.invPos = 0;
	}
	else if(newIndex == 1){
		newItem.x = inv.x + 200 - game.camera.x;
		newItem.y = inv.y + 100;
		newItem.fixedToCamera = true;
		newItem.invPos = 1;
	}
	else if(newIndex == 2){
		newItem.x = inv.x + 325 - game.camera.x;
		newItem.y = inv.y + 100;
		newItem.fixedToCamera = true;
		newItem.invPos = 2;
	}
	else if(newIndex == 3){
		newItem.x = inv.x + 450 - game.camera.x;
		newItem.y = inv.y + 100;
		newItem.fixedToCamera = true;
		newItem.invPos = 3;
	}
	return 1;
}