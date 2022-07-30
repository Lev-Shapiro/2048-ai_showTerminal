export default function enumValues(
    obj: object
): number[] {
    return Object.values(obj).filter((k) => !isNaN(Number(k)));
}