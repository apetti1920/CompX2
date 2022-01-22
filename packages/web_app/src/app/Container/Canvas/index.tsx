import React, {Component} from 'react';
import Grid from "./Grid";

import { ScreenToWorld } from "../../../helpers";
import { LinearInterp, Clamp } from '@compx/common/Helpers/Other'
import {PointType} from '@compx/common/Types';
import Keypad from "./Keypad";
import GraphComponent from "./Graph/GraphComponent";

import { VisualGraphStorageType } from '@compx/common/Network/GraphItemStorage/GraphStorage';
import {MakeVisualGraph} from "./Graph/testGraph.js";

type PropType = {
    style?: React.CSSProperties
};
type StateType = {
    graph: VisualGraphStorageType
    isMouseDownOnCanvas: boolean,
    canvasTranslation: PointType,
    canvasZoom: number
};

export default class Container extends Component<PropType, StateType> {
    private readonly canvasRef: React.MutableRefObject<HTMLDivElement | null>;

    constructor(props: PropType) {
        super(props);

        this.canvasRef = React.createRef();
        this.state = {
            graph: {blocks: []},
            isMouseDownOnCanvas: false,
            canvasTranslation: { x: 0, y: 0 },
            canvasZoom: 1
        }
    }

    componentDidMount() {
        this.setState({graph: MakeVisualGraph()}, () => {
            this.center();
        });
    }

    // Handles the state change when the mouse is pressed
    onMouseDownHandlerCanvas = (e: React.MouseEvent) => {
        e.preventDefault();
        this.setState({isMouseDownOnCanvas: true});
        e.stopPropagation();
    }

    // Handles the state change when the mouse is depressed
    onMouseUpHandlerCanvas = (e: React.MouseEvent) => {
        e.preventDefault();
        this.setState({isMouseDownOnCanvas: false});
        e.stopPropagation();
    }

    // Changes the translation of the map utilizing the delta mouse moves
    onMouseMoveOverHandlerCanvas = (e: React.MouseEvent) => {
        e.preventDefault();

        // only changes position if the mouse is down
        if (this.state.isMouseDownOnCanvas) {
            // Calculates the new translation by the delta of the movement of the mouse
            const newTranslation = {
                x: this.state.canvasTranslation.x + e.movementX,
                y: this.state.canvasTranslation.y + e.movementY
            };

            this.setState({ canvasTranslation: newTranslation });
        }
        e.stopPropagation();
    }

    // Handling an arbitrary zoom
    handleZoom = (amount: number, around: PointType) => {
        amount = this.state.canvasZoom + amount;
        const tempScroll = Clamp(amount, 1/3, 4);

        // calculate the new translation about the scale change
        const scaleChange = tempScroll - this.state.canvasZoom;
        const newTranslation = {
            x: this.state.canvasTranslation.x - (around.x * scaleChange),
            y: this.state.canvasTranslation.y - (around.y * scaleChange)
        }

        this.setState({
            canvasZoom: tempScroll,
            canvasTranslation: newTranslation
        });
    }

    handleZoomClick = (zoomIn: boolean) => {
        const amount = 0.24 * (zoomIn?1:-1);

        let windowCenter: PointType = this.state.canvasTranslation;
        if (this.canvasRef !== null && this.canvasRef.current !== null) {
            const canvasX = this.canvasRef.current.getBoundingClientRect().x
            const canvasY = this.canvasRef.current.getBoundingClientRect().y;
            const canvasWidth = this.canvasRef.current.clientWidth;
            const canvasHeight = this.canvasRef.current.clientHeight;

            windowCenter = ScreenToWorld({
                x: canvasX + (canvasWidth / 2.0),
                y: canvasY + (canvasHeight / 2.0)
            }, this.state.canvasTranslation, this.state.canvasZoom);
        }

        this.handleZoom(amount, windowCenter);
    }

    // handles how the canvas will zoom with the scroll wheel
    handleScroll = (e: React.WheelEvent) => {
        // converts the position of the mouse on the screen to coordinates in the canvas world
        // this tell the canvas where to zoom around
        const mouseWorld = ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
            this.state.canvasTranslation, this.state.canvasZoom);

        // calculate how much has scrolled and interpolate to the zoom delta
        // also set a clamp to disallow zooms too large or small
        // noinspection JSSuspiciousNameCombination
        let tempScroll = LinearInterp(e.deltaY, -100, 100, -0.2, 0.2);
        this.handleZoom(tempScroll, mouseWorld)

        e.stopPropagation();
    };

    // centers the canvas
    center = () => {
        if (this.canvasRef !== null && this.canvasRef.current !== null) {
            const canvasWidth = this.canvasRef.current.clientWidth;
            const canvasHeight = this.canvasRef.current.clientHeight;

            this.setState({canvasTranslation: {x: canvasWidth/2.0, y: canvasHeight/2.0}})
        }
    }

    render() {
        return (
            // Creates a svg canvas to draw the elements on
            <div style={{
                width: "100%", height: "100%", pointerEvents: "none", ...this.props.style,
                overflow: "hidden", position: "relative"}} ref={this.canvasRef}>
                <svg id="Canvas" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
                     pointerEvents="auto" style={{fill: 'black', float: 'left', minWidth: "100%", minHeight: "100%"}}
                     preserveAspectRatio="xMaxYMid meet">
                    {/* The background is used to handle the mouse events on the canvas */}
                    <rect id="CanvasBackground" width="100%" height="100%" pointerEvents="auto" opacity={0}
                          onMouseDown={this.onMouseDownHandlerCanvas} onMouseUp={this.onMouseUpHandlerCanvas}
                          onMouseMove={this.onMouseMoveOverHandlerCanvas} onWheel={this.handleScroll} order={0}
                    />

                    {/* The Grid shows the dots and origin of the canvas */}
                    <Grid canvasTranslation={this.state.canvasTranslation} canvasZoom={this.state.canvasZoom} />
                    <GraphComponent graph={this.state.graph} canvasTranslation={this.state.canvasTranslation}
                                    canvasZoom={this.state.canvasZoom}/>
                </svg>
                <Keypad centerClickHandler={this.center}
                        zoomInClick={()=>{this.handleZoomClick(true)}}
                        zoomOutClick={()=>{this.handleZoomClick(false)}}/>
            </div>
        )
    }
}