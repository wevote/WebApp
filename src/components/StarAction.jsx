import React, { Component, PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';

export default class StarAction extends Component {
    static propTypes = {
        we_vote_id: PropTypes.string
    };

    constructor(props) {
        super(props);
    }
	render() {
        var floatRight = {
            float: 'right'
        };
        var link_script;
        if (this.props.we_vote_id) {
            link_script = <Link to="ballot">
                <span className="glyphicon glyphicon-small glyphicon-star-empty"></span>
            </Link>;
        } else {
            link_script = <Link to="ballot">
                <span className="glyphicon glyphicon-small glyphicon-star-empty"></span>
            </Link>;
        }
		return (
            <span style={floatRight}>
                &nbsp;<span className="glyphicon glyphicon-small glyphicon-star-empty"></span>
            </span>
        );
	}
}
