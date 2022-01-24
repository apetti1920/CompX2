import React, {Component} from 'react';


import { PortStringListType } from '@compx/common/Graph/Port';
import { VisualBlockStorageType } from '@compx/common/Network/GraphItemStorage/BlockStorage';

type PropType = {
    block: VisualBlockStorageType<PortStringListType, PortStringListType>
    onWheel: (e: React.WheelEvent<SVGRectElement>) => void
};
type StateType = {};

export default class BlockComponent extends Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
    }

    render() {
        return (
            <rect width={this.props.block.size.x} height={this.props.block.size.y}
                  x={this.props.block.position.x} y={this.props.block.position.y}  rx={15}
                  onWheel={this.props.onWheel}/>
        )
    }
}