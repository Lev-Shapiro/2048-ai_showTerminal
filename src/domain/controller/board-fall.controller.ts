import { Direction } from '../entities/direction.entity';
import { Board, BoardInformation } from "../entities/board.entity";
import BoardModel from '../models/board.model';

export default class BoardFallController extends BoardInformation {
    constructor(private board: Board) {
        super()
    }

    down() {
        for (let j = 0; j < this.BOARD_SIZE; j++) {
            let x = this.BOARD_SIZE - 1;
            for (let i = this.BOARD_SIZE - 1; i >= 0; i--) {
                if (this.board[i][j] != this.EMPTY) {
                    this.board[x][j] = this.board[i][j];
                    if (x != i) {
                        this.board[i][j] = this.EMPTY;
                    }
                    x--;
                }
            }
        }
    }

    up() {
        for (let j = 0; j < this.BOARD_SIZE; j++) {
            let x = 0;
            for (let i = 0; i < this.BOARD_SIZE; i++) {
                if (this.board[i][j] != this.EMPTY) {
                    this.board[x][j] = this.board[i][j];
                    if (x != i) {
                        this.board[i][j] = this.EMPTY;
                    }
                    x++;
                }
            }
        }
    }

    left() {
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            let x = 0;
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                if (this.board[i][j] != this.EMPTY) {
                    this.board[i][x] = this.board[i][j];
                    if (x != j) {
                        this.board[i][j] = this.EMPTY;
                    }
                    x++;
                }
            }
        }
    }

    right() {
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            let x = this.BOARD_SIZE - 1;
            for (let j = this.BOARD_SIZE - 1; j >= 0; j--) {
                if (this.board[i][j] != this.EMPTY) {
                    this.board[i][x] = this.board[i][j];
                    if (x != j) {
                        this.board[i][j] = this.EMPTY;
                    }
                    x--;
                }
            }
        }
    }
}