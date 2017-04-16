function Enemy(level, health) {
    Person.call(this, level, health);
}

Enemy.prototype = Object.create(Person.prototype, {
    name: {
	value: 'Enemy'
    }
});

function Boss(level, health) {
    Enemy.call(this, level*BOSS_MULT, health*BOSS_MULT);
}
Boss.prototype = Object.create(Enemy.prototype, {
    name: {
	value: 'Boss'
    }
});