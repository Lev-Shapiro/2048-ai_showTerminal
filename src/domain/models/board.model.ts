import BoardCollapseController from "../controller/board-collapse.controller";
import BoardFallController from "../controller/board-fall.controller";
import { Board, BoardInformation } from "../entities/board.entity";
import { Direction } from "../entities/direction.entity";

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

    isEnded(): boolean {
        return false;
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

    copy(): BoardModel {
        const board = new BoardModel();

        board.board = this.board;

        return board;
    }

    findEmptyPlaces(): [number, number][] {
        let emptyPlaces = [];

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                if (this.board[i][j] == this.EMPTY) emptyPlaces.push([i, j]);
            }
        }

        return emptyPlaces;
    }

    // j - axisX,
    // i - axisY

    setTile(i: number, j: number, value: number) {
        this.board[i][j] = value;
    }

    /* 
        * board random functions
        ? Possibly can be replaced to another file
    */

    randomNewTile(): number {
        const possibleValues = [2, 4];
        return possibleValues[this.randomNumber(possibleValues.length)];
    }

    randomNumber(max: number): number {
        return Math.floor(Math.random() * max);
    }

    addRandomNewTile(): void {
        const emptyPlaces = this.findEmptyPlaces();

        if (emptyPlaces.length > 0) {
            const index = this.randomNumber(emptyPlaces.length);

            this.setTile(
                emptyPlaces[index][0],
                emptyPlaces[index][1],
                this.randomNewTile()
            );
        }
    }

    /*
        * board rule functions   
        ? Possibly can be replaced to another file
    */

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

    action(direction: Direction): BoardModel {
        const board = this.copy();

        board.fall(direction);
        board.collapse(direction);
        board.fall(direction);

        board.addRandomNewTile();

        return board;
    }
}
