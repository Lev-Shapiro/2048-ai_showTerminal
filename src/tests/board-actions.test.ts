import { Direction } from "../domain/entities/direction.entity";
import AgentModel from "../domain/models/agent.model";
import BoardModel from "../domain/models/board.model";
import { Tile } from "./../domain/entities/tile.entity";
import BoardTestHelpersService from "./board-test-helpers.service";

interface IProps {
    direction: keyof typeof Direction;
    tiles: Tile[];
    answer: Tile;
}

function createTest({ direction, tiles, answer }: IProps) {
    const board = new BoardModel();
    const agentModel = new AgentModel();

    board.setTiles(tiles);

    agentModel.action(board, Direction[direction]);

    expect(board.board[answer[0]][answer[1]]).toEqual(answer[2]);
}

describe("pressing on arrow key", () => {
    const boardTests = new BoardTestHelpersService();

    boardTests.loopDirections((direction) => {
        it(`press on ${direction} key`, () => {
            boardTests.loopBoardTemplates((templateName, tiles) => {
                const templateResult =
                    boardTests.boardTemplatesMoveResults[templateName][direction];

                if (Array.isArray(templateResult[0])) {
                    (templateResult as Tile[]).forEach((answer) =>
                        createTest({ direction, tiles, answer })
                    );
                } else {
                    createTest({
                        direction,
                        tiles,
                        answer: templateResult as Tile,
                    });
                }
            });
        });
    });
});
