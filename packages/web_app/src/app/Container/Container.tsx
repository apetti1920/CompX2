import React, {Component} from 'react';
import SplitPane from 'react-split-pane';

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
                    <div id="sidebar1-wrapper" style={{width: this.sidebar1Width, height: "100%", margin: 0}}/>

                    <SplitPane defaultSize="20%" minSize="5%" maxSize="95%" split='vertical'>
                        {/*A wrapper for the resizable sidebar*/}
                        <div style={{width: "100%", height: "100%", backgroundColor: "blue"}}/>

                        {/*// A wrapper for the resizable main content area to the right of sidebar2*/}
                        <SplitPane defaultSize="75%" minSize="5%" maxSize="95%" split='horizontal'>
                            {/*// A wrapper for the canvas component*/}
                            <div style={{width: "100%", height: "100%", backgroundColor: "red"}}/>

                            {/*// A wrapper for the terminal component*/}
                            <div style={{width: "100%", height: "100%", backgroundColor: "black"}}/>
                        </SplitPane>
                    </SplitPane>

                    {/* A wrapper to the right of the sidebar */}
                </div>
            </div>
        )
    }
}