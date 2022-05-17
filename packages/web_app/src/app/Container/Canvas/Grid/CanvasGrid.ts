import { PointType } from '@compx/common/Types';

export default function DrawGrid(context: CanvasRenderingContext2D, size: PointType, position: PointType, zoomLevel: number) {
    const major = 100; const minor = major / 10;

    for (let x=0; x<size.x; x+=major) {
        context.beginPath()
        context.moveTo(x, 0);
        context.lineTo(x, size.y + position.y);
        context.stroke();
    }

    for (let y=0; y<size.y; y+=major) {
        context.beginPath()
        context.moveTo(0, y);
        context.lineTo(size.x + position.x, y);
        context.stroke();
    }
}