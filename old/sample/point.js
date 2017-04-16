// Simple point in a 2D grid. 
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function () {
    return 'Point { x: ' + this.x + ', y: ' + this.y + ' }';
};