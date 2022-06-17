import loopDirections from "../../scripts/loop-directions.script";
import { Direction } from "../entities/direction.entity";
import { BoardInformation } from "./../entities/board.entity";
import BoardModel from "./board.model";

interface BoardData {
    direction: Direction;
    boardModel: BoardModel;
    reward: number;
}
export default class AiModel extends BoardInformation {
    iterationsMade = 0;
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

        // //* second factor
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

        return 0.001 + reward;
    }

    bestOpponentMove(board: BoardModel, nodeDirection: Direction): BoardData {
        const boardCopy = board.copy();

        const boardUnsetDefault: BoardData = {
            boardModel: boardCopy,
            direction: -1,
            reward: -1,
        };

        return boardCopy
            .findEmptyPlaces()
            .reduce((prevLocalBest, emptyPlaceCoords) => {
                this.iterationsMade++;
                const boardCopyA = boardCopy.copy();
                boardCopyA.setTile(...emptyPlaceCoords, 2);

                const boardCopyB = boardCopy.copy();
                boardCopyB.setTile(...emptyPlaceCoords, 4);

                const boardCopyAresult: BoardData = {
                    boardModel: boardCopyA,
                    direction: nodeDirection,
                    reward: this.getBoardReward(boardCopyA),
                };

                const boardCopyBresult: BoardData = {
                    boardModel: boardCopyB,
                    direction: nodeDirection,
                    reward: this.getBoardReward(boardCopyB),
                };

                const localBest =
                    boardCopyAresult.reward > boardCopyBresult.reward
                        ? boardCopyAresult
                        : boardCopyBresult;

                return prevLocalBest.reward > localBest.reward
                    ? prevLocalBest
                    : localBest;
            }, boardUnsetDefault);
    }

    suggest(board: BoardModel): Direction {
        let boardCopies: BoardData[] = board
            .findAvailableDirections()
            .map((direction) => {
                const boardCopy = board.copy();
                boardCopy.agentAction(direction);

                return {
                    direction,
                    boardModel: boardCopy,
                    reward: -1,
                };
            });

        for (var depth = 1; depth <= 20; depth++) {
            boardCopies = boardCopies.map(({ direction: nodeDirection, boardModel }) => {
                const boardCopy2 = boardModel.copy();
                
                return boardCopy2.findAvailableDirections().reduce<BoardData>((prev, directionToEmulate)=>{
                    boardCopy2.agentAction(directionToEmulate);
    
                    const bestBoardData = this.bestOpponentMove(
                        boardCopy2,
                        nodeDirection
                    );
    
                    if (depth === 20) {
                        console.log(
                            "highest tile: ",
                            bestBoardData.boardModel.findHighestTile()
                        );
                    }
    
                    return (bestBoardData.reward > prev.reward) ? bestBoardData : prev;
                }, {
                    boardModel: boardCopy2,
                    direction: -1,
                    reward: -1
                });
            });
        }

        return boardCopies.reduce((prev, curr) =>
            curr.reward > prev.reward ? curr : prev
        ).direction;
    }
}
