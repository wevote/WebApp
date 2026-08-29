import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { renderLog } from '../../common/utils/logging';
import {
  Dot,
  InnerWrapper,
  IntroHeader,
  ListMaxWidth,
  ListRow,
  ListTitleRow,
  ListWrapper,
  OuterWrapper,
  ShowMoreWrapper,
  StepNumber,
  StepNumberPlaceholder,
  StepText,
  StepTitle,
} from '../Style/ReadyIntroductionStyles';
import ShowMoreButtons from '../Widgets/ShowMoreButtons';

function ReadyFinePrint ({ contentUnfurledOnLoad, showStep3WhenCompressed, titleCentered, titleLarge }) {
  renderLog('ReadyFinePrint');  // Set LOG_RENDER_EVENTS to log all renders
  const [contentUnfurled, setContentUnfurled] = useState(contentUnfurledOnLoad);
  const introHeaderRef = useRef(null);

  const contentUnfurledLink = () => {
    setContentUnfurled(!contentUnfurled);
    if (!contentUnfurled) {
      introHeaderRef.current.focus();
    }
  };

  return (
    <OuterWrapper>
      <InnerWrapper>
        <IntroHeader id="theFinePrintHeaderText" titleCentered={titleCentered} titleLarge={titleLarge} tabIndex={0} ref={introHeaderRef}>
          The fine print:
        </IntroHeader>
        <ListWrapper>
          <ListMaxWidth>
            <ListTitleRow onClick={contentUnfurledLink}>
              <Dot><StepNumber id="finePrintMenuItema">a</StepNumber></Dot>
              <StepTitle id="finePrintTextMenuHeadera">You cannot cast your vote electronically</StepTitle>
            </ListTitleRow>
            {contentUnfurled && (
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText id="readyFinePrintStepTexta">WeVote will not submit your vote. You will need to vote in person or vote-by-mail to have your vote count.</StepText>
              </ListRow>
            )}

            <ListTitleRow onClick={contentUnfurledLink}>
              <Dot><StepNumber id="finePrintMenuItemb">b</StepNumber></Dot>
              <StepTitle id="finePrintTextMenuHeaderb">WeVote does not represent a government entity</StepTitle>
            </ListTitleRow>
            {contentUnfurled && (
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText id="readyFinePrintStepTextb">
                  WeVote provides ballot data collected from
                  {' '}
                  <Link to="/election-data" className="u-link-color">official government websites</Link>
                  . We work to include 100% of the items on your official ballot, but we can’t guarantee complete coverage.
                  WeVote should not be considered official government information.
                  WeVote strives to provide a balanced selection of clearly identified voting guides from newspapers, media, and nonpartisan sources.
                  Partisan voter guides are also provided from a diversity of sources and points-of-view.
                </StepText>
              </ListRow>
            )}

            {(contentUnfurled || showStep3WhenCompressed) && (
              <ListTitleRow onClick={contentUnfurledLink}>
                <Dot><StepNumber id="finePrintMenuitemc">c</StepNumber></Dot>
                <StepTitle id="finePrintTextMenuHeaderc">Please make sure you are registered to vote</StepTitle>
              </ListTitleRow>
            )}
            {contentUnfurled && (
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText id="readyFinePrintStepTextc">
                  Many states require you to register weeks in advance of each election. Search the web for &quot;voter registration&quot; + your state to learn how to register in time.
                </StepText>
              </ListRow>
            )}

            {(contentUnfurled || showStep3WhenCompressed) && (
              <ListTitleRow onClick={contentUnfurledLink}>
                <Dot><StepNumber id="finePrintStepd">d</StepNumber></Dot>
                <StepTitle id="finePrintTextMenuHeaderd">How your data is used  &amp; protected</StepTitle>
              </ListTitleRow>
            )}
            {contentUnfurled && (
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText id="readyFinePrintStepTextd">
                  WeVote will never share or sell your contact information.
                  {' '}
                  <Link to="/privacy" className="u-link-color">See full privacy policy here</Link>
                  {' '}
                  which includes description of how we use and protect your data.
                </StepText>
              </ListRow>
            )}
            {!contentUnfurledOnLoad && (
              <ShowMoreWrapper>
                <ShowMoreButtons
                  showMoreId="showMoreReadyFinePrintCompressed"
                  showMoreButtonWasClicked={contentUnfurled}
                  showMoreButtonsLink={contentUnfurledLink}
                />
              </ShowMoreWrapper>
            )}
          </ListMaxWidth>
        </ListWrapper>
      </InnerWrapper>
    </OuterWrapper>
  );
}
ReadyFinePrint.propTypes = {
  contentUnfurledOnLoad: PropTypes.bool,
  showStep3WhenCompressed: PropTypes.bool,
  titleCentered: PropTypes.bool,
  titleLarge: PropTypes.bool,
};

export default ReadyFinePrint;
