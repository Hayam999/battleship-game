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
    /**  1) choose random number from valid indices
         2) 2.a) if Horizontal: add ship.len to index && assure value % 11 != 0
             2.b) if vertical: add ship.len * 11 to index && assure <= 120
         3) calculate forbidden area:
            3.a) if vertical: think of logic for it
            3.b) if horizontal: think of logic for it
         4) remove forbidden area from validIndicies
         5) call gb.addComputerShip(ship)
         6) repeat until done
        **/
    const shipName = shipsDic[i].name;
    const ship = gb.ships[shipName];
    gb.addComputerShip(ship);
  }
}

/*  @params:
            validIndices: Array of empty indicies on the gameboard.
            max: length of ValidIndicies Array.
            shipLength: len of the ship we pick a valid index for.
            shipDirection: direction of the same Ship.
    @returns: Integer => "random index for value in ValidIndicies. the value should suit the length and direction of the array"
 **/
function pickRandomValidIndex(validIndices, max, shipLength, shipDirection) {
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
export { getComputerData };
