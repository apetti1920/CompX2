import { PointType } from '@compx/common/Types';
import { VisualBlockStorageType } from '@compx/common/Network/GraphItemStorage/BlockStorage';

export default function(
    context: CanvasRenderingContext2D, screenSize: PointType,
    canvasTranslation: PointType, canvasZoom: number, blockInfo:  VisualBlockStorageType<any, any>
) {
    const width = blockInfo.size.x * canvasZoom; const height = blockInfo.size.y * canvasZoom;
    if (width < 5 || height < 5) return;

    const x = (screenSize.x/2.0) + canvasTranslation.x - (0.5*width)  + (blockInfo.position.x * canvasZoom);
    const y = (screenSize.y/2.0) + canvasTranslation.y - (0.5*height) - (blockInfo.position.y * canvasZoom);
    // TODO: Set Rectangle outside drawing bounds

    context.beginPath(); context.rect(x, y, width, height);
    context.fillStyle = '#ff003b'; context.fill();
}