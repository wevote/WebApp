"use strict";
import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import GuideActions from "../actions/GuideActions";

export default class FollowOrIgnore extends Component {
    static propTypes = {
        organization_we_vote_id: PropTypes.string.isRequired,
    };

    render () {
      var ignoreFunc = GuideActions.ignore.bind(this, this.props.organization_we_vote_id);
      var stopFollowingFunc = GuideActions.stopFollowing.bind(this, this.props.organization_we_vote_id);

        var floatRight = {
            float: "right"
        };

      return (
            <span style={floatRight}>
                <ButtonToolbar>
                    <Button bsStyle="info" bsSize="small" onClick={stopFollowingFunc}>Following</Button>
                    <Button bsStyle="danger" bsSize="small" onClick={ignoreFunc}>Ignore</Button>
                </ButtonToolbar>
            </span>
        );
	}
}
