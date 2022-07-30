// import { PlayStatus } from "./../entities/play-status.entity";
import loopDirections from "../../scripts/loop-directions.script";
import { BoardInformation } from "../entities/board.entity";
import { Direction } from "../entities/direction.entity";
import BoardModel from "./board.model";

export default class AiModel extends BoardInformation {
    // private placeFactor(board: BoardModel, i: number, j: number): number {
    //     const boardWeight = this.getBoardWeight();

    //     const placeWeight = boardWeight[i][j];
    //     const placeValue = board.board[i][j];

    //     return placeValue * placeWeight;
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
        reward += board.findEmptyPlaces().length * 0.0625;

        // if (board.board[3][0] === board.findHighestTile()) {
        //     // console.log("Sanahilwa Yagamil")
        //     reward += 50;
        // }

        //* second factor
        const factor2 =
            Math.max(...loopDirections((_, d) => board.findMergesCount(d))) *
            0.250;

        reward += factor2;

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

    counter = 0;

    recursive(
        board: BoardModel,
        depthLimit: number,
        ignoredSituations: number
    ) {
        if (depthLimit === 0) return this.getBoardReward(board);

        const directions = board.findAvailableDirections();

        let avgDirection = 0;

    for (var edi = 0; edi < directions.length; edi++) {
        const emulateDirection = directions[edi];

        const boardCopy = board.copy();
        boardCopy.agentAction(emulateDirection);

        const boardCopy_emptyPlaces = boardCopy.findEmptyPlaces();

        for (
            var i = 0;
            i <
            Math.floor(boardCopy_emptyPlaces.length * ignoredSituations);
            i++
        ) {
            boardCopy_emptyPlaces.splice(
                Math.floor(Math.random() * boardCopy_emptyPlaces.length),
                1
            );
        }

        //* epi = empty place index
        for (var epi = 0; epi < boardCopy_emptyPlaces.length; epi++) {
            const boardCopy4A = boardCopy.copy();
            boardCopy4A.setTile(...boardCopy_emptyPlaces[epi], 2);

            const boardCopy4B = boardCopy.copy();
            boardCopy4B.setTile(...boardCopy_emptyPlaces[epi], 4);

            const a: number =
                this.recursive(
                    boardCopy4A,
                    depthLimit - 1,
                    ignoredSituations
                ) || 0;

            const b: number =
                this.recursive(
                    boardCopy4B,
                    depthLimit - 1,
                    ignoredSituations
                ) || 0;

            this.counter++;

            avgDirection += (a + b) / 2;
        }
    }

        return avgDirection;
    }

    // recursive(board: BoardModel, depthLimit: number): number {
    //     if (depthLimit === 0) {
    //         return this.getBoardReward(board);
    //     }

    //     let loopUntil = 3;
    //     let result = 0;

    //     for (var i = 0; i < loopUntil; i++) {
    //         const boardCopy = board.copy();
    //         const availableDirections = board.findAvailableDirections();

    //         boardCopy.agentAction(
    //             availableDirections[
    //                 Math.floor(Math.random() * availableDirections.length)
    //             ]
    //         );

    //         const status = boardCopy.opponentAction();

    //         if (status === PlayStatus.Loss) {
    //             result -= 1;

    //             if (loopUntil < 9) {
    //                 loopUntil += 4;
    //             } else {
    //                 return 0;
    //             }
    //         }

    //         const newReward = this.recursive(boardCopy, depthLimit - 1);

    //         if(result < newReward) result = newReward;
    //     }

    //     return result;
    // }

    suggest(board: BoardModel) {
        this.counter = 0;
        // [number, number] = [Direction, reward];
        let bestDirection: [Direction | undefined, number] = [undefined, -1];
        const directions = board.findAvailableDirections();

        //* ndi = node direction index
        for (var ndi = 0; ndi < directions.length; ndi++) {
            const nodeDirection = directions[ndi];

            const boardCopy = board.copy();
            boardCopy.agentAction(nodeDirection);
            boardCopy.opponentAction();

            let a: number = 3;
            //     b: number = 0.9;

            // if (boardCopy.findEmptyPlaces().length < 4) {
            //     a = 4;
            //     // b = 0.80;
            // }

            let directionReward: number = this.recursive(boardCopy, a, 0);

            if (bestDirection[1] < directionReward) {
                bestDirection = [nodeDirection, directionReward];
            }
        }

        console.log("iterations made: ", this.counter);
        console.log("best direction: ", directions[bestDirection[0] || 0]);
        console.log("reward for direction: ", bestDirection[1]);

        return bestDirection[0];
    }
}
