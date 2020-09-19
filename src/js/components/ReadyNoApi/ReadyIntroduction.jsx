import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import ReadMore from '../Widgets/ReadMore';
import ShowMoreButtons from './ShowMoreButtons';

class ReadyIntroduction extends Component {
  static propTypes = {
    showStep3WhenCompressed: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      contentUnfurled: false,
    };
  }

  contentUnfurledLink = () => {
    const { contentUnfurled } = this.state;
    this.setState({
      contentUnfurled: !contentUnfurled,
    });
  }

  render () {
    renderLog('ReadyIntroduction');  // Set LOG_RENDER_EVENTS to log all renders
    const { contentUnfurled } = this.state;
    const { showStep3WhenCompressed } = this.props;
    // const numberOfCandidates = '12,600';
    // const numberOfOffices = '6,500';
    return (
      <OuterWrapper>
        <InnerWrapper>
          <IntroHeader>
            <span className="u-show-mobile-tablet">
              We Vote helps you:
            </span>
            <span className="u-show-desktop">
              We Vote helps you:
            </span>
          </IntroHeader>
          <ListWrapper>
            <ListMaxWidth>
              <ListTitleRow>
                <Dot><StepNumber>1</StepNumber></Dot>
                <StepTitle>Be ready to vote in 6 minutes</StepTitle>
              </ListTitleRow>
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText>Make a plan for casting your vote. See your entire ballot. Find your polling location.</StepText>
                </ListRow>
              )}

              <ListTitleRow>
                <Dot><StepNumber>2</StepNumber></Dot>
                <StepTitle>Be confident in your choices</StepTitle>
              </ListTitleRow>
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText>
                    <ReadMore
                      textToDisplay="Who's running for office? We show you what will be on your actual ballot, based on your full address. What do your trusted friends think about what is on the ballot? We Vote helps you make sense of your options."
                      numberOfLines={3}
                    />
                  </StepText>
                </ListRow>
              )}

              {(contentUnfurled || showStep3WhenCompressed) && (
                <ListTitleRow>
                  <Dot><StepNumber>3</StepNumber></Dot>
                  <StepTitle>Help your friends &amp; amplify your impact</StepTitle>
                </ListTitleRow>
              )}
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText>
                    <ReadMore
                      textToDisplay="Show your friends how to make sense of their decisions, so they can vote their values. The more of your friends who vote, the more impact you will have on the outcome of the election."
                      numberOfLines={3}
                    />
                  </StepText>
                </ListRow>
              )}
              <ShowMoreButtons
                showMoreId="showMoreReadyIntroductionCompressed"
                showMoreButtonWasClicked={contentUnfurled}
                showMoreButtonsLink={this.contentUnfurledLink}
              />
            </ListMaxWidth>
          </ListWrapper>
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 !important;
`;

const InnerWrapper = styled.div`
`;

const IntroHeader = styled.div`
  color: #2e3c5d;
  padding-top: 0;
  padding-bottom: 0;
  font-size: 26px;
  font-weight: 800;
  margin: 0 !important;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 15px;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ListMaxWidth = styled.div`
  max-width: 450px;
`;

const ListTitleRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding-top: 8px;
`;

const ListRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const Dot = styled.div`
  padding-top: 2px;
  text-align: center;
  vertical-align: top;
`;

const StepNumber = styled.div`
  background: ${props => props.theme.colors.brandBlue};
  border-radius: 4px;
  color: white;
  font-size: 14px;
  width: 20px;
  height: 20px;
  padding-top: 1px;
`;

const StepTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
`;

const StepText = styled.div`
  color: #555;
  font-size: 14px;
  font-weight: 200;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
`;

const StepNumberPlaceholder = styled.div`
  width: 20px;
  height: 20px;
`;

export default withTheme(withStyles(styles)(ReadyIntroduction));
