import React, {Component, CSSProperties, HTMLProps, useState} from 'react';

type PropType = {
    children: {
        panel1: React.ReactElement,
        panel2: React.ReactElement
    },
    id?: string,
    isHorizontal: boolean,
    panel1DefaultPct: number
};

type StateType = {
    panel1Pct: number
};

function GrabBar(props: {isHorizontal: boolean, onChangePct?: (pct: number)=>void }): React.ReactElement {
    const grabSize = 2;

    const [isHovering, setHover] = useState(false);
    const [isMouseDown, setMouseDown] = useState(false);

    const cursorType: CSSProperties["cursor"] = isHovering?(isMouseDown?(
        props.isHorizontal?"col-resize":"row-resize"
    ):"grab"):"default";
    const commonStyle: CSSProperties = {
        backgroundColor: 'yellow',
        cursor: cursorType
    };

    const dragHandler = (e: React.MouseEvent) => {
        if (isMouseDown) {
            e.stopPropagation();
            e.preventDefault();

            const delta = props.isHorizontal ? e.movementX : e.movementY;
            if (props.onChangePct !== undefined) props.onChangePct(delta);
        }
    }
    const hoverProps: HTMLProps<HTMLDivElement> = {
        onMouseEnter: ()=>setHover(true), onMouseLeave: ()=>setHover(false),
        onMouseDown: ()=>setMouseDown(true), onMouseUp: ()=>setMouseDown(false),
        onMouseMove: (e) => dragHandler(e)
    }

    return (
        props.isHorizontal ? (
            <div style={{height: "100%", width: grabSize, ...commonStyle}} {...hoverProps} />
        ) : (
            <div style={{height: grabSize, width: "100%", ...commonStyle}} {...hoverProps} />
        )
    )
}

export default class Panel extends Component<PropType, StateType> {
    private panelPaddingPct: number = 5;

    public static defaultProps: Partial<PropType> = {
        isHorizontal: true,
        panel1DefaultPct: 50
    };

    constructor(props: PropType) {
        super(props);

        this.state = {
            panel1Pct: (
                this.props.panel1DefaultPct>=this.panelPaddingPct &&
                this.props.panel1DefaultPct <= (100-this.panelPaddingPct)
            )?this.props.panel1DefaultPct:50
        }
    }

    onChangePct = (deltaPct: number) => {
        const newPct = this.state.panel1Pct + deltaPct;
        if (newPct >= this.panelPaddingPct && newPct <= (100-this.panelPaddingPct))
            this.setState({panel1Pct: newPct});
    }

    render() {
        return (
            <div id={this.props.id} style={{
                width: "100%", height: "100%", display: "flex",
                flexFlow: `${this.props.isHorizontal?"row":"column"} nowrap`
            }}>
                { React.cloneElement(this.props.children.panel1,
                    { style: {
                        ...this.props.children.panel1.props.style,
                            width: this.props.isHorizontal?`${this.state.panel1Pct}%`:"100%",
                            height: this.props.isHorizontal?"100%":`${this.state.panel1Pct}%`
                    }})
                }
                <GrabBar isHorizontal={this.props.isHorizontal} onChangePct={this.onChangePct}/>
                { React.cloneElement(this.props.children.panel2,
                    { style: {
                            ...this.props.children.panel2.props.style,
                            width: this.props.isHorizontal?`${100-this.state.panel1Pct}%`:"100%",
                            height: this.props.isHorizontal?"100%":`${100-this.state.panel1Pct}%`
                        }})
                }
            </div>
        )
    }
}