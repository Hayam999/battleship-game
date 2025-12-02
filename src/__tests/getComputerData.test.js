import { test, expect, describe } from "@jest/globals";
import { Ship, GameBoard, shipsDic } from "../js-files/backend-logic/data.js";

import { getComputerData } from "../js-files/backend-logic/getComputerData.js";

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
