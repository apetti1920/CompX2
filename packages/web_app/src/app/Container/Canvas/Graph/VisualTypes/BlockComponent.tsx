import React, {Component} from 'react';
import { Rect } from 'react-konva';

import { PointType } from '@compx/common/Types';
import { VisualBlockStorageType } from '@compx/common/Network/GraphItemStorage/BlockStorage';
import {ThemeType} from "../../../../../types";
import {HexToRgbA} from "../../../../../theme/helpers";

type PropType = {
    screenSize: PointType,
    canvasTranslation: PointType,
    canvasZoom: number,
    block: VisualBlockStorageType<any, any>
    theme: ThemeType
};
type StateType = {};

export default class BlockComponent extends Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
    }

    render() {
        const width = this.props.block.size.x * this.props.canvasZoom;
        const height = this.props.block.size.y * this.props.canvasZoom;
        if (width < 5 || height < 5) return <React.Fragment />;

        const x = (this.props.screenSize.x/2.0) + this.props.canvasTranslation.x - (0.5*width) +
            (this.props.block.position.x * this.props.canvasZoom);
        const y = (this.props.screenSize.y/2.0) + this.props.canvasTranslation.y - (0.5*height) -
            (this.props.block.position.y * this.props.canvasZoom);
        let radius = 5*this.props.canvasZoom;
        radius = (2*radius >= (this.props.block.size.x - 5) || 2*radius >= (this.props.block.size.y - 5)) ? 0 : radius;

        return (
            <Rect
                x={x} y={y} width={width} height={height}
                cornerRadius={radius} fill={this.props.block.color ?? this.props.theme.palette.background}
                stroke={HexToRgbA(this.props.theme.palette.text, 0.5)} strokeWidth={1}
                shadowColor={this.props.theme.palette.shadow} shadowOffsetY={2.5} shadowOffsetX={2.5} shadowBlur={2.5}
            />
        )
    }
}