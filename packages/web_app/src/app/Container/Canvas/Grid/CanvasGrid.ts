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
    spacing: number, radius: number, color: string
) {
    const TWO_PI = 2 * Math.PI;

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
            context.arc(xPos, yPos, radius, 0, TWO_PI, false);
            context.fillStyle = color;
            context.fill();
        }
    }
}

export default function DrawGrid(
    context: CanvasRenderingContext2D, size: PointType, position: PointType, zoomLevel: number
) {
    const zoomInterval = 8; const color = '#888';
    const pct =  (zoomLevel % zoomInterval) / zoomInterval;
    const level = Math.ceil(zoomLevel / zoomInterval)
    const spacing = 50 * zoomLevel / Math.pow(10, (level - 1));

    // ------------------------------- Grid 1 --------------------------------------------------------------------------
    if (pct >= 0.0 && pct < (1/5)) {
        // fade in 1
        const opacity = Clamp(LinearInterp(pct, 0.0, (1/5), 0.5, 1.0), 0.0, 1.0);
        DrawGridCirc(context, size, position, spacing, 1.5, SetOpacity(color, opacity));
    } else if (pct >= (1/5) && pct < (2/5)) {
        // hold 1
        DrawGridCirc(context, size, position, spacing, 1.5, color);
    } else if (pct >= (2/5) && pct < (3/5)) {
        // grow 1
        const radius = LinearInterp(pct, (2/5), (3/5), 1.5, 3.0);
        DrawGridCirc(context, size, position, spacing, radius, color);
    } else if (pct >= (3/5) && pct < (5/5)) {
        // hold 1
        DrawGridCirc(context, size, position, spacing, 3.0, color);
    }

    // -------------------------------- Grid 2 -------------------------------------------------------------------------
    if (pct >= 0.0 && pct < (1/5)) {
        // Hold
        DrawGridCirc(context, size, position, spacing*10, 3.0, color);
    } else if (pct >= (1/5) && pct < (7/15)) {
        // Fade Out
        const radius1 = LinearInterp(pct, (1/5), (7/15), 3.0, 1.5);
        const opacity = Clamp(LinearInterp(pct, (1/5), (7/15), 1.0, 0.0), 0.002, 1.0);
        DrawGridCirc(context, size, position, spacing*10, radius1, SetOpacity(color, opacity));
    } else if (pct >= (7/15) && pct < (4/5)) {
        // Fade in
        const opacity = Clamp(LinearInterp(pct, (7 / 15), (8 / 5), 0.0, 1.0), 0.002, 1.0);
        DrawGridCirc(context, size, position, spacing / 10, 1.5, SetOpacity(color, opacity));
    } else if (pct >= (4/5) && pct < (5/5)) {
        DrawGridCirc(context, size, position, spacing / 10, 1.5, color);
    }
}