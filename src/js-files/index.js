import { getPlayerData } from "./getPlayerData";

const human = await getPlayerData();

console.log(human.name, human.gameBoard.uiData, human.gameBoard["rawData"]);
