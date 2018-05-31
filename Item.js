function Item(game, xPos, yPos, key, text, id){
	Phaser.Sprite.call(this, game, xPos, yPos, key);
	var inInventory = false;
	this.anchor.set(.5);
	this.inputEnabled = true;
	this.events.onInputDown.add(clicked, this);
	var invPos = -1;
	var description = text;
	var select = false;
	var combinable = new Array();
	var itemID = id;
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

