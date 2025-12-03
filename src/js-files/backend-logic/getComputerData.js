import {
  createGameBoard as CreateRawGameBoard,
  shipsDic,
  createArrayOfIndicies,
} from "./data.js";

function getComputerData() {
  const emptyGameBoard = CreateRawGameBoard();
  const filledGameBoard = fillGb(emptyGameBoard);
  //   console.log(`Hello from computers Data ${filledGameBoard.ships}`);
}

function fillGb(gb) {
  const validIndices = createArrayOfIndicies();
  for (let i = 0; i < shipsDic.length; i++) {
    const shipName = shipsDic[i].name;
    const ship = gb.ships[shipName];
    const index = pickRandomValidIndex(validIndices, ship.length, ship.dir);
    ship.updateLocation(index);
    removeForbiddenArea(validIndices, index, ship.length, ship.dir);
    gb.addComputerShip(ship);
  }
}
//----------------------------------------------------------
/*  @params:
            validIndices: Array of empty indicies on the gameboard.
            shipLength: len of the ship we pick a valid index for.
            shipDirection: direction of the same Ship.
    @returns: Integer => "random index for value in ValidIndicies. the value should suit the length and direction of the array"
 **/
function pickRandomValidIndex(validIndices, shipLength, shipDirection) {
  const max = validIndices.length;
  const pickIndexOnSameHorizontalLine = () => {
    let keepTrying = true;
    let result;
    while (keepTrying) {
      const randomIndex = Math.floor(Math.random() * max);
      const shipIndex = validIndices[randomIndex];
      let currentShipIndex = shipIndex;
      for (let i = 0; i < shipLength; i++) {
        currentShipIndex++;
        if (currentShipIndex % 11 == 0) {
          break;
        } else if (i == shipLength - 1) {
          result = shipIndex;
          keepTrying = false;
        }
      }
    }
    return result;
  };

  const pickIndexOnSameVerticaLine = () => {
    let keepTrying = true;
    let result;
    while (keepTrying) {
      const randomIndex = Math.floor(Math.random() * max);
      const shipIndex = validIndices[randomIndex];
      const lastIndex = shipIndex + shipLength * 11;
      if (lastIndex <= 120) {
        result = shipIndex;
        keepTrying = false;
      }
    }
    return result;
  };

  if (shipDirection == "v") {
    const validIndex = pickIndexOnSameVerticaLine();
    return validIndex;
  } else if (shipDirection == "h") {
    const validIndex = pickIndexOnSameHorizontalLine();
    return validIndex;
  } else {
    throw new Error("Invalid ship direction");
  }
}

//----------------------------------------------------------

/*  @params:
            validIndices: Array of empty indicies on the gameboard.
            shipLength: the length of the ship for it we remove forbiddenArea from validIndices.
            shipDirection: direction of the same Ship.
    @purpose: remove the occupied area by the ship and around it from validIndices so that future ships won't have the option to occupy it.
    @Side Effects: change given validIndices by removing some values.
 **/
function removeForbiddenArea(
  validIndices,
  shipIndex,
  shipLength,
  shipDirection,
) {
  if (shipDirection == "v") {
    const shipArray = [shipIndex];
    for (let i = 1; i < shipLength; i++) {
      const newIndex = shipIndex + 11 * i;
      shipArray.push(newIndex);
    }
    for (let i = 0; i < shipLength; i++) {
      const toRemove = validIndices.indexOf(shipArray[i]);
      validIndices.splice(toRemove, 1);
    }
  } else if (shipDirection == "h") {
    const i = validIndices.indexOf(shipIndex);
    validIndices.splice(i, shipLength);
  } else {
    throw new Error("Invalid ship direction");
  }
}

export { getComputerData };
