import React, {Component} from 'react';

type PropType = {
    children: {
        panel1: React.ReactNode,
        panel2: React.ReactNode
    }
};
type StateType = {};

export default class Panel extends Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}