import BoardCollapseController from "../controller/board-collapse.controller";
import BoardFallController from "../controller/board-fall.controller";
import { Board, BoardInformation } from "../entities/board.entity";
import { Direction } from "../entities/direction.entity";
import { PlayStatus } from "../entities/play-status.entity";
import { Tile } from "../entities/tile.entity";

export default class BoardModel extends BoardInformation {
    board: Board = [];

    constructor() {
        super();

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                this.board[i].push(this.EMPTY);
            }
        }
    }

    copy(): BoardModel {
        const board = new BoardModel();

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            board.board[i] = this.board[i].map((x) => x);
        }

        return board;
    }

    checkPlayStatus(): PlayStatus | null {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] == 2048) return PlayStatus.Victory;
            }
        }
        if (this.findEmptyPlaces().length == 0) return PlayStatus.Loss;
        return null;
    }

    totalScore(): number {
        let score = 0;

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                score += this.board[i][j];
            }
        }

        return score;
    }

    findEmptyPlaces(): [number, number][] {
        let emptyPlaces = [];

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                if (this.board[i][j] === this.EMPTY) emptyPlaces.push([i, j]);
            }
        }

        return emptyPlaces;
    }

    //* returns a value from 0 to 8
    findMergesCount(direction: Direction): number {
        const board = this.copy();
        const emptyPlaces1 = board.findEmptyPlaces().length;

        this.fall(direction);
        this.collapse(direction);
        this.fall(direction);

        const emptyPlaces2 = board.findEmptyPlaces().length;

        return emptyPlaces2 - emptyPlaces1;
    }

    setTile([i, j, value]: Tile) {
        this.board[i][j] = value;
    }

    setTiles(tiles: Tile[]) {
        tiles.forEach((tile) => this.setTile(tile));
    }

    fall(direction: Direction) {
        const controller = new BoardFallController(this.board);

        switch (direction) {
            case Direction.Down:
                controller.down();
                break;
            case Direction.Up:
                controller.up();
                break;
            case Direction.Left:
                controller.left();
                break;
            case Direction.Right:
                controller.right();
                break;
        }
    }

    collapse(direction: Direction) {
        const controller = new BoardCollapseController(this.board);

        switch (direction) {
            case Direction.Down:
                controller.down();
                break;
            case Direction.Up:
                controller.up();
                break;
            case Direction.Left:
                controller.left();
                break;
            case Direction.Right:
                controller.right();
                break;
        }
    }
}
