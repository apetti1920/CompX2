import { PointType } from '@compx/common/Types';
import {SetOpacity} from "../../../../theme/helpers";
import {Clamp, LinearInterp} from '@compx/common/Helpers/Other';

function DrawGridInt(context: CanvasRenderingContext2D, size: PointType, position: PointType, spacing: number, lineWidth: number, color: string) {
    context.beginPath();

    const halfSizeX = size.x / 2.0;
    const xLow = spacing*Math.ceil((position.x-halfSizeX)/spacing);
    const xHigh = spacing*Math.floor((position.x + halfSizeX)/spacing);
    for (let i=xLow; i<=xHigh; i+=spacing) {
        const xPos = halfSizeX - (position.x - i);
        context.moveTo(xPos, 0);
        context.lineTo(xPos, size.y);
    }

    const halfSizeY = size.y / 2.0;
    const yLow = spacing*Math.ceil((position.y-halfSizeY)/spacing);
    const yHigh = spacing*Math.floor((position.y + halfSizeY)/spacing);
    for (let i=yLow; i<=yHigh; i+=spacing) {
        const yPos = halfSizeY - (i - position.y);
        context.moveTo(0, yPos);
        context.lineTo(size.x, yPos);
    }

    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.stroke();
}

export default function DrawGrid(context: CanvasRenderingContext2D, size: PointType, position: PointType, zoomLevel: number) {
    const major = 100 * zoomLevel; const minor = major / 10;

    DrawGridInt(context, size, position, major, 3, '#888');
    DrawGridInt(context, size, position, minor, 1, SetOpacity('#888', Clamp(LinearInterp(zoomLevel, 0.5, 4.0, 0, 0.6), 0.0, 1.0)));


    context.beginPath();
    context.arc((size.x/2.0)-position.x, (size.y/2.0)+position.y, 25*zoomLevel, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();
}