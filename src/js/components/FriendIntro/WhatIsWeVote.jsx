import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import SvgImage from '../../common/components/Widgets/SvgImage';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';


const FAQModal = React.lazy(() => import(/* webpackChunkName: 'FAQModal' */ './FAQModal'));

const logoGrey = '../../../img/global/svg-icons/we-vote-icon-square-color-grey.svg';
const voteFlag = '../../../img/get-started/your-vote-counts-cropped-200x200.gif';

class WhatIsWeVote extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showFAQModal: false,
    };
  }

  closeFAQModal = () => {
    this.setState({
      showFAQModal: false,
    });
  }

  toggleFAQModal = () => {
    const { showFAQModal } = this.state;
    this.setState({
      showFAQModal: !showFAQModal,
    });
  }

  render () {
    renderLog('WhatIsWeVote');  // Set LOG_RENDER_EVENTS to log all renders
    const { showFAQModal } = this.state;

    return (
      <WhatIsWeVoteWrapper>
        <CloseButtonDiv>
          <IconButton
            aria-label="Close"
            onClick={this.props.toggleWhatIsWeVote}
            size="large"
          >
            <Close />
          </IconButton>
        </CloseButtonDiv>
        <BodyWrapperWhatIs>
          <FlagImageWrapper>
            <FlagImage src={normalizedImagePath(voteFlag)} alt="Your vote counts" />
          </FlagImageWrapper>
          <WeVoteTextTitle>What is We Vote?</WeVoteTextTitle>
          <WeVoteTextBody>
            We Vote shows you information about the next election, side-by-side with your
            friends&apos; opinions. Use We Vote to track your ballot, see endorsements from your
            network for candidates and measures, and collaborate with people and groups who share your values.
          </WeVoteTextBody>
          <WeVoteLogoWrapper>
            <div style={{ cursor: 'pointer', width: 'fit-content' }} onClick={this.toggleFAQModal}>
              <SvgImage
                imageName={logoGrey}
                stylesTextIncoming="fill: #999 !important; width:48px; height: 48px;"
              />
            </div>
          </WeVoteLogoWrapper>
          <LinkToFAQ>
            <div style={{ cursor: 'pointer', width: 'fit-content' }} onClick={this.toggleFAQModal}>
              Read Our FAQ
            </div>
          </LinkToFAQ>
          {showFAQModal && (
            <Suspense fallback={<></>}>
              <FAQModal
                show={showFAQModal}
                toggleFunction={this.closeFAQModal}
              />
            </Suspense>
          )}
        </BodyWrapperWhatIs>
      </WhatIsWeVoteWrapper>
    );
  }
}
WhatIsWeVote.propTypes = {
  toggleWhatIsWeVote: PropTypes.func.isRequired,
};

const styles = () => ({
});

const BodyWrapperWhatIs = styled('div')`
  padding: 0px 20px 0 20px;
`;

const CloseButtonDiv = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 10px 12px 0 12px;
  z-index: 999;
`;

const FlagImage = styled('img')`
  max-width: 200px;
  align-items:center;
`;

const FlagImageWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const LinkToFAQ = styled('div')`
  color: #999;
  display: flex;
  font-size: 16px;
  justify-content: center;
`;

const WeVoteLogoWrapper = styled('div')`
  color: '#999';
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const WeVoteTextBody = styled('div')`
  color: #555;
  font-size: 16px;
  text-align: center;
`;

const WeVoteTextTitle = styled('div')`
  color: #555;
  font-size: 24px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const WhatIsWeVoteWrapper = styled('div')`
  max-width: 550px;
`;


export default withTheme(withStyles(styles)(WhatIsWeVote));
