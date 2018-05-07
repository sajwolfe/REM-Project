var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var mouseX = 50;
var move = false;
function preload() {
	// preload assets
	game.load.image('player', 'assets/img/playerPH.png');
	game.load.image('bg', 'assets/img/backgroundPH.png')
}

function create() {
	// place your assets
	game.world.setBounds(0, 0, 2400, 600);
	game.add.image(0, 0, 'bg');

	player = game.add.sprite(50, game.height - 280, 'player');
	game.physics.arcade.enable(player);
	game.camera.follow(player);
	game.camera.deadzone = new Phaser.Rectangle(200, 0, 300, 600);
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
	console.log(move);

}