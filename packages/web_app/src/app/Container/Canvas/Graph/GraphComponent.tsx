import React, { Component } from "react";

import { PointType } from '@compx/common/Types';
import {MakeVisualGraph} from './testGraph';
import { VisualBlockStorageType } from '@compx/common/Network/GraphItemStorage/BlockStorage';
import BlockComponent from "./VisualTypes/BlockComponent";
import {ThemeType} from "../../../../types";

type PropType = {
    screenSize: PointType,
    canvasTranslation: PointType,
    canvasZoom: number
    theme: ThemeType
};
type StateType = {};

export default class GraphComponent extends Component<PropType, StateType> {
    private readonly blocks: VisualBlockStorageType<any, any>[];

    constructor(props: PropType) {
        super(props);

        this.blocks = MakeVisualGraph(10).blocks;
    }

    render() {
        return (
            <React.Fragment>
                {this.blocks.map(block => <BlockComponent
                    screenSize={this.props.screenSize} canvasTranslation={this.props.canvasTranslation}
                    canvasZoom={this.props.canvasZoom} block={block} theme={this.props.theme} /> )}
            </React.Fragment>
        )
    }
}