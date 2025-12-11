import {
  createGameBoard as CreateRawGameBoard,
  shipsDic,
  createArrayOfIndicies,
} from "./data.js";
import { getComputerGameBoard } from "../ui-logic/place-ships.js";

function getComputerData() {
  const emptyGameBoard = CreateRawGameBoard();
  const filledGameBoard = fillGb(emptyGameBoard);
  const gameBoardDiv = getComputerGameBoard();

  return { rawData: filledGameBoard, uiData: gameBoardDiv };
}

function fillGb(gb) {
  const initValidIndices = createArrayOfIndicies();
  let validIndices = [...initValidIndices];

  for (let i = 0; i < shipsDic.length; i++) {
    const shipName = shipsDic[i].name;
    const ship = gb.ships[shipName];
    const decideShipDir = Math.random() * 2;

    if (decideShipDir >= 1) {
      ship.dir = "v";
    } else {
      ship.dir = "h";
    }

    const shipArray = pickRandomValidShip(validIndices, ship.length, ship.dir);

    if (!shipArray) {
      console.error(`Failed to find valid position for ${shipName}`);
      throw new Error(`Cannot place ${shipName}`);
    }
    ship.updateLocation(shipArray[0]);
    validIndices = removeForbiddenArea(
      validIndices,
      shipArray,
      ship.length,
      ship.dir,
    );
    gb.addComputerShip(ship);
  }

  return gb;
}

//----------------------------------------------------------
function pickRandomValidShip(validIndices, shipLength, shipDirection) {
  const max = validIndices.length;

  const pickIndexOnSameHorizontalLine = () => {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      attempts++;
      const randomIndex = Math.floor(Math.random() * max);
      const shipIndex = validIndices[randomIndex];

      if (!shipIndex) continue;

      // Check if ship would wrap to next row
      const startRow = Math.floor(shipIndex / 11);
      const endRow = Math.floor((shipIndex + (shipLength - 1)) / 11);
      if (startRow !== endRow) continue;

      // Build ship array and verify all cells are valid
      const shipArray = [shipIndex];
      let allValid = true;

      for (let i = 1; i < shipLength; i++) {
        const nextIndex = shipIndex + i;
        if (!validIndices.includes(nextIndex)) {
          allValid = false;
          break;
        }
        shipArray.push(nextIndex);
      }

      if (allValid) {
        return shipArray;
      }
    }

    return null;
  };

  const pickIndexOnSameVerticalLine = () => {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      attempts++;
      const randomIndex = Math.floor(Math.random() * max);
      const shipIndex = validIndices[randomIndex];

      if (!shipIndex) continue;

      // Check if ship would go past bottom
      const lastIndex = shipIndex + (shipLength - 1) * 11;
      if (lastIndex > 120) continue;

      // Build ship array and verify all cells are valid
      const shipArray = [shipIndex];
      let allValid = true;

      for (let i = 1; i < shipLength; i++) {
        const nextIndex = shipIndex + i * 11;
        if (!validIndices.includes(nextIndex)) {
          allValid = false;
          break;
        }
        shipArray.push(nextIndex);
      }

      if (allValid) {
        return shipArray;
      }
    }

    return null;
  };

  if (shipDirection === "v") {
    return pickIndexOnSameVerticalLine();
  } else if (shipDirection === "h") {
    return pickIndexOnSameHorizontalLine();
  } else {
    throw new Error("Invalid ship direction");
  }
}

//----------------------------------------------------------
function removeForbiddenArea(
  validIndices,
  shipArray,
  shipLength,
  shipDirection,
) {
  const addForbiddenAreaAroundVerticalShip = (forbiddenValues, shipArray) => {
    const oneCellUp = shipArray[0] - 11;
    const oneCellDown = shipArray[shipLength - 1] + 11;
    forbiddenValues.push(oneCellUp, oneCellDown);

    for (let i = 0; i < shipLength; i++) {
      const oneCellRight = shipArray[i] + 1;
      const oneCellLeft = shipArray[i] - 1;
      forbiddenValues.push(oneCellRight, oneCellLeft);
    }

    return forbiddenValues;
  };

  const addForbiddenAreaAroundHorizontalShip = (forbiddenValues, shipArray) => {
    const firstShipCell = shipArray[0];
    const oneCellRight = shipArray[shipLength - 1] + 1;
    const oneCellLeft = firstShipCell - 1;
    forbiddenValues.push(oneCellRight, oneCellLeft);

    let firstCellUp = firstShipCell - 11;
    let firstCellDown = firstShipCell + 11;

    for (let i = 0; i < shipLength; i++) {
      forbiddenValues.push(firstCellUp, firstCellDown);
      firstCellUp++;
      firstCellDown++;
    }

    return forbiddenValues;
  };

  const removeIndices = (forbiddenValues) => {
    return validIndices.filter((index) => !forbiddenValues.includes(index));
  };

  let forbiddenValues = [...shipArray];

  if (shipDirection === "v") {
    forbiddenValues = addForbiddenAreaAroundVerticalShip(
      forbiddenValues,
      shipArray,
    );
  } else if (shipDirection === "h") {
    forbiddenValues = addForbiddenAreaAroundHorizontalShip(
      forbiddenValues,
      shipArray,
    );
  } else {
    throw new Error("Invalid ship direction");
  }

  return removeIndices(forbiddenValues);
}

export { getComputerData };
