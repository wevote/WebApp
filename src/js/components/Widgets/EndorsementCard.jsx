import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import OpenExternalWebSite from './OpenExternalWebSite';
import positionIcon from '../../../img/global/svg-icons/positions-icon-24-x-24.svg';
import SplitIconButton from './SplitIconButton';
import VoterStore from '../../stores/VoterStore';

class EndorsementCard extends PureComponent {
  static propTypes = {
    buttonText: PropTypes.string,
    organizationWeVoteId: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
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
    const { organizationWeVoteId } = this.props;
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
    return (
      <div>
        <div className="card">
          <Container>
            <div className="endorsement-card">
              <OpenExternalWebSite
                url="https://api.wevoteusa.org/vg/create/"
                target="_blank"
                title={this.props.title}
                className="u-no-underline"
                body={(
                  <SplitIconButton
                    title="Add endorsements to We Vote"
                    id="endorsementCardAddEndorsementsToWeVote"
                    icon={<img src={cordovaDot(positionIcon)} alt="" />}
                    buttonText={this.props.buttonText}
                  />
                )}
              />
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

const Container = styled.div`
  padding: 16px;
`;

export default EndorsementCard;
