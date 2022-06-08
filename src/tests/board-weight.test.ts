import BoardModel from "../domain/models/board.model";

describe("find board weight", () => {
    const board = new BoardModel();
    const boardWeight = board.getBoardWeight();
    
    //* bms - board max size
    const bms = board.BOARD_SIZE;
    //* bmsi - board max size index
    const bmsi = bms - 1;

    it("bottom checks: ", () => {
        expect(boardWeight[0][0]).toEqual(Math.pow(bms, 15));
        expect(boardWeight[bmsi][0]).toEqual(Math.pow(bms, 0));
        expect(boardWeight[0][bmsi]).toEqual(Math.pow(bms, 12));
        expect(boardWeight[bmsi][bmsi]).toEqual(Math.pow(bms, 3));
    });

    it("center checks: ", () => {
        expect(boardWeight[1][1]).toEqual(Math.pow(bms, 9));
        expect(boardWeight[1][2]).toEqual(Math.pow(bms, 10));
        expect(boardWeight[2][1]).toEqual(Math.pow(bms, 6));
        expect(boardWeight[2][2]).toEqual(Math.pow(bms, 5));
    })
});
