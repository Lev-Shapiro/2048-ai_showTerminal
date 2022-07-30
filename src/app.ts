
import BoardModel from "./domain/models/board.model";
import AiModel from "./domain/models/ai.model";
import BeautifyService from "./domain/services/beautify.service";
import chalk = require("chalk");
// import { Direction } from "./domain/entities/direction.entity";

const ai = new AiModel();
const beautify = new BeautifyService();

/*
 * agent - 2048 bot
 * opponent - algorithm which adds random tile every move
 */

console.log(chalk.blue("game: 2048"));
console.log(chalk.blue("board: 4 x 4"));
console.log(chalk.blue("=============="));

const board = new BoardModel();

board.opponentAction();
board.opponentAction()

// board.agentAction(Direction.Down)

// console.log(chalk.yellow(beautify.stringifyBoard(board)));

board.opponentAction();
board.opponentAction();

let losed = false;

while (!losed) {
    console.time("AI suggests");
    const direction = ai.suggest(board);
    console.timeEnd("AI suggests");

    if (typeof direction != "number") {
        losed = true;
        console.log(chalk.red("Game ended"));

        continue;
    }

    board.agentAction(direction);
    board.opponentAction();

    // console.log(
    //     chalk.magenta("available directions: "),
    //     chalk.cyan(board.findAvailableDirections())
    // );
    // console.log(chalk.magenta("selected direction: ") + chalk.cyan(direction));
    console.log(chalk.yellow(beautify.stringifyBoard(board)));
}
