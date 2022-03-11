import React from "react";

import { PointType } from '@compx/common/Types'

function MicroGrid(props: { size: number, scale: number, translation: PointType, opacity: number }): React.ReactElement {
    const smallGridSize1 = (props.size*props.scale);
    const largeGridSize1 = smallGridSize1 * 10;

    return (
        <React.Fragment>
            <defs>
                <pattern id="smallGrid1" width={smallGridSize1} height={smallGridSize1} patternUnits="userSpaceOnUse">
                    <path d={`M ${smallGridSize1} 0 L 0 0 0 ${smallGridSize1}`} fill="none" stroke="gray"
                          strokeWidth="0.5" opacity={props.opacity}/>
                </pattern>
                <pattern id="grid1" width={largeGridSize1} height={largeGridSize1} patternUnits="userSpaceOnUse"
                         patternTransform={`translate(${props.translation.x} ${props.translation.y})`}>
                    <rect width={largeGridSize1} height={largeGridSize1} fill="url(#smallGrid1)"/>
                    <path d={`M ${largeGridSize1} 0 L 0 0 0 ${largeGridSize1}`} fill="none" stroke="gray"
                          strokeWidth="1" opacity={props.opacity}/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid1)" />
        </React.Fragment>
    )
}

function RecursiveMicroGrid(props: { size: number, scale: number, translation: PointType, level?: number}): React.ReactElement {
    const turnPoint = 3;
    const cvtLevel = props.level ?? 0;
    const cvtScale = props.scale - (turnPoint*cvtLevel);

    if (cvtScale < turnPoint) {
        return (
            <MicroGrid size={props.size} scale={props.scale}
                       translation={props.translation} opacity={1} />
        )
    } else if (cvtScale < turnPoint + 1) {
        const pct = (turnPoint+1)-cvtScale;
        return (
            <React.Fragment>
                <MicroGrid size={props.size/10} scale={props.scale}
                           translation={props.translation}
                           opacity={1-pct} />
                <MicroGrid size={props.size} scale={props.scale}
                           translation={props.translation}
                           opacity={pct} />
            </React.Fragment>
        )
    } else {
        return (
            <RecursiveMicroGrid size={props.size/10} scale={props.scale}
                                translation={props.translation} level={cvtLevel+1} />
        )
    }
}

type PropType = {
    canvasTranslation: PointType
    canvasZoom: number
    style?: {
        fillColor?: string
    }
};

type StateType = {
    oldZoom: number
};

export default class Grid extends React.Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);

        this.state = {
            oldZoom: this.props.canvasZoom
        }
    }

    render() {
        return (
            <g id="BackgroundGrid" width="100%" height="100%" order={1} pointerEvents="none">
                <RecursiveMicroGrid size={40} scale={this.props.canvasZoom} translation={this.props.canvasTranslation}/>

                <g>
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