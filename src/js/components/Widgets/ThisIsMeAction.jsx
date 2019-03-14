import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

export default class ThisIsMeAction extends Component {
  static propTypes = {
    name_being_viewed: PropTypes.string,
    twitter_handle_being_viewed: PropTypes.string,
    kind_of_owner: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    const { twitter_handle_being_viewed: twitterHandleBeingViewed } = this.props;
    if (!twitterHandleBeingViewed) {
      // We do not want to show the "This is me" link if there isn't a twitter_handle associated with this organization
      return <span />;
    }
    const { kind_of_owner: kindOfOwner, name_being_viewed: nameBeingViewed } = this.props;
    // Manage the control over this organization voter guide
    const { voter } = this.state;
    const signedInTwitter = voter === undefined ? false : voter.signed_in_twitter;
    let signedInWithThisTwitterAccount = false;
    if (signedInTwitter && voter.twitter_screen_name && twitterHandleBeingViewed) {
      signedInWithThisTwitterAccount = voter.twitter_screen_name.toLowerCase() === twitterHandleBeingViewed.toLowerCase();
    }
    let thisIsMeActionText;
    if (kindOfOwner === 'ORGANIZATION') {
      if (nameBeingViewed) {
        thisIsMeActionText = `I represent ${nameBeingViewed}`;
      } else {
        thisIsMeActionText = 'I represent this organization';
      }
    } else if (kindOfOwner === 'POLITICIAN') {
      if (nameBeingViewed) {
        thisIsMeActionText = `I represent ${nameBeingViewed}`;
      } else {
        thisIsMeActionText = 'I represent this politician';
      }
    } else {
      thisIsMeActionText = 'This is me';
    }

    return (
      <span>
        {signedInWithThisTwitterAccount ?
          <span /> : (
            <Link to={`/verifythisisme/${twitterHandleBeingViewed}`}>
              <span className="u-wrap-links">
                {thisIsMeActionText}
              </span>
            </Link>
          )}
      </span>
    );
  }
}
