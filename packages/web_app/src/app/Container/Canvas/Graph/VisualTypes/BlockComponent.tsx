import React, {Component} from 'react';


import { PortStringListType } from '@compx/common/Graph/Port';
import { VisualBlockStorageType } from '@compx/common/Network/GraphItemStorage/BlockStorage';
import {ThemeType} from "../../../../../types";

type PropType = {
    theme: ThemeType
    block: VisualBlockStorageType<PortStringListType, PortStringListType>
    onWheel: (e: React.WheelEvent<SVGRectElement>) => void
};
type StateType = {};

export default class BlockComponent extends Component<PropType, StateType> {
    private imageRadius = 50;
    private diameter = this.imageRadius * 2;
    private imageLocation = this.imageRadius + 25;
    private textStart = {x: this.diameter + 40, y: 35}

    constructor(props: PropType) {
        super(props);
    }

    render() {
        return (
            <g x={this.props.block.position.x + 50} y={this.props.block.position.y} onWheel={this.props.onWheel}>
                <rect width={this.props.block.size.x} height={this.props.block.size.y} rx={15}
                      fill={this.props.theme.palette.accent}
                      filter="drop-shadow(3px 5px 2px #ffffff)"
                />
                <circle cx={this.imageLocation} cy={this.imageLocation} r={this.imageRadius}
                        fill={this.props.theme.palette.text}/>
                <text x={this.textStart.x} y={this.textStart.y}
                      textAnchor="start" dominantBaseline="hanging"
                      style={{font: "bold 30px sans-serif"}}
                >{this.props.block.visualName}</text>
                <text x={(this.imageRadius*2) + 40} y="75"
                      textAnchor="start" dominantBaseline="hanging"
                      style={{font: "20px sans-serif"}}
                >{this.props.block.name}</text>
                <line x1={5} y1={(this.imageRadius * 2) + 50} x2={this.props.block.size.x - 5}
                      y2={(this.imageRadius * 2) + 50} stroke={this.props.theme.palette.text} strokeWidth={5}
                      strokeLinecap="round"/>
            </g>
        )
    }
}