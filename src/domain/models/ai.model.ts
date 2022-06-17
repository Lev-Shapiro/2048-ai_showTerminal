import loopDirections from "../../scripts/loop-directions.script";
import { Direction } from "../entities/direction.entity";
import { BoardInformation } from "./../entities/board.entity";
import BoardModel from "./board.model";

interface BoardData {
    direction: Direction;
    boardModel: BoardModel;
    reward: number;
}

interface BoardBest {
    boardModel: BoardModel | null;
    reward: number;
}
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
        // reward += board.findEmptyPlaces().length * 0.025;
        reward += board.findEmptyPlaces().length;

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

    // private compareBoards(...boards: BoardBest[]) {
    //     return boards.reduce((prev, curr) =>
    //         curr.reward > prev.reward ? curr : prev
    //     );
    // }

    suggest(board: BoardModel) {
        const availableDirections = board.findAvailableDirections();

        let boardCopiesOfEachDirection: (BoardData | null)[] = Array.from(
            { length: availableDirections.length },
            (_, i) => {
                const _boardCopy = board.copy();
                _boardCopy.agentAction(availableDirections[i]);
                return {
                    direction: availableDirections[i],
                    boardModel: _boardCopy,
                    reward: this.getBoardReward(_boardCopy),
                };
            }
        );

        for (var depth = 1; depth <= 5; depth++) {
            boardCopiesOfEachDirection =
                boardCopiesOfEachDirection.map<BoardData | null>(
                    (boardCopyData) => {
                        if (!boardCopyData) {
                            console.log("ERROR HAPPENED");
                            return null;
                        }

                        const bestBoardAtDepthXForDirectionY =
                            boardCopyData.boardModel
                                .findAvailableDirections()
                                .reduce<BoardBest | null>(
                                    (
                                        prevBoardAtDepthXForDirectionY,
                                        directionToEmulate
                                    ) => {
                                        const boardCopyCopy =
                                            boardCopyData.boardModel.copy();
                                        boardCopyCopy.agentAction(
                                            directionToEmulate
                                        );

                                        const emptyPlaces =
                                            boardCopyCopy.findEmptyPlaces();

                                        const bestBoardSituation =
                                            emptyPlaces.reduce<BoardBest>(
                                                (
                                                    prevBestEmptyPlaceToFill,
                                                    coords
                                                ) => {
                                                    // [boardModel | null , number] = [boardModel | null, reward]
                                                    const bestTileValue = [
                                                        2, 4,
                                                    ].reduce<BoardBest>(
                                                        (
                                                            prevBestTileValue,
                                                            newTileValue
                                                        ) => {
                                                            const boardCopyCopyCopy =
                                                                boardCopyCopy.copy();
                                                            boardCopyCopyCopy.setTile(
                                                                ...coords,
                                                                newTileValue
                                                            );

                                                            const boardCopyCopyCopyReward =
                                                                this.getBoardReward(
                                                                    boardCopyCopyCopy
                                                                );

                                                            return prevBestTileValue.reward <
                                                                boardCopyCopyCopyReward
                                                                ? {
                                                                      boardModel:
                                                                          boardCopyCopyCopy,
                                                                      reward: boardCopyCopyCopyReward,
                                                                  }
                                                                : prevBestTileValue;
                                                        },
                                                        {
                                                            boardModel: null,
                                                            reward: -1,
                                                        }
                                                    );

                                                    return prevBestEmptyPlaceToFill.reward <
                                                        bestTileValue.reward
                                                        ? bestTileValue
                                                        : prevBestEmptyPlaceToFill;
                                                },
                                                {
                                                    boardModel: null,
                                                    reward: -1,
                                                }
                                            );

                                        return prevBoardAtDepthXForDirectionY &&
                                            prevBoardAtDepthXForDirectionY.reward <
                                                bestBoardSituation.reward
                                            ? bestBoardSituation
                                            : prevBoardAtDepthXForDirectionY;
                                    },
                                    null
                                );

                        if (
                            bestBoardAtDepthXForDirectionY && 
                            bestBoardAtDepthXForDirectionY.boardModel &&
                            boardCopyData?.direction &&
                            bestBoardAtDepthXForDirectionY.reward
                        ) {
                            return {
                                boardModel:
                                    bestBoardAtDepthXForDirectionY.boardModel,
                                direction: boardCopyData.direction,
                                reward: bestBoardAtDepthXForDirectionY.reward,
                            };
                        } else {
                            return null;
                        }
                    }
                );
        }

        return boardCopiesOfEachDirection.reduce((prev, curr) =>
            prev && curr && prev.reward < curr.reward ? curr : prev
        )?.direction;
    }

    // compareBetweenBoardData(...boardsData: [Direction, BoardModel][]) {
    //     for(var i = 0; i < boards.length; i++ ) {
    //         const boardData = boardsData[i]
    //     }
    // }

    // suggest(board: BoardModel) {
    //     let counter = 0;
    //     const availableDirections = board.findAvailableDirections();

    //     const boardCopies: [Direction, BoardModel][] = Array.from(
    //         { length: availableDirections.length },
    //         (_, i) => {
    //             const _boardCopy = board.copy();
    //             _boardCopy.agentAction(availableDirections[i]);
    //             return [availableDirections[i], _boardCopy];
    //         }
    //     );

    //     for (var depth = 1; depth <= 5; depth++) {
    //         for (var i = 0; i < boardCopies.length; i++) {
    //             //TODO: ADD DIRECTIONS, SO IT WON'T LOOP ONLY IN ONE DIRECTION EVERY TIME
    //             let [firstDirection, boardCopy] = boardCopies[i];
    //             boardCopy = boardCopy.copy();

    //             loopDirections((_, directionToEmulate) => {
    //                 boardCopy.agentAction(directionToEmulate);

    //                 const emptyPlaces = boardCopy.findEmptyPlaces();

    //                 /**========================================================================
    //                  **                           VARIABLE
    //                  *@tileCoords   [0] [number, number]
    //                  *@tileValue    [1] number ( 2 or 4 )
    //                  *@BoardReward  [2] number
    //                  *========================================================================**/
    //                 let bestEmptyPlace: [[number, number], 2 | 4, number] | undefined;

    //                 for (var j = 0; j < emptyPlaces.length; j++) {
    //                     const boardCopyCopy1 = boardCopy.copy(),
    //                         boardCopyCopy2 = boardCopy.copy();

    //                     boardCopyCopy1.setTile(...emptyPlaces[j], 2);
    //                     boardCopyCopy2.setTile(...emptyPlaces[j], 4);

    //                     const boardCopyCopyResult1: [
    //                         [number, number],
    //                         2 | 4,
    //                         number
    //                     ] = [
    //                         emptyPlaces[j],
    //                         2,
    //                         this.getBoardReward(boardCopyCopy1),
    //                     ];

    //                     const boardCopyCopyResult2: [
    //                         [number, number],
    //                         2 | 4,
    //                         number
    //                     ] = [
    //                         emptyPlaces[j],
    //                         4,
    //                         this.getBoardReward(boardCopyCopy2),
    //                     ];

    //                     const boardCopyCopyBestEmptyPlace =
    //                         boardCopyCopyResult1[2] > boardCopyCopyResult2[2]
    //                             ? boardCopyCopyResult1
    //                             : boardCopyCopyResult2;

    //                     if (!bestEmptyPlace || (bestEmptyPlace && boardCopyCopyBestEmptyPlace[2] > bestEmptyPlace[2])) {
    //                         bestEmptyPlace = [...boardCopyCopyBestEmptyPlace];
    //                     }

    //                     if (bestEmptyPlace) {
    //                         boardCopy.setTile(...bestEmptyPlace[0], bestEmptyPlace[1]);
    //                         boardCopies[i] = [firstDirection, boardCopy];
    //                         continue;
    //                     }

    //                     console.log("best equals to undefined");
    //                 }
    //             });
    //         }
    //     }

    //     let highestScoredBoard: [Direction, BoardModel, number] | undefined;

    //     for (var i = 0; i < boardCopies.length; i++) {
    //         const boardCopyCurrent = boardCopies[i],
    //             boardCopyCurrentReward = this.getBoardReward(
    //                 boardCopyCurrent[1]
    //             );

    //         if (
    //             !highestScoredBoard ||
    //             highestScoredBoard[2] < boardCopyCurrentReward
    //         ) {
    //             highestScoredBoard = [
    //                 ...boardCopyCurrent,
    //                 boardCopyCurrentReward,
    //             ];
    //         }
    //     }

    //     if (!highestScoredBoard) return -1;

    //     console.log(counter);
    //     return highestScoredBoard[0];
    // }
}
