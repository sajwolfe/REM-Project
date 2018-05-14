var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var mouseX = 50;
var move = false;
var faceLeft = false;
var currEmpty = 0;
var nextEmpty = 1;
function preload() {
	// preload assets
	game.load.atlas('player', 'assets/img/playerSprite.png', 'assets/img/playerSprite.json');
	game.load.image('bg', 'assets/img/backgroundPH.png');
	game.load.image('item', 'assets/img/itemPH.png');
	game.load.image('inv', 'assets/img/inventoryPH.png');
}

function create() {
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

	game.input.mouse.capture = true;
}

function update() {
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

}

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