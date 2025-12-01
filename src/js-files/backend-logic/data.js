const shipsDic = [
  { name: "carrier", length: 5 },
  { name: "battleShip", length: 4 },
  { name: "cruiser", length: 3 },
  { name: "submarine", length: 3 },
  { name: "destroy", length: 2 },
];

function Ship(name, length, index, dir) {
  return {
    name: name,
    length: length,
    hitNum: 0,
    sunk: false,
    index: index,
    pos: { x: null, y: null },
    dir: dir,
    updateLocation(i) {
      this.index = i;
      this.pos["x"] = Math.floor(i / 11);
      this.pos["y"] = i - this.pos["x"] * 11;
    },

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
  const self = this;
  const matrix = [];
  for (let i = 0; i < 11; i++) {
    const subMatrix = [];
    const indexOfRow = i * 11;
    for (let j = 0; j < 11; j++) {
      const index = indexOfRow + j;
      subMatrix[j] = { ship: "", index: index };
    }
    matrix[i] = subMatrix;
  }

  ////////////////////////////////

  function getIndexArr(ship) {
    let step;
    let indexArr = [];
    if (ship.dir == "h") {
      step = 1;
    } else if (ship.dir == "v") {
      step = 11;
    } else {
      return false;
    }
    let currentIndex = ship.index;
    for (let i = 0; i < ship.length; i++) {
      indexArr.push(currentIndex);
      currentIndex = currentIndex + step;
    }
    return indexArr;
  }

  ////////////////////////////////

  function checkBoundries(indexArr, dir) {
    const first = indexArr[0];
    const last = indexArr[indexArr.length - 1];

    // assure last cell of ship isn't off gameboard
    if (dir == "h") {
      const firstIndexInRow = first - (first % 11);
      const lastIndexInRow = firstIndexInRow + 10;
      console.log(
        `First Index in the Row = ${firstIndexInRow} \n Last Index In the row = ${lastIndexInRow}`,
      );
      if (last > lastIndexInRow) {
        console.log(`Last is greater that last index in the row`);
        return false;
      }
    } else if (dir == "v") {
      if (last > 120) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  /////////////////////////////////////
  /**
   * @param indexArr => array of indecies on the grid.
   * @param ship => the ship that occupies given indecies from indexArr on gameboard.
   * --------------------------------------
   * @purpose check given conditions:
   * =======> 1) ship do not overlap with any other ship.
   * =======> 2) ship has 1 there is at least 1 empty square around the ship from all directions except valid boundries.
   * --------------------------------------
   * @returns boolean
   */
  const checkSpaceAroundShip = (ship) => {
    const x = ship.pos["x"];
    const y = ship.pos["y"];
    const d = ship.dir;
    const commonCase = x > 1 && x < 10 && y > 1 && y < 10;
    const checkUp = (x, y, d) => {
      if (d == "v") {
        const cell = self.matrix[x - 1][y];
        return cell.ship === "";
      } else if (d == "h") {
        let result = true;
        for (let i = 0; i < ship.length; i++) {
          const cell = self.matrix[x - 1][y + i];
          result = result && cell.ship === "";
        }
        return result;
      } else {
        return false;
      }
    };
    const checkDown = (x, y, d) => {
      if (d == "v") {
        const cell = self.matrix[x + 1][y];
        return cell.ship === "";
      } else if (d == "h") {
        let result = true;
        for (let i = 0; i < ship.length; i++) {
          const cell = matrix[x + 1][y + i];
          result = result && cell.ship === "";
        }
        return result;
      } else {
        return false;
      }
    };
    const checkRight = (x, y, d) => {
      if (d == "v") {
        let result = true;
        for (let i = 0; i < ship.length; i++) {
          const cell = self.matrix[x + i][y + 1];
          result = result && cell.ship === "";
        }
        return result;
      } else if (d == "h") {
        const cell = self.matrix[x][y + 1];
        return cell.ship === "";
      } else {
        return false;
      }
    };
    const checkLeft = (x, y, d) => {
      if (d == "v") {
        let result = true;
        for (let i = 0; i < ship.length; i++) {
          const cell = self.matrix[x - 1][y + i];
          result = result && cell.ship === "";
        }
        return result;
      }
      if (d == "h") {
        const cell = self.matrix[x][y - 1];
        return cell.ship === "";
      } else {
        return false;
      }
    };
    const checkAllCourners = (x, y, d) => {
      return (
        checkUp(x, y, d) &&
        checkDown(x, y, d) &&
        checkLeft(x, y, d) &&
        checkRight(x, y, d)
      );
    };

    if (commonCase) {
      return checkAllCourners(x, y, d);
    } else if (x == 1 && y == 1) {
      return checkRight(x, y, d) && checkDown(x, y, d);
    } else if (x == 1 && y == 10) {
      return checkLeft(x, y, d) && checkDown(x, y, d);
    } else if (x == 10 && y == 1) {
      return checkUp(x, y, d) && checkLeft(x, y, d);
    } else if (x == 10 && y == 10) {
      return checkUp(x, y, d) && checkLeft(x, y, d);
    } else if (x == 1) {
      return checkRight(x, y, d) && checkLeft(x, y, d) && checkDown(x, y, d);
    } else if (x == 10) {
      return checkRight(x, y, d) && checkLeft(x, y, d) && checkUp(x, y, d);
    } else if (y == 1) {
      return checkUp(x, y, d) && checkDown(x, y, d) && checkRight(x, y, d);
    } else if (y == 10) {
      return checkUp(x, y, d) && checkDown(x, y, d) && checkLeft(x, y, d);
    } else {
      return false;
    }
  };

  /////////////////////////////////////

  const checkRules = (ship) => {
    for (let i = 0; i < shipsDic.length; i++) {
      const indexArr = getIndexArr(ship);
      const ValidBoundries = checkBoundries(indexArr, ship.dir);
      if (!ValidBoundries) {
        console.log("Problems came from checkBoundries");
        return false;
      }
      const validSpaceAroundShip = checkSpaceAroundShip(ship);
      if (!validSpaceAroundShip) {
        console.log("Problems came from checkSpaceAroundShip");
        return false;
      }
      return true;
    }
  };
  /////////////////////////
  return {
    matrix: matrix,
    ships: ships,
    addShip(ship) {
      const validLocation = checkRules(ship);
      if (!validLocation) {
        return false;
      }

      // submit ship to the matrix
      const x = ship.pos["x"];
      const y = ship.pos["y"];
      const d = ship.dir;
      for (let i = 0; i < ship.length; i++) {
        let cell;
        if (d == "v") {
          cell = self.matrix[x + i][y];
        } else {
          cell = self.matrix[x][y + i];
        }
        if (cell["ship"] === "") {
          cell["ship"] = ship.name;
        } else {
          return false;
        }
      }
      return true;
    },
  };
}
//     placeShip(name, location) {
//       let shipToPlace = this.ships[name];
//       // make sure user place the ship vertically or horizantally
//       if (location[0][0] == location[1][0]) {
//         return shipToPlace.placeHorizontally(this.matrix, location);
//       } else if (location[0][1] == location[1][1]) {
//         return shipToPlace.placeVertically(this.matrix, location);
//       } else {
//         throw new Error("can't place the ship diagonally");
//       }
//     },

//     receiveAttack(x, y) {
//       // determine if those coordinates have a ship placed on them
//       // if so hit that ship
//       // else label the position as miss

//       const target = this.matrix[x][y];
//       if (target == "") {
//         this.matrix[x][y] = "Miss";
//       } else {
//         this.ships[target].hit();
//       }
//       return this.matrix;
//     },
//     allSunk() {
//       let sunkShips = 0;
//       for (const ship in this.ships) {
//         if (this.ships[ship].isSunk()) {
//           sunkShips += 1;
//         }
//       }
//       if (sunkShips === 5) {
//         return true;
//       } else {
//         return false;
//       }
//     },
//   };
// }

function Player(type) {
  return {
    type,
    gboard: GameBoard(),
  };
}

export { Ship, GameBoard, Player, shipsDic };
