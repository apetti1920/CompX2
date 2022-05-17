// import React, {Component} from 'react';
// import { debounce } from 'lodash'
// import { PointType } from '@compx/common/Types';
//
// type PropType = {};
// type StateType = {};
//
// export default class CanvasContainer extends Component<PropType, StateType> {
//     private readonly wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
//     private readonly canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
//
//     constructor(props: PropType) {
//         super(props);
//
//         this.wrapperRef = React.createRef();
//         this.canvasRef = React.createRef();
//
//         this.state = {
//             isMouseDownOnCanvas: false,
//             canvasTranslation: {x: 0, y: 0},
//             shapes: [
//                 {position: { x: 300, y: 300}, size: { x: 50, y: 50 }},
//                 {position: { x: 800, y: 800}, size: { x: 75, y: 75 }}
//             ]
//         }
//     }
//
//     center = () => new Promise<void>((res, rej) => {
//         if (this.canvasRef === null || this.canvasRef.current === null) return rej();
//
//         const delta = { x: (this.canvasRef.current.width/2.0), y: (this.canvasRef.current.height/2.0) };
//         this.setState({canvasTranslation: delta}, res);
//     });
//
//     // Handles the state change when the mouse is pressed
//     onMouseDownHandlerCanvas = (e: React.MouseEvent) => {
//         e.preventDefault();
//         this.setState({isMouseDownOnCanvas: true});
//         e.stopPropagation();
//     }
//
//     // Handles the state change when the mouse is depressed
//     onMouseUpHandlerCanvas = (e: React.MouseEvent) => {
//         e.preventDefault();
//         this.setState({isMouseDownOnCanvas: false});
//         e.stopPropagation();
//     }
//
//     // Changes the translation of the map utilizing the delta mouse moves
//     onMouseMoveOverHandlerCanvas = (e: React.MouseEvent) => {
//         e.preventDefault();
//
//         // only changes position if the mouse is down
//         if (this.state.isMouseDownOnCanvas) {
//             this.setState({ canvasTranslation: { x: e.movementX, y: e.movementY }}, ()=>{
//                 console.log("set translation", this.state.canvasTranslation)
//             });
//         }
//         e.stopPropagation();
//     }
//
//     draw = (context: CanvasRenderingContext2D) => {
//         this.state.shapes.forEach(shape => {
//             context.fillStyle = 'blue';
//             context.fillRect(
//                 shape.position.x - (shape.size.x / 2.0),
//                 shape.position.y - (shape.size.y / 2.0),
//                 shape.size.x, shape.size.y
//             );
//         });
//     }
//
//     resize = () => {
//         this.center().then(() => {
//             if (this.wrapperRef.current === null || this.wrapperRef.current === undefined) return;
//             if (this.canvasRef.current === null || this.canvasRef.current === undefined) return;
//
//             this.canvasRef.current.width = this.wrapperRef.current.clientWidth;
//             this.canvasRef.current.height = this.wrapperRef.current.clientHeight;
//
//             const context: CanvasRenderingContext2D | null = this.canvasRef.current.getContext('2d');
//             if (context === null) return;
//
//             this.draw(context);
//         });
//     }
//
//     debouncedResize = debounce(this.resize, 300);
//
//     componentDidMount() {
//         window.addEventListener('resize', this.debouncedResize);
//         this.resize();
//     }
//
//     componentWillUnmount() {
//         window.removeEventListener('resize', this.debouncedResize);
//     }
//
//     render() {
//         return (
//             <div ref={this.wrapperRef} style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}>
//                 <canvas style={{position: "absolute", width: "100%", height: "100%", pointerEvents: "auto"}}
//                         onMouseDown={this.onMouseDownHandlerCanvas} onMouseOver={this.onMouseMoveOverHandlerCanvas}
//                         onMouseUp={this.onMouseUpHandlerCanvas} ref={this.canvasRef} />
//             </div>
//         )
//     }
// }