import { Direction } from "../domain/entities/direction.entity";
import BoardModel from "../domain/models/board.model";
import BoardTestHelpersService from "./board-test-helpers.service";

describe("calculate merges count", () => {
    const boardTests = new BoardTestHelpersService();

    boardTests.loopDirections((direction) => {
        it(`merge count for ${direction} direction`, () => {
            boardTests.loopBoardTemplates((templateName, tiles) => {
                const board = new BoardModel();

                board.setTiles(tiles);

                const mergeCount = board.findMergesCount(Direction[direction]);

                expect(Number.isInteger(mergeCount)).toEqual(true);
                expect(mergeCount).toEqual(
                    boardTests.boardTemplatesMergesCount[templateName][
                        direction
                    ]
                );
            });
        });
    });
});
