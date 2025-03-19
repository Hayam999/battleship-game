function Ship(name, length) {
  // Private function
  function place(callback, matrix, location) {
    let start = location[0];
    let end = location[1];
    for (let i = 0; i < length; i++) {
      if (skippedEnd(start, end)) {
        throw new Error("Can't place the ship beyond given end position");
      } else {
        let x = start[0];
        let y = start[1];

        if (matrix[x][y] === "") {
          matrix[x][y] = name;
          let newPos = callback(x, y);
          start = newPos; // Update start position for next iteration
        } else {
          throw new Error("Ships overlapping");
        }
      }
    }
    return matrix;
  }

  function skippedEnd(start, end) {
    // For horizontal placement (same x)
    if (start[0] === end[0] && start[1] > end[1]) {
      return true;
    }
    // For vertical placement (same y)
    if (start[1] === end[1] && start[0] > end[0]) {
      return true;
    }
    return false;
  }

  return {
    name,
    length,
    hitNum: 0,
    sunk: false,
    location: null,

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

    placeHorizontally(matrix, location) {
      // For horizontal placement, y increases (move right)
      return place((x, y) => [x, y + 1], matrix, location);
    },

    placeVertically(matrix, location) {
      // For vertical placement, x increases (move down)
      return place((x, y) => [x + 1, y], matrix, location);
    },
  };
}
function GameBoard() {
  // initialize the 5 ships to start the game
  function createShips() {
    let carrier = Ship("Carrier", 5);
    let battleship = Ship("BattleShip", 4);
    let cruiser = Ship("Cruiser", 3);
    let submarine = Ship("Submarine", 3);
    let destroy = Ship("Destroy", 2);
    return {
      carrier: carrier,
      battleship: battleship,
      cruiser: cruiser,
      submarine: submarine,
      destroy: destroy,
    };
  }
  return {
    matrix: Array(10)
      .fill()
      .map(() => Array(10).fill("")),
    ships: createShips(),

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
