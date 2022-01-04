import React, {Component} from 'react';
import Container from "./container/Container";

type PropType = {};
type StateType = {};

export default class App extends Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
    }

    render() {
        return (<Container />)
    }
}