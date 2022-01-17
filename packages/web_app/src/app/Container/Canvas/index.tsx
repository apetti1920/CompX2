import React, {Component} from 'react';
import Grid from "./Grid";

import { ScreenToWorld } from "../../../helpers";
import { LinearInterp, Clamp } from '@compx/common/Helpers/Other'
import {PointType} from '@compx/common/Types';

type PropType = {};
type StateType = {
    isMouseDownOnCanvas: boolean,
    canvasTranslation: PointType,
    canvasZoom: number
};

export default class Container extends Component<PropType, StateType> {
    private readonly canvasRef: React.MutableRefObject<SVGSVGElement | null>;

    constructor(props: PropType) {
        super(props);

        this.canvasRef = React.createRef();

        this.state = {
            isMouseDownOnCanvas: false,
            canvasTranslation: { x: 0, y: 0 },
            canvasZoom: 1
        }
    }

    componentDidMount() {
        this.center();
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

    // handles how the canvas will zoom with the scroll wheel
    handleScroll = (e: React.WheelEvent) => {
        // converts the position of the mouse on the screen to coordinates in the canvas world
        // this tell the canvas where to zoom around
        const mouseWorld = ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
            this.state.canvasTranslation, this.state.canvasZoom);

        // calculate how much hasscrolled and interpolate to the zoom delta
        // also set a clamp to disallow zooms too large or small
        // noinspection JSSuspiciousNameCombination
        let tempScroll = this.state.canvasZoom + LinearInterp(e.deltaY, -100, 100, -0.2, 0.2);
        tempScroll = Clamp(tempScroll, 1/3, 4);

        // calculate the new translation about the scale change
        const scaleChange = tempScroll - this.state.canvasZoom;
        const newTranslation = {
            x: this.state.canvasTranslation.x - (mouseWorld.x * scaleChange),
            y: this.state.canvasTranslation.y - (mouseWorld.y * scaleChange)
        }

        this.setState({
            canvasZoom: tempScroll,
            canvasTranslation: newTranslation
        });

        e.stopPropagation();
    };

    // centers the canvas
    center = () => {
        if (this.canvasRef !== null &&  this.canvasRef.current !== null) {
            const canvasWidth = this.canvasRef.current.clientWidth;
            const canvasHeight = this.canvasRef.current.clientHeight;

            this.setState({canvasTranslation: {x: canvasWidth/2.0, y: canvasHeight/2.0}})
        }
    }

    render() {
        return (
            // Creates an svg canvas to draw the elements on
            <svg id="Canvas" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" ref={this.canvasRef}>
                {/* The background is used to handle the mouse events on the canvas */}
                <rect id="CanvasBackground" width="100%" height="100%" pointerEvents="auto" opacity={0}
                      onMouseDown={this.onMouseDownHandlerCanvas} onMouseUp={this.onMouseUpHandlerCanvas}
                      onMouseMove={this.onMouseMoveOverHandlerCanvas} onWheel={this.handleScroll} order={0}
                />

                {/* The Grid shows the dots and origon of the canvas */}
                <Grid canvasTranslation={this.state.canvasTranslation} canvasZoom={this.state.canvasZoom} />
            </svg>
        )
    }
}