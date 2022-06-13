import { PlayStatus } from "./domain/entities/play-status.entity";
import AiModel from "./domain/models/ai.model";
import BeautifyService from "./domain/services/beautify.service";
import createGame from "./scripts/game-create.script";

(async () => {
    let losed = false;

    const ai = new AiModel();
    const beautify = new BeautifyService();

    /*
     * agent - 2048 bot
     * opponent - algorithm which adds random tile every move
     */

    console.log("game: 2048");
    console.log("board: 4 x 4");
    console.log("==============");

    const game = createGame();

    while (!losed) {
        console.log("selected board: ", beautify.stringifyBoard(game.board));

        const direction = ai.suggest(game);
        console.log("selected direction: ", direction);

        if (game.board.checkPlayStatus() === PlayStatus.Loss) {
            losed = true;

            console.log("Game is ended");
        }
    }
})();
