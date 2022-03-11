import { PointType } from '@compx/common/Types';

/* Utility function to convert on screen mouse coordinates to canvas coordinates*/
export function ScreenToWorld(point: PointType, translation: PointType, zoom: number): PointType {
    const gX1 = (point.x - translation.x) / zoom;
    const gY1 = (point.y - translation.y) / zoom;
    return {x: gX1, y: gY1}
}

