
var UNIT_SIZE = new Point(40, 40);
var HEALTH_OFFSET = new Point(12, 16);

var createKnight = function(owner) {
    var knight = new Unit(owner, 8, 3, 15, 1, 1);
    knight.toString = function() { return "knight"; }

    return knight;
}

var createElf = function(owner) {
    var elf = new Unit(owner, 5, 1, 10, 3, 3);
    elf.toString = function() { return "elf"; }

    elf.canAttackThrough = function(pos) {
        return true;
    };

    return elf;
}

var createDwarf = function(owner) {
    var dwarf = new Unit(owner, 6, 2, 12, 2, 2);
    dwarf.toString = function() { return "dwarf"; }

    return dwarf;
}

var Unit = function(owner, damage, armor, health, attRange, movement) {

    this.color = "#888888";

    var maxHealth = health;
    var curHealth = health;
    var placed = false;
    var worldPos = new Point(0, 0);
    var boardPos = null;
    var boardRef = null;

    this.type = "unit";

    this.getOwner = function() { return owner; }
    this.getWorldPos = function() { return worldPos; }
    this.setWorldPos = function(value) { if(value) { worldPos = value; } }
    this.getBoardPos = function() { return boardPos; }
    this.getDamage = function() { return damage; }
    this.getArmor = function() { return armor; }
    this.getMovement = function() { return movement; } 
    this.getAttRange = function() { return attRange; }
    this.getHealth = function() { return curHealth; }
    this.getMaxHealth = function() { return maxHealth; }  
    this.getBoard = function() { return boardRef; }

    this.isDead = function() { return curHealth <= 0; }
    this.isPlaced = function() { return placed; }

    this.raycast = function(pos) {
        if(!pos) { throw("Missing argument!"); }

        var boundingRect = getBoundingRect();
        return boundingRect.contains(pos);
    }

    this.canAttackThrough = function(pos) {
        return  boardRef.getPiece(pos) != "obstacle";
    };

    this.canAttackTarget = function(pos) {
        var piece = boardRef.getPiece(pos);
        if(piece == null) { return false; }
        if(piece != "obstacle" && owner.owns(piece)) { return false; }
        
        var dist = pos.distance(boardPos);

        return dist == attRange; 
    };

    this.canTraverse = function(pos) {
        return (!boardRef.getPiece(pos));
    };

    this.canStandOn = function(pos) {
        return (!boardRef.getPiece(pos));
    };

    this.place = function(board, pos) {
        if(!board || !pos) { return; }
    
        if(placed) 
            throw ("Attempting to place a game piece for a second time!");
    
        boardRef = board;

        boardPos = pos;
        worldPos = boardRef.boardToWorldPos(boardPos);
        boardRef.setPiece(pos, this);
        placed = true;
    };

    this.remove = function() {
        if(!placed)
            throw("Attempting to remove a game piece that has not been placed on the board!");
        boardRef.removePiece(boardPos);
        boardRef = null;
        boardPos = null;
        placed = false;
    };

    this.attack = function(pos) {
        var otherPiece = boardRef.getPiece(pos);
        if(otherPiece == "obstacle") {
            boardRef.removePiece(pos)
        }
        else if(otherPiece != null) {
            otherPiece.takeDamage(damage, this);
        }
        else {
            throw ("Attacking an invalid pos " + pos);
        }
    };

    this.die = function() {
        this.remove();
        this.getOwner().opponent.addKill(this);
        CollectionUtil.removeSpecific(this.getOwner().units, this);

        console.log("Dead");    
    };

    this.takeDamage = function(amount, attacker) {

        dice.clear();
        var diceResult = dice.roll(3);

        if(diceResult == curHealth) {
            console.log("Attack failed");
            return;
        }

        var amountRef = amount;

        if(diceResult == 3) {
            console.log("Half damage");
            amountRef /= 2;
        }

        var finalAmount = amountRef - armor;

        if(finalAmount <= 0) { return; }

        attacker.getOwner().addScore(finalAmount);
        curHealth -= finalAmount;
        if(curHealth <= 0) {
            this.die();
        }
    };

    this.heal = function(value) {
        curHealth += value;
        if(curHealth > maxHealth) {
            curHealth = maxHealth;
        }
    };
    
    this.draw = function(drawer) {
        if(!drawer) { return; }

        var rectToDraw = getBoundingRect();

        drawer.drawRect(rectToDraw, owner.getColor());
        drawer.drawText(this.toString(), "18px Arial", worldPos, "black");
        drawer.drawText(curHealth, "12px Arial", worldPos.add(HEALTH_OFFSET) , "black");
    };
    
    function getBoundingRect() {
        return new Rect( 
            worldPos.x - UNIT_SIZE.x / 2,
            worldPos.y - UNIT_SIZE.y / 2,
            UNIT_SIZE.x,
            UNIT_SIZE.y
        );
    };
}
