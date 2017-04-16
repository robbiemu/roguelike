/*
 * Rptx 2016-06-13 Script for Roguelike Dungeon Crawler Game
 * Data Visualization projects (React) for Free Code Camp.
 *
 * This contains all class and functions of the Model. 
 */
var XP_THRESHOLD = 100;
var XP_PER_KILL = 34;
var NEXT_LEVEL = 2;
var MAX_NUM_WALLS = 75;		// avoid infinite loop in buildWalls
var MAX_WALL_LENGTH = 10;
var MIN_WALL_LENGTH = 5;
var NUM_HOLES = 4;

var START_LEVEL = 6;
var START_HEALTH = 100;
var START_WEAPON = 1;
var START_XP = 0;
var RANGE_MULT = 0.2;			// attack damage range.
var RANGE_MIN = 2;

var ENEMY_PROPORTION = 0.0125;
var ENEMY_HEALTH = START_HEALTH * 0.60;

var WEAPONS_MULT = 0.25;
var WEAPONS_MIN = 3;
var WEAPONS_PROPORTION = 3.0;
var BOSS_MULT = 4;

var HEALTH_OVER_WEAPONS = 2;

var VISIBILITY_RANGE = 3;

// Return a random Integer in the range [0, i)
function randomInt(start, end) {
    if (start > end) {
	var tmp = start;
	start = end;
	end = tmp;
    }
    return Math.floor(Math.random() * (end - start) + start);
}

function minMax(a, b) {
    if (a <= b) {
	return { min: a, max: b };
    }
    else {
	return { min: b, max: a };
    }
}

// First and last "bricks" would be closed by recursive calls, so don't pick them
// remember that randomInt is [start, end)
function randomInRect(start, end) {
    var mmX = minMax(start.x, end.x);
    var mmY = minMax(start.y, end.y);
    return new Point(
	randomInt(mmX.min + 1, mmX.max),
	randomInt(mmY.min + 1, mmY.max)
    );
}

function perpendiculars(dir) {
    switch (dir) {
    case 'ArrowLeft':
    case 'ArrowRight':
	return [ 'ArrowUp', 'ArrowDown'];
	break;
    case 'ArrowUp':
    case 'ArrowDown':
	return [ 'ArrowLeft', 'ArrowRight'];
	break;
    default:
	throw new Error('perpendiculars: Unknown dir ' + dir);
    }
}

function moveInDir(dir, point) {
    var p = new Point(point.x, point.y);
    switch (dir) {
    case 'ArrowLeft':
	p.x -= 1;
	break;
    case 'ArrowRight':
	p.x += 1;
	break;
    case 'ArrowUp':
	p.y -= 1;
	break;
    case 'ArrowDown':
	p.y += 1;
	break;
    default:
	throw new Error('moveInDir: Unknown dir ' + dir);
    }
    return p;
}

// I use an Array of rows (instead of more natural columns), becuase of rendering.
// I render a row of divs with (float left), and a br at the end.
function emptyCellArray(width, height) {
    var res = [];
    for (var i = 0; i < height; i++) {
	var row = [];
	for (var j = 0; j < width; j++) {
	    row.push(new Cell(new Empty(), true));
	}
	res.push(row);
    }
    return res;
}

// leave no encapsulation or abstraction untouched.
function maxDamage(numEnemies, numWeapons) {
    var p = new Player(START_LEVEL, START_HEALTH);
    var e = new Enemy(START_LEVEL, ENEMY_HEALTH);
    var damage = 0;
    var blowsNeeded = 0;		      // to kill an enemy
    for(var i = 0; i < numEnemies; i++) {
	if(i%numWeapons === 0) {
	    p.pickWeapon(new Weapon(Math.floor(i/numWeapons) * WEAPONS_MULT));
	}
	blowsNeeded = Math.ceil(e.getHealth() / p.attack());
	damage += e.attack() * blowsNeeded; 
	p.setXP(34);
    }
    // boss
    var bossLevel = e.level * BOSS_MULT;
    damage += (bossLevel + bossLevel * RANGE_MULT);
    return Math.ceil(damage);
}

