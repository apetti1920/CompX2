import React, {Component} from 'react';

import { Crosshair } from 'react-feather'
import {Glassomorphism} from "../../../../theme/helpers";
import theme from "../../../../theme";

type PropType = {
    centerClickHandler: ()=>void
};
type StateType = {
    isHovering: boolean
};

export default class Keypad extends Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);

        this.state = {
            isHovering: false
        }
    }
    
    render() {
        const style = this.state.isHovering ? (
            Glassomorphism(theme.palette.text, 2.0, 0.8)):
            (Glassomorphism(theme.palette.shadow, 2.0, 0.1))

        return (
            <div style={{...style, marginBottom: "30px", marginLeft : "30px",
                position: "absolute", bottom: "0px", display: 'flex', justifyContent: 'center', alignItems: 'center',
                padding: '5px', pointerEvents: 'auto', opacity: this.state.isHovering?1.0:0.2
            }}
                 onMouseEnter={()=>this.setState({isHovering: true})}
                 onMouseLeave={()=>this.setState({isHovering: false})}
                 onClick={this.props.centerClickHandler}
            >
                <Crosshair/>
            </div>
        )
    }
}