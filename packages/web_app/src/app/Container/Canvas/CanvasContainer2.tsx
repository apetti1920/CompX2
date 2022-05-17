import React, {Component} from 'react';
import DrawGrid from "./Grid/CanvasGrid";
import { PointType } from '@compx/common/Types';

type PropType = {};
type StateType = {
    context?: CanvasRenderingContext2D,
    center: PointType
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
            center: { x: 0.0, y: 0.0 },
            pos: {x: 0, y: 0}
        }
    }

    center = () => new Promise<void>((res, rej) => {
        if (this.canvasRef === null || this.canvasRef.current === null) return rej();

        const delta = { x: (this.canvasRef.current.width/2.0), y: (this.canvasRef.current.height/2.0) };
        this.setState({center: delta}, res);
    });

    Draw() {
        if (this.canvasRef.current === null || this.state === undefined || this.state.context === undefined)
            return;
        this.state.context.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);

        const randX = (Math.floor(Math.random() * 20) - 10) / 10;
        const randY = (Math.floor(Math.random() * 20) - 10) / 10;
        this.setState({pos: {x: this.state.pos.x + randX, y: this.state.pos.y + randY}}, () => {
            if (this.state.context === undefined) return;

            this.state.context.fillRect(
                this.state.pos.x - (100 / 2.0) + this.state.center.x,
                this.state.pos.y - (100 / 2.0) + this.state.center.y,
                100, 100
            );

            requestAnimationFrame(() => this.Draw())
        });
    }

    componentDidMount() {
        // Setup Work
        if (this.wrapperRef.current === null || this.wrapperRef.current === undefined) return;
        if (this.canvasRef.current === null || this.canvasRef.current === undefined) return;

        this.canvasRef.current.width = this.wrapperRef.current.clientWidth;
        this.canvasRef.current.height = this.wrapperRef.current.clientHeight;

        const context: CanvasRenderingContext2D | null = this.canvasRef.current.getContext('2d');
        if (context === null) return;

        this.center().then(() => {
            this.setState({context: context}, () => {
                if (this.state.context === undefined || this.canvasRef.current === null) return;
                this.state.context.fillStyle = 'blue';

                DrawGrid(this.state.context, { x: this.canvasRef.current.width, y: this.canvasRef.current.height},
                    this.state.center, 0);
                // requestAnimationFrame(() => this.Draw())
            });
        });
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