function RandomWorld(width, height) {
    this.width = width;
    this.height = height;
    this.visibility = false;	// false: all world visible.
    this.attacked = false;	// to attack by turns.
    
    this.world = emptyCellArray(width, height);
    var mid = new Point(Math.floor(width/2),Math.floor(height/2));
    this.num_walls = 0;		// avoid overflow
    this.buildWalls(mid, 'ArrowDown', MAX_WALL_LENGTH/2);

    this.player = new Player(START_LEVEL, START_HEALTH);
    this.playerPos = this.randomEmptyCell();
    this.setCell(this.playerPos, new Cell(this.player, true));

    this.numEnemies = Math.floor(width * height * ENEMY_PROPORTION);
    for(var i = 0; i < this.numEnemies; i++) {
	this.setCell(this.randomEmptyCell(),
		     new Cell(new Enemy(START_LEVEL, ENEMY_HEALTH))); 
    }

    this.setCell(this.randomEmptyCell(),
		 new Cell(new Boss(START_LEVEL, ENEMY_HEALTH)));
    this.numEnemies += 1;

    var numWeapons = Math.max(WEAPONS_MIN,
			      Math.floor(this.numEnemies / WEAPONS_PROPORTION));
    for(i = 1; i <= numWeapons; i++) {
	this.setCell(this.randomEmptyCell(),
		     new Cell(new Weapon(i * WEAPONS_MULT)));
    }

    var numHealth = numWeapons + HEALTH_OVER_WEAPONS;
    var healthVal = Math.ceil(maxDamage(this.numEnemies, numWeapons) / numHealth);
    for(i = 0; i < numHealth; i++) {
	this.setCell(this.randomEmptyCell(),
		     new Cell(new Health(healthVal)));
    }

    for(i = 0; i < NUM_HOLES; i++) {
	this.setCell(this.randomEmptyCell(),
		     new Cell(new Hole()));
    }

    this.setVisibility();
}

// Used to signal the end of the game. 
var End = function (str) {
    this.message = str || 'End';
};

