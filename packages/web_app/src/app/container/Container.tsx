import React, {Component} from 'react';

type PropType = {};
type StateType = {
    sidebar2WidthPct: number,
    terminalHeightPct: number
};

export default class Container extends Component<PropType, StateType> {
    private readonly toolbarHeight: string = "60px";
    private readonly sidebar1Width: string = "75px";

    constructor(props: PropType) {
        super(props);

        this.state = {
            sidebar2WidthPct: 25,
            terminalHeightPct: 25
        }
    }

    render() {
        return (
            <div id="main-container" style={{width: "100%", height: "100%"}}>
                <div id="toolbar-wrapper" style={{width: "100%", height: this.toolbarHeight}} />
                <div id="content1-wrapper" style={{
                    width: "100%", height: `calc(100% - ${this.toolbarHeight})`,
                    display: 'flex', flexFlow: "row nowrap"
                }}>
                    <div id="sidebar1-wrapper" style={{width: this.sidebar1Width, height: "100%", margin: 0}}/>
                    <div id="content2-wrapper" style={{
                        width: `calc(100% - ${this.sidebar1Width})`, height: "100%",
                        display: 'flex', flexFlow: "row nowrap"
                    }}>
                        <div id="sidebar2-wrapper" style={{width: `${this.state.sidebar2WidthPct}%`, height: "100%"}}>
                            <div style={{width: "100%", height: "100%", backgroundColor: "blue"}}/>
                        </div>
                        <div id="main-content-wrapper" style={{
                            width: `calc(100% - ${this.state.sidebar2WidthPct}%)`, height: "100%",
                            display: 'flex', flexFlow: "column nowrap"
                        }}>
                            <div id="canvas-wrapper" style={{height: `calc(100% - ${this.state.terminalHeightPct}%)`, width: "100%"}}>
                                <div style={{width: "100%", height: "100%", backgroundColor: "red"}}/>
                            </div>
                            <div id="terminal-wrapper" style={{height: `${this.state.terminalHeightPct}%`, width: "100%"}}>
                                <div style={{width: "100%", height: "100%", backgroundColor: "black"}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}