import AgentModel from "../domain/models/agent.model";
import BoardModel from "../domain/models/board.model";
import GameModel from "../domain/models/game.model";
import OpponentModel from "../domain/models/opponent.model";

export default function createGame(board_existing?: BoardModel): GameModel {
    const agent = new AgentModel();
    const opponent = new OpponentModel();
    const board = new BoardModel() || board_existing;

    opponent.action(board);
    opponent.action(board);

    const game = new GameModel(agent, opponent, board);

    return game;
}
