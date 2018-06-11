var game = new Phaser.Game(600, 600, Phaser.AUTO);

var mouseX = 50;
var move = false;
var faceLeft = false;
var invArray = [-1, -1, -1, -1];
var index = 0;
var items = new Array();
var gameText;
var newText = '';
var startGame = false;
var floorStat = 0;

var MainMenu = function(game) {};
MainMenu.prototype = {
	init: function() {

	},
	preload: function() {
		game.load.image('title', 'assets/img/titlescreen.png');
		game.load.image('play', 'assets/img/play.png');
		game.load.image('controls', 'assets/img/controls.png');
		game.load.image('credits', 'assets/img/credits.png');
	},
	create: function() {

		game.add.image(-100, -150, 'title');

		game.input.mouse.capture = true;

		var playButton = game.add.sprite(250, 250, 'play');
		playButton.inputEnabled = true;
		var controlButton = game.add.sprite(250, 350, 'controls');
		controlButton.inputEnabled = true;		
		var creditButton = game.add.sprite(250, 450, 'credits');
		creditButton.inputEnabled = true;

		playButton.events.onInputDown.add(startTheGame, this);
		controlButton.events.onInputDown.add(displayControls, this);
		creditButton.events.onInputDown.add(displayCredits, this);

	},
	update: function() {
		// main menu logic
		if(startGame) {
			// pass this.level to next state
			game.state.start('Day', true, false, this.level);
		}
	}
}

var Day = function(game) {};
Day.prototype = {
	preload: function(){
		game.load.atlas('player', 'assets/img/playerSprite.png', 'assets/img/playerSprite.json');
		game.load.image('bottom', 'assets/img/bottomBorder.png');
		game.load.image('top', 'assets/img/topBorder.png');
		game.load.image('dayHallbg', 'assets/img/dormHallBKday.png');
		game.load.image('dayRoombg', 'assets/img/dormbkNoAssets.png');
		game.load.image('door', 'assets/img/door_0.png');
		game.load.image('inv', 'assets/img/inventoryPH.png');
		game.load.image('bed', 'assets/img/Bed_0.png');
		game.load.image('desk', 'assets/img/desk_0.png');
		game.load.image('comp', 'assets/img/computer_off_0.png');
		game.load.image('monitor', 'assets/img/Monitor_off_0.png');
		game.load.image('plant', 'assets/img/plant2_0.png');
		game.load.image('closet', 'assets/img/Closet_0.png');
		game.load.image('merge', 'assets/img/merge.png');
	},
	create: function(){
		game.world.setBounds(0, 0, 2400, 10000);
		var dayhall = game.add.image(-20, -20, 'dayHallbg');
		dayhall.scale.setTo(1, .6);

		game.add.image(0, 825, 'dayRoombg')

		var tBorder = game.add.image(0, 0, 'top');
		var bBorder = game.add.image(0, 400, 'bottom');
		tBorder.fixedToCamera = true;
		bBorder.fixedToCamera = true;

		inv = game.add.image(0, game.height - 200, 'inv');
		inv.fixedToCamera = true;

		var mergeButton = game.add.sprite(525, game.height - 150, 'merge');
		mergeButton.fixedToCamera = true;
		mergeButton.inputEnabled = true;
		mergeButton.events.onInputDown.add(mergeItems, this);

		var door1 = game.add.sprite(300, game.height - 450, 'door');
		door1.inputEnabled = true;
		door1.events.onInputDown.add(boring, this);
		var door2 = game.add.sprite(1800, game.height - 450, 'door');
		door2.inputEnabled = true;
		door2.events.onInputDown.add(boring, this);
		var door3 = game.add.sprite(2100, game.height - 450, 'door');
		door3.inputEnabled = true;

		var dormDoor = game.add.sprite(1200, game.height - 450 + 1000, 'door');
		dormDoor.inputEnabled = true;
		dormDoor.events.onInputDown.add(upFloor, this);
		var bedEnv = game.add.sprite(10, game.height - 326 + 1000, 'bed');
		bedEnv.scale.setTo(1.2, 1);
		var deskEnv = game.add.sprite(350, game.height - 340 + 1000, 'desk');
		deskEnv.scale.setTo(1, .8);
		var compEnv = game.add.sprite(490, game.height - 300 + 1000, 'comp');
		compEnv.scale.setTo(.8, .8);
		game.add.sprite(360, game.height - 440 + 1000, 'monitor');
		game.add.sprite(620, game.height - 395 + 1000, 'plant');
		var closetEnv = game.add.sprite(800, game.height - 525 + 1000, 'closet');
		closetEnv.scale.setTo(1.3, 1.3);
		

		var deskEnv2 = game.add.sprite(1450, game.height - 340 + 1000, 'desk');
		deskEnv2.scale.setTo(1, .8);
		var bedEnv2 = game.add.sprite(1750, game.height - 326 + 1000, 'bed');
		bedEnv2.scale.setTo(1.2, 1);
		var closetEnv2 = game.add.sprite(2075, game.height - 525 + 1000, 'closet');
		closetEnv2.scale.setTo(1.3, 1.3);

		player = game.add.sprite(50, game.height - 326, 'player');
		game.physics.arcade.enable(player);
		player.anchor.set(.5);
		player.body.bounce.y = .1;
		player.animations.add('walk', [0, 1, 2, 3], 10, true);

		door3.events.onInputDown.add(downfloor, this);

		game.camera.follow(player);
		game.camera.deadzone = new Phaser.Rectangle(200, 0, 200, 600);

		game.input.mouse.capture = true;

		gameText = game.add.text(10, 10, '', { fontSize: '24px', fill: '#FFF' });
		gameText.fixedToCamera = true; 
		newText = 'I should head to my room at the end of the hall.';

		console.log(game.camera.y);
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	},
	update: function(){
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

		gameText.text = newText;

		if(player.y - (game.height - 326) != floorStat){
			player.y += floorStat;
			game.camera.y += floorStat;
			if(floorStat == 1000){
				player.x -= 900;
			}
		}
	}
}

