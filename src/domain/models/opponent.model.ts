import BoardModel from "./board.model";

export default class OpponentModel {

    private  randomNewTile(): number {
        return (Math.random() > 0.8) ? 2 : 4;
    }

    //* adds random tile ( 2 or 4 ) to empty place
    action(board: BoardModel): void {
        const emptyPlaces = board.findEmptyPlaces();

        if (emptyPlaces.length > 0) {
            const index = Math.floor(Math.random() * emptyPlaces.length);

            board.setTile([
                emptyPlaces[index][0],
                emptyPlaces[index][1],
                this.randomNewTile()
            ]);
        }
    }
}