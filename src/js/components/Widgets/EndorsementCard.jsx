import { Recommend } from '@mui/icons-material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { PureComponent, Suspense } from 'react';
import SplitIconButton from '../../common/components/Widgets/SplitIconButton';
import VoterStore from '../../stores/VoterStore';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));


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
    const { classes, organizationWeVoteId, whiteTextOnDarkButton } = this.props;
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
    let backgroundColor = '#fff';
    let fontColor = '#2e3c5d';
    let recommendIcon = <Recommend classes={{ root: classes.recommendDarkTextOnWhite }} />;
    if (whiteTextOnDarkButton) {
      backgroundColor = '#2e3c5d';
      fontColor = '#fff';
      recommendIcon = <Recommend classes={{ root: classes.recommendWhiteTextOnDarkBackground }} />;
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
                      icon={recommendIcon}
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
  classes: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  whiteTextOnDarkButton: PropTypes.bool,
};

const styles = () => ({
  recommendDarkTextOnWhite: {
    color: '#2e3c5d',
  },
  recommendWhiteTextOnDarkBackground: {
    color: '#fff',
  },
});

const Container = styled('div')`
  padding: 16px;
`;

export default withStyles(styles)(EndorsementCard);
