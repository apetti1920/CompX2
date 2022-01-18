import React, {Component} from 'react';

import { Crosshair } from 'react-feather'

type PropType = {
    style?: React.CSSProperties
};
type StateType = {};

export default class Keypad extends Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
    }
    
    render() {
        return (
            <div style={{...this.props.style, marginBottom: "5px", marginLeft : "5px",
                width: "150px", height: "100px", position: "absolute", bottom: "0px" }}>
                <Crosshair/>
            </div>
        )
    }
}