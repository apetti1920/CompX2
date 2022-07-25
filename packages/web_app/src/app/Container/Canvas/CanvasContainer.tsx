import React, {Component} from 'react';

import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {throttle} from "lodash";
import {Stage, Layer, Rect} from 'react-konva';


import { PointType } from '@compx/common/Types'
import {StateType as SaveState} from "../../../store/types";
import {TranslatedCanvasAction, ZoomedCanvasAction} from "../../../store/actions/canvasactions";
import Grid from "./Grid/Grid";
import {ThemeType} from "../../../types";
import GraphComponent from "./Graph/GraphComponent";


type GlobalProps = {
    canvasZoom: number,
    canvasTranslation: PointType,
    theme: ThemeType
}
type DispatchProps = {
    onZoom: (delta: number, around: PointType) => void,
    onTranslate: (point: PointType) => void
}
type ComponentProps = {};
type PropsType = GlobalProps & DispatchProps & ComponentProps
type StateType = {
    canvasSize: PointType
};

class CanvasContainer extends Component<PropsType, StateType> {
    // Initialize some class variables
    private readonly wrapperRef: React.MutableRefObject<HTMLDivElement | null>;

    // Create the Component
    constructor(props: PropsType) {
        super(props);

        // Set the refs
        this.wrapperRef = React.createRef();
        this.state = {
            canvasSize: { x: 0.0, y: 0.0 }
        }
    }

    componentDidMount() {
        // --------------------------------- State Setting -------------------------------------------------------------
        const SetWindowSize = () => {
            // Check if the refs are present
            if (this.wrapperRef.current === null || this.wrapperRef.current === undefined) return;

            this.setState({
                canvasSize: {x: this.wrapperRef.current.clientWidth, y: this.wrapperRef.current.clientHeight}
            });
        };
        SetWindowSize();

        // ----------------------------- Resize Event ------------------------------------------------------------------
        window.addEventListener('resize', throttle(() => requestAnimationFrame(SetWindowSize), 180));
    }

    render() {
        return (
            <div ref={this.wrapperRef} style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}>
                <Stage width={window.innerWidth} height={window.innerHeight}>
                    <Layer id="background">
                        <Rect x={0} y={0}
                              width={this.state.canvasSize.x}
                              height={this.state.canvasSize.y}
                              fill={this.props.theme.palette.background} shadowBlur={10}
                        />
                    </Layer>

                    <Layer id="grid">
                        <Grid screenSize={this.state.canvasSize}
                              canvasTranslation={this.props.canvasTranslation}
                              onTranslate={this.props.onTranslate}
                              canvasZoom={this.props.canvasZoom}
                              onZoom={this.props.onZoom}
                              theme={this.props.theme}
                        />
                    </Layer>

                    <Layer id="graph">
                        <GraphComponent
                            screenSize={this.state.canvasSize} canvasTranslation={this.props.canvasTranslation}
                            canvasZoom={this.props.canvasZoom} theme={this.props.theme} />
                    </Layer>
                </Stage>
            </div>
        )
    }
}

// Creates a function to map the redux state to the redux props
function mapStateToProps(state: SaveState): GlobalProps {
    return {
        canvasZoom: state.userStorage.canvas.zoom,
        canvasTranslation: state.userStorage.canvas.translation,
        theme: state.userStorage.theme
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
export default connect(mapStateToProps, mapDispatchToProps)(CanvasContainer);