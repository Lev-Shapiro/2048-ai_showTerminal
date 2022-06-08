import { Tile } from "../domain/entities/tile.entity";
import fillBoardWith4 from "../scripts/fill-board-with-4.script";
import { Direction } from "./../domain/entities/direction.entity";

export type BoardTemplateNames = "easy" | "medium" | "complex";

type BoardTemplate = {
    [key in BoardTemplateNames]: Tile[];
};

type TemplateResultData<T> = {
    [key in BoardTemplateNames]: T;
};

export default abstract class BoardTestInfoEntity {
    boardTemplates: BoardTemplate = {
        easy: [
            [0, 0, 4],
            [2, 0, 4],
        ],
        medium: [
            [2, 3, 2],
            [3, 3, 2],
        ],
        complex: fillBoardWith4(),
    };

    boardTemplatesMergesCount: TemplateResultData<{
        [key in keyof typeof Direction]: number;
    }> = {
        easy: {
            Down: 1,
            Up: 1,
            Right: 0,
            Left: 0
        },
        medium: {
            Down: 1,
            Up: 1,
            Right: 0,
            Left: 0,
        },
        complex: {
            Down: 8,
            Up: 8,
            Right: 8,
            Left: 8,
        }
    };

    boardTemplatesMoveResults: TemplateResultData<{
        [key in keyof typeof Direction]: Tile | Tile[];
    }> = {
        easy: {
            Down: [3, 0, 8],
            Up: [0, 0, 8],
            Right: [
                [0, 3, 4],
                [2, 3, 4],
            ],
            Left: [
                [0, 0, 4],
                [2, 0, 4],
            ],
        },
        medium: {
            Down: [3, 3, 4],
            Up: [0, 3, 4],
            Right: [
                [2, 3, 2],
                [3, 3, 2],
            ],
            Left: [
                [2, 0, 2],
                [3, 0, 2],
            ],
        },
        complex: {
            Down: [
                [3, 0, 8],
                [2, 0, 8],
                [3, 1, 8],
                [2, 1, 8],
                [3, 2, 8],
                [2, 2, 8],
                [3, 3, 8],
                [2, 3, 8],
            ],
            Up: [
                [0, 0, 8],
                [1, 0, 8],
                [0, 1, 8],
                [1, 1, 8],
                [0, 2, 8],
                [1, 2, 8],
                [0, 3, 8],
                [1, 3, 8],
            ],
            Right: [
                [0, 3, 8],
                [0, 2, 8],
                [1, 3, 8],
                [1, 2, 8],
                [2, 3, 8],
                [2, 2, 8],
                [3, 3, 8],
                [3, 2, 8],
            ],
            Left: [
                [0, 0, 8],
                [0, 1, 8],
                [1, 0, 8],
                [1, 1, 8],
                [2, 0, 8],
                [2, 1, 8],
                [3, 0, 8],
                [3, 1, 8],
            ],
        },
    };
}
