import { PointType } from '@compx/common/Types';
import {SetOpacityHex, HexToRgbA} from "../../../../theme/helpers";
import {Clamp, LinearInterp} from '@compx/common/Helpers/Other';

function DrawGridCirc(
    context: CanvasRenderingContext2D, size: PointType, position: PointType,
    spacing: number, radius: number, color: string
) {
    // Constants
    const TWO_PI = 2 * Math.PI;

    // Calculations for how many dots across have to appear on screen
    const halfSizeX = size.x / 2.0; const halfSizeY = size.y / 2.0;
    const xLow = spacing*Math.ceil((position.x-halfSizeX)/spacing);
    const xHigh = spacing*Math.floor((position.x + halfSizeX)/spacing);

    // Calculations for how many dots high have to appear on screen
    const yLow = spacing*Math.ceil((position.y-halfSizeY)/spacing);
    const yHigh = spacing*Math.floor((position.y+halfSizeY)/spacing);

    // Double loop to draw all the dots required
    for (let ix=xLow-spacing; ix<=xHigh+spacing; ix+=spacing) {
        for (let iy=yLow-spacing; iy<=yHigh+spacing; iy+=spacing) {
            // Calculate the location of the specified dot
            const xPos = halfSizeX - (ix - position.x);
            const yPos = halfSizeY - (iy - position.y);

            // Draw the dot
            context.beginPath();
            context.arc(xPos, yPos, radius, 0, TWO_PI, false);
            context.fillStyle = color;
            context.fill();
        }
    }
}

// Constants
const zoomInterval = 8; const color = '#888';
let rgba1 = HexToRgbA(SetOpacityHex(color, 1.0));

export default function DrawGrid(
    context: CanvasRenderingContext2D, screenSize: PointType, canvasTranslation: PointType, canvasZoom: number
) {
    // Calculates the percentage of the way through any single zoom level
    // Calculates which level the zoom is on
    const pct =  (canvasZoom % zoomInterval) / zoomInterval;
    const level = Math.ceil(canvasZoom / zoomInterval);

    // Calculates the spacinging between any two dots
    // TODO: This imploads at higher zoom levels but works fine for our purposes. May wnat to fix in future
    const spacing = 50 * canvasZoom / Math.pow(10, (level - 1));

    // ------------------------------- Grid 1 --------------------------------------------------------------------------
    if (pct >= 0.0 && pct < (2/5)) {
        // hold 1
        DrawGridCirc(context, screenSize, canvasTranslation, spacing, 1.5, rgba1);
    } else if (pct >= (2/5) && pct < (3/5)) {
        // grow 1
        const radius = LinearInterp(pct, (2/5), (3/5), 1.5, 3.0);
        DrawGridCirc(context, screenSize, canvasTranslation, spacing, radius, rgba1);
    } else if (pct >= (3/5) && pct < (5/5)) {
        // hold 1
        DrawGridCirc(context, screenSize, canvasTranslation, spacing, 3.0, rgba1);
    }

    // -------------------------------- Grid 2 -------------------------------------------------------------------------
    if (pct >= 0.0 && pct < (1/5)) {
        // Hold
        DrawGridCirc(context, screenSize, canvasTranslation, spacing*10, 3.0, rgba1);
    } else if (pct >= (1/5) && pct < (7/15)) {
        // Fade Out
        const radius1 = LinearInterp(pct, (1/5), (7/15), 3.0, 1.5);
        const opacity = Clamp(LinearInterp(pct, (1/5), (7/15), 1.0, 0.0), 0.0, 1.0);
        const rgba = HexToRgbA(color, opacity);
        DrawGridCirc(context, screenSize, canvasTranslation, spacing*10, radius1, rgba);
    } else if (pct >= (7/15) && pct < (4/5)) {
        // Fade in
        const opacity = Clamp(LinearInterp(pct, (7 / 15), (4 / 5), 0.0, 1.0), 0.0, 1.0);
        const rgba = HexToRgbA(color, opacity);
        DrawGridCirc(context, screenSize, canvasTranslation, spacing / 10, 1.5, rgba);
    } else if (pct >= (4/5) && pct < (5/5)) {
        // Hold
        DrawGridCirc(context, screenSize, canvasTranslation, spacing / 10, 1.5, rgba1);
    }

    const center = { x: (screenSize.x/2.0) + canvasTranslation.x, y: (screenSize.y/2.0) + canvasTranslation.y }
    context.beginPath(); context.lineWidth = 3; context.lineCap = "round"; context.lineJoin = 'round';
    context.moveTo(center.x, center.y);
    context.strokeStyle = 'green'; context.lineTo(center.x + 75, center.y);
    context.stroke();
    context.beginPath(); context.lineWidth = 3; context.lineCap = "round"; context.lineJoin = 'round';
    context.moveTo(center.x, center.y);
    context.strokeStyle = 'red'; context.lineTo(center.x, center.y - 75);
    context.stroke();
}