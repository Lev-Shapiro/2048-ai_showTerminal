import { PlayStatus } from './../entities/play-status.entity';
import loopDirections from "../../scripts/loop-directions.script";
import { Board, BoardInformation } from "../entities/board.entity";
import { Direction } from "../entities/direction.entity";
import { Tile } from "../entities/tile.entity";
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

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            board.board[i] = this.board[i].map((x) => x);
        }

        return board;
    }

    /**------------------------------------------------------------------------
     * ?                          BOARD CONTROLLER
     * @setTile           : add {value} at board[i][j]
     * @setTiles          : loop setTile
     * @setRow            : replace row in board ( vertical or horizontal line )
     * @getRow            : get row from board ( vertical or horizontal line )
     * @newRandomTile     : 80% returns 2 and 20% returns 4
     *------------------------------------------------------------------------**/

    setTile(...[i, j, value]: Tile) {
        this.board[i][j] = value;
    }

    setTiles(tiles: Tile[]) {
        tiles.forEach((tile) => this.setTile(...tile));
    }

    setRow(row: number[], direction: "vertical" | "horizontal", line: number) {
        for (var i = 0; i < this.BOARD_SIZE; i++) {
            direction === "vertical"
                ? (this.board[i][line] = row[i])
                : (this.board[line][i] = row[i]);
        }
    }

    getRow(direction: "vertical" | "horizontal", line: number) {
        const row: number[] = [];

        for (var i = 0; i < this.BOARD_SIZE; i++) {
            row.push(
                direction === "vertical"
                    ? this.board[i][line]
                    : this.board[line][i]
            );
        }

        return row;
    }

    newRandomTile() {
        return Math.random() > 0.8 ? 4 : 2;
    }

    /**------------------------------------------------------------------------
     * ?                       HELPER FUNCTIONS
     * @findEmptyPlaces             : returns coords of all empty places
     * @findScore                   : returns sum of all tiles
     * @findHighestTile             : returns highest tile
     * @findMergesCount             : returns number from 0 to 8
     * @findAvailableDirections     : returns array of available directions
     * @isLosed                     : returns true or false
     *------------------------------------------------------------------------**/

    findEmptyPlaces() {
        const result = new Array<[number, number]>();

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                if (this.board[i][j] == this.EMPTY) result.push([i, j]);
            }
        }

        return result;
    }

    findScore(): number {
        return this.board.reduce(
            (prev, arr) => prev + arr.reduce((prev, v) => v + prev, 0),
            0
        );
    }

    findHighestTile(): number {
        return this.board.reduce(
            (prev, arr) => (prev > Math.max(...arr) ? prev : Math.max(...arr)),
            0
        );
    }

    findMergesCount(direction: Direction): number {
        const boardCopy = this.copy();
        const emptyPlaces1 = boardCopy.findEmptyPlaces().length;

        boardCopy.agentAction(direction);

        const emptyPlaces2 = boardCopy.findEmptyPlaces().length;

        return emptyPlaces2 - emptyPlaces1;
    }

    findAvailableDirections() {
        const availableDirections: Direction[] = [];

        loopDirections((_, direction) => {
            if (
                this.findMergesCount(direction) != 0 ||
                this.findEmptyPlaces().length != 0
            ) {
                availableDirections.push(direction);
                return;
            }
        });

        return availableDirections;
    }

    isLosed() {
        return !this.findAvailableDirections().length;
    }

    /**------------------------------------------------------------------------
     * ?                             PLAYERS
     * @player1      : agent, AI bot
     * @player2      : computer
     *------------------------------------------------------------------------**/

    /**------------------------------------------------------------------------
     * ?                         PLAYERS ACTIONS
     * @agentAction    : move left/right/down/up
     * @opponentAction : add number 2 or 4 to one of empty tiles
     *------------------------------------------------------------------------**/

    agentAction(direction: Direction) {
        // const axisName =
        //     direction === Direction.Down || direction === Direction.Up
        //         ? "vertical"
        //         : "horizontal";

        const axisName =
        direction === Direction.Down || direction === Direction.Up
            ? "vertical"
            : "horizontal";

        for (var x = 0; x < this.BOARD_SIZE; x++) {
            let arr = this.getRow(axisName, x),
                arrCopy = arr.filter((v) => v != 0);

            if (direction === Direction.Down || direction === Direction.Right)
                arrCopy.reverse();

            for (var y = 0; y < arrCopy.length; y++) {
                if (arrCopy[y] === arrCopy[y + 1]) {
                    arrCopy.splice(y + 1, 1);
                    arrCopy[y] *= 2;
                }
            }

            for (var z = arrCopy.length; z < this.BOARD_SIZE; z++) {
                arrCopy.push(0);
            }

            this.setRow(
                direction === Direction.Down || direction === Direction.Right
                    ? arrCopy.reverse()
                    : arrCopy,
                axisName,
                x
            );
        }
    }

    opponentAction(): PlayStatus {
        const emptyPlaces = this.findEmptyPlaces();

        if(emptyPlaces.length === 0) {
            return PlayStatus.Loss
        }

        const index = Math.floor(Math.random() * emptyPlaces.length);

        this.setTile(
            emptyPlaces[index][0],
            emptyPlaces[index][1],
            this.newRandomTile()
        );

        return PlayStatus.Playing
    }
}
