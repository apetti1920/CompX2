// linearly interprets a value in on  range to a value in an other
export function LinearInterp(x: number, x0: number, x1: number, y0: number, y1: number): number {
    // calculate the interp
    return ((y0 * (x1 - x) + y1 * (x - x0))) / (x1 - x0);
}

// clamps a value to be between or equal to the endpoints of a range
export function Clamp(x: number, min: number, max: number): number {
    return x>max?max:(x<min?min:x)
}