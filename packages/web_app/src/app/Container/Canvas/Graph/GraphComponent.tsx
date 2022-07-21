import { PointType } from '@compx/common/Types';

export default function DrawGraph(
    context: CanvasRenderingContext2D, size: PointType, position: PointType, zoomLevel: number
) {
    const w = 400 * zoomLevel;
    if (w >= 5) {
        context.beginPath();
        context.rect((size.x/2.0)+position.x, (size.y/2.0)+position.y, w, w);
        context.stroke();
    }
};