import loopDirections from "../../scripts/loop-directions.script";
import { Direction } from "../entities/direction.entity";
import { BoardInformation } from "./../entities/board.entity";
import BoardModel from "./board.model";

export default class AiModel extends BoardInformation {
    // private depth: number = 0; //* current depth of search tree

    // private placeFactor(board: BoardModel, i: number, j: number): number {

    //     const boardWeight = this.getBoardWeight();

    //     const placeWeight = boardWeight[i][j];
    //     const placeValue = board.board[i][j];

    //     return placeValue * placeWeight;
    // }

    private getBoardReward(board: BoardModel) {
        let reward = 0;

        /*
         * factor1 - max value 0.2
         * factor2 - max value 0.3
         * factor3 - max value 0.5
         */

        //* first factor
        reward += board.findEmptyPlaces().length * 0.025;

        //* second factor
        const factor2 =
            Math.max(...loopDirections((_, d) => board.findMergesCount(d))) *
            0.0375;

        reward += factor2;

        // //* third factor
        // for (let i = 0; i < this.BOARD_SIZE; i++) {
        //     for (let j = 0; j < this.BOARD_SIZE; j++) {
        //         const currPlaceFactor = this.placeFactor(board, i, j),
        //             prevPlaceFactor = this.placeFactor(board, i, j - 1);

        //         if (j != 0 && currPlaceFactor > prevPlaceFactor) {
        //             reward += 1 / Math.pow(this.BOARD_SIZE, 2);
        //         }
        //     }
        // }

        return reward;
    }

    suggest(board: BoardModel) {
        interface BestBoard {
            direction: Direction;
            reward: number;
        }

        let bestBoard: BestBoard = {
            direction: -1,
            reward: -1,
        };

        for (var x = 0; x < 5; x++) {
            const directions = board.findAvailableDirections();

            directions.forEach((direction) => {
                for (let i = 0; i < 2; i++) {
                    var boardCopy = board.copy();

                    boardCopy.agentAction(direction);
                    boardCopy.opponentAction();

                    const boardReward = this.getBoardReward(boardCopy);

                    if (bestBoard.reward < boardReward) {
                        bestBoard = {
                            direction,
                            reward: boardReward,
                        };
                    }
                }
            });
        }

        return bestBoard.direction;
    }
}
