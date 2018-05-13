var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var mouseX = 50;
var move = false;
var inventory = new Array();
function preload() {
	// preload assets
	game.load.image('player', 'assets/img/playerPH.png');
	game.load.image('bg', 'assets/img/backgroundPH.png');
	game.load.image('item', 'assets/img/itemPH.png');
	game.load.image('inv', 'assets/img/inventoryPH.png');
}

function create() {
	// place your assets
	game.world.setBounds(0, 0, 2400, 600);
	game.add.image(0, 0, 'bg');

	player = game.add.sprite(50, game.height - 480, 'player');
	game.physics.arcade.enable(player);

	inv = game.add.image(50, 600, 'inv');
	inv.fixedToCamera = true;

	var itemOne = new Item(game, 200, game.height - 350, 'item');
	game.add.existing(itemOne);
	var itemTwo = new Item(game, 500, game.height - 350, 'item');
	game.add.existing(itemTwo);
	itemTwo.tint = Math.random() * 0xffffff;
	var itemThree = new Item(game, 800, game.height - 350, 'item');
	game.add.existing(itemThree);
	itemThree.tint = Math.random() * 0xffffff; 
	var itemFour = new Item(game, 1200, game.height - 350, 'item');
	game.add.existing(itemFour);
	itemFour.tint = Math.random() * 0xffffff;

	game.camera.follow(player);
	game.camera.deadzone = new Phaser.Rectangle(200, 0, 300, 800);
}

function update() {
	// run game loop


	if(game.input.mousePointer.isDown){
		mouseX = game.input.mousePointer.x + game.camera.x;
		move = true;
	}
	if(player.x < mouseX + 25 && player.x > mouseX - 25){
		move = false;
		player.body.velocity.x = 0;
	}
	if(move){
		game.physics.arcade.moveToXY(player, mouseX, player.y, 200);
	}

}

function clicked(item){
	if(!item.inInventory){
		item.inInventory = true;
		inventory.push(item);
		if(inventory.indexOf(item) == 0){
			item.x = inv.x + 75 - game.camera.x;
			item.y = inv.y + 100;
			item.fixedToCamera = true;
		}
		if(inventory.indexOf(item) == 1){
			item.x = inv.x + 200 - game.camera.x;
			item.y = inv.y + 100;
			item.fixedToCamera = true;
		}
		if(inventory.indexOf(item) == 2){
			item.x = inv.x + 325 - game.camera.x;
			item.y = inv.y + 100;
			item.fixedToCamera = true;
		}
		if(inventory.indexOf(item) == 3){
			item.x = inv.x + 450 - game.camera.x;
			item.y = inv.y + 100;
			item.fixedToCamera = true;
		}
	}
}