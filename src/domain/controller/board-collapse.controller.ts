import { Board, BoardInformation } from "../entities/board.entity";

export default class BoardCollapseController extends BoardInformation {
    constructor(private board: Board) {
        super()
    }

    down() {
        for (let i = this.BOARD_SIZE - 1; i > 0; i--) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                const prev = i - 1;
                if (this.board[prev][j] == this.board[i][j]) {
                    this.board[i][j] *= 2;
                    this.board[prev][j] = this.EMPTY;
                }
            }
        }
    }

    up() {
        for (let i = 1; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                const prev = i - 1;
                if (this.board[prev][j] == this.board[i][j]) {
                    this.board[i][j] *= 2;
                    this.board[prev][j] = this.EMPTY;
                }
            }
        }
    }
    
    left() {
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE - 1; j++) {
                const prev = j + 1;
                if (this.board[i][prev] == this.board[i][j]) {
                    this.board[i][j] *= 2;
                    this.board[i][prev] = this.EMPTY;
                }
            }
        }
    }

    right() {
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = this.BOARD_SIZE - 1; j > 0; j--) {
                const prev = j - 1;
                if (this.board[i][prev] == this.board[i][j]) {
                    this.board[i][j] *= 2;
                    this.board[i][prev] = this.EMPTY;
                }
            }
        }
    }
}