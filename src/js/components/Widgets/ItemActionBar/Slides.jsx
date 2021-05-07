import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../../utils/logging';

class Slides extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentIndex: props.startIndex || 0,
    };
  }

  handleSwitchSlide = (next) => {
    const { currentIndex } = this.state;
    const nextIndex = next > 0 ? currentIndex + 1 : currentIndex - 1;
    this.setState({
      currentIndex: nextIndex,
    });
  }

  render () {
    renderLog('Slides');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, voterIsSignedIn } = this.props;
    const { currentIndex } = this.state;
    const numberOfButtons = currentIndex > 0 && currentIndex < this.props.slides.length ? 2 : 1;
    let activeButtons;
    switch (currentIndex) {
      default:
      case 0:
        activeButtons = (
          <Options buttons="1">
            <Button
              classes={{ root: numberOfButtons > 1 ? classes.optionsButton : classes.nextButton }}
              variant="contained"
              color="primary"
              onClick={() => this.handleSwitchSlide(1)}
            >
              Next
            </Button>
          </Options>
        );
        break;
      case 1:
        activeButtons = (
          <Options buttons="2">
            <Button
              classes={{ root: classes.optionsButton }}
              variant="outlined"
              color="primary"
              onClick={() => this.handleSwitchSlide(0)}
            >
              Previous
            </Button>
            {
              voterIsSignedIn ? (
                <Button
                  classes={{ root: classes.optionsButton }}
                  variant="contained"
                  color="primary"
                  onClick={this.props.onClose}
                >
                  Close
                </Button>
              ) :
                (
                  <Button
                    classes={{ root: classes.optionsButton }}
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleSwitchSlide(1)}
                  >
                    Next
                  </Button>
                )
            }
          </Options>
        );
        break;
      case 2:
        activeButtons = (
          <Options buttons="2">
            {
              numberOfButtons > 1 && (
                <Button
                  classes={{ root: classes.optionsButton }}
                  variant="outlined"
                  color="primary"
                  onClick={() => this.handleSwitchSlide(0)}
                >
                  Previous
                </Button>
              )
            }
            <Button
              classes={{ root: classes.optionsButton }}
              variant="outlined"
              color="primary"
              onClick={this.props.onClose}
            >
              {voterIsSignedIn ? 'Close' : 'Sign In Later'}
            </Button>
          </Options>
        );
        break;
    }
    return (
      <Wrapper>
        <SlidesContainer>
          {this.props.slides[currentIndex]}
        </SlidesContainer>
        {activeButtons}
      </Wrapper>
    );
  }
}
Slides.propTypes = {
  classes: PropTypes.object,
  slides: PropTypes.array,
  startIndex: PropTypes.number,
  onClose: PropTypes.func,
  voterIsSignedIn: PropTypes.bool,
};

const styles = (theme) => ({
  optionsButton: {
    minWidth: '40%',
    width: '100%',
    margin: '8px 0',
    [theme.breakpoints.down('md')]: {
      width: '40%',
    },
  },
  nextButton: {
    width: '100%',
    margin: '8px 0',
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 508px;
  min-height: 205px;
  justify-content: space-between;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    min-width: 260px;
  }
`;

const Options = styled.div`
  display: flex;
  flex-flow: ${({ buttons }) => (buttons > 1 ? 'row' : 'column')};
  ${({ buttons }) => (buttons > 1 ? 'justify-content: space-between;' : '')};
  margin-top: 1em;
`;

const SlidesContainer = styled.div`
  display: block;
`;

export default withStyles(styles)(Slides);
