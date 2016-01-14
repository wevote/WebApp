import React, { Component, PropTypes } from "react";
import Navigator from 'components/Navigator';
import MoreMenu from 'components/MoreMenu';

import 'stylesheets/main.scss';

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
          <MoreMenu />
          <Navigator />
		</div>
        );
	}
}