var Night = function(game) {};
Night.prototype = {
	preload: function() {
		// preload assets
		game.load.atlas('player', 'assets/img/playerSprite.png', 'assets/img/playerSprite.json');
		game.load.image('bottom', 'assets/img/bottomBorder.png');
		game.load.image('top', 'assets/img/topBorder.png');
		game.load.image('nightDormbg', 'assets/img/dormbkNoAssetsNight.png');
		game.load.image('key', 'assets/img/key.png');
		game.load.image('clip', 'assets/img/clip.png');
		game.load.image('towel', 'assets/img/towel.png');
		game.load.image('shirt', 'assets/img/Yellow_Shirt_0.png');
		game.load.image('door', 'assets/img/door_0.png');
		game.load.image('inv', 'assets/img/inventoryPH.png');
		game.load.image('bed', 'assets/img/Bed_0.png');
		game.load.image('desk', 'assets/img/desk_0.png');
		game.load.image('comp', 'assets/img/computer_off_0.png');
		game.load.image('monitor', 'assets/img/Monitor_off_0.png');
		game.load.image('plant', 'assets/img/plant2_0.png');
		game.load.image('closet', 'assets/img/Closet_0.png');
		game.load.image('merge', 'assets/img/merge.png');
		game.load.image('controller', 'assets/img/Game_control_0.png')
	},

	create: function() {
		// place your assets
		game.world.setBounds(0, 0, 2400, 600);
		game.add.image(0, -175, 'nightDormbg');

		var tBorder = game.add.image(0, 0, 'top');
		var bBorder = game.add.image(0, 400, 'bottom');
		tBorder.fixedToCamera = true;
		bBorder.fixedToCamera = true;

		inv = game.add.image(0, game.height - 200, 'inv');
		inv.fixedToCamera = true;

		var mergeButton = game.add.sprite(525, game.height - 150, 'merge');
		mergeButton.fixedToCamera = true;
		mergeButton.inputEnabled = true;
		mergeButton.events.onInputDown.add(mergeItems, this);

		game.add.sprite(1200, game.height - 490, 'door');
		var bedEnv = game.add.sprite(10, game.height - 326, 'bed');
		bedEnv.scale.setTo(1.2, 1);
		var deskEnv = game.add.sprite(350, game.height - 340, 'desk');
		deskEnv.scale.setTo(1, .8);
		var compEnv = game.add.sprite(490, game.height - 300, 'comp');
		compEnv.scale.setTo(.8, .8);
		game.add.sprite(360, game.height - 440, 'monitor');
		game.add.sprite(620, game.height - 395, 'plant');
		var closetEnv = game.add.sprite(800, game.height - 525, 'closet');
		closetEnv.scale.setTo(1.3, 1.3);
		

		var deskEnv2 = game.add.sprite(1450, game.height - 340, 'desk');
		deskEnv2.scale.setTo(1, .8);
		var bedEnv2 = game.add.sprite(1750, game.height - 326, 'bed');
		bedEnv2.scale.setTo(1.2, 1);
		var closetEnv2 = game.add.sprite(2075, game.height - 525, 'closet');
		closetEnv2.scale.setTo(1.3, 1.3);

		var keyItem = new Item(game, 850, game.height - 520, 'key', 'this is a key', 7);
		items.push(keyItem);
		game.add.existing(keyItem);
		keyItem.scale.setTo(.5, .5);
		var clipItem = new Item(game, 450, game.height - 225, 'clip', 'this a paper clip', 11);
		items.push(clipItem);
		game.add.existing(clipItem);
		clipItem.scale.setTo(.3, .3);
		var towelItem = new Item(game, 200, game.height - 290, 'towel', 'this is a towel', 12);
		items.push(towelItem);
		game.add.existing(towelItem);
		towelItem.scale.setTo(.3, .3);
		var shirtItem = new Item(game, 900, game.height - 435, 'shirt', 'this is a shirt', 13);
		items.push(shirtItem);
		game.add.existing(shirtItem);
		shirtItem.scale.setTo(.8, .8);
		var controlItem = new Item(game, 0, game.height - 900, 'controller', 'this is a controller', 23);
		items.push(controlItem);
		game.add.existing(controlItem);
		shirtItem.scale.setTo(.8, .8);

		canCombine(clipItem, towelItem);

		player = game.add.sprite(50, game.height - 326, 'player');
		game.physics.arcade.enable(player);
		player.anchor.set(.5);
		player.body.bounce.y = .1;
		player.animations.add('walk', [0, 1, 2, 3], 10, true);

		game.camera.follow(player);
		game.camera.deadzone = new Phaser.Rectangle(200, 0, 200, 600);

		game.input.mouse.capture = true;

		gameText = game.add.text(10, 10, '', { fontSize: '24px', fill: '#FFF' });
		gameText.fixedToCamera = true;

		game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
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

		gameText.text = newText;
		player.y += floorStat;
		game.camera.y += floorStat;
	},	
}

