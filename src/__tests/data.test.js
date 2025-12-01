import { test, expect, describe } from "@jest/globals";
import { Ship, GameBoard, shipsDic } from "../js-files/backend-logic/data.js";

const shipsTable = {};

for (let i = 0; i < shipsDic.length; i++) {
  const ship = shipsDic[i];
  const newKey = ship.name;
  const newShip = Ship(ship.name, ship.length, null, "h");
  shipsTable[newKey] = newShip;
}

describe("Test 4 corners when placing horizontal ships", () => {
  const gb = GameBoard(shipsTable);
  const submarine = gb.ships["submarine"];
  submarine.updateLocation(12);
  test("Should add submarine in the matrix[1][1]", () => {
    expect(gb.addShip(submarine)).toBe(true);
  });
});
describe("Test 4 corners when placing vertical ships", () => {
  const gb = GameBoard(shipsTable);
});
