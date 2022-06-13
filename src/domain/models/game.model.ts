import { Direction } from "../entities/direction.entity";
import BeautifyService from "../services/beautify.service";
import AgentModel from "./agent.model";
import BoardModel from "./board.model";
import OpponentModel from "./opponent.model";

export default class GameModel {
    constructor(
        public agent: AgentModel,
        public opponent: OpponentModel,
        public board: BoardModel
    ) {}

    copy() {
        return new GameModel(this.agent, this.opponent, this.board);
    }

    directionIsAvailable(direction: Direction): boolean {
        const beautify = new BeautifyService();
        const gameCopy = this.copy();

        this.agent.action(gameCopy.board, direction);

        return !(
            beautify.stringifyBoard(this.board) ===
            beautify.stringifyBoard(gameCopy.board)
        );
    }

    action(direction: Direction) {
        this.agent.action(this.board, direction);
        this.opponent.action(this.board);
    }

    showAvailableDirections() {

    }
}
