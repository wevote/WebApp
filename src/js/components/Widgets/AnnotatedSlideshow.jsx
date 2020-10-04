import React, { PureComponent } from 'react';
import styled, { withTheme } from 'styled-components';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import { cordovaDot } from '../../utils/cordovaUtils';

class AnnotatedSlideshow extends PureComponent {
  componentDidMount () {
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  handleChangeSlide = (advanceIfTrue) => {
    const { selectedStepIndex, slides } = this.props;
    const { length } = Object.keys(slides);
    if ((!advanceIfTrue && selectedStepIndex === 0) || (advanceIfTrue && selectedStepIndex === length - 1)) {
      return;
    }
    // this.handleSlideImage(num);
    this.props.onChangeSlide(advanceIfTrue ? selectedStepIndex + 1 : selectedStepIndex - 1);
  }

  render () {
    const { slides, selectedStepIndex, classes } = this.props;
    const data = Object.values(slides);
    const { length } = data;
    const { title, description, imgSrc } = data.find((slide) => slide.index === selectedStepIndex);
    // console.log('AnnotatedSlideshow selectedStepIndex:', selectedStepIndex, 'length:', length);
    return (
      <Wrapper inModal={this.props.inModal}>
        <SlideShowTitle inModal={this.props.inModal}>{title}</SlideShowTitle>
        <Description>{description}</Description>
        <Slide>
          {!this.props.inModal && (
            <Nav disabled={selectedStepIndex === 0} id="howItWorksLeftArrow" onClick={() => this.handleChangeSlide(false)}>
              <ArrowLeft classes={{ root: classes.navIconRoot }} />
            </Nav>
          )}
          <Image inModal={this.props.inModal} src={cordovaDot(imgSrc)} />
          {!this.props.inModal && (
            <Nav disabled={selectedStepIndex === length - 1} id="howItWorksRightArrow" onClick={() => this.handleChangeSlide(true)}>
              <ArrowRight classes={{ root: classes.navIconRoot }} />
            </Nav>
          )}
        </Slide>
        {
          selectedStepIndex < (length - 1) && (
            <TwoButtonsWrapper>
              <BackButtonWrapper>
                <Button
                  classes={{ root: this.props.inModal ? classes.nextButtonRootModal : classes.nextButtonRoot }}
                  id={`annotatedSlideShowStep${selectedStepIndex + 1}Back`}
                  color="primary"
                  disabled={selectedStepIndex === 0}
                  fullWidth
                  onClick={() => this.handleChangeSlide(false)}
                  variant="outlined"
                >
                  Back
                </Button>
              </BackButtonWrapper>
              <NextButtonWrapper>
                <Button
                  color="primary"
                  id={`annotatedSlideShowStep${selectedStepIndex + 1}Next`}
                  variant="contained"
                  classes={{ root: this.props.inModal ? classes.nextButtonRootModal : classes.nextButtonRoot }}
                  onClick={() => this.handleChangeSlide(true)}
                >
                  Next
                </Button>
              </NextButtonWrapper>
            </TwoButtonsWrapper>
          )
        }
      </Wrapper>
    );
  }
}
AnnotatedSlideshow.propTypes = {
  classes: PropTypes.object,
  inModal: PropTypes.bool,
  onChangeSlide: PropTypes.func,
  selectedStepIndex: PropTypes.number.isRequired,
  slides: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  navIconRoot: {
    fontSize: 72,
    '&:hover': {
      color: theme.palette.primary.lighter,
    },
  },
  nextButtonRoot: {
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  nextButtonRootModal: {
    width: '100%',
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ inModal }) => (inModal ? '0' : '1em 0')};
  }
`;

const SlideShowTitle = styled.h3`
  font-weight: bold;
  font-size: 24px;
  margin-top:  ${({ inModal }) => (inModal ? '0' : '36px')};
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 20px;
    margin-top: ${({ inModal }) => (inModal ? '0' : '16px')};
  }
`;

const TwoButtonsWrapper = styled.div`
  width: 100%;
  margin: 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButtonWrapper = styled.div`
  margin: 0;
  margin-right: 12px;
  width: 100%;
  @media(min-width: 520px) {
    margin-right: 8px;
  }
`;

const NextButtonWrapper = styled.div`
  margin: 0;
  margin-right: 0;
  width: 100%;
  @media(min-width: 520px) {
    margin-right: 8px;
  }
`;

const Description = styled.p`
  font-size: 16px;
`;

const Slide = styled.div`
  display: flex;
  flex-flow: row;
  margin: 1em 0 3em 0;
  width: 100%;
  justify-content: space-between;
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  width: 100px;
  height: 100px;
  border-radius: 100rem;
  transition: all 150ms ease-in;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  font-size: 72px;
  background: ${({ disabled, theme }) => (disabled ? theme.colors.grayPale : theme.colors.grayChip)};
  color: ${({ disabled, theme }) => (disabled ? theme.colors.grayChip : theme.colors.brandBlue)};
  &:hover {
    filter: ${({ disabled }) => (disabled ? '' : 'brightness(102%)')};
  }
  &:active {
    filter: ${({ disabled }) => (disabled ? '' : 'brightness(105%)')};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const Image = styled.img`
  border: 1px solid #999;
  border-radius: 16px;
  box-shadow: 2px 2px 4px 2px ${({ theme }) => theme.colors.grayLight};
  ${(inModal) => (inModal ? 'width: 100%;' : 'width: 640px;')}
  ${(inModal) => (inModal ? 'height: auto;' : 'height: 360px;')}
  transition: all 150ms ease-in;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 90vw;
    height: calc(90vw * 0.5625);
  }
`;

export default withStyles(styles)(withTheme(AnnotatedSlideshow));
