import { Direction } from "../domain/entities/direction.entity";

export default function loopDirections<T>(
    callback: (dName: keyof typeof Direction, dValue: Direction, i: number) => T
) {
    const result = [];

    const directions = Object.keys(Direction).filter((x) => !Number(x) && x != "0") as unknown as (keyof typeof Direction)[];
   
    for(var i = 0; i < directions.length; i++ ) {
        result.push(callback(directions[i], Direction[directions[i]], i));
    }

    return result
}