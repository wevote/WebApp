import React, { PropTypes } from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";

export default class AskOrShareAction extends React.Component {
	static propTypes = {
		link_text: PropTypes.string
	}

	render() {
        var link_text;
        if (this.props.link_text) {
            link_text = this.props.link_text;
        } else {
            link_text = "Ask or Share";
        }
		return (
			<span>
			    <span className="glyphicon glyphicon-small glyphicon-share-alt"></span>
			    <DropdownButton bsStyle="link" title={link_text} id="17">
			        <MenuItem eventKey="1">Email</MenuItem>
			        <MenuItem eventKey="2">Facebook</MenuItem>
			        <MenuItem eventKey="3">Twitter</MenuItem>
			        <MenuItem eventKey="4">Copy Link</MenuItem>
			    </DropdownButton>
			</span>
        );
	}
}
