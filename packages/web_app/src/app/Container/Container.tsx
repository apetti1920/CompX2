import React, {Component} from 'react';
import Panel from "../Helpers/Panel";

type PropType = {};
type StateType = {};

export default class Container extends Component<PropType, StateType> {
    private readonly toolbarHeight: string = "60px";
    private readonly sidebar1Width: string = "45px";

    constructor(props: PropType) {
        super(props);
    }

    render() {
        return (
            <div id="main-container" style={{width: "100%", height: "100%"}}>
                {/* A wrapper for the top toolbar */}
                <div id="toolbar-wrapper" style={{width: "100%", height: this.toolbarHeight}} />

                {/* A wrapper content under the toolbar */}
                <div id="content1-wrapper" style={{
                    width: "100%", height: `calc(100% - ${this.toolbarHeight})`,
                    display: 'flex', flexFlow: "row nowrap"
                }}>
                    {/* A wrapper sidebar on the left */}
                    <div id="sidebar1-wrapper" style={{width: this.sidebar1Width, height: "100%", margin: 0}}/>

                    {/* A wrapper to the right of the sidebar */}
                    <Panel id="content2-wrapper" panel1DefaultPct={20} >
                        {{
                            panel1: (
                                // A wrapper for the resizable sidebar
                                <div id="sidebar2-wrapper">
                                    <div style={{width: "100%", height: "100%", backgroundColor: "blue"}}/>
                                </div>
                            ),
                            panel2: (
                                // A wrapper for the resizable main content area to the right of sidebar2
                                <Panel id="main-content-wrapper" isHorizontal={false} panel1DefaultPct={75}>
                                    {{
                                        panel1: (
                                            // A wrapper for the canvas component
                                            <div id="canvas-wrapper">
                                                <div style={{width: "100%", height: "100%", backgroundColor: "red"}}/>
                                            </div>
                                        ),
                                        panel2: (
                                            // A wrapper for the terminal component
                                            <div id="terminal-wrapper">
                                                <div style={{width: "100%", height: "100%", backgroundColor: "black"}}/>
                                            </div>
                                        )
                                    }}
                                </Panel>
                            )
                        }}
                    </Panel>
                </div>
            </div>
        )
    }
}