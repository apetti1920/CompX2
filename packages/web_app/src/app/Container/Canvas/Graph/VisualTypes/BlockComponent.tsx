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
    private radius = 50;
    private padding = 20;

    constructor(props: PropType) {
        super(props);
    }

    GetBlockOutline = (): string => {
        const position = this.props.block.position;
        const size = this.props.block.size;

        return (
            `M-${position.x+(0.5*size.x)},${position.y+(0.5*size.y)}` +
            `v-${size.y-this.radius}` +`q0,-${this.radius} ${this.radius},-${this.radius}` +
            `h${size.x-(2*this.radius)}` + `q${this.radius},0 ${this.radius},${this.radius}` +
            `v${size.y-(1.25*this.radius)}` + `q0,${0.25*this.radius} -${0.25*this.radius},${0.25*this.radius}` +
            `h-${size.x-(0.5*this.radius)}` + `q-${0.25*this.radius},0 -${0.25*this.radius},-${0.25*this.radius}`
        )
    }

    render() {
        return (
            <g x={this.props.block.position.x + 50} y={this.props.block.position.y} onWheel={this.props.onWheel}>
                <path  d={this.GetBlockOutline()} fill={this.props.theme.palette.shadow} opacity={0.9}
                       filter="drop-shadow(3px 5px 2px #ffffff)"/>
                <rect x={(-0.5*this.props.block.size.x)+this.padding} y={(-0.5*this.props.block.size.y)+this.padding}
                      width="100" height="100" rx={this.radius/2.0} fill={this.props.theme.palette.link} />
                <text x={(-0.5*this.props.block.size.x)+(2*this.padding) + 100}
                      y={(-0.5*this.props.block.size.y)+this.padding + 50}
                      textAnchor="start"
                      style={{font: "bold 30px sans-serif"}}>{this.props.block.name}</text>
                <text x={(-0.5*this.props.block.size.x)+(2*this.padding) + 100}
                      y={(-0.5*this.props.block.size.y)+this.padding + 90}
                      textAnchor="start"
                      style={{font: "bold 30px sans-serif"}}>{this.props.block.name}</text>
                {/*>{this.props.block.visualName}</text>*/}
                {/*<text x={(this.imageRadius*2) + 40} y="75"*/}
                {/*      textAnchor="start" dominantBaseline="hanging"*/}
                {/*      style={{font: "20px sans-serif"}}*/}
                {/*>{this.props.block.name}</text>*/}
                {/*<line x1={5} y1={(this.imageRadius * 2) + 50} x2={this.props.block.size.x - 5}*/}
                {/*      y2={(this.imageRadius * 2) + 50} stroke={this.props.theme.palette.text} strokeWidth={5}*/}
                {/*      strokeLinecap="round"/>*/}
            </g>
        )
    }
}