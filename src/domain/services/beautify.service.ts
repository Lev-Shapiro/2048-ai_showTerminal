import BoardModel from "../models/board.model"

export default class BeautifyService {
    stringifyBoard(board: BoardModel): string {
        const wrapper = "-".repeat(64)

        let r = wrapper + "\n"
        
        for (let i = 0; i < board.BOARD_SIZE; i++) {
            for (let j = 0; j < board.BOARD_SIZE; j++) { 
                r += "\t" + board.board[i][j]
            }
            r += "\n"
        }

        return r + wrapper
    }
}