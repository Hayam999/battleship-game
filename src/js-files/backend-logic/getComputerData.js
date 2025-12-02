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
  const validIndicies = createArrayOfIndicies();
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
export { getComputerData };
