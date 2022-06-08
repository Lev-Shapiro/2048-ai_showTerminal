export type Board = number[][];

export abstract class BoardInformation {
    BOARD_SIZE = 4;
    EMPTY = 0;

    getBoardWeight() {
        const boardWeight: number[][] = [];

        enum Move {
            Positive = 1,
            Negative = -1
        }

        for(let i = this.BOARD_SIZE; i > 0; i-- ) {
            const line: number[] = [];
            const currMove = (i % 2 === 0) ? Move.Negative : Move.Positive;

            for(let j = 0; j < this.BOARD_SIZE ; j++ ) {
                const weight = 
                    (i * this.BOARD_SIZE) + //* row * this.BOARD_SIZE
                    ((currMove === Move.Negative) ? -1 : -this.BOARD_SIZE) + //* get start of line 
                    (currMove * j); //* move j times in positive/negative direction

                line.push(Math.pow(this.BOARD_SIZE, weight))
            }

            boardWeight.push(line);
        }

        return boardWeight
    }
}