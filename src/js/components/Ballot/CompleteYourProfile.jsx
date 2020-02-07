import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Card, Button } from '@material-ui/core';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';

class CompleteYourProfile extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  // Steps: options, friends
  componentDidMount () {

  }

  render () {
    const { classes } = this.props;

    return (
      <>
        <div className="card">
          <div className="card-main">
            <Flex>
              <span>
                <strong>3 of 8</strong>
                {' '}
                actions completed
              </span>
              <Indicators>
                <Indicator complete />
                <Indicator complete />
                <Indicator complete />
                <Indicator />
                <Indicator />
                <Indicator />
                <Indicator />
                <Indicator />
              </Indicators>
            </Flex>
            <Seperator />
            <Description>
              <TitleArea>
                <Icon>
                  <PlayCircleFilled />
                </Icon>
                <Title>Watch how it works</Title>
                <TabletActionButton>
                  <Button fullWidth variant="contained" color="primary">
                    How It Works
                  </Button>
                </TabletActionButton>
              </TitleArea>
              <MobileActionButton>
                <Button fullWidth variant="contained" color="primary">
                  How It Works
                </Button>
              </MobileActionButton>
              <NavButtons>
                <NavButton>
                  <Button color="primary">
                    {'< Previous'}
                  </Button>
                </NavButton>
                <NavButton>
                  <Button color="primary">
                    {'Next >'}
                  </Button>
                </NavButton>
              </NavButtons>
            </Description>
          </div>
        </div>
      </>
    );
  }
}
const styles = () => ({
});

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Indicators = styled.div`
  display: flex;
  flex: 1 1 0;
  align-items: center;
  margin-left: 8px;
`;

const Indicator = styled.div`
  flex: 1 1 0;
  margin: 0 4px;
  background: ${props => (props.complete ? '#2E3C5D' : '#e1e1e1')};
  height: 8px;
  @media (max-width: 768px) {
    &:nth-child(even) {
      margin-left: -4px;
    }    
  }
`;

const Seperator = styled.div`
  width: 90%;
  background: #e1e1e1;
  height: 1px;
  margin: 12px auto;
`;

const Description = styled.div`
  @media (min-width: 769px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Icon = styled.div`
  display: inline-block;
  width: 35px;
  height: 35px;
  * {
    height: 35px !important;
    width: 35px !important;
    fill: #2E3C5D;
  }
`;

const Title = styled.h2`
  display: inline-block;
  font-weight: normal;
  margin: 0 0 0 8px;
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media(min-width: 576px) {
    margin-bottom: 12px;
  }
`;

const MobileActionButton = styled.div`
  margin-top: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e1e1e1;
  margin-bottom: 12px;
  @media (min-width: 576px) {
    display: none;
  }
`;

const TabletActionButton = styled.div`
  display: none;
  @media(min-width: 576px) {
    display: block;
    margin-left: auto;
  }
  @media(min-width: 769px) {
    margin-left: 12px;
  }
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media(min-width: 576px) {
    width: fit-content;
    margin-right: auto;
  }
  @media(min-width: 769px) {
    margin-left: auto;
    margin-right: 0;
  }
`;

const NavButton = styled.div`
  * {
    font-weight: bold;
  }
`;


export default withTheme(withStyles(styles)(CompleteYourProfile));
