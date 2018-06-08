function Item(game, xPos, yPos, key, text, id){
	Phaser.Sprite.call(this, game, xPos, yPos, key);
	var description = text;
	var itemID = id;
	var invPos = -1;
	this.invPos = invPos;
	this.description = description;
	this.itemID = itemID;
	this.inInventory = false;
	this.anchor.set(.5);
	this.inputEnabled = true;
	this.events.onInputDown.add(clicked, this);
	this.select = false;
	this.combinable;
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

