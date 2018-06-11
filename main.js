var game = new Phaser.Game(600, 600, Phaser.AUTO);
//global variables because Im evil
//tracks where player clicks
var mouseX = 50;
//is moving
var move = false;
//boolean switch for which way player faces
var faceLeft = false;
//inventory stores items
var invArray = [-1, -1, -1, -1];
var index = 0;
//list of all items
var items = new Array();
//text that appears on the top of the screen
var gameText;
//used to update gametext
var newText = '';
//boolean that starts game
var startGame = false;
//allows switching between rooms (moves player by its amount)
var floorStat = 0;
//controls control and credit screens
var showControls = false;
var showCredits = false;
//tracks if player got key off cabinet
var keyFell = false;
//tracks if player has key
var gotKey = false;

var MainMenu = function(game) {};
MainMenu.prototype = {
	init: function() {

	},
	preload: function() {
		//loads all menu assets
		game.load.image('title', 'assets/img/titlescreen.png');
		game.load.image('play', 'assets/img/play.png');
		game.load.image('controls', 'assets/img/controls.png');
		game.load.image('credits', 'assets/img/credits.png');
		game.load.image('controlScreen', 'assets/img/controlScreen.png');
		game.load.image('creditScreen', 'assets/img/creditScreen.png');
		game.load.audio('ambience', ['assets/audio/Day Time Ambience.mp3', 'assets/audio/Day Time Ambience.ogg']);		
	},
	create: function() {

		game.add.image(-100, -150, 'title');

		game.input.mouse.capture = true;

		//menu functionality
		playButton = game.add.sprite(250, 250, 'play');
		playButton.inputEnabled = true;
		controlButton = game.add.sprite(250, 350, 'controls');
		controlButton.inputEnabled = true;		
		creditButton = game.add.sprite(250, 450, 'credits');
		creditButton.inputEnabled = true;

		creditObj = game.add.sprite(700, 0, 'creditScreen');
		creditObj.inputEnabled = true;
		creditObj.events.onInputDown.add(hideCredits, this);
		controlObj = game.add.sprite(700, 0, 'controlScreen');
		controlObj.inputEnabled = true;
		controlObj.events.onInputDown.add(hideControls, this);

		playButton.events.onInputDown.add(startTheGame, this);
		controlButton.events.onInputDown.add(displayControls, this);
		creditButton.events.onInputDown.add(displayCredits, this);

		//starts Day ambient noise
		amb = game.add.audio('ambience');

	},
	update: function() {
		// main menu logic
		if(showCredits){
			creditObj.x -= 700;
			showCredits = false;
		}
		if(showControls){
			controlObj.x -= 700;
			showControls = false;
		}		

		if(startGame) {
			//changes to play state
			game.state.start('Day', true, false, this.level);
			amb.loopFull(.6);
		}
	}
}

