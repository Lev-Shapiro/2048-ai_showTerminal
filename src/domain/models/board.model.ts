import BoardCollapseController from "../controller/board-collapse.controller";
import BoardFallController from "../controller/board-fall.controller";
import { Board, BoardInformation } from "../entities/board.entity";
import { Direction } from "../entities/direction.entity";
import { Tile } from "../entities/tile.entity";
import AgentModel from "./agent.model";
import OpponentModel from "./opponent.model";

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

        board.board = this.board;

        return board;
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

    findEmptyPlaces(): [number, number][] {
        let emptyPlaces = [];

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                if (this.board[i][j] === this.EMPTY) emptyPlaces.push([i, j]);
            }
        }

        return emptyPlaces;
    }

    //? returns a value from 0 to 8
    findMergesCount(direction: Direction): number {
        const board = this.copy();
        const emptyPlaces1 = board.findEmptyPlaces().length;
        board.move(direction);
        const emptyPlaces2 = board.findEmptyPlaces().length;
        
        return emptyPlaces2 - emptyPlaces1;
    }

    setTile([i, j, value]: Tile) {
        this.board[i][j] = value;
    }

    setTiles(tiles: Tile[]) {
        tiles.forEach((tile) => this.setTile(tile))
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

    move(direction: Direction) {
        this.fall(direction);
        this.collapse(direction);
        this.fall(direction);
    }
}
