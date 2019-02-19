

var PLAYER_1_OFFSET = new Point(300, 100);
var PLAYER_2_OFFSET = new Point(300, 400);
var UNIT_OFFSET = new Point(60, 60);

var Player = function(index, game) {

    var indexRef = index ? index : 0;
    var offset = index == 0 ? PLAYER_1_OFFSET : PLAYER_2_OFFSET;

    this.units = [
        createKnight(this), createKnight(this),
        createElf(this), createElf(this),
        createDwarf(this), createDwarf(this)
    ];

    this.units.forEach(unit => {
        game.addPiece(unit); 
    });

    for(var x = 0; x < 2; x++) {
        for(var y = 0; y < 3; y++) {
            var unit = this.units[y * 2 + x];

            unit.setWorldPos(offset.x + x * UNIT_OFFSET.x, offset.y + y * UNIT_OFFSET * y);
        }
    }
};