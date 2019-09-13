import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

class Slides extends Component {
  static propTypes = {
    slides: PropTypes.array,
    startIndex: PropTypes.number,
    classes: PropTypes.object,
    onClose: PropTypes.func,
  }

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
    const { classes } = this.props;
    const { currentIndex } = this.state;
    const numberOfButtons = currentIndex > 0 && currentIndex < this.props.slides.length ? 2 : 1;
    return (
      <Wrapper>
        <SlidesContainer>
          {this.props.slides[currentIndex]}
        </SlidesContainer>
        <Options buttons={numberOfButtons}>
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
          {
            currentIndex === this.props.slides.length - 1 && (
              <Button
                classes={{ root: classes.optionsButton }}
                variant="outlined"
                color="primary"
                onClick={this.props.onClose}
              >
                Skip
              </Button>
            )
          }
          {
            currentIndex < this.props.slides.length - 1 && (
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
      </Wrapper>
    );
  }
}

const styles = ({
  optionsButton: {
    minWidth: '40%',
    width: '100%',
    margin: '8px 4px',
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
