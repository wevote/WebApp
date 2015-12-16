import React, { Component, PropTypes } from "react";
import Navigator from 'components/Navigator';

export default class Application extends Component {
    static propTypes = {
        children: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // TODO
    }

    componentWillUnmount() {
        // TODO
    }

	render() {
		return (
            <div>
                { this.props.children }
                <Navigator />
		    </div>
        );
	}
}
