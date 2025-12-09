const shipsDic = [
  { name: "carrier", length: 5 },
  { name: "battleShip", length: 4 },
  { name: "cruiser", length: 3 },
  { name: "submarine", length: 3 },
  { name: "destroy", length: 2 },
];
const shipNames = ["carrier", "battleShip", "cruiser", "submarine", "destroy"];

function createGameBoard() {
  const shipsTable = {};

  for (let i = 0; i < shipsDic.length; i++) {
    const ship = shipsDic[i];
    const newKey = ship.name;
    const newShip = Ship(ship.name, ship.length, null, "h");
    shipsTable[newKey] = newShip;
  }
  const gameBoardTable = GameBoard(shipsTable);
  return gameBoardTable;
}

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
      if (i == null) {
        return;
      }
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

      if (last > lastIndexInRow) {
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
  const checkSpaceAroundShip = (ship, matrix, indexArr) => {
    const x = ship.pos["x"];
    const y = ship.pos["y"];
    const d = ship.dir;
    const commonCase = x > 1 && x < 10 && y > 1 && y < 10;
    const checkUp = (x, y, d, matrix) => {
      if (d == "v") {
        const cell = matrix[x - 1][y];
        if (!cell) {
          return true;
        }
        return cell.ship === "";
      } else if (d == "h") {
        let result = true;
        for (let i = 0; i < ship.length; i++) {
          const cell = matrix[x - 1][y + i];
          if (!cell) {
            continue;
          }
          result = result && cell.ship === "";
        }
        return result;
      } else {
        return false;
      }
    };
    const checkDown = (x, y, d, matrix) => {
      if (d == "v") {
        const cell = matrix[x + 1][y];
        if (!cell) {
          return true;
        }
        return cell.ship === "";
      } else if (d == "h") {
        let result = true;
        for (let i = 0; i < ship.length; i++) {
          const cell = matrix[x + 1][y + i];
          if (!cell) {
            continue;
          }
          result = result && cell.ship === "";
        }
        return result;
      } else {
        return false;
      }
    };
    const checkRight = (x, y, d, matrix) => {
      if (d == "v") {
        let result = true;
        for (let i = 0; i < ship.length; i++) {
          const cell = matrix[x + i][y + 1];
          if (!cell) {
            continue;
          }
          result = result && cell.ship === "";
        }
        return result;
      } else if (d == "h") {
        const cell = matrix[x][y + 1];
        if (!cell) {
          return true;
        }
        return cell.ship === "";
      } else {
        return false;
      }
    };
    const checkLeft = (x, y, d, matrix) => {
      if (d == "v") {
        let result = true;
        for (let i = 0; i < ship.length; i++) {
          const cell = matrix[x - 1][y + i];
          if (!cell) {
            continue;
          }
          result = result && cell.ship === "";
        }
        return result;
      }
      if (d == "h") {
        const cell = matrix[x][y - 1];
        if (!cell) {
          return true;
        }
        return cell.ship === "";
      } else {
        return false;
      }
    };
    const checkAllCourners = (x, y, d, matrix) => {
      return (
        checkUp(x, y, d, matrix) &&
        checkDown(x, y, d, matrix) &&
        checkLeft(x, y, d, matrix) &&
        checkRight(x, y, d, matrix)
      );
    };
    const lastIndex = indexArr[indexArr.length - 1];
    const lastColCase = (lastIndex + 1) % 11 === 0;

    if (lastColCase && x == 10) {
      return checkUp(x, y, d, matrix) && checkLeft(x, y, d, matrix);
    } else if (lastColCase && x == 1) {
      return checkDown(x, y, d, matrix) && checkLeft(x, y, d, matrix);
    } else if (lastColCase) {
      return (
        checkUp(x, y, d, matrix) &&
        checkDown(x, y, d, matrix) &&
        checkLeft(x, y, d, matrix)
      );
    } else if (commonCase) {
      return checkAllCourners(x, y, d, matrix);
    } else if (x == 1 && y == 1) {
      return checkRight(x, y, d, matrix) && checkDown(x, y, d, matrix);
    } else if (x == 1 && y == 10) {
      return checkLeft(x, y, d, matrix) && checkDown(x, y, d, matrix);
    } else if (x == 10 && y == 1) {
      return checkUp(x, y, d, matrix) && checkLeft(x, y, d, matrix);
    } else if (x == 10 && y == 10) {
      return checkUp(x, y, d, matrix) && checkLeft(x, y, d, matrix);
    } else if (x == 1) {
      return (
        checkRight(x, y, d, matrix) &&
        checkLeft(x, y, d, matrix) &&
        checkDown(x, y, d, matrix)
      );
    } else if (x == 10) {
      return (
        checkRight(x, y, d, matrix) &&
        checkLeft(x, y, d, matrix) &&
        checkUp(x, y, d, matrix)
      );
    } else if (y == 1) {
      return (
        checkUp(x, y, d, matrix) &&
        checkDown(x, y, d, matrix) &&
        checkRight(x, y, d, matrix)
      );
    } else if (y == 10) {
      return (
        checkUp(x, y, d, matrix) &&
        checkDown(x, y, d, matrix) &&
        checkLeft(x, y, d, matrix)
      );
    } else {
      return false;
    }
  };

  /////////////////////////////////////

  const checkRules = (ship, matrix) => {
    if (ship.pos["x"] == 0 || ship.pos["y"] == 0) {
      return false;
    }
    const indexArr = getIndexArr(ship);
    const ValidBoundries = checkBoundries(indexArr, ship.dir);
    if (!ValidBoundries) {
      return false;
    }
    const validSpaceAroundShip = checkSpaceAroundShip(ship, matrix, indexArr);
    if (!validSpaceAroundShip) {
      return false;
    }
    return true;
  };
  /////////////////////////
  return {
    matrix: matrix,
    ships: ships,
    addShip(ship) {
      const validLocation = checkRules(ship, this.matrix);
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
          cell = matrix[x + i][y];
        } else {
          cell = matrix[x][y + i];
        }
        if (cell["ship"] === "") {
          cell["ship"] = ship.name;
        } else {
          return false;
        }
      }
      return true;
    },
    humanPlacedAllShips() {
      for (let i = 0; i < shipNames.length; i++) {
        const currentShip = this.ships[shipNames[i]];
        if (!currentShip.index) {
          return false;
        }
      }
      return true;
    },
    addComputerShip(ship) {
      const x = ship.pos["x"];
      const y = ship.pos["y"];
      const d = ship.dir;
      console.log(
        `----------addComputerShip------------- \n x: ${x}, y:${y}, index: ${ship.index}`,
      );
      for (let i = 0; i < ship.length; i++) {
        let cell;
        if (d == "v") {
          cell = matrix[x + i][y];
        } else {
          cell = matrix[x][y + i];
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

function createArrayOfIndicies() {
  const arr = [];
  for (let i = 0; i < 121; i++) {
    if (i > 10 && i % 11 !== 0) {
      arr.push(i);
    }
  }
  return arr;
}

export {
  Ship,
  GameBoard,
  Player,
  createGameBoard,
  shipsDic,
  createArrayOfIndicies,
  shipNames,
};
