import { Twitter } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { PureComponent, Suspense } from 'react';
import styled from 'styled-components';
import VoterStore from '../../stores/VoterStore';
import SplitIconButton from './SplitIconButton';
import SvgImage from './SvgImage';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './OpenExternalWebSite'));


class EndorsementCard extends PureComponent {
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
    const { organizationWeVoteId, whiteOnBlue } = this.props;
    const { voter } = this.state;
    if (!voter) {
      return null;
    }
    const { linked_organization_we_vote_id: linkedOrganizationWeVoteId } = voter;

    if (organizationWeVoteId === linkedOrganizationWeVoteId) {
      // Do not offer this component if looking at self.
      return null;
    }
    // console.log('organizationWeVoteId:', organizationWeVoteId, ', linkedOrganizationWeVoteId:', linkedOrganizationWeVoteId);
    let backgroundColor = '';
    let fontColor = '';
    let icon = (
      <SvgImage imageName="positions-icon-24-x-24" width="20px" />
    );
    if (whiteOnBlue) {
      backgroundColor = '#fff';
      fontColor = '#2e3c5d';
      icon = <Twitter />;
    }
    return (
      <div>
        <div className="card">
          <Container>
            <div className="endorsement-card">
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="endorsementCard"
                  url="https://api.wevoteusa.org/vg/create/"
                  target="_blank"
                  title={this.props.title}
                  className="u-no-underline"
                  body={(
                    <SplitIconButton
                      backgroundColor={backgroundColor}
                      buttonText={this.props.buttonText}
                      externalUniqueId="endorsementCardAddEndorsementsToWeVote"
                      fontColor={fontColor}
                      icon={icon}
                      id="endorsementCardAddEndorsementsToWeVote"
                      title="Add endorsements to We Vote"
                    />
                  )}
                />
              </Suspense>
              <div className="endorsement-card__text">
                {this.props.text}
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
EndorsementCard.propTypes = {
  buttonText: PropTypes.string,
  organizationWeVoteId: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  whiteOnBlue: PropTypes.bool,
};

const Container = styled.div`
  padding: 16px;
`;

export default EndorsementCard;
