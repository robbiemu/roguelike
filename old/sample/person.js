function Health(amount) {
    if (amount !== undefined) {
	var amt = amount;
    }
    else {
	throw new Error('Health: must provide an amount');
    }

    this.valueOf = function () {
	return amt;
    };
}
Health.prototype.name = 'Health';

// base for Enemy and Player
function Person(level, health) {
    this.health = health || 100;
    this.level = level || START_LEVEL;
    this.range = Math.max(RANGE_MIN, Math.floor(this.level * RANGE_MULT));
}

Person.prototype.getHealth = function () {
    return this.health;
};
Person.prototype.setHealth = function (health) {
    this.health = health;
    return health;
};
Person.prototype.getLevel = function () {
    return this.level;
};
Person.prototype.setLevel = function (lvl) {
    this.level = lvl;
    return lvl;
};
Person.prototype.getRange = function () {
    return this.range;
};
Person.prototype.setRange = function (rng) {
    this.range = rng;
    return rng;
};
Person.prototype.defend = function (damage) {
    this.setHealth(this.getHealth() - damage);
    return this.getHealth();
};

Person.prototype.attack = function () {
    var lev = this.getLevel();
    return randomInt(lev, lev + this.getRange());
};
