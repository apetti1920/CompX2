import React, {Component} from 'react';
import DrawGrid from "./Grid/CanvasGrid";
import { PointType } from '@compx/common/Types';
import {ScreenToWorld} from "../../../helpers";
import {Clamp, LinearInterp} from '@compx/common/Helpers/Other';

type PropType = {};
type StateType = {
    context?: CanvasRenderingContext2D,
    mouseDown: boolean,
    center: PointType,
    zoom: number,
    pos: PointType
};

export default class CanvasContainer2 extends Component<PropType, StateType> {
    private readonly wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
    private readonly canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;

    constructor(props: PropType) {
        super(props);

        this.wrapperRef = React.createRef(); this.canvasRef = React.createRef();

        this.state = {
            context: undefined,
            mouseDown: false,
            center: { x: 0.0, y: 0.0 },
            zoom: 1,
            pos: {x: 0, y: 0}
        }
    }

    center = () => {
        if (this.canvasRef === null || this.canvasRef.current === null) return;

        // const delta = { x: (this.canvasRef.current.width/2.0), y: (this.canvasRef.current.height/2.0) };
        this.setState({center: {x: 0, y: 0}}, ()=>requestAnimationFrame(()=>this.Draw()));
    }

    // Draw() {
    //     if (this.canvasRef.current === null || this.state === undefined || this.state.context === undefined)
    //         return;
    //     this.state.context.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    //
    //     const randX = (Math.floor(Math.random() * 20) - 10) / 10;
    //     const randY = (Math.floor(Math.random() * 20) - 10) / 10;
    //     this.setState({pos: {x: this.state.pos.x + randX, y: this.state.pos.y + randY}}, () => {
    //         if (this.state.context === undefined) return;
    //
    //         this.state.context.fillRect(
    //             this.state.pos.x - (100 / 2.0) + this.state.center.x,
    //             this.state.pos.y - (100 / 2.0) + this.state.center.y,
    //             100, 100
    //         );
    //
    //         requestAnimationFrame(() => this.Draw())
    //     });
    // }

    Draw() {
        if (this.state.context === undefined || this.canvasRef.current === null) return;

        const size = { x: this.canvasRef.current.clientWidth, y: this.canvasRef.current.clientHeight};
        this.state.context.clearRect(0, 0, size.x, size.y);

        DrawGrid(this.state.context, size, this.state.center, this.state.zoom);
    }

    componentDidMount() {
        // Setup Work
        if (this.wrapperRef.current === null || this.wrapperRef.current === undefined) return;
        if (this.canvasRef.current === null || this.canvasRef.current === undefined) return;

        this.canvasRef.current.width = this.wrapperRef.current.clientWidth;
        this.canvasRef.current.height = this.wrapperRef.current.clientHeight;

        const context: CanvasRenderingContext2D | null = this.canvasRef.current.getContext('2d');
        if (context === null) return;

        // mouse events
        window.addEventListener('resize', ()=>requestAnimationFrame(()=>this.Draw()));
        this.canvasRef.current.addEventListener("mousedown", (e)=> {
            if (e.button === 0) {
                this.setState({mouseDown: true});
            }
        }, false);
        this.canvasRef.current.addEventListener("mousemove", (e)=>{
            if (this.state.mouseDown) {
                this.setState({
                    center: {x: this.state.center.x - e.movementX, y: this.state.center.y + e.movementY}
                }, ()=>{
                    requestAnimationFrame(()=>this.Draw());
                });
            }
        }, false);
        this.canvasRef.current.addEventListener("mouseup", (e)=> {
            if (e.button === 0) {
                this.setState({mouseDown: false});
            }
        }, false);
        this.canvasRef.current.addEventListener("wheel", (e)=>{
            e.preventDefault();
            if (this.canvasRef.current === null || this.canvasRef.current === undefined) return;
            const size = { x: this.canvasRef.current.clientWidth, y: this.canvasRef.current.clientHeight};

            let tempScroll = LinearInterp(-e.deltaY, -100, 100, -0.2, 0.2);
            const newZoom = this.state.zoom + tempScroll;
            const clampedZoom = Clamp(newZoom, 1/3, 4);
            const scaleChange = clampedZoom - this.state.zoom;


            let zoomAround = ScreenToWorld({x: e.offsetX - (size.x/2.0), y: e.offsetY - (size.y/2.0)},
                this.state.center, this.state.zoom);
            const newTranslation = {
                x: this.state.center.x + (zoomAround.x * scaleChange),
                y:  this.state.center.y - (zoomAround.y * scaleChange)
            }
            // console.log(e.offsetX, e.offsetY, size, this.state.center, scaleChange, zoomAround);

            this.setState({zoom: clampedZoom, center: newTranslation}, ()=>requestAnimationFrame(()=>this.Draw()));
        });

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