function Item(game, xPos, yPos, key){
	Phaser.Sprite.call(this, game, xPos, yPos, key);
	var inInventory = false;
	this.anchor.set(.5);
	this.inputEnabled = true;
	this.events.onInputDown.add(clicked, this);
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;
