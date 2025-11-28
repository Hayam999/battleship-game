function Ship(name, length, index, dir) {
  return {
    name: name,
    length: length,
    hitNum: 0,
    sunk: false,
    index: index,
    dirctions: dir,

    hit() {
      if (this.hitNum < this.length) {
        this.hitNum += 1;
        if (this.hitNum == this.length) {
          this.sunk = true;
        }
      }
      return this;
    },

    isSunk() {
      return this.hitNum >= this.length;
    },
  };
}
function GameBoard(ships) {
  return {
    matrix: Array(10)
      .fill()
      .map(() => Array(10).fill("")),
    ships: ships,

    placeShip(name, location) {
      let shipToPlace = this.ships[name];
      // make sure user place the ship vertically or horizantally
      if (location[0][0] == location[1][0]) {
        return shipToPlace.placeHorizontally(this.matrix, location);
      } else if (location[0][1] == location[1][1]) {
        return shipToPlace.placeVertically(this.matrix, location);
      } else {
        throw new Error("can't place the ship diagonally");
      }
    },

    receiveAttack(x, y) {
      // determine if those coordinates have a ship placed on them
      // if so hit that ship
      // else label the position as miss

      const target = this.matrix[x][y];
      if (target == "") {
        this.matrix[x][y] = "Miss";
      } else {
        this.ships[target].hit();
      }
      return this.matrix;
    },
    allSunk() {
      let sunkShips = 0;
      for (const ship in this.ships) {
        if (this.ships[ship].isSunk()) {
          sunkShips += 1;
        }
      }
      if (sunkShips === 5) {
        return true;
      } else {
        return false;
      }
    },
  };
}

function Player(type) {
  return {
    type,
    gboard: GameBoard(),
  };
}

export { Ship, GameBoard, Player };