RandomWorld.prototype = {
    inBounds: function (point) {
	return point.x >= 0 && point.x < this.width &&
	    point.y >= 0 && point.y < this.height;
    },
    // All these will throw if not inBounds.
    getCell: function (point) {
	if (this.inBounds(point)) {
	    return this.world[point.y][point.x];
	}
	else {
	    throw new Error('RandomWorld.getCell: out of bounds. ' + point.toString());
	}
    },
    setCell: function (point, cell) {
	if (this.inBounds(point)) {
	    this.world[point.y][point.x] = cell;
	}
	else {
	    throw new Error('RandomWorld.setCell: out of bounds. ' + point.toString());
	}
    },
    emptyCell: function (point) {
	if (this.inBounds(point)) {
	    return this.getCell(point).isEmpty();
	}
	else {
	    throw new Error('RandomWorld.emptyCell: out of bounds. ' + point.toString());
	}
    },
    randomEmptyCell: function () {
	var w = this.width;
	var h = this.height;
	
	var p = new Point(randomX(), randomY());
	while(!this.emptyCell(p)) {
	    p.x = randomX();
	    p.y = randomY();
	}
	return p;
	
	function randomX() {
	    return randomInt(0, w);
	};
	function randomY() {
	    return randomInt(0, h);
	};
    },
    // Point, string, int, World -> void
    // dir is one of: ArrowDown, ArrowUp, ArrowRight, ArrowLeft
    // Side effect: replace length cells in world from 'empty' to 'wall'
    // 0. If next cell in dir is full or out of bounds or MAX_NUM_WALLS reached, return
    // 1. Build wall in dir, until length or I hit a wall
    // 2. If I reached length, build walls in the two perpendicular
    //    directions from the end position. Random length
    // 3. Build two perpendicular walls from the start position. Random length
    buildWalls: function (start, dir, length) {
	// avoid overflowing call stack
	var p = moveInDir(dir, start);
	if (this.num_walls >= MAX_NUM_WALLS || !this.inBounds(p) || !this.emptyCell(p)) {
	    return;
	}
	var dirs = perpendiculars(dir);
	var w = new Wall();
	this.setCell(start, new Cell(w, false));
	for (var i = 0; i < length; i++, p = moveInDir(dir, p)) {
	    var p0 = moveInDir(dirs[0], p); // on each side of the "brick" I'm constructing
	    var p1 = moveInDir(dirs[1], p);
	    if(!this.inBounds(p)  ||
	       !this.emptyCell(p) ||
	       // avoid contiguos parallel lines that could obstruct doors
	       (this.inBounds(p0) && !this.emptyCell(p0)) ||
	       (this.inBounds(p1) && !this.emptyCell(p1))) {
		break;
	    }
	    else {
		this.setCell(p, new Cell(w, false)); 
	    }
	}
	this.num_walls++;
	if (i === length) {		// didn't collide
	    this.buildWalls(p, dirs[0], randomInt(MIN_WALL_LENGTH, MAX_WALL_LENGTH));
	    this.buildWalls(p, dirs[1], randomInt(MIN_WALL_LENGTH, MAX_WALL_LENGTH));
	}
	this.buildWalls(start, dirs[0], randomInt(MIN_WALL_LENGTH, MAX_WALL_LENGTH));
	this.buildWalls(start, dirs[1], randomInt(MIN_WALL_LENGTH, MAX_WALL_LENGTH));

	// Open Door.
	    this.setCell(randomInRect(start, p), new Cell(new Empty(), false));
    },
    winOrLose: function () {
	if (this.player.getHealth() <= 0) {
	    throw new End('Lose');
	}
	if (this.numEnemies <= 0) {
	    throw new End('Win');
	}
	return false;
    },
    toggleVisibility: function () {
	this.visibility = (this.visibility) ? false : true;
	this.setVisibility();
    },
    setVisibility: function () {
	for (var i = 0; i < this.width; i++) {
	    for (var j = 0; j < this.height; j++) {
		if (Math.abs(i - this.playerPos.x) <= VISIBILITY_RANGE &&
		    Math.abs(j - this.playerPos.y) <= VISIBILITY_RANGE) {
		    this.getCell(new Point(i,j)).visibility = true;
		}
		else {
		    this.getCell(new Point(i,j)).visibility = this.visibility;
		}
	    }
	}
    },
    movePlayer: function (dir) {
	try {
	    var newPosition = moveInDir(dir, this.playerPos);
	    var cell = this.getCell(newPosition);
	    var move = true;
	    switch (cell.name()) {
	    case 'Enemy':
	    case 'Boss':  
		var e = cell.contents;
		if (this.attacked) {
		    this.player.defend(e.attack());
		    this.attacked = false;
		}
		else {
		    e.defend(this.player.attack());
		    this.attacked = true;
		}
		if (e.getHealth() <= 0) {
		    this.player.setXP(XP_PER_KILL);
		    this.numEnemies -= 1;
		}
		else {
		    move = false;
		}
		this.winOrLose();
		break;
	    case 'Health':
		this.player.pickHealth(cell.contents);
		break;
	    case 'Weapon':
		this.player.pickWeapon(cell.contents);
		break;
	    case 'Wall':
		move = false;
		break;
	    case 'Hole':
		newPosition = this.randomEmptyCell(this.width, this.height);
		break;
	    default:
		break;
	    }
	    if (move || this.emptyCell(newPosition)) {
		this.setCell(this.playerPos, new Cell(new Empty(), true));
		this.setCell(newPosition, new Cell(this.player, true));
		this.playerPos = newPosition;
		this.setVisibility();
	    }
	}
	catch (e) {
	    if (e instanceof End) {
		throw e;	// rethrow to catch in Script.js
	    }
	}
    }
};

/*
 * Rptx 2016-06-13 Script for Roguelike Dungeon Crawler Game
 * Data Visualization projects (React) for Free Code Camp.
 *
 * This Contains all React Visualization code. 
 */

// In the game. You are in something like a maze, you can walk around, 
// fight enemies, pick up weapons and health, or fall into holes that transport
// you to random places. You can't walk through walls, and you kill enemies by
// colliding with them many times. 
// At any time you can only see some distance around you. 

// Generic Class for creating Buttons dynamically.
var Button = React.createClass({
    componentDidMount: function() {
	document.getElementById(this.props.id).addEventListener('click', this.props.callback);
    },

    render: function() {
	return React.createElement(
	    'button',
	    {
		className: 'btn',
		id: this.props.id
	    },
	    this.props.text
	);
    }
});

var TextBox = React.createClass({
    render: function () {
	return React.createElement(
	    'div',
	    { className: 'textBox' },
	    this.props.text
	);
    }
});

// A row of divs. The building blocks of the world.
// Each divs gets an id that can be used to add events to it later. 
var Row = React.createClass({
    render: function () {
	var cs = this.props.cells;
	var cElements = [];
	var length = this.props.cellLength - (this.props.borderWidth * 2);
	
	for (var i = 0; i < cs.length; i++) {
	    cElements.push(
		React.createElement(
		    'div',
		    {
			className:'cell nonLastCell ' + ((cs[i].visibility) ? cs[i].name() : 'nonVisible'), 
			id: 'cell' + this.props.rowNumber + ',' + i,
			style: {
			    borderWidth: this.props.borderWidth,
			    borderStyle: 'solid',
			    borderColor: 'black',
			    width: length,
			    height: length
			},
			key: this.props.rowNumber + i
		    })
	    );
	}
	cElements.push(React.createElement('br', { key: this.props.rowNumber + i }));
	
	return React.createElement(
	    'div',
	    {
		className: 'row',
		style: { height: this.props.cellLength }
	    },
	    cElements
	);
    }
});


