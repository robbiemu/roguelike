function Player(level, health) {
    Person.call(this, level, health);
    this.weapon = START_WEAPON;		// multiplied by level
    this.XP = START_XP;			// increase level
}

Player.prototype = Object.create(Person.prototype, {
    name: {
	value: 'Player'
    },
    attack: {
	value: function () {
	    return Person.prototype.attack.apply(this) * this.getWeapon();
	}
    },
    pickHealth: {
	value: function (health) {
	    var val = health.valueOf();
	    if(window.isNaN(val)) {
		throw new Error('pickHealth: NaN Health');
	    }
	    this.setHealth(this.getHealth() + val);
	}
    },
    pickWeapon: {
	value: function (wep) {
	    this.weapon += wep.valueOf();
	}
    },
    getWeapon: {
	value: function() {
	    return this.weapon;
	}
    },
    getXP:  {
	value: function() {
	    return this.XP;
	}
    },
    setXP: {
	value: function (xp) {
	    this.XP += xp;
	    if (this.XP >= XP_THRESHOLD) {
		this.XP -= XP_THRESHOLD;
		var lev = this.getLevel();
		this.setLevel(lev + NEXT_LEVEL);
		this.setRange(Math.max(RANGE_MIN, Math.floor(lev * RANGE_MULT)));
	    }
	}
    }
});