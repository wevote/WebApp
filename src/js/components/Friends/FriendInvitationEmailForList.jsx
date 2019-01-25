import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import FriendActions from "../../actions/FriendActions";
import ImageHandler from "../ImageHandler";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";

export default class FriendInvitationEmailForList extends Component {
  static propTypes = {
    invitationsSentByMe: PropTypes.bool,
    invitation_status: PropTypes.string, // Comes friend data object from API server
    // voter_display_name: PropTypes.string, // Comes friend data object from API server
    voter_email_address: PropTypes.string, // Comes friend data object from API server
    // voter_photo_url_medium: PropTypes.string, // Comes friend data object from API server
    // voter_twitter_description: PropTypes.string, // Comes friend data object from API server
    // voter_twitter_followers_count: PropTypes.number, // Comes friend data object from API server
    voter_twitter_handle: PropTypes.string, // Comes friend data object from API server
    // voter_we_vote_id: PropTypes.string, // Comes friend data object from API server
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {},
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  deleteFriendInviteEmail (voterEmailAddress) {
    // console.log("deleteFriendInviteEmail");
    FriendActions.deleteFriendInviteEmail(voterEmailAddress);
  }

  render () {
    renderLog(__filename);
    const {
      invitationsSentByMe, invitation_status: invitationState, voter_email_address: voterEmailAddress,
    } = this.props;

    const { voter } = this.state;
    let invitationStateText;
    if (invitationState === "PENDING_EMAIL_VERIFICATION") {
      invitationStateText = "Your invitation will be sent when you verify your email address.";
    } else if (invitationState === "NO_RESPONSE") {
      invitationStateText = "";
    }

    const voterGuideLink = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
    const voterImage = <ImageHandler sizeClassName="image-lg " imageUrl="" kind_of_ballot_item="CANDIDATE" />;
    const voterDisplayNameFormatted = <h4 className="card-child__display-name">{voterEmailAddress}</h4>;

    return (
      <div className="position-item card-child card-child--not-followed">
        <div className="card-child__avatar">
          { voterGuideLink ? (
            <Link to={voterGuideLink} className="u-no-underline">
              {voterImage}
            </Link>
          ) :
            <span>{voterImage}</span> }
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                {voterDisplayNameFormatted}
              </Link>
            ) :
              <span>{voterDisplayNameFormatted}</span> }
            { invitationsSentByMe ?
              <span> has an open invitation from you.</span> :
              <span> invited you.</span>}
            <h5>
              {invitationStateText}
            </h5>
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              {invitationState === "PENDING_EMAIL_VERIFICATION" && !voter.signed_in_with_email ? (
                <Link to="/settings/account">
                  <Button size="small" variant="warning">
                  Verify Your Email
                  </Button>
                </Link>
              ) : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
