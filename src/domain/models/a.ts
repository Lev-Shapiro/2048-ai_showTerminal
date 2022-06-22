import loopDirections from "../../scripts/loop-directions.script";
import BoardModel from "./board.model";
import chalk = require("chalk");

const board = new BoardModel();

board.opponentAction();
board.opponentAction();

type A = BoardModel[][];

const allBoardCopies: A = [[board], [], [], [], []];

/**------------------------------------------------------------------------
 * ?                                ABOUT
 * @step1         :  loop depth => depth = 0
 * @step2         :  loop allBoardCopies[depth] => 1
 * @step3         :  loop all node directions => let nodeDirection; length = 4
 * @step4         :  loop random directions to walk => let directionToEmulate; length = 4
 * @step5         :  loop all empty places => let placeCoords; length = 14
 * @step6         :  push result board with new tiles of 2 or 4
 *------------------------------------------------------------------------**/

for (var depth = 0; depth < 1; depth++) {
    allBoardCopies[depth].forEach((board) => {
        const boardCopy = board.copy();

        loopDirections((_, nodeDirection) => {
            const boardCopy2 = boardCopy.copy();
            boardCopy2.agentAction(nodeDirection);

            loopDirections((_, directionToEmulate) => {
                const boardCopy3 = boardCopy2.copy();
                boardCopy3.agentAction(directionToEmulate);

                boardCopy3.findEmptyPlaces().forEach((placeCoords) => {
                    const boardCopy4A = boardCopy3.copy();
                    boardCopy4A.setTile(...placeCoords, 2);

                    allBoardCopies[depth + 1].push(boardCopy4A);

                    const boardCopy4B = boardCopy3.copy();
                    boardCopy4B.setTile(...placeCoords, 4);

                    allBoardCopies[depth + 1].push(boardCopy4B);
                });
            });
        });
    });
}

const x = 1; // depth

console.log(
    chalk.cyan(`board copies for depth ${x}: `),
    allBoardCopies[x].length
);
