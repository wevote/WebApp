import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
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
  StepNumber,
  StepNumberPlaceholder,
  StepText,
  StepTitle,
} from '../Style/ReadyIntroductionStyles';
import ShowMoreButtons from '../Widgets/ShowMoreButtons';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));

class ReadyFinePrint extends Component {
  constructor (props) {
    super(props);
    this.state = {
      contentUnfurled: false,
    };
  }

  componentDidMount () {
    const { contentUnfurledOnLoad } = this.props;
    this.setState({
      contentUnfurled: contentUnfurledOnLoad,
    });
  }

  contentUnfurledLink = () => {
    const { contentUnfurled } = this.state;
    this.setState({
      contentUnfurled: !contentUnfurled,
    });
  }

  render () {
    renderLog('ReadyFinePrint');  // Set LOG_RENDER_EVENTS to log all renders
    const { contentUnfurled } = this.state;
    const { contentUnfurledOnLoad, showStep3WhenCompressed, titleCentered, titleLarge } = this.props;
    return (
      <OuterWrapper>
        <InnerWrapper>
          <IntroHeader titleCentered={titleCentered} titleLarge={titleLarge}>
            The fine print:
          </IntroHeader>
          <ListWrapper>
            <ListMaxWidth>
              <ListTitleRow>
                <Dot><StepNumber>a</StepNumber></Dot>
                <StepTitle>You cannot cast your vote electronically</StepTitle>
              </ListTitleRow>
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText>We Vote will not submit your vote. You will need to vote in person or vote-by-mail to have your vote count.</StepText>
                </ListRow>
              )}

              <ListTitleRow>
                <Dot><StepNumber>b</StepNumber></Dot>
                <StepTitle>We Vote data comes from official and unofficial sources</StepTitle>
              </ListTitleRow>
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText>
                    <Suspense fallback={<></>}>
                      <ReadMore
                        textToDisplay="We Vote uses ballot data aggregated from government, nonpartisan, and partisan sources.
                        We cannot guarantee 100% of the items on your official ballot will be shown on We Vote.
                        We Vote strives to provide a balanced selection of clearly identified voting guides from newspapers and media.
                        Partisan voter guides are also provided from a diversity of sources and points-of-view.
                        These voting guides are captured and updated by volunteers."
                        numberOfLines={contentUnfurledOnLoad ? 7 : 3}
                      />
                    </Suspense>
                  </StepText>
                </ListRow>
              )}

              {(contentUnfurled || showStep3WhenCompressed) && (
                <ListTitleRow>
                  <Dot><StepNumber>c</StepNumber></Dot>
                  <StepTitle>Please make sure you are registered to vote</StepTitle>
                </ListTitleRow>
              )}
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText>
                    Many states require you to register weeks in advance of each election. Search the web for &quot;voter registration&quot; + your state to learn how to register in time.
                  </StepText>
                </ListRow>
              )}
              {!contentUnfurledOnLoad && (
                <ShowMoreButtons
                  showMoreId="showMoreReadyFinePrintCompressed"
                  showMoreButtonWasClicked={contentUnfurled}
                  showMoreButtonsLink={this.contentUnfurledLink}
                />
              )}
            </ListMaxWidth>
          </ListWrapper>
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}
ReadyFinePrint.propTypes = {
  contentUnfurledOnLoad: PropTypes.bool,
  showStep3WhenCompressed: PropTypes.bool,
  titleCentered: PropTypes.bool,
  titleLarge: PropTypes.bool,
};

export default withTheme(ReadyFinePrint);
