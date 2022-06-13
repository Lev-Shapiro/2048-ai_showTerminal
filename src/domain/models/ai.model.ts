import loopDirections from "../../scripts/loop-directions.script";
import { Direction } from "../entities/direction.entity";
import { BoardInformation } from "./../entities/board.entity";
import BoardModel from "./board.model";
import GameModel from "./game.model";

export default class AiModel extends BoardInformation {
    private depth: number = 0; //* current depth of search tree

    private placeFactor(board: BoardModel, i: number, j: number): number {
        const boardWeight = this.getBoardWeight();

        const placeWeight = boardWeight[i][j];
        const placeValue = board.board[i][j];

        return placeValue * placeWeight;
    }

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
        // const factor2 = board.findMergesCount() * 0.0375;

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

        return reward;
    }

    compareBetweenBoards(...boards: BoardModel[]) {
        interface BoardDataFactor {
            board?: BoardModel;
            index: number;
            reward: number;
        }

        let boardData: BoardDataFactor = {
            index: -1,
            reward: -1,
        };

        for (let i = 0; i < boards.length; i++) {
            const board = boards[i];
            const boardReward = this.getBoardReward(board);

            if (boardReward > boardData.reward) {
                boardData = {
                    board,
                    index: i,
                    reward: this.getBoardReward(board),
                };
            }
        }

        if (!boardData.board) {
            console.log("board not found");
        }

        return boardData;
    }

    suggest(game: GameModel) {
        const boardsAtDepth: BoardModel[] = [];
        const directionsAtDepth: Direction[] = [];

        loopDirections((direction) => {
            for (let i = 0; i < 1; i++) {
                var gameCopy = game.copy();

                gameCopy.action(Direction[direction]);

                boardsAtDepth.push(gameCopy.board);
                directionsAtDepth.push(Direction[direction]);
            }
        });

        return directionsAtDepth[
            this.compareBetweenBoards(...boardsAtDepth).index
        ];
    }
}
