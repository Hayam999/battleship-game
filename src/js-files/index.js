import { getPlayerData } from "./getPlayerData.js";
import { getComputerData } from "./backend-logic/getComputerData.js";
import "./ui-logic/create-ui.js";
import { play } from "./play.js";

const human = await getPlayerData();
let computer = getComputerData();

play(human, computer);
