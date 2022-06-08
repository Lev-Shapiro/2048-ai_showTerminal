import { Direction } from "../entities/direction.entity";
import BoardModel from "./board.model";

export default class AgentModel {
    action(board: BoardModel, direction: Direction): void {
        board.move(direction);
    }
}