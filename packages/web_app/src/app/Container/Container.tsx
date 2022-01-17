import React, {Component} from 'react';
import SplitPane from 'react-split-pane';

import Canvas from './Canvas';

import './Split.css'

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
                    <div id="sidebar1-wrapper" style={{width: this.sidebar1Width, height: "100%"}}/>

                    {/* Main Content Space */}
                    <SplitPane defaultSize="80%" minSize="5%" maxSize="95%" split='vertical' primary='second'
                               style={{width: `calc(100% - ${this.sidebar1Width})`, height: "100%", position: "unset"}}>
                        {/*A wrapper for the resizable sidebar*/}
                        <div style={{width: "100%", height: "100%",
                            backgroundColor: "blue", borderRadius: "10px", borderColor: 'black', borderWidth: "2px"}}/>

                        {/*// A wrapper for the resizable main content area to the right of sidebar2*/}
                        <SplitPane defaultSize="75%" minSize="5%" maxSize="95%" split='horizontal'>
                            {/*// A wrapper for the canvas component*/}
                            <Canvas />

                            {/*// A wrapper for the terminal component*/}
                            <div style={{width: "100%", height: "100%", backgroundColor: "black",
                                borderRadius: "10px", borderColor: 'black', borderWidth: "2px"}}/>
                        </SplitPane>
                    </SplitPane>
                </div>
            </div>
        )
    }
}