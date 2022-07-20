import { PointType } from '@compx/common/Types';
import {SetOpacity} from "../../../../theme/helpers";
import {Clamp, LinearInterp} from '@compx/common/Helpers/Other';

function DrawGridInt(
    context: CanvasRenderingContext2D, size: PointType, position: PointType,
    spacing: number, lineWidth: number, color: string
) {
    context.beginPath();

    const halfSizeX = size.x / 2.0;
    const xLow = spacing*Math.ceil((position.x-halfSizeX)/spacing);
    const xHigh = spacing*Math.floor((position.x + halfSizeX)/spacing);
    for (let i=xLow-spacing; i<=xHigh+spacing; i+=spacing) {
        const xPos = halfSizeX - (i - position.x);
        context.moveTo(xPos, 0);
        context.lineTo(xPos, size.y);
    }

    const halfSizeY = size.y / 2.0;
    const yLow = spacing*Math.ceil((position.y-halfSizeY)/spacing);
    const yHigh = spacing*Math.floor((position.y+halfSizeY)/spacing);
    for (let i=yLow-spacing; i<=yHigh+spacing; i+=spacing) {
        const yPos = halfSizeY - (i - position.y);
        context.moveTo(0, yPos);
        context.lineTo(size.x, yPos);
    }

    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.stroke();
}

function DrawGridCirc(
    context: CanvasRenderingContext2D, size: PointType, position: PointType,
    spacing: number, lineWidth: number, color: string
) {
    const halfSizeX = size.x / 2.0; const halfSizeY = size.y / 2.0;
    const xLow = spacing*Math.ceil((position.x-halfSizeX)/spacing);
    const xHigh = spacing*Math.floor((position.x + halfSizeX)/spacing);

    const yLow = spacing*Math.ceil((position.y-halfSizeY)/spacing);
    const yHigh = spacing*Math.floor((position.y+halfSizeY)/spacing);

    for (let ix=xLow-spacing; ix<=xHigh+spacing; ix+=spacing) {
        for (let iy=yLow-spacing; iy<=yHigh+spacing; iy+=spacing) {
            const xPos = halfSizeX - (ix - position.x);
            const yPos = halfSizeY - (iy - position.y);

            context.beginPath();
            context.arc(xPos, yPos, lineWidth, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
        }
    }
}

export default function DrawGrid(
    context: CanvasRenderingContext2D, size: PointType, position: PointType, zoomLevel: number
) {
    const zoomInterval = 1.8; const color = '#888';
    const pct = Math.round((((zoomLevel % zoomInterval) / zoomInterval) + Number.EPSILON) * 1000) / 1000;
    const spacing = pct * 500;

    console.log(zoomLevel, pct, spacing, spacing/10, spacing*10);

    if (pct >= 0.0 && pct <= (1/7)) {
        // Nothing 1
        // Grow 2
        const radius = LinearInterp(pct, 0.0, (1/7), 1.0, 3.0);
        DrawGridCirc(context, size, position, spacing*10, radius, color);
    } else if (pct <= (2/7)) {
        // fade In 1
        const opacity1 = Clamp(LinearInterp(pct, (1/7), (2/7), 0.0, 1.0), 0.0, 1.0);
        DrawGridCirc(context, size, position, spacing, 1.0, SetOpacity(color, opacity1));

        // Hold 2
        DrawGridCirc(context, size, position, spacing*10, 3.0, color);
    } else if (pct <= (3/7)) {
        // Hold 1
        DrawGridCirc(context, size, position, spacing, 1.0, color);

        // Fade Out 2
        const opacity = Clamp(LinearInterp(pct, (2/7), (3/7), 1.0, 0.0), 0.0, 1.0);
        DrawGridCirc(context, size, position, spacing*10, 3.0, SetOpacity(color, opacity));
    } else if (pct <= (4/7)) {
        // Hold 1
        DrawGridCirc(context, size, position, spacing, 1.0, color);

        // Nothing 2
    } else if (pct <= (5/7)) {
        // Grow 1
        const radius = LinearInterp(pct, (4/7), (5/7), 1.0, 3.0);
        DrawGridCirc(context, size, position, spacing, radius, color);

        // Fade In 2
        const opacity1 = Clamp(LinearInterp(pct, (4/7), (5/7), 0.0, 1.0), 0.0, 1.0);
        DrawGridCirc(context, size, position, spacing/10.0, 1.0, SetOpacity(color, opacity1));
    } else if (pct <= (6/7)) {
        // Hold 1
        DrawGridCirc(context, size, position, spacing, 3.0, color);

        // Hold 2
        DrawGridCirc(context, size, position, spacing/10.0, 1.0, color);
    } else if (pct <= 1.0) {
        // Fade Out 1
        const opacity = Clamp(LinearInterp(pct, (6/7), 1.0, 1.0, 0.0), 0.0, 1.0);
        DrawGridCirc(context, size, position, spacing, 3.0, SetOpacity(color, opacity));

        // Hold 2
        DrawGridCirc(context, size, position, spacing/10.0, 1.0, color);
    }

    // context.beginPath();
    // context.arc(
    //     (size.x/2.0)+position.x, (size.y/2.0)+position.y, 10*zoomLevel,
    //     0, 2 * Math.PI, false
    // );
    // context.fillStyle = 'red';
    // context.fill();
}