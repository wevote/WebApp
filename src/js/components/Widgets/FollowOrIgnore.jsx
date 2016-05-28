"use strict";
import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import GuideActions from "../../actions/GuideActions";

export default class FollowOrIgnore extends Component {
    static propTypes = {
        organization_we_vote_id: PropTypes.string.isRequired,
    };

    render () {
      const ignoreFunc = GuideActions.ignore.bind(this, this.props.organization_we_vote_id);
      const stopFollowingFunc = GuideActions.stopFollowing.bind(this, this.props.organization_we_vote_id);

      return <ButtonToolbar bsClass="bs-btn-toolbar">
            <Button bsClass="bs-btn" bsStyle="info" bsSize="xsmall" className="bs-btn-action bs-hidden-xs" onClick={stopFollowingFunc} data-hover="Unfollow"><span>Following</span></Button>
            <Button bsClass="bs-btn" bsStyle="info" bsSize="xsmall" className="bs-btn-action visible-xs-block utils-margin_bottom5" onClick={stopFollowingFunc} data-hover="Unfollow"><span>Following</span></Button>
            <Button bsClass="bs-btn" bsStyle="danger" bsSize="xsmall" className="hidden-xs" onClick={ignoreFunc}>Ignore</Button>
            <Button bsClass="bs-btn" bsStyle="danger" bsSize="xsmall" className="visible-xs-block" onClick={ignoreFunc}>Ignore</Button>
        </ButtonToolbar>;
    }
}