var Day = function(game) {};
Day.prototype = {
	preload: function(){
		game.load.atlas('player', 'assets/img/charspritesheet.png', 'assets/img/charsprites.json');
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
		game.load.audio('ambience2', ['assets/audio/Darkness Ambience.mp3', 'assets/audio/Darkness Ambience.ogg']);
	},
	create: function(){
		//establishes boundaries and creates backgrounds
		game.world.setBounds(0, 0, 2400, 10000);
		dayhall = game.add.image(-20, -20, 'dayHallbg');
		dayhall.scale.setTo(1, .6);

		game.add.image(0, 825, 'dayRoombg');

		//creates borders for text and inventory
		tBorder = game.add.image(0, 0, 'top');
		bBorder = game.add.image(0, 400, 'bottom');
		tBorder.fixedToCamera = true;
		bBorder.fixedToCamera = true;

		//creates inventory image
		inv = game.add.image(0, game.height - 200, 'inv');
		inv.fixedToCamera = true;

		//creates merge button
		mergeButton = game.add.sprite(525, game.height - 150, 'merge');
		mergeButton.fixedToCamera = true;
		mergeButton.inputEnabled = true;
		mergeButton.events.onInputDown.add(mergeItems, this);

		//spawns doors that give text feedback when clicked
		door1 = game.add.sprite(300, game.height - 450, 'door');
		door1.inputEnabled = true;
		door1.events.onInputDown.add(boring, this);
		door2 = game.add.sprite(1800, game.height - 450, 'door');
		door2.inputEnabled = true;
		door2.events.onInputDown.add(boring, this);
		door3 = game.add.sprite(2100, game.height - 450, 'door');
		door3.inputEnabled = true;

		//furnishes dorm room, which is actually under the hallway
		dormDoor = game.add.sprite(1200, game.height - 450 + 1000, 'door');
		dormDoor.inputEnabled = true;
		dormDoor.events.onInputDown.add(upFloor, this);
		bedEnv = game.add.sprite(10, game.height - 326 + 1000, 'bed');
		bedEnv.scale.setTo(1.2, 1);
		bedEnv.inputEnabled = true;
		bedEnv.events.onInputDown.add(goToNight, this);
		deskEnv = game.add.sprite(350, game.height - 340 + 1000, 'desk');
		deskEnv.scale.setTo(1, .8);
		compEnv = game.add.sprite(490, game.height - 300 + 1000, 'comp');
		compEnv.scale.setTo(.8, .8);
		game.add.sprite(360, game.height - 440 + 1000, 'monitor');
		game.add.sprite(620, game.height - 395 + 1000, 'plant');
		closetEnv = game.add.sprite(800, game.height - 525 + 1000, 'closet');
		closetEnv.scale.setTo(1.3, 1.3);
		

		deskEnv2 = game.add.sprite(1450, game.height - 340 + 1000, 'desk');
		deskEnv2.scale.setTo(1, .8);
		bedEnv2 = game.add.sprite(1750, game.height - 326 + 1000, 'bed');
		bedEnv2.scale.setTo(1.2, 1);
		closetEnv2 = game.add.sprite(2075, game.height - 525 + 1000, 'closet');
		closetEnv2.scale.setTo(1.3, 1.3);

		//creates player character with animation
		player = game.add.sprite(50, game.height - 326, 'player');
		game.physics.arcade.enable(player);
		player.anchor.set(.5);
		player.body.bounce.y = .1;
		player.animations.add('walk', [1, 2, 3, 4], 10, true);

		//door with room switching functionality
		door3.events.onInputDown.add(downfloor, this);

		//deadzone for camera panning
		game.camera.follow(player);
		game.camera.deadzone = new Phaser.Rectangle(200, 0, 200, 600);

		//CONTROLS
		game.input.mouse.capture = true;

		//instantiates game text
		gameText = game.add.text(10, 10, '', { fontSize: '24px', fill: '#FFF' });
		gameText.fixedToCamera = true; 
		newText = 'I should head to my room at the end of the hall.';

		//preps audio for next part
		amb2 = game.add.audio('ambience2');
		//gets rid of browser right click functionality
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	},
	update: function(){
		//allows click controls with player facing correct direction
		if(game.input.mousePointer.isDown && game.input.mousePointer.y < 400){
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
		//stops player movement when appropriate
		if(player.x < mouseX + 25 && player.x > mouseX - 25){
			move = false;
			player.animations.stop();
			player.frame = 0;
			player.body.velocity.x = 0;
		}
		//plays player animation
		if(move){
			player.animations.play('walk');
			game.physics.arcade.moveToXY(player, mouseX, player.y, 200);
		}
		//updates gametext
		gameText.text = newText;

		//switches rooms when appropriate
		if(player.y - (game.height - 326) != floorStat){
			player.y += floorStat;
			game.camera.y += floorStat;
			if(floorStat == 1000){
				player.x -= 900;
			}
		}
		//loop dat shit baby
		amb2.loopFull(.6);
	}
}

var Night = function(game) {};
Night.prototype = {
	preload: function() {
		//this state is almost identical to Day so I will comment less sorry :(
		game.load.atlas('player', 'assets/img/charspritesheet.png', 'assets/img/charsprites.json');
		game.load.atlas('enemy', 'assets/img/demonspritesheet.png', 'assets/img/demonsprites.json');
		game.load.image('bottom', 'assets/img/bottomBorder.png');
		game.load.image('top', 'assets/img/topBorder.png');
		game.load.image('nightDormbg', 'assets/img/dormbkNoAssetsNight.png');
		game.load.image('nightHallbg', 'assets/img/dormHallBKNight.png');
		game.load.image('key', 'assets/img/key_0.png');
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
		game.load.image('branch', 'assets/img/Branch_0.png');
		game.load.image('tape', 'assets/img/Tape.png');
		game.load.image('string', 'assets/img/string.png');
		game.load.image('alarm', 'assets/img/alarm_clock_0.png');
		game.load.image('pack', 'assets/img/backpack_0.png');
		game.load.image('ball', 'assets/img/Basketball_0.png');
		game.load.image('rod', 'assets/img/fishing_rod_0.png');
		game.load.image('charger', 'assets/img/charger.png');
		game.load.image('chocolate', 'assets/img/Chocolate_0.png');
		game.load.image('hook', 'assets/img/hook_0.png');

		game.load.audio('boot', ['assets/audio/Boot Up.mp3', 'assets/audio/Boot Up.ogg']);
		game.load.audio('shatter', ['assets/audio/Glass Shatter.mp3', 'assets/audio/Glass Shatter.ogg']);
		game.load.audio('pickup', ['assets/audio/Item Pickup.mp3', 'assets/audio/Item Pickup.ogg']);
		game.load.audio('craft', ['assets/audio/Craft.mp3', 'assets/audio/Craft.ogg']);
		game.load.audio('monster', ['assets/audio/Monster Screech.mp3', 'assets/audio/Monster Screech.ogg']);
	},

	create: function() {
		game.world.setBounds(0, 0, 2400, 10000);
		game.add.image(0, -175, 'nightDormbg');
		game.add.image(0, 625, 'nightHallbg');

		tBorder = game.add.image(0, 0, 'top');
		bBorder = game.add.image(0, 400, 'bottom');
		tBorder.fixedToCamera = true;
		bBorder.fixedToCamera = true;

		inv = game.add.image(0, game.height - 200, 'inv');
		inv.fixedToCamera = true;

		mergeButton = game.add.sprite(525, game.height - 150, 'merge');
		mergeButton.fixedToCamera = true;
		mergeButton.inputEnabled = true;
		mergeButton.events.onInputDown.add(mergeItems, this);

		dormDoor = game.add.sprite(1200, game.height - 450, 'door');
		dormDoor.inputEnabled = true;
		dormDoor.events.onInputDown.add(checkDoor, this);
		bedEnv = game.add.sprite(10, game.height - 326, 'bed');
		bedEnv.scale.setTo(1.2, 1);
		deskEnv = game.add.sprite(350, game.height - 340, 'desk');
		deskEnv.scale.setTo(1, .8);
		compEnv = game.add.sprite(490, game.height - 300, 'comp');
		compEnv.scale.setTo(.8, .8);
		game.add.sprite(360, game.height - 440, 'monitor');
		game.add.sprite(620, game.height - 395, 'plant');
		closetEnv = game.add.sprite(800, game.height - 525, 'closet');
		closetEnv.scale.setTo(1.3, 1.3);
		

		deskEnv2 = game.add.sprite(1450, game.height - 340, 'desk');
		deskEnv2.scale.setTo(1, .8);
		bedEnv2 = game.add.sprite(1750, game.height - 326, 'bed');
		bedEnv2.scale.setTo(1.2, 1);
		closetEnv2 = game.add.sprite(2075, game.height - 525, 'closet');
		closetEnv2.scale.setTo(1.3, 1.3);

		//key that says its too high
		keyProp = game.add.sprite(850, game.height - 520, 'key');
		keyProp.inputEnabled = true;
		keyProp.events.onInputDown.add(checkKey, this);

		//creates interactable items and adds them to list
		keyItem = new Item(game, -850, game.height - 520, 'key', 'This is a key', 100);
		items.push(keyItem);
		game.add.existing(keyItem);
		
		clipItem = new Item(game, 450, game.height - 225, 'clip', 'This a paper clip', 11);
		items.push(clipItem);
		game.add.existing(clipItem);
		clipItem.scale.setTo(.3, .3);
		
		towelItem = new Item(game, 200, game.height - 290, 'towel', 'This is a towel', 12);
		items.push(towelItem);
		game.add.existing(towelItem);
		towelItem.scale.setTo(.3, .3);
		
		shirtItem = new Item(game, 900, game.height - 435, 'shirt', 'This is a shirt', 13);
		items.push(shirtItem);
		game.add.existing(shirtItem);
		shirtItem.scale.setTo(.8, .8);
		
		controlItem = new Item(game, 0, game.height - 900, 'controller', 'This is a controller', 23);
		items.push(controlItem);
		game.add.existing(controlItem);
		shirtItem.scale.setTo(.8, .8);
		
		branchItem = new Item(game, 620, game.height - 355, 'branch', 'This is a branch', 91);
		items.push(branchItem);
		game.add.existing(branchItem);
		
		tapeItem = new Item(game, 1600, game.height - 370, 'tape', 'This is some tape', 50);
		items.push(tapeItem);
		game.add.existing(tapeItem);
		tapeItem.scale.setTo(.3, .3);
		
		stringItem = new Item(game, 1500, game.height - 370, 'string', 'This is a string', 90);
		items.push(stringItem);
		game.add.existing(stringItem);
		stringItem.scale.setTo(.3, .3);
		
		alarmItem = new Item(game, 520, game.height - 370, 'alarm', 'This is an alarm clock', 77);
		items.push(alarmItem);
		game.add.existing(alarmItem);
		
		packItem = new Item(game, 320, game.height - 230, 'pack', 'This is my backpack', 34);
		items.push(packItem);
		game.add.existing(packItem);
		
		ballItem = new Item(game, 2200, game.height - 240, 'ball', 'This is a basketball', 2);
		items.push(ballItem);
		game.add.existing(ballItem);
		
		rodItem = new Item(game, -850, game.height - 520, 'rod', 'This is the makeshift rod I made', 101);
		items.push(rodItem);
		game.add.existing(rodItem);
		
		chargerItem = new Item(game, 700, game.height - 220, 'charger', 'This is a phone charger', 33);
		items.push(chargerItem);
		game.add.existing(chargerItem);
		chargerItem.scale.setTo(.3, .3);
		
		chocolateItem = new Item(game, 400, game.height - 220, 'chocolate', 'This is a chocolate bar', 24);
		items.push(chocolateItem);
		game.add.existing(chocolateItem);
		chocolateItem.scale.setTo(.8, .8);
		
		hookItem = new Item(game, -850, game.height - 520, 'hook', 'This is the makeshift hook I made', 102);
		items.push(hookItem);
		game.add.existing(hookItem);		

		//methods that label which items can be combined with each other
		canCombine(stringItem, clipItem);
		canCombine(branchItem, clipItem);

		//that exit
		doorExit = game.add.sprite(300, game.height - 450 + 1000, 'door');
		doorExit.inputEnabled = true;
		doorExit.events.onInputDown.add(leave, this);

		player = game.add.sprite(50, game.height - 326, 'player');
		game.physics.arcade.enable(player);
		player.anchor.set(.5);
		player.body.bounce.y = .1;
		player.animations.add('walk', [1, 2, 3, 4], 10, true);

		//spooky monster with animation
		monsterObj = game.add.sprite(-150, game.height - 500, 'enemy');
		game.physics.arcade.enable(monsterObj);
		monsterObj.anchor.set(.5);
		monsterObj.animations.add('go', [0, 1, 2, 3], 10, true);

		game.camera.follow(player);
		game.camera.deadzone = new Phaser.Rectangle(200, 0, 200, 600);

		game.input.mouse.capture = true;

		gameText = game.add.text(10, 10, '', { fontSize: '24px', fill: '#FFF' });
		gameText.fixedToCamera = true;

		amb = game.add.audio('ambience');
		screech = game.add.audio('monster');

		game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	},

	update: function() {
		// run game loop
		if(game.input.mousePointer.isDown && game.input.mousePointer.y < 400){
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
			player.frame = 0;
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
				player.x += 900;
			}
		}

		//gets rid of fake key
		if(keyFell){
			keyProp.destroy();
		}

		if(player.y - (game.height - 326) != floorStat){
			player.y += floorStat;
			game.camera.y += floorStat;
			if(floorStat == 1000){
				player.x += 900;
			}
		}

		//starts the spooky stuff when the player has the key
		monsterObj.animations.play('go');
		if(!gotKey){
			for(var i = 0; i < invArray.length; i++){
				if(invArray[i].itemID == 100){
					gotKey = true;
					newText = '.........run.........'
					screech.play();
				}
			}
		}
		else{
			if(player.body.x < monsterObj.body.x){
				monsterObj.body.x -= 2;
			}
			else{
				monsterObj.body.x += 2;
			}
			if(player.body.y < monsterObj.body.y){
				monsterObj.body.y -= 2;
			}
			else{
				monsterObj.body.y += 2;
			}			
		}
		if(game.physics.arcade.collide(player, monsterObj)){
			game.state.start('Death', true, false, this.level);
		}
		amb.loopFull(.6);
	},	
}

