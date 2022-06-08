import { Board, BoardInformation } from './../entities/board.entity';

export default class AiModel extends BoardInformation {
    private depth: number = 0; //* current depth of search tree

    eval(board: Board) {
        const boardWeight = this.getBoardWeight();

        for(let i = 0; i < 3; i++ ) {
            for(let j = 0; j < 3; j++ ) {
                const placeWeight = boardWeight[i][j];
                const placeValue = board[i][j];
            }
        }
    }
    
    suggestDirection() {
        
    }
}