import BoardModel from "./board.model";

export default class AiModel {
    findBoardReward(board: BoardModel) {
        let reward = 0;

        /*
         * factor1 - max value 0.2
         * factor2 - max value 0.3
         * factor3 - max value 0.5
         */

        //* first factor
        reward += board.findEmptyPlaces().length * 0.0625;

        return reward;
    }

    rollouts = 1000;

    random(board: BoardModel) {
        const boardCopy = board.copy();
        const directions = boardCopy.findAvailableDirections();

        //* edi = emulate direction index
        boardCopy.agentAction(
            directions[Math.floor(Math.random() * directions.length)]
        );
        boardCopy.opponentAction();

        return this.findBoardReward(boardCopy);
    }

    suggest(board: BoardModel) {
        const directions = board.findAvailableDirections();

        let bestMove = -1,
            bestValue = 0;

        //* ndi = node direction index
        for (var ndi = 0; ndi < directions.length; ndi++) {
            const direction = directions[ndi],
                boardCopy = board.copy();

            let moveSumValue = 0;

            boardCopy.agentAction(direction);
            boardCopy.opponentAction();

            for (var i = 0; i < this.rollouts; i++) {
                moveSumValue += this.random(boardCopy);
            }

            if (moveSumValue > bestValue) {
                bestValue = moveSumValue;
                bestMove = directions[ndi];
            }
        }

        return bestMove;
    }
}
