import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import withTheme from '@mui/styles/withTheme';
import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
// import { Link } from 'react-router-dom';
import { renderLog } from '../../utils/logging';
import {
  Candidate, CandidateNameAndPartyWrapper, CandidateNameH4, CandidateTopRow,
} from '../../../components/Style/BallotStyles';
import { cordovaBallotFilterTopMargin } from '../../../utils/cordovaOffsets';
import standardBoxShadow from '../Style/standardBoxShadow';
import normalizedImagePath from '../../utils/normalizedImagePath';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../../../components/ImageHandler'));

// React functional component example
function ChallengeHeaderSimple (props) {
  renderLog('ChallengeHeaderSimple');  // Set LOG_RENDER_EVENTS to log all renders
  const { challengeTitle, challengeWeVoteId, classes, imageUrlLarge, goToChallengeHome } = props;
  const avatarBackgroundImage = normalizedImagePath('../img/global/svg-icons/avatar-generic.svg');
  const avatarCompressed = 'card-main__avatar-compressed';

  return (
    <ChallengeHeaderSimpleOuterContainer id="politicianHeaderContainer">
      <ChallengeHeaderSimpleInnerContainer>
        <ChallengeHeaderSimpleContentContainer>
          <CandidateTopRow>
            <Candidate
              id={`officeItemCompressedCandidateImageAndName-${challengeWeVoteId}`}
            >
              {/* Candidate Image */}
              <Suspense fallback={<></>}>
                <ImageHandler
                  className={avatarCompressed}
                  sizeClassName="icon-candidate-small u-push--sm "
                  imageUrl={imageUrlLarge}
                  alt=""
                  kind_of_ballot_item="CANDIDATE"
                  style={{ backgroundImage: { avatarBackgroundImage } }}
                />
              </Suspense>
              {/* Candidate Name */}
              <CandidateNameAndPartyWrapper>
                <CandidateNameH4>
                  {challengeTitle}
                </CandidateNameH4>
              </CandidateNameAndPartyWrapper>
            </Candidate>
            <CloseDrawerIconWrapper>
              <div>
                <IconButton
                  aria-label="Close"
                  className={classes.closeButton}
                  id="goToChallengeHome"
                  onClick={goToChallengeHome}
                  size="large"
                >
                  <span className="u-cursor--pointer">
                    <Close classes={{ root: classes.closeIcon }} />
                  </span>
                </IconButton>
              </div>
            </CloseDrawerIconWrapper>
          </CandidateTopRow>
          <HeartToggleAndThermometerWrapper>
            &nbsp;
          </HeartToggleAndThermometerWrapper>
        </ChallengeHeaderSimpleContentContainer>
      </ChallengeHeaderSimpleInnerContainer>
    </ChallengeHeaderSimpleOuterContainer>
  );
}
ChallengeHeaderSimple.propTypes = {
  goToChallengeHome: PropTypes.func,
  challengeTitle: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  imageUrlLarge: PropTypes.string,
};

const styles = () => ({
  closeButton: {
    marginRight: 'auto',
    padding: 6,
  },
  closeIcon: {
    color: '#999',
    width: 24,
    height: 24,
  },
});

const HeartToggleAndThermometerWrapper = styled('div')`
  margin-top: 12px;
`;

const ChallengeHeaderSimpleContentContainer = styled('div')(({ theme }) => (`
  padding: 15px 15px 0 15px;
  margin: ${() => cordovaBallotFilterTopMargin()} auto 0 auto;
  position: relative;
  max-width: 960px;
  width: 100%;
  z-index: 0;
  ${theme.breakpoints.down('sm')} {
    min-height: 10px;
    //margin: 0 10px;
  }
`));

const ChallengeHeaderSimpleOuterContainer = styled('div')`
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #aaa;
  // box-shadow: ${standardBoxShadow('wide')};
  // overflow: hidden;
  // position: fixed;
  z-index: 1;
  right: 0;
`;

const ChallengeHeaderSimpleInnerContainer = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CloseDrawerIconWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export default withTheme(withStyles(styles)(ChallengeHeaderSimple));
