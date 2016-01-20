"use strict";

import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router';
import VoterGuideStore from 'stores/VoterGuideStore';

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

  componentDidMount () {
    VoterGuideStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    VoterGuideStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {
    VoterGuideStore.getBallotItemByWeVoteId(
      this.props.we_vote_id, ballot_item => this.setState({
        VoterStarred: ballot_item.VoterStarred,
      })
    );
  }

    render() {
        var floatRight = {
            float: 'right'
        };
        var action_text;
        if (this.props.action_text) {
            action_text = this.props.action_text;
        } else {
            if (this.state.OrganizationFollowed == "Yes") {
                action_text = 'Followed';
            } else {
                action_text = 'Follow';
            }
        }
		return (
            <span style={floatRight}>
                <ButtonToolbar>
                    <Button bsStyle="info" bsSize="small" onClick={this.toggleFollow.bind(this)}>{action_text}</Button>
                    <Button bsStyle="danger" bsSize="small">Ignore</Button>
                </ButtonToolbar>
            </span>
        );
	}
}
