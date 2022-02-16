import React from "react";

import { PointType } from '@compx/common/Types'

type PropType = {
    canvasTranslation: PointType
    canvasZoom: number
    style?: {
        fillColor?: string
    }
};

type StateType = {
    oldZoom: number,
    level: number
};

export default class Grid extends React.Component<PropType, StateType> {
    private static readonly SwitchPoint = (4.0 - (1/3)) / 4;

    constructor(props: PropType) {
        super(props);

        this.state = {
            oldZoom: this.props.canvasZoom,
            level: Math.floor((props.canvasZoom - (1/3)) / (4.0 - (1/3)))
        }
    }

    static getDerivedStateFromProps(newProps: PropType, oldState: StateType): StateType {
        const oz = (oldState.oldZoom % Grid.SwitchPoint) / Grid.SwitchPoint;
        const nz = (newProps.canvasZoom % Grid.SwitchPoint) / Grid.SwitchPoint;

        const newState: StateType = {...oldState, oldZoom: newProps.canvasZoom };
        if (oz >= 0.98 && nz <= 0.02) {
            console.log("State up");
            return {...newState, level: oldState.level += 1}
        } else if (oz <= 0.02 && nz >= 0.98) {
            console.log("State down");
            return {...newState, level: oldState.level -= 1}
        } else {
            return newState;
        }
    }

    render() {
        // let opp1 = 1 - ((this.props.canvasZoom % Grid.SwitchPoint) / Grid.SwitchPoint);
        // opp1 = opp1 <= 0.25 ? 0 : (opp1 >= 0.75 ? 1.0 : opp1)
        // const opp2 = 1-opp1;

        const smallGridSize1 = 10 * (10**this.state.level);
        const largeGridSize1 = smallGridSize1 * 10

        // const smallGridSize2 = 150 + (150 * (this.state.level + 1));
        // const largeGridSize2 = smallGridSize2 * 10;

        return (
            <g id="BackgroundGrid" width="100%" height="100%" order={1} pointerEvents="none">
                <defs>
                    <pattern id="smallGrid1" width={smallGridSize1} height={smallGridSize1} patternUnits="userSpaceOnUse">
                        <path d={`M ${smallGridSize1} 0 L 0 0 0 ${smallGridSize1}`} fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid1" width={largeGridSize1} height={largeGridSize1} patternUnits="userSpaceOnUse"
                             patternTransform={`translate(${this.props.canvasTranslation.x} ${this.props.canvasTranslation.y}) 
                                                                    scale(${this.props.canvasZoom} ${this.props.canvasZoom})`}>
                        <rect width={largeGridSize1} height={largeGridSize1} fill="url(#smallGrid1)"/>
                        <path d={`M ${largeGridSize1} 0 L 0 0 0 ${largeGridSize1}`} fill="none" stroke="gray" strokeWidth="1"/>
                    </pattern>

                    {/*<pattern id="smallGrid2" width={smallGridSize2} height={smallGridSize2} patternUnits="userSpaceOnUse">*/}
                    {/*    <path d={`M ${smallGridSize2} 0 L 0 0 0 ${smallGridSize2}`} fill="none" stroke="gray" strokeWidth="0.5"/>*/}
                    {/*</pattern>*/}
                    {/*<pattern id="grid2" width={largeGridSize2} height={largeGridSize2} patternUnits="userSpaceOnUse"*/}
                    {/*         patternTransform={`translate(${this.props.canvasTranslation.x} ${this.props.canvasTranslation.y}) */}
                    {/*                                                scale(${this.props.canvasZoom} ${this.props.canvasZoom})`}>*/}
                    {/*    <rect width={largeGridSize2} height={largeGridSize2} fill="url(#smallGrid2)" opacity={`${opp2*100}%`}/>*/}
                    {/*    <path d={`M ${largeGridSize2} 0 L 0 0 0 ${largeGridSize2}`} fill="none" stroke="gray" strokeWidth="1" opacity={`${opp2*100}%`}/>*/}
                    {/*</pattern>*/}
                </defs>

                <rect width="100%" height="100%" fill="url(#grid1)" />
                {/*<rect width="100%" height="100%" fill="url(#grid2)" />*/}
                <g transform={`translate(${this.props.canvasTranslation.x} ${this.props.canvasTranslation.y}) 
                                                              scale(${this.props.canvasZoom} ${this.props.canvasZoom})`}>
                    <path d={`M 0 0 L 0 ${-80 / this.props.canvasZoom}`} fill='none' stroke="red" strokeWidth={1}/>
                    <path d={`M 0 0 L ${80 / this.props.canvasZoom} 0`} fill='none' stroke="green" strokeWidth={1}/>
                </g>
            </g>
        )
    }
}


// <pattern id="grid" x={radius} y={radius} width={tickSpacing} height={tickSpacing}
//          patternUnits="userSpaceOnUse"
//          patternTransform={
//              `translate(${props.canvasTranslation.x} ${props.canvasTranslation.y})
//                                      scale(${props.canvasZoom} ${props.canvasZoom})`}>
//     <circle cx={tickSpacing-radius} cy={tickSpacing-radius}
//             r={radius} fill="black" opacity={0.75} style={{fill: props.style?.fillColor || "white"}}/>
// </pattern>
// <rect width="100%" height="100%" fill="url(#grid)"/>
// <g transform={`translate(${props.canvasTranslation.x} ${props.canvasTranslation.y})
//                                                     scale(${props.canvasZoom} ${props.canvasZoom})`}>
//     <path d={`M 0 0 L 0 ${-tickSpacing / props.canvasZoom}`} fill='none' stroke="red" strokeWidth="1"/>
//     <path d={`M 0 0 L ${tickSpacing / props.canvasZoom} 0`} fill='none' stroke="green" strokeWidth="1"/>
// </g>