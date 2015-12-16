"use strict";

import React from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router";

export default class FollowOrIgnoreAction extends React.Component {
	render() {
        var floatRight = {
            float: 'right'
        };
        var action_text;
        if (this.props.action_text) {
            action_text = this.props.action_text;
        } else {
            action_text = 'Follow';
        }
		return (
            <span style={floatRight}>
                <ButtonToolbar>
                    <Button bsStyle="info" bsSize="small">{action_text}</Button>
                    <Button bsStyle="danger" bsSize="xsmall">Ignore</Button>
                </ButtonToolbar>
            </span>
        );
	}
}
