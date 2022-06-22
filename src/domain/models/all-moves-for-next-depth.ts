import enumValues from "../../scripts/enum-values.script";
import { Direction } from "../entities/direction.entity";
import BoardModel from "./board.model";

//* from 0 to 1 ( percents / 100 )
const emptyPlacesToIgnore = 0.90

function getAllMovesForNextDepth(board: BoardModel) {
    const boardCopy = board.copy();
    const directions = enumValues(Direction);
    const result: BoardModel[] = [];

    for (var i = 0; i < directions.length; i++) {
        const boardCopy2 = boardCopy.copy();
        boardCopy2.agentAction(directions[i]);

        for (var j = 0; j < directions.length; j++) {
            const boardCopy3 = boardCopy2.copy();
            boardCopy3.agentAction(directions[j]);

            const emptyPlaces = boardCopy3.findEmptyPlaces();

            const emptyPlacesToRemove = Math.floor(emptyPlaces.length * emptyPlacesToIgnore);

            for (var j2 = 0; j2 < emptyPlacesToRemove; j2++) {
                emptyPlaces.splice(
                    Math.floor(Math.random() * emptyPlaces.length),
                    1
                );
            }

            for(var j3 = 0; j3 < emptyPlaces.length; j3++ ) {
                const boardCopy4A = boardCopy3.copy();
                boardCopy4A.setTile(...emptyPlaces[j3], 2);

                result.push(boardCopy4A);

                const boardCopy4B = boardCopy3.copy();
                boardCopy4B.setTile(...emptyPlaces[j3], 4);

                result.push(boardCopy4B);
            }
        }
    }

    return result;
}

function getExampleBoard(): BoardModel {
    const board = new BoardModel();

    board.opponentAction();
    board.opponentAction();

    return board;
}

let result: BoardModel[] = [getExampleBoard()];

console.log("STARTED");
console.time("running...");

for (var depth = 0; depth < 3; depth++) {
    const result2: BoardModel[] = [];

    for(var i = 0; i < result.length; i++ ) {
        result.push(...getAllMovesForNextDepth(result[i]))
    }

    result = result2;
}

console.log(result.length);

console.timeEnd("running...")
