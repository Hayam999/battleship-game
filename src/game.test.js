import { ship as createShip } from "./ship.js";
import { test, expect, describe } from "@jest/globals";

describe("Ship", () => {
  const ship = createShip(4, 0, false);

  const sunkShip = createShip(5, 5, true);

  describe("Test hit()", () => {
    test("hit increases hit number", () => {
      ship.hit();
      expect(ship.hitNum).toBe(1);
    });
    test("hit() keeps hitted ships as it is", () => {
      sunkShip.hit();
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
});
