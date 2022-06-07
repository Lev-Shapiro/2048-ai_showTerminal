import { Direction } from "../domain/entities/direction.entity";
import createBoardTest from "../scripts/create-board-test.script";
import fillBoardWith4 from "../scripts/fill-board-with-4.script";
import { Tile } from "./../domain/entities/tile.entity";

interface IPressCheck {
    tiles: Tile[];
    checkCorrectResults: {
        [key in keyof typeof Direction]?: Tile | Tile[];
    };
}

describe("pressing on arrow key", () => {
    const pressChecks: IPressCheck[] = [
        //* move two numbers
        {
            tiles: [
                [0, 0, 4],
                [2, 0, 4],
            ],
            checkCorrectResults: {
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
        },
        //* move two numbers at different coords
        {
            tiles: [
                [2, 3, 2],
                [3, 3, 2],
            ],
            checkCorrectResults: {
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
        },
        /* 
            * fill all the board with number 4
            * move in all directions all numbers
        */
        {
            tiles: fillBoardWith4(),
            checkCorrectResults: {
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
        }
    ];

    pressChecks.forEach(({ tiles, checkCorrectResults }) => {
        Object.entries(checkCorrectResults).forEach(([arrowX, answerX]) => {
            const arrow = arrowX as unknown as keyof typeof Direction;
            const direction = Direction[arrow];

            it(`press on ${arrow} key`, () => {
                if (Array.isArray(answerX[0])) {
                    const answers = answerX as Tile[];
                    answers.forEach((answer) =>
                        expect(
                            createBoardTest({ direction, tiles, answer })
                        ).toEqual(answer[2])
                    );
                } else {
                    const answer = answerX as Tile;
                    expect(
                        createBoardTest({ direction, tiles, answer })
                    ).toEqual(answer[2]);
                }
            });
        });
    });
});
