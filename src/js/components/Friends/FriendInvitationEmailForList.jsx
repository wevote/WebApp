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
    children: PropTypes.array,
    invitationsSentByMe: PropTypes.bool,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_medium: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string,
    invitation_status: PropTypes.string,
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

  deleteFriendInviteEmail (voter_email_address) {
    // console.log("deleteFriendInviteEmail");
    FriendActions.deleteFriendInviteEmail(voter_email_address);
  }

  render () {
    renderLog(__filename);
    const {
      invitationsSentByMe, invitation_status, voter_email_address,
    } = this.props;

    const { voter } = this.state;
    let invitation_status_text;
    if (invitation_status === "PENDING_EMAIL_VERIFICATION") {
      invitation_status_text = "Your invitation will be sent when you verify your email address.";
    } else if (invitation_status === "NO_RESPONSE") {
      invitation_status_text = "";
    }

    const voterGuideLink = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
    const voter_image = <ImageHandler sizeClassName="image-lg " imageUrl="" kind_of_ballot_item="CANDIDATE" />;
    const voter_display_name_formatted = <h4 className="card-child__display-name">{voter_email_address}</h4>;

    return (
      <div className="position-item card-child card-child--not-followed">
        <div className="card-child__avatar">
          { voterGuideLink ? (
            <Link to={voterGuideLink} className="u-no-underline">
              {voter_image}
            </Link>
          ) :
            <span>{voter_image}</span> }
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                {voter_display_name_formatted}
              </Link>
            ) :
              <span>{voter_display_name_formatted}</span> }
            { invitationsSentByMe ?
              <span> has an open invitation from you.</span> :
              <span> invited you.</span>}
            <h5>
              {invitation_status_text}
            </h5>
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              {invitation_status === "PENDING_EMAIL_VERIFICATION" && !voter.signed_in_with_email ? (
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
