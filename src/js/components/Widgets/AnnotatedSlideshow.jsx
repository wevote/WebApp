import React, { PureComponent } from 'react';
import styled, { withTheme } from 'styled-components';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { cordovaDot } from '../../utils/cordovaUtils';

class AnnotatedSlideshow extends PureComponent {
  static propTypes = {
    slides: PropTypes.object.isRequired,
    selectedStepIndex: PropTypes.number.isRequired,
    onChangeSlide: PropTypes.func,
    classes: PropTypes.object,
  };

  handleChangeSlide = (num) => {
    const { selectedStepIndex, slides } = this.props;
    const { length } = Object.keys(slides);
    if ((!num && selectedStepIndex === 0) || (num && selectedStepIndex === length - 1)) {
      return;
    }
    // this.handleSlideImage(num);
    this.props.onChangeSlide(num ? selectedStepIndex + 1 : selectedStepIndex - 1);
  }

  render () {
    const { slides, selectedStepIndex, classes } = this.props;
    const data = Object.values(slides);
    const { length } = data;
    const { title, description, imgSrc } = data.find(slide => slide.index === selectedStepIndex);

    return (
      <Wrapper>
        <SlideShowTitle>{title}</SlideShowTitle>
        <Description>{description}</Description>
        <Slide>
          <Nav disabled={selectedStepIndex === 0} id="howItWorksLeftArrow" onClick={() => this.handleChangeSlide(0)}>
            <ArrowLeftIcon classes={{ root: classes.navIconRoot }} />
          </Nav>
          <Image src={cordovaDot(imgSrc)} />
          <Nav disabled={selectedStepIndex === length - 1} id="howItWorksRightArrow" onClick={() => this.handleChangeSlide(1)}>
            <ArrowRightIcon classes={{ root: classes.navIconRoot }} />
          </Nav>
        </Slide>
        {
          selectedStepIndex < length - 1 && (
            <Button
              color="primary"
              id="howItWorksNext"
              variant="contained"
              classes={{ root: classes.nextButtonRoot }}
              onClick={() => this.handleChangeSlide(1)}
            >
              Next
            </Button>
          )
        }
      </Wrapper>
    );
  }
}

const styles = theme => ({
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
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 1em 0;
  }
`;

const SlideShowTitle = styled.h3`
  font-weight: bold;
  font-size: 24px;
  margin-top: 36px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 20px;
    margin-top: 16px;
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
  width: 640px;
  border: 1px solid #999;
  border-radius: 16px;
  box-shadow: 2px 2px 4px 2px ${({ theme }) => theme.colors.grayLight};
  height: 360px;
  max-width: 90vw;
  transition: 150ms ease-in;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 90vw;
    height: calc(90vw * 0.5625);
  }
`;

export default withStyles(styles)(withTheme(AnnotatedSlideshow));
