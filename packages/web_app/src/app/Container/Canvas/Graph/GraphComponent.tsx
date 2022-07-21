import { PointType } from '@compx/common/Types';
import {MakeVisualGraph} from './testGraph';
import { VisualBlockStorageType } from '@compx/common/Network/GraphItemStorage/BlockStorage';
import DrawBlock from './VisualTypes/BlockComponent2'

const blocks = MakeVisualGraph(5).blocks;
export default function DrawGraph(
    context: CanvasRenderingContext2D, screenSize: PointType, canvasTranslation: PointType, canvasZoom: number
) {
    const DrawBlockRet = (block: VisualBlockStorageType<any, any>) =>
        DrawBlock(context, screenSize, canvasTranslation, canvasZoom, block);

    blocks.forEach(block => {
        DrawBlockRet(block);
    });
};