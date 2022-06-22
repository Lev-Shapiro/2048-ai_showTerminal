// import loopDirections from "../../scripts/loop-directions.script";
import { BoardInformation } from "../entities/board.entity";
import { Direction, DirectionNames } from "../entities/direction.entity";
import BoardModel from "./board.model";

type BoardDepthResults = {
    [key in DirectionNames]: number;
};

export default class AiModel extends BoardInformation {
    // private placeFactor(board: BoardModel, i: number, j: number): number {
    //     // const boardWeight = this.getBoardWeight();

    //     // const placeWeight = boardWeight[i][j];
    //     const placeValue = board.board[i][j];

    //     return placeValue;
    // }

    // private snakeShapedMatch(board: BoardModel) {
    //     let reward = 0;

    //     for (let i = 0; i < this.BOARD_SIZE; i++) {
    //         for (let j = 0; j < this.BOARD_SIZE; j++) {
    //             const currPlaceFactor = this.placeFactor(board, i, j),
    //                 prevPlaceFactor = this.placeFactor(board, i, j - 1);

    //             if (j != 0 && currPlaceFactor > prevPlaceFactor) {
    //                 reward += 1 / Math.pow(this.BOARD_SIZE, 2);
    //             }
    //         }
    //     }

    //     return reward;
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
        // const factor2 =
        //     loopDirections((_, d) => board.findMergesCount(d)).reduce(
        //         (a, b) => a + b
        //     ) * 0.0375;

        // reward += factor2;

        //* third factor
        // for (let i = 0; i < this.BOARD_SIZE; i++) {
        //     for (let j = 0; j < this.BOARD_SIZE; j++) {
        //         const currPlaceFactor = this.placeFactor(board, i, j),
        //             prevPlaceFactor = this.placeFactor(board, i, j - 1);

        //         if (j != 0 && currPlaceFactor > prevPlaceFactor) {
        //             reward += 1 / Math.pow(this.BOARD_SIZE, 2);
        //         }
        //     }
        // }

        return 0.001 + reward;
    }

    suggest(board: BoardModel, maxDepth: number = 2): Direction {
        let counter = 0;
        let resultBoards: BoardDepthResults = {
            Left: -1,
            Right: -1,
            Down: -1,
            Up: -1,
        };

        const directions = Object.keys(resultBoards) as DirectionNames[];

        //* ndi = node direction index
        for (var ndi = 0; ndi < 4; ndi++) {
            const direction = directions[ndi],
                boardCopy = board.copy();

            boardCopy.agentAction(Direction[direction]);

            let avgForDirection = 0;
            let boardCopies: BoardModel[] = [boardCopy];

            for (var depthCount = 0; depthCount <= maxDepth; depthCount++) {
                const statesForCurrDepth: BoardModel[] = [];

                //* bci = board copy index
                for (var bci = 0; bci < boardCopies.length; bci++) {
                    const boardCopy2 = boardCopies[bci];

                    //* edi = emulated direction index
                    for (var edi = 0; edi < 4; edi++) {
                        const boardCopy3 = boardCopy2.copy();
                        boardCopy3.agentAction(Direction[directions[edi]]);

                        if (boardCopy3.isLosed()) continue;

                        const boardCopy3_emptyPlaces =
                            boardCopy3.findEmptyPlaces();

                        //* epi = empty place index
                        for (
                            var epi = 0;
                            epi < boardCopy3_emptyPlaces.length;
                            epi++
                        ) {
                            const boardCopy4A = boardCopy3.copy();
                            boardCopy4A.setTile(
                                ...boardCopy3_emptyPlaces[epi],
                                2
                            );

                            const boardCopy4B = boardCopy3.copy();
                            boardCopy4B.setTile(
                                ...boardCopy3_emptyPlaces[epi],
                                4
                            );

                            if (depthCount != maxDepth) {
                                statesForCurrDepth.push(boardCopy4A);
                                statesForCurrDepth.push(boardCopy4B);
                            } else {
                                avgForDirection +=
                                    (this.getBoardReward(boardCopy4A) +
                                        this.getBoardReward(boardCopy4B)) /
                                    2;
                            }

                            counter++;
                        }
                    }
                }

                boardCopies = statesForCurrDepth;
            }

            avgForDirection /= 2;
            //* ONLY AFTER THIS LINE YOU CAN USE avgForDirection

            resultBoards[direction] = avgForDirection;
        }

        console.log("counted: ", counter);
        console.log(resultBoards);

        const bestDirectionName = Object.entries(resultBoards).reduce(
            (prev, curr) => {
                return prev[1] > curr[1] ? prev : curr;
            }
        )[0] as unknown as DirectionNames;

        console.log("best direction name is: ", bestDirectionName);

        return Direction[bestDirectionName];
    }
}
