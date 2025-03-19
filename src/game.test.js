import { Ship as createShip, GameBoard } from "./data.js";
import { test, expect, describe } from "@jest/globals";

function makeMatrix() {
  return Array(10)
    .fill()
    .map(() => Array(10).fill(""));
}
function fillMatrix(matrix, start, end, same, name, dir) {
  if (dir === "h") {
    for (let i = start; i < end; i++) {
      matrix[same][i] = name;
    }
  } else if (dir === "v") {
    for (let i = start; i < end; i++) {
      matrix[i][same] = name;
    }
  }
  return matrix;
}
function sinkAll(gboard) {
  for (const ship in gboard.ships) {
    sinkShip(gboard.ships[ship]);
  }
}
function sinkShip(ship) {
  for (let i = 0; i < ship.length; i++) {
    ship.hit();
  }
}

describe("Ship", () => {
  const ship = createShip("ship", 4);
  // declaring a sunkShip and make it hit 5 times
  const sunkShip = createShip("sunkShip", 5);
  for (let i = 0; i <= 4; i++) {
    sunkShip.hit();
  }

  describe("Test hit()", () => {
    test("hit increases hit number", () => {
      ship.hit();
      expect(ship.hitNum).toBe(1);
    });
    test("hit() keeps hitted ships as it is", () => {
      expect(sunkShip.hitNum).toBe(5);
    });
  });

  describe("Test isSunk()", () => {
    test("Ship with no hits is not sunk", () => {
      expect(ship.isSunk()).toBe(false);
    });
    test("Ship with equal hits to its length is sunk", () => {
      expect(sunkShip.isSunk()).toBe(true);
    });
  });

  describe("Test placing ships", () => {
    let submarine = createShip("Submarine", 4);
    let destroy = createShip("Destroy", 2);
    let horizontalLocation1 = [
      [0, 1],
      [0, 4],
    ];
    let verticalLocation1 = [
      [8, 5],
      [9, 5],
    ];
    const emptyMatrix = makeMatrix();
    const emptyMatrix2 = makeMatrix();
    let matrixWithHorizontalShip = makeMatrix();
    fillMatrix(matrixWithHorizontalShip, 1, 5, 0, "Submarine", "h");
    let matrixWithVerticalShip = makeMatrix();
    fillMatrix(matrixWithVerticalShip, 8, 10, 5, "Destroy", "v");

    test("place a ship horizontally", () => {
      expect(
        submarine.placeHorizontally(emptyMatrix, horizontalLocation1),
      ).toEqual(matrixWithHorizontalShip);
    });

    test("place a ship vertically", () => {
      expect(destroy.placeVertically(emptyMatrix2, verticalLocation1)).toEqual(
        matrixWithVerticalShip,
      );
    });
  });
});

describe("GameBoard", () => {
  let gboard = GameBoard();

  let location1 = [
    [7, 6],
    [7, 9],
  ];
  test("Place a ship in the Gameboard", () => {
    let filledMatrix = fillMatrix(makeMatrix(), 6, 9, 7, "Cruiser", "h");
    expect(gboard.placeShip("cruiser", location1)).toEqual(filledMatrix);
  });

  test("Hit a ship that is placed in the board", () => {
    let matrixUnHitted = fillMatrix(makeMatrix(), 8, 10, 5, "destroy", "h");
    let gboard = GameBoard();
    gboard.matrix = matrixUnHitted;
    let hittedGboard = GameBoard();
    let hittedMatrix = fillMatrix(makeMatrix(), 8, 10, 5, "destroy", "h");
    hittedGboard.matrix = hittedMatrix;
    hittedGboard.ships["destroy"].hit();
    expect(gboard.receiveAttack(5, 8)).toMatchObject(hittedMatrix);
  });
  describe("Test sunkAll", () => {
    test("return true if all ships have been sunk flase other wise", () => {
      let gboard = GameBoard();
      sinkAll(gboard);
      expect(gboard.allSunk()).toBe(true);
    });
    test("return false if some of the ships have been sunk but not all of them", () => {
      let gboard = GameBoard();
      sinkShip(gboard.ships["carrier"]);
      sinkShip(gboard.ships["submarine"]);
      gboard.ships["destroy"].hit();
      expect(gboard.allSunk()).toBe(false);
    });
  });
});
