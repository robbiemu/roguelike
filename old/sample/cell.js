// Cell has contents and visibility properties. 
// contents is one of: 'player', 'wall', 'empty', 'weapon', 'enemy', 'health', 'hole'
// contents will be replaced by objects representing each type of element in the world. 
// visibility is a boolean.
function Cell(contents, visibility) {
    this.contents = contents || new Empty();
    this.visibility = visibility || false;
}

Cell.prototype.name = function () {
    return this.contents.name;
};

Cell.prototype.isEmpty = function () {
    return this.name() === 'Empty';
};

function Wall() {
}
Wall.prototype.name = 'Wall';

function Empty() {
}
Empty.prototype.name = 'Empty';

function Hole() {
}
Hole.prototype.name = 'Hole';

function Weapon(power) {
    if (power !== undefined) {
	var pwr = power;
    }
    else {
	throw new Error('Weapon: must provide a value for power');
    }
    
    this.valueOf = function () {
	return pwr;
    };
}
Weapon.prototype.name = 'Weapon';