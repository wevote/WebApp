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
    index: PropTypes.number.isRequired,
    onChangeSlide: PropTypes.func,
    classes: PropTypes.object,
  };

  handleChangeSlide = (num) => {
    const { index, slides } = this.props;
    const { length } = Object.keys(slides);
    if ((!num && index === 0) || (num && index === length - 1)) {
      return;
    }
    // this.handleSlideImage(num);
    this.props.onChangeSlide(num ? index + 1 : index - 1);
  }

  render () {
    const { slides, index, classes } = this.props;
    const data = Object.values(slides);
    const { length } = data;
    const { title, description, imgSrc } = data.find(slide => slide.index === index);

    return (
      <Wrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Slide>
          <Nav disabled={index === 0} onClick={() => this.handleChangeSlide(0)}>
            <ArrowLeftIcon classes={{ root: classes.navIconRoot }} />
          </Nav>
          <Image
            src={cordovaDot(imgSrc)}
            ref={(img) => { this.currentImage = img; }}
          />
          <Nav disabled={index === length - 1} onClick={() => this.handleChangeSlide(1)}>
            <ArrowRightIcon classes={{ root: classes.navIconRoot }} />
          </Nav>
        </Slide>
        {
          index < length - 1 && (
            <Button
              color="primary"
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

const Title = styled.h3`
  font-weight: bold;
  font-size: 24px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 20px;
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
  overflow-x: hidden;
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
  border-radius: 16px;
  height: 360px;
  max-width: 90vw;
  transition: 150ms ease-in;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 90vw;
    height: calc(90vw * 0.5625);
  }
`;

export default withStyles(styles)(withTheme(AnnotatedSlideshow));
