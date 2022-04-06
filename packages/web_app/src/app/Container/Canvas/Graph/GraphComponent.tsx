import React, {Component} from 'react';
import { VisualGraphStorageType } from '@compx/common/Network/GraphItemStorage/GraphStorage'
import BlockComponent from "./VisualTypes/BlockComponent";
import { PointType } from '@compx/common/Types'
import {ThemeType} from "../../../../types";

type PropType = {
    theme: ThemeType,
    graph: VisualGraphStorageType,
    canvasTranslation: PointType,
    canvasZoom: number,
    onWheel: (e: React.WheelEvent) => void
};
type StateType = {};

export default class GraphComponent extends Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
    }

    render() {
        return (
            <g id="GraphGroup" transform={`translate(${this.props.canvasTranslation.x} ${this.props.canvasTranslation.y})  
                                                    scale(${this.props.canvasZoom} ${this.props.canvasZoom})`}>
                <g id="BlockGroup">
                    {this.props.graph.blocks.map(block => <BlockComponent key={block.id} block={block}
                                                                          theme={this.props.theme}
                                                                          onWheel={this.props.onWheel}/>)}
                </g>
            </g>
        )
    }
}