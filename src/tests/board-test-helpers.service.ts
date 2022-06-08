import { Direction } from "../domain/entities/direction.entity";
import { Tile } from "../domain/entities/tile.entity";
import BoardTestInfoEntity, {
    BoardTemplateNames,
} from "./board-test-info.entity";

export default class BoardTestHelpersService extends BoardTestInfoEntity {
    loopDirections(
        callback: (direction: keyof typeof Direction, i: number) => void
    ): void {
        (
            Object.keys(Direction).filter((x) => !Number(x) && x != "0") as any
        ).forEach(callback);
    }

    loopBoardTemplates(
        callback: (templateName: BoardTemplateNames, tiles: Tile[]) => void
    ): void {
        Object.entries(this.boardTemplates).forEach(([templateName, tiles]) =>
            callback(templateName as BoardTemplateNames, tiles)
        );
    }
}
