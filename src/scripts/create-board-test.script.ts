import { Direction } from '../domain/entities/direction.entity';
import { Tile } from '../domain/entities/tile.entity';
import BoardModel from "../domain/models/board.model";

interface BoardTest {
    direction: Direction;
    tiles: Tile[];
    answer: Tile;
}

export default function createBoardTest(props: BoardTest) {
    const board = new BoardModel();

    props.tiles.forEach(([i, j, value]) => board.setTile(i, j, value));
    board.action(props.direction);

    const [i, j] = props.answer;
    
    return board.board[i][j];
}
