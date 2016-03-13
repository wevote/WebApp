"use strict";

import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import VoterGuideStore from "../stores/VoterGuideStore";

export default class FollowOrIgnore extends Component {
    static propTypes = {
        organization_we_vote_id: PropTypes.string,
        action: PropTypes.object.isRequired,
        action_text: PropTypes.string,
        OrganizationFollowed: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
          OrganizationFollowed: this.props.OrganizationFollowed,
        };
    }

  toggleFollow (evt) {
    evt.stopPropagation();
    if (this.state.OrganizationFollowed == "Yes")
      this.props.action.stopFollowingOrg(this.props.organization_we_vote_id);
    else
      this.props.action.followOrg(this.props.organization_we_vote_id);
  }

  ignoreOrgLocal (evt) {
    evt.stopPropagation();
    this.props.action.ignoreOrg(this.props.organization_we_vote_id);
  }

  componentDidMount () {
    this.changeListener = this._onChange.bind(this);
    VoterGuideStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount() {
    VoterGuideStore.removeChangeListener(this.changeListener);
  }

  _onChange () {
    VoterGuideStore.getVoterGuideByWeVoteId(
      this.props.we_vote_id, voter_guide => this.setState({
        OrganizationFollowed: voter_guide.OrganizationFollowed,
      })
    );
  }

    render() {
        var floatRight = {
            float: "right"
        };
        var action_text;
        if (this.props.action_text) {
            action_text = this.props.action_text;
        } else {
            if (this.state.OrganizationFollowed == "Yes") {
                action_text = "Followed";
            } else {
                action_text = "Follow";
            }
        }
        var ignore_code;
        if (this.state.OrganizationFollowed != "Yes") {
            ignore_code = <Button bsStyle="danger" bsSize="small" onClick={this.ignoreOrgLocal.bind(this)}>Ignore</Button>
        }
      
      return (
            <span style={floatRight}>
                <ButtonToolbar>
                    <Button bsStyle="info" bsSize="small" onClick={this.toggleFollow.bind(this)}>{action_text}</Button>
                    {ignore_code}
                </ButtonToolbar>
            </span>
        );
	}
}
