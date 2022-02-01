import React from "react";

import { PointType } from '@compx/common/Types'

type PropType = {
    canvasTranslation: PointType
    canvasZoom: number
    style?: {
        fillColor?: string
    }
};

const radius = Math.sqrt(2);
const tickSpacing = 80;
export default function (props: PropType): React.ReactElement {

    return (
        //  create a group to hold the dot pattern and origin
        <g id="BackgroundGrid" width="100%" height="100%" order={1} pointerEvents="none">
            <pattern id="grid" x={radius} y={radius} width={tickSpacing} height={tickSpacing}
                     patternUnits="userSpaceOnUse"
                     patternTransform={
                         `translate(${props.canvasTranslation.x} ${props.canvasTranslation.y})
                                     scale(${props.canvasZoom} ${props.canvasZoom})`}>
                <circle cx={tickSpacing-radius} cy={tickSpacing-radius}
                        r={radius} fill="black" opacity={0.75} style={{fill: props.style?.fillColor || "white"}}/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)"/>
            <g transform={`translate(${props.canvasTranslation.x} ${props.canvasTranslation.y})  
                                                    scale(${props.canvasZoom} ${props.canvasZoom})`}>
                <path d={`M 0 0 L 0 ${-tickSpacing / props.canvasZoom}`} fill='none' stroke="red" strokeWidth="1"/>
                <path d={`M 0 0 L ${tickSpacing / props.canvasZoom} 0`} fill='none' stroke="green" strokeWidth="1"/>
            </g>
        </g>
    )
}