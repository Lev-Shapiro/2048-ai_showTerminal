import { Tile } from "../domain/entities/tile.entity";

export default function fillBoardWith4() {
    const tiles: Tile[] = []
    const BOARD_SIZE = 4;

    for(let i = 0; i < BOARD_SIZE; i++ ) {
        for(let j = 0; j < BOARD_SIZE; j++ ) {
            tiles.push([i, j, 4]);
        }
    }

    return tiles
}