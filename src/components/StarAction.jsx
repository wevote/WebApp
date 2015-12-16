import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";
import { Link } from "react-router";

export default class StarAction extends React.Component {
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
