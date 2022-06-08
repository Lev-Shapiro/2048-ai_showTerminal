import AgentModel from "./domain/models/agent.model";
import BoardModel from "./domain/models/board.model";
import OpponentModel from "./domain/models/opponent.model";

(async () => {
    const board = new BoardModel();

    /* 
        * agent - 2048 bot
        * opponent - algorithm which adds random tile every move
    */

    const agentModel = new AgentModel();
    const opponentModel = new OpponentModel();


    opponentModel.action(board);
    opponentModel.action(board);

    console.log("game: 2048");
    console.log("board: 4 x 4");
    console.log("==============");
})();
