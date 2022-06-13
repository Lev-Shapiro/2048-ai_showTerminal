import { Direction } from "../domain/entities/direction.entity";

export default function loopDirections(
    callback: (direction: keyof typeof Direction, i: number) => void
) {
    const directions = Object.keys(Direction).filter((x) => !Number(x) && x != "0") as unknown as (keyof typeof Direction)[];
   
    for(var i = 0; i < directions.length; i++ ) {
        callback(directions[i], i);
    }
}