import React, {Component} from 'react';
import { Rect } from 'react-konva';
import Konva from 'konva';
type KonvaEventObject<T> = Konva.KonvaEventObject<T>;

import { PointType } from '@compx/common/Types';
import { VisualBlockStorageType } from '@compx/common/Network/GraphItemStorage/BlockStorage';
import { WheelHandler } from  '../../utils'
import { ThemeType } from "../../../../../types";
import { HexToRgbA } from "../../../../../theme/helpers";

type PropType = {
    onSelectBlock: (blockId: string, selectMultiple: boolean)=>void
    screenSize: PointType,
    canvasTranslation: PointType,
    canvasZoom: number,
    block: VisualBlockStorageType<any, any>,
    theme: ThemeType,
    onZoom: (delta: number, around: PointType) => void
};
type StateType = {};

export default class BlockComponent extends Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
    }

    onClickHandler = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.stopPropagation();

        if (e.evt.shiftKey) {
            this.props.onSelectBlock(this.props.block.id, true);
        } else if (e.evt.button === 0) {
            this.props.onSelectBlock(this.props.block.id, false);
        }
    }

    render() {
        const width = this.props.block.size.x * this.props.canvasZoom;
        const height = this.props.block.size.y * this.props.canvasZoom;
        if (width < 5 || height < 5) return <React.Fragment />;

        const x = (this.props.screenSize.x/2.0) + this.props.canvasTranslation.x - (0.5*width) +
            (this.props.block.position.x * this.props.canvasZoom);
        const y = (this.props.screenSize.y/2.0) + this.props.canvasTranslation.y - (0.5*height) -
            (this.props.block.position.y * this.props.canvasZoom);

        let radius = 5;
        radius = (width > (2.2*radius) && height > (2.2*radius)) ? radius : 5;

        return (
            <Rect
                x={x} y={y} width={width} height={height}
                cornerRadius={radius} fill={this.props.block.color ?? this.props.theme.palette.background}
                stroke={!this.props.block.selected?HexToRgbA(this.props.theme.palette.text, 0.5):"red"} strokeWidth={!this.props.block.selected?1:3}
                shadowColor={this.props.theme.palette.shadow} shadowOffsetY={2.5} shadowOffsetX={2.5} shadowBlur={2.5}
                perfectDrawEnabled={false} shadowEnabled={false}
                shadowForStrokeEnabled={false} hitStrokeWidth={0} onClick={this.onClickHandler}
                onWheel={(e)=>WheelHandler(
                    e, this.props.onZoom, this.props.canvasTranslation,
                    this.props.canvasZoom, this.props.screenSize
                )}
            />
        )
    }
}