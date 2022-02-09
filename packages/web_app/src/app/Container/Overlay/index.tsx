import React, {Component} from 'react';
import { connect } from "react-redux";

import { Trash,  User, Play, } from 'react-feather';
import { Container, Navbar, Form } from "react-bootstrap";

import { StateType as SaveState } from '../../../store/types'
import { ThemeType } from "../../../types";
import { SetOpacity } from "../../../theme/helpers";

type GlobalProps = {
    theme: ThemeType
}
type DispatchProps = {}
type ComponentProps = {
    style?: React.CSSProperties
};

type PropsType = GlobalProps & DispatchProps & ComponentProps
type StateType = {};

class Overlay extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
    }

    render() {
        return (
            <div id="overlay" style={{...this.props.style, display: "flex", flexFlow: "column nowrap",
                width: "100%", height: "100%"}}>
                <div style={{
                    width: "100%",
                    height: "150px",
                    background: `linear-gradient(to top, ${SetOpacity(this.props.theme.palette.background, 0.0)}, 
                                    ${SetOpacity(this.props.theme.palette.background, 1.0)})`,
                    pointerEvents: "auto"
                }}>
                    <Container fluid style={{height: "50px", padding: "0px 60px 0px 60px"}}>
                        <Navbar>
                            <Container fluid>
                                <Navbar.Brand style={{color: this.props.theme.palette.text}}>
                                    <Trash width="30" height={30} stroke={this.props.theme.palette.text}/>
                                    React Bootstrap
                                </Navbar.Brand>
                                <Navbar.Collapse className="justify-content-end">
                                    <User stroke={this.props.theme.palette.text}/>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </Container>
                    <Container fluid style={{height: "40px", padding: "0px 60px 0px 60px"}}>
                        <div style={{
                            width: "100%", height: "100%", backgroundColor: this.props.theme.palette.text,
                            borderRadius: "25px", display: "flex", flexFlow: "row nowrap", padding: "0px 25px 0px 25px"
                        }}>
                            <div style={{width: "50%", height: "100%", display: "flex", flexFlow: "row nowrap", alignItems: "center", gap: "5px"}}>

                            </div>
                            <div style={{
                                width: "50%", height: "100%", display: "flex", flexFlow: "row nowrap",
                                justifyContent: "flex-end", alignItems: "center", gap: "5px"
                            }}>
                                <Play/>
                                <Form.Control
                                    type="text" size="sm" placeholder="Simulation Time" style={{width: "200px"}}
                                    onChange={()=>console.log("Changed")}/>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
        )
    }
}

// Creates a function to map the redux state to the redux props
function mapStateToProps(state: SaveState): GlobalProps {
    return {
        theme: state.userStorage.theme
    };
}

// Exports the redux connected component
export default connect(mapStateToProps, {})(Overlay)
