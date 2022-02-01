import React, {Component} from 'react';

import Canvas from './Canvas';

import { Glassomorphism } from "../../theme/helpers";
import './Split.css'

type PropType = {};
type StateType = {};

export default class Container extends Component<PropType, StateType> {
    private readonly toolbarHeight: string = "60px";
    private readonly sidebar1Width: string = "45px";
    private readonly borderRadius: string = "25px";
    private readonly paddingAmount: number = 30;

    constructor(props: PropType) {
        super(props);
    }

    render() {
        return (
            <div id="main-container" style={{width: "100%", height: "100%", position: "relative"}}>
                <Canvas style={{position: "absolute", top: 0, left: 0}}/>
                <div id="overlay" style={{
                    zIndex: 1, position: "relative", width: "100%", height: "100%", pointerEvents: "none",
                    display: "flex", flexFlow: "column nowrap"}}>
                    <div className="top-overlay"
                         style={{padding: `${this.paddingAmount/2}px ${this.paddingAmount}px 0px ${this.paddingAmount}px`}}>
                        <div style={{backgroundColor: "red", width: "100%", borderRadius: this.borderRadius, height: this.toolbarHeight}}/>
                    </div>
                    <div style={{width: "100%", height: "100%"}}>
                        <div className="left-overlay"
                             style={{display: "flex", flexFlow: "row nowrap", height: "100%", boxSizing: "border-box",
                                 padding: `${this.paddingAmount}px 0px ${this.paddingAmount}px ${this.paddingAmount/2}px`}}>
                            <div style={{backgroundColor: "red", width: "30px", borderRadius: this.borderRadius, height: "100%", marginRight: `${this.paddingAmount}px`}}/>
                            <div style={{backgroundColor: "red", width: "300px", borderRadius: this.borderRadius, height: "100%"}}/>
                        </div>
                        <div style={{width: "100%", height: "100%", display: "flex", flexFlow: "column nowrap"}}>
                            <div>
                                <div style={{width: "100%", height: "100%"}}/>
                                <div className="right-overlay"
                                     style={{display: "flex", flexFlow: "row nowrap", height: "100%", boxSizing: "border-box",
                                         padding: `${this.paddingAmount}px 0px ${this.paddingAmount}px ${this.paddingAmount/2}px`}}>
                                    <div style={{backgroundColor: "red", width: "30px", borderRadius: this.borderRadius, height: "100%", marginRight: `${this.paddingAmount}px`}}/>
                                    <div style={{backgroundColor: "red", width: "300px", borderRadius: this.borderRadius, height: "100%"}}/>
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}