game.state.add('MainMenu', MainMenu);
game.state.add('Day', Day)
game.state.add('Night', Night);
game.state.start('MainMenu');


function clicked(item){
	if(game.input.activePointer.leftButton.isDown){
		if(!item.inInventory){
			newText = item.description;
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
			if(!item.select){
				item.select = true;
				item.scale.setTo(item.scale.x + .1, item.scale.y + .1);
			}
			else{
				item.select = false;
				item.scale.setTo(item.scale.x - .1, item.scale.y - .1);
			}
		}
	}
}

function canCombine(item1, item2){
	item1.combinable = item2;
	item2.combinable = item1;
}

function mergeItems(){
	console.log('merging');
	for(var i = 0; i < invArray.length; i++){
		if(invArray[i].select){
			var item1 = invArray[i];
			break;
		}
	}
	for(var i = item1.invPos + 1; i < invArray.length; i++){
		if(invArray[i].select){
			var item2 = invArray[i];
			break;
		}
	}
	console.log(item2.combinable.invPos);
	combine(item1, item2);
}

function combine(item1, item2){
	console.log('combining');
	if(item1.combinable != item2){
		console.log('not possible');
		return -1;
	}
	console.log('possible');
	console.log(item1.itemID);
	console.log(item2.itemID);
	var newID = item1.itemID + item2.itemID;
	console.log('newID:' + newID);
	var newItem;
	for(var i = 0; i < items.length; i++){
		if(items[i].itemID == newID){
			console.log(items[i].itemID);
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

function startTheGame(){
	startGame = true;
}

function displayControls(){

}

function displayCredits(){

}

function upFloor(){
	floorStat -= 1000;
	console.log(game.camera.y);
}
function downfloor(){
	floorStat += 1000;
	console.log(game.camera.y);
}

function boring(){
	newText = 'I dont really feel like doing that right now.'
}

function goToNight(){
	game.state.start('Night', true, false, this.level);
}