var World = React.createClass({
    render: function() {
	var wState = this.props.worldState;
	var rows = [];
	for (var i = 0; i < wState.length; i++) {
	    rows.push(React.createElement(
		Row,
		{
		    cells: wState[i],
		    rowNumber: i,
		    cellLength: this.props.cellLength,
		    borderWidth: this.props.borderWidth,
		    key: i
		}
	    ));
	}
	return React.createElement(
	    'div',
	    {
		id: "world",
		style: { width: this.props.width, height: this.props.height }
	    },
	    rows
	);
    }
});


function centerInline(id) {
    var element = document.getElementById(id);
    // add one to avoid overflowing elements to another line
    var width = (element.offsetWidth + 1) + 'px';
    var height = element.offsetHeight + 'px';
    element.style.width = width;
    element.style.height = height;
    element.style.margin = '5px auto';
    element.style.display = 'block';
}

function intToStr(int, length) {
    var negative = false;
    if (int < 0) {
	int *= -1;
	negative = true;
    }
    var str = int + '';
    for (var i = str.length; i < length - (negative) ? 1 : 0; i++) {
	    str = '0' + str;
    }
    if (negative) {
	str = '-' + str;
    }
    return str;
}

var Master = React.createClass({
    toggleVisibility: function (e) {
	var w = this.state.world;
	w.toggleVisibility();
	this.setState({ wrold: w });
    },

    handleKeyPress: function(k) {
	try {
	    var w = this.state.world;
	    w.movePlayer(k.code);
	    this.setState({ world: w });
	}
	catch (e) {
	    if (e instanceof End) {
		window.alert('You ' + e.message);
		this.setState(this.getInitialState());
	    }
	    else {
		console.log(e);
	    }
	}
    },

    componentDidMount: function () {
	window.onkeydown = this.handleKeyPress;
	centerInline('information');
	centerInline('legendWrap');
    },

    getInitialState: function () {
	var w = new RandomWorld(this.props.numCellWidth, this.props.numCellHeight);
	return { world: w  };
    },

    render: function () {
	return React.createElement(
	    'div',
	    null,
	    React.createElement(
		'div',
		{
		    id: 'information',
		    style: { display: 'inline-block' }
		},
		React.createElement(
		    TextBox,
		    {
			text: 'Health: ' + intToStr(this.state.world.player.getHealth(), 3)
		    }
		),
		React.createElement(
		    TextBox,
		    {
			text: 'Level: ' + intToStr(this.state.world.player.level, 2)
		    }
		),
		React.createElement(
		    TextBox,
		    {
			text: 'XP: ' + intToStr(this.state.world.player.getXP(), 2)
		    }
		),
		React.createElement(
		    TextBox,
		    {
			text: 'Weapon: ' + this.state.world.player.getWeapon().toFixed(1)
		    }
		),
		React.createElement(
		    Button,
		    {
			id: 'toggleVisibility',
			text: 'Toggle Visibility',
			callback: this.toggleVisibility
		    }
		)
	    ),
	    React.createElement(
		World,
		{
		    worldState: this.state.world.world,
		    cellLength: this.props.cellLength,
		    borderWidth: this.props.borderWidth,
		    width: this.props.numCellWidth * this.props.cellLength,
		    height: this.props.numCellHeight * this.props.cellLength
		}
	    )
	);
    }
});

function niceCellLength() {
    var screen = Math.min(window.innerWidth, window.innerHeight);
    // game gets slow with too many divs.
    return Math.max(20, Math.floor(screen / 35));
}

var cellLength = niceCellLength();
var borderWidth = 0;

var boxRendered = ReactDOM.render(
    React.createElement(Master, {
	numCellWidth: Math.floor((window.innerWidth * 0.9) / cellLength),
	numCellHeight: Math.floor((window.innerHeight * 0.70) / cellLength),
	cellLength: cellLength,
	borderWidth: borderWidth,
	speed: 100
    }),
    document.getElementById('content')
);

