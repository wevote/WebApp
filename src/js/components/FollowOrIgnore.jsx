"use strict";
import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import GuideActions from "../actions/GuideActions";

export default class FollowOrIgnore extends Component {
    static propTypes = {
        organization_we_vote_id: PropTypes.string.isRequired,
    };

    render () {
      const ignoreFunc = GuideActions.ignore.bind(this, this.props.organization_we_vote_id);
      const stopFollowingFunc = GuideActions.stopFollowing.bind(this, this.props.organization_we_vote_id);

      return <ButtonToolbar>
                <Button bsStyle="info" bsSize="xsmall" className="hidden-xs" onClick={stopFollowingFunc}>Following</Button>
                <Button bsStyle="info" bsSize="xsmall" className="visible-xs-block utils-margin_bottom5" onClick={stopFollowingFunc}>Following</Button>
                <Button bsStyle="danger" bsSize="xsmall" className="hidden-xs" onClick={ignoreFunc}>Ignore</Button>
                <Button bsStyle="danger" bsSize="xsmall" className="visible-xs-block" onClick={ignoreFunc}>Ignore</Button>
            </ButtonToolbar>
	}
}