//death screen
var Death = function(game) {};
Death.prototype = {
	preload: function(){

	},
	create: function(){
		game.add.text(200, 300, 'You succumbed to the darkness...', { fontSize: '32px', fill: '#FFF' });
	},
	update: function(){
		game.state.start('MainMenu', true, false, this.level);
	}
}

//win screen
var Win = function(game) {};
Win.prototype = {
	preload: function(){

	},
	create: function(){
		game.add.text(200, 300, 'You have escaped!', { fontSize: '32px', fill: '#FFF' });
	},
	update: function(){
		if(game.input.activePointer.leftButton.isDown){
			game.state.start('MainMenu', true, false, this.level);
		}
	}
}

game.state.add('MainMenu', MainMenu);
game.state.add('Day', Day);
game.state.add('Night', Night);
game.state.add('Death', Death);
game.state.add('Win', Win);
game.state.start('MainMenu');

//method that handles what to do when an item is clicked
function clicked(item){
	//if left clicked
	if(game.input.activePointer.leftButton.isDown){
		//if its not in the inventory
		//display description
		if(!item.inInventory){
			newText = item.description;
		}
		//if its in the inventory, drop it
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
	//if right clicked
	else{
		//if its not in the inventory, take it
		if(!item.inInventory){
			item.inInventory = true;
			index = 0;
			//find open spot in inventory
			while(invArray[index] != -1){
				index++;
				if(index >= 4){
					return;
				}
			}
			
			invArray[index] = item;
			//put item where it needs to go
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
		//if it is in the inventory, select or deselect it
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

//makes items combinable
function canCombine(item1, item2){
	item1.combinable = item2;
	item2.combinable = item1;
}

//when merge is clicked, finds selected items and attempts to combine them
function mergeItems(){
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
	combine(item1, item2);
}

//where the crafting magic happens
function combine(item1, item2){
	//returns if it uncombinable
	if(item1.combinable != item2){
		return -1;
	}
	//crafted items have the combined ID of the two ingredients
	//so it finds that ID if it exists
	var newID = item1.itemID + item2.itemID;
	var newItem;
	for(var i = 0; i < items.length; i++){
		if(items[i].itemID == newID){
			newItem = items[i];
		}
	}
	//manipulates inventory to remove ingredients and add crafted item
	var newIndex = item1.invPos;
	invArray[item1.invPos] = newItem;
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
	//places new item appropriately in inventory
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

//self explanitory
function startTheGame(){
	startGame = true;
}

function displayControls(){
	showControls = true;
}

function displayCredits(){
	showCredits = true;
}

//go back to original room
function upFloor(){
	floorStat -= 1000;
}

//go to the new room
function downfloor(){
	floorStat += 1000;
	if(floorStat == 1000 && !keyFell){
		newText = 'My dorm. I just want to go to bed...'
	}
}

//just like me!
function boring(){
	newText = 'I dont really feel like doing that right now.'
}

//changes states to spooky hour
function goToNight(){
	game.state.start('Night', true, false, this.level);
	newText = 'Its night, but something feels off...';
	floorStat = 0;
	faceLeft = false;
	amb.stop();
}

//check to see if the player can get the key
function checkKey(){
	for(var i = 0; i < invArray.length; i++){
		if(invArray[i].itemID === 101 || invArray[i].itemID === 102){
			keyItem.x = player.x;
			keyItem.y = player.y + 100;
			newText = 'The key falls onto the ground!';
			this.y -= 200;
			keyFell = true;
			return;
		}
		else{
			newText = 'There is a key up there, but I cant reach';
		}
	}

}

//gets rid of screens appropriately
function hideControls(){
	controlObj.x += 700;
	showControls = false;
}

function hideCredits(){
	creditObj.x += 700;
	showCredits = false;
}

//checks if the player can open the door
function checkDoor(){
	for(var i = 0; i < invArray.length; i++){
		if(invArray[i].itemID == 100){
			downfloor();
			return;
		}
		else{
			newText = 'Weird, the door is locked...';
		}
	}
}

//win state
function leave(){
	game.state.start('Win', true, false, this.level);
}