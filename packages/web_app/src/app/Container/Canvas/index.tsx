import React, {Component} from 'react';

import Grid from "./Grid";
import GraphComponent from "./Graph/GraphComponent";

import { ScreenToWorld } from "../../../helpers";
import { LinearInterp } from '@compx/common/Helpers/Other';
import { PointType } from '@compx/common/Types';
import { StateType as SaveState } from "../../../store/types";
import { VisualGraphStorageType } from '@compx/common/Network/GraphItemStorage/GraphStorage'

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from 'redux';
import { TranslatedCanvasAction, ZoomedCanvasAction } from "../../../store/actions/canvasactions";
import {ThemeType} from "../../../types";

// Get the global state from redux
type GlobalProps = {
    currentGraph: VisualGraphStorageType,
    canvasTranslation: PointType,
    canvasZoom: number
    theme: ThemeType
}

// Add the redux actions to props
interface DispatchProps {
    onZoom: (delta: number, around: PointType) => void,
    onTranslate: (delta: PointType) => void
}

// Local componment props
type ComponentProps = {
    style?: React.CSSProperties
};

// Combine all the props
type PropType = GlobalProps & DispatchProps & ComponentProps

// Set the local state
type StateType = {
    isMouseDownOnCanvas: boolean
};

class Container extends Component<PropType, StateType> {
    private readonly canvasRef: React.MutableRefObject<HTMLDivElement | null>;

    constructor(props: PropType) {
        super(props);

        this.canvasRef = React.createRef();
        this.state = {
            isMouseDownOnCanvas: false
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
            this.props.onTranslate({x: e.movementX, y: e.movementY});
        }
        e.stopPropagation();
    }

    handleZoomClick = (zoomIn: boolean) => {
        const amount = 0.24 * (zoomIn?1:-1);

        let windowCenter: PointType = this.props.canvasTranslation;
        if (this.canvasRef !== null && this.canvasRef.current !== null) {
            const canvasX = this.canvasRef.current.getBoundingClientRect().x
            const canvasY = this.canvasRef.current.getBoundingClientRect().y;
            const canvasWidth = this.canvasRef.current.clientWidth;
            const canvasHeight = this.canvasRef.current.clientHeight;

            windowCenter = ScreenToWorld({
                x: canvasX + (canvasWidth / 2.0),
                y: canvasY + (canvasHeight / 2.0)
            }, this.props.canvasTranslation, this.props.canvasZoom);
        }

        this.props.onZoom(amount, windowCenter);
    }

    // handles how the canvas will zoom with the scroll wheel
    handleScroll = (e: React.WheelEvent) => {
        // converts the position of the mouse on the screen to coordinates in the canvas world
        // this tell the canvas where to zoom around
        const mouseWorld = ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
            this.props.canvasTranslation, this.props.canvasZoom);

        // calculate how much has scrolled and interpolate to the zoom delta
        // also set a clamp to disallow zooms too large or small
        // noinspection JSSuspiciousNameCombination
        let tempScroll = LinearInterp(e.deltaY, -100, 100, -0.2, 0.2);
        this.props.onZoom(tempScroll, mouseWorld)

        e.stopPropagation();
    };

    // centers the canvas
    center = () => {
        if (this.canvasRef !== null && this.canvasRef.current !== null) {
            const canvasWidth = this.canvasRef.current.clientWidth;
            const canvasHeight = this.canvasRef.current.clientHeight;

            const delta = {
                x: (canvasWidth/2.0) - this.props.canvasTranslation.x,
                y: (canvasHeight/2.0) - this.props.canvasTranslation.y
            }
            this.props.onTranslate(delta);
        }
    }

    render() {
        return (
            // Creates a svg canvas to draw the elements on
            <div style={{...this.props.style, width: "100%", height: "100%",
                pointerEvents: "none", overflow: "hidden"}} ref={this.canvasRef}>
                <svg id="Canvas" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
                     pointerEvents="auto" style={{float: 'left', minWidth: "100%", minHeight: "100%"}}
                     preserveAspectRatio="xMaxYMid meet">
                    {/* The background is used to handle the mouse events on the canvas */}
                    <rect id="CanvasBackground" width="100%" height="100%" pointerEvents="auto"
                          onMouseDown={this.onMouseDownHandlerCanvas} onMouseUp={this.onMouseUpHandlerCanvas}
                          onMouseMove={this.onMouseMoveOverHandlerCanvas} onWheel={this.handleScroll} order={0}
                          fill={this.props.theme.palette.background}
                    />

                    {/* The Grid shows the dots and origin of the canvas */}
                    <Grid canvasTranslation={this.props.canvasTranslation}
                          canvasZoom={this.props.canvasZoom} />
                    <GraphComponent graph={this.props.currentGraph}
                                    canvasTranslation={this.props.canvasTranslation}
                                    canvasZoom={this.props.canvasZoom} onWheel={this.handleScroll}/>
                </svg>
                {/*<Keypad centerClickHandler={this.center}*/}
                {/*        zoomInClick={()=>{this.handleZoomClick(true)}}*/}
                {/*        zoomOutClick={()=>{this.handleZoomClick(false)}}/>*/}
            </div>
        )
    }
}

// Creates a function to map the redux state to the redux props
function mapStateToProps(state: SaveState): GlobalProps {
    return {
        theme: state.userStorage.theme,
        currentGraph: state.currentGraph,
        canvasTranslation: state.userStorage.canvas.translation,
        canvasZoom: state.userStorage.canvas.zoom
    };
}

// Creates  a function to map the redux actions to props
function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onTranslate: TranslatedCanvasAction,
        onZoom: ZoomedCanvasAction
    }, dispatch)
}

// Exports the redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Container)

