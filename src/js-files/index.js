import { getPlayerData } from "./getPlayerData.js";
import { getComputerData } from "./backend-logic/getComputerData.js";
import "./ui-logic/create-ui.js";
import { play } from "./play.js";
//const human = await getPlayerData();

const computer = getComputerData();

document.body.append(computer.uiData);
// TODO After getting computer data and computer data start play a round
