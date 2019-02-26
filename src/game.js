

var Game = function() {

    var potion = new Potion(new Point(670, 520));

    var board = new Board();
    this.getBoard = function() { return board; } 

    var players = [ new Player(0, this), new Player(1, this) ];
    this.getPlayers = function() { return players; }
    
    var logicStates = {
        "placement" : new PlacementLogic(board, players, changeLogic),
        "battle" : new BattleLogic(board, players, changeLogic)
    };
    var curLogic;
    this.getLogic = function() { return curLogic; };
    
    changeLogic("placement");
    var controller = new HumanController(board, players, potion, curLogic);

    
    this.update = function() { };

    this.draw = function(drawer) {

        board.draw(drawer);

        players.forEach(player => {
            player.draw(drawer);

            player.units.forEach(unit => {
                unit.draw(drawer);
            }); 
        });

        dice.draw(drawer);

        potion.draw(drawer);
    };

    function changeLogic(logicName) {
        if(!(logicName in logicStates)) { return; }
        if(curLogic == logicStates[logicName]) { return; }

        if(curLogic) { 
            curLogic.onExit(); 
        }

        curLogic = logicStates[logicName];

        if(curLogic) {
            curLogic.onEnter();
        }

        if(controller) {
            controller.setLogic(curLogic);
        }
    };
};