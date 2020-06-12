import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import ReadMore from '../Widgets/ReadMore';

class ReadyIntroduction extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('ReadyIntroduction');  // Set LOG_RENDER_EVENTS to log all renders
    const numberOfCandidates = '12,400';
    const numberOfOffices = '3,600';
    return (
      <OuterWrapper>
        <InnerWrapper>
          <IntroHeader>
            We Vote makes
            {' '}
            <span className="u-no-break">
              being a voter easier:
            </span>
          </IntroHeader>
          <ListWrapper>
            <ListMaxWidth>
              <ListTitleRow>
                <Dot><StepNumber>1</StepNumber></Dot>
                <StepTitle>Make sure you&apos;re ready to vote</StepTitle>
              </ListTitleRow>
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText>Verify your registration. Make a plan for casting your vote. Find your polling location.</StepText>
              </ListRow>

              <ListTitleRow>
                <Dot><StepNumber>2</StepNumber></Dot>
                <StepTitle>See what&apos;s on your ballot</StepTitle>
              </ListTitleRow>
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText>
                  <ReadMore
                    textToDisplay={`Who's running for office? What do they stand for? With over ${numberOfCandidates} candidates running for ${numberOfOffices} offices this year, We Vote helps you make sense of your choices.`}
                    numberOfLines={3}
                  />
                </StepText>
              </ListRow>

              <ListTitleRow>
                <Dot><StepNumber>3</StepNumber></Dot>
                <StepTitle>Learn from friends you trust</StepTitle>
              </ListTitleRow>
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText>
                  <ReadMore
                    textToDisplay="Between the nonstop misleading TV ads, texts, calls and overflowing mailboxes, who has time to make sense of the madness? Get help from people you trust."
                    numberOfLines={3}
                  />
                </StepText>
              </ListRow>
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
  font-size: 20px;
  font-weight: 600;
  padding-top: 0;
  padding-bottom: 0;
  text-align: left;
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
  padding-top: 14px;
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
