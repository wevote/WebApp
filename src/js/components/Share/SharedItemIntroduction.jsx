import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';

class SharedItemIntroduction extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showAllStepOne: false,
      showAllStepTwo: false,
      showAllStepThree: false,
    };
  }

  onClickShowAllStepOne = () => {
    this.setState({
      showAllStepOne: true,
    });
  }

  onClickShowAllStepTwo = () => {
    this.setState({
      showAllStepTwo: true,
    });
  }

  onClickShowAllStepThree = () => {
    this.setState({
      showAllStepThree: true,
    });
  }

  render () {
    renderLog('SharedItemIntroduction');  // Set LOG_RENDER_EVENTS to log all renders
    const { showAllStepOne, showAllStepTwo, showAllStepThree } = this.state;
    return (
      <OuterWrapper>
        <InnerWrapper>
          <IntroHeader>
            How We Vote helps you:
          </IntroHeader>
          <ListWrapper>
            <ListMaxWidth>
              <ListTitleRow>
                <Dot><StepNumber>1</StepNumber></Dot>
                <StepTitle>Be ready to vote in 6 minutes</StepTitle>
              </ListTitleRow>
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                {showAllStepOne ? (
                  <StepText>
                    Make a plan for casting your vote. Verify your registration. Find your polling location.
                  </StepText>
                ) : (
                  <StepText onClick={this.onClickShowAllStepOne}>
                    Make a plan for casting your vote. Verify your...
                    {' '}
                    (
                    <span className="u-cursor--pointer u-link-color">
                      more
                    </span>
                    )
                  </StepText>
                )}
              </ListRow>

              <ListTitleRow>
                <Dot><StepNumber>2</StepNumber></Dot>
                <StepTitle>Be confident in your choices</StepTitle>
              </ListTitleRow>
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                {showAllStepTwo ? (
                  <StepText>
                    Who&apos;s running for office? What do they stand for? We Vote helps you make sense of your options.
                  </StepText>
                ) : (
                  <StepText onClick={this.onClickShowAllStepTwo}>
                    Who&apos;s running for office? What do they...
                    {' '}
                    (
                    <span className="u-cursor--pointer u-link-color">
                      more
                    </span>
                    )
                  </StepText>
                )}
              </ListRow>

              <ListTitleRow>
                <Dot><StepNumber>3</StepNumber></Dot>
                <StepTitle>Help your friends</StepTitle>
              </ListTitleRow>
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                {showAllStepThree ? (
                  <StepText>
                    You&apos;ve done your homework deciding how to vote. Now show your friends how to make sense of their decisions, so they can vote their values.
                  </StepText>
                ) : (
                  <StepText onClick={this.onClickShowAllStepThree}>
                    You&apos;ve done your homework deciding...
                    {' '}
                    (
                    <span className="u-cursor--pointer u-link-color">
                      more
                    </span>
                    )
                  </StepText>
                )}
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
  padding-left: 12px;
  padding-right: 12px;
`;

const InnerWrapper = styled.div`
`;

const IntroHeader = styled.div`
  color: #2e3c5d;
  font-size: 20px;
  font-weight: 600;
  padding-top: 20px;
  padding-bottom: 0;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
    padding-top: 20px;
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
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 3px;
  }
`;

const StepNumber = styled.div`
  background: ${props => props.theme.colors.brandBlue};
  border-radius: 4px;
  color: white;
  font-size: 16px;
  width: 22px;
  height: 22px;
  padding-top: 1px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
    min-width: 20px;
    width: 20px;
    height: 20px;
  }
`;

const StepTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 17px;
  }
`;

const StepText = styled.div`
  color: #555;
  font-size: 16px;
  font-weight: 200;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const StepNumberPlaceholder = styled.div`
  width: 22px;
  height: 22px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 20px;
    height: 20px;
    min-width: 20px;
  }
`;

export default withTheme(withStyles(styles)(SharedItemIntroduction));
