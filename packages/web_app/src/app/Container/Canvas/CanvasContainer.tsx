import React, {Component} from 'react';
import DrawGrid from "./Grid/CanvasGrid";
import {PointType} from "@compx/common/Types";
import {ScreenToWorld} from "../../../helpers";
import {LinearInterp} from '@compx/common/Helpers/Other';
import {StateType as SaveState} from "../../../store/types";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {TranslatedCanvasAction, ZoomedCanvasAction} from "../../../store/actions/canvasactions";
import DrawGraph from "./Graph/GraphComponent";

type GlobalProps = {
    canvasZoom: number,
    canvasTranslation: PointType
}
type DispatchProps = {
    onZoom: (delta: number, around: PointType) => void,
    onTranslate: (point: PointType) => void
}
type ComponentProps = {};
type PropsType = GlobalProps & DispatchProps & ComponentProps
type StateType = {
    context?: CanvasRenderingContext2D,
    mouseDown: boolean
};

class CanvasContainer extends Component<PropsType, StateType> {
    private readonly wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
    private readonly canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;

    constructor(props: PropsType) {
        super(props);

        this.wrapperRef = React.createRef(); this.canvasRef = React.createRef();

        this.state = {
            context: undefined,
            mouseDown: false
        }
    }

    componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<StateType>, snapshot?: any) {
        if (prevProps.canvasZoom !== this.props.canvasZoom || prevProps.canvasTranslation !== this.props.canvasTranslation) {
            requestAnimationFrame(()=>this.Draw());
        }
    }

    center = () => {
        if (this.canvasRef === null || this.canvasRef.current === null) return;

        this.props.onTranslate({x: -this.props.canvasTranslation.x, y: -this.props.canvasTranslation.y});
    }

    Draw() {
        if (this.state.context === undefined || this.canvasRef.current === null) return;
        const size = this.GetWindowSize(); if (size === undefined) return;
        this.state.context.clearRect(0, 0, size.x, size.y);

        DrawGrid(this.state.context, size, this.props.canvasTranslation, this.props.canvasZoom);
        DrawGraph(this.state.context, size, this.props.canvasTranslation, this.props.canvasZoom);
    }

    GetWindowSize(): PointType | undefined {
        if (this.canvasRef.current === null || this.canvasRef.current === undefined) return;
        return { x: this.canvasRef.current.clientWidth, y: this.canvasRef.current.clientHeight};
    }

    componentDidMount() {
        // Setup Work
        if (this.wrapperRef.current === null || this.wrapperRef.current === undefined) return;
        if (this.canvasRef.current === null || this.canvasRef.current === undefined) return;

        this.canvasRef.current.width = this.wrapperRef.current.clientWidth;
        this.canvasRef.current.height = this.wrapperRef.current.clientHeight;

        const context: CanvasRenderingContext2D | null = this.canvasRef.current.getContext('2d');
        if (context === null) return;

        // ----------------------------- Resize ------------------------------------------------------------------------
        window.addEventListener('resize', ()=>requestAnimationFrame(()=>this.Draw()));

        // ----------------------------- Mouse Events ------------------------------------------------------------------
        this.canvasRef.current.addEventListener("mousedown", (e)=> {
            if (e.button === 0) {
                e.preventDefault();
                this.setState({ mouseDown: true });
            }
        }, false);
        this.canvasRef.current.addEventListener("mousemove", (e)=>{
            if (this.state.mouseDown) {
                e.preventDefault();

                this.props.onTranslate({
                    x: this.props.canvasTranslation.x + e.movementX,
                    y: this.props.canvasTranslation.y + e.movementY
                });
            }
        }, false);
        this.canvasRef.current.addEventListener("mouseup", (e)=> {
            if (e.button === 0) {
                this.setState({mouseDown: false});
            }
        }, false);
        this.canvasRef.current.addEventListener("mouseout", (e)=> {
            if (e.button === 0) {
                this.setState({mouseDown: false});
            }
        }, false);

        // ----------------------------- Zoom Events -------------------------------------------------------------------
        this.canvasRef.current.addEventListener("wheel", (e)=>{
            e.preventDefault();
            const size = this.GetWindowSize(); if (size === undefined) return;
            let delta = LinearInterp(-e.deltaY, -100, 100, -0.2, 0.2);

            const zoomAround =  ScreenToWorld(
                {x: e.offsetX, y: e.offsetY},
                this.props.canvasTranslation,
                this.props.canvasZoom, size
            );

            this.props.onZoom(delta, zoomAround);
        });

        // ----------------------------- Context Actions ---------------------------------------------------------------
        this.setState({context: context}, ()=>this.center());
    }

    render() {
        return (
            <div ref={this.wrapperRef} style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}>
                <canvas style={{position: "absolute", width: "100%", height: "100%", pointerEvents: "auto"}}
                        ref={this.canvasRef} />
            </div>
        )
    }
}

// Creates a function to map the redux state to the redux props
function mapStateToProps(state: SaveState): GlobalProps {
    return {
        canvasZoom: state.userStorage.canvas.zoom,
        canvasTranslation: state.userStorage.canvas.translation
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
export default connect(mapStateToProps, mapDispatchToProps)(CanvasContainer)