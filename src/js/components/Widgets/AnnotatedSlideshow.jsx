import React, { PureComponent } from 'react';
import styled, { withTheme } from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { cordovaDot } from '../../utils/cordovaUtils';

class AnnotatedSlideshow extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
  };

  render () {
    const { title, description, imgSrc, classes } = this.props;
    return (
      <Wrapper>
        <Title>
          {title}
        </Title>
        <Description>
          {description}
        </Description>
        <Slide>
          <Nav>
            <ArrowLeftIcon classes={{ root: classes.navIconRoot }} />
          </Nav>
          <Image src={cordovaDot(imgSrc)} />
          <Nav>
            <ArrowRightIcon classes={{ root: classes.navIconRoot }} />
          </Nav>
        </Slide>
      </Wrapper>
    );
  }
}

const styles = ({
  navIconRoot: {
    fontSize: 64,
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  text-align: left;
`;

const Title = styled.h3`
  font-weight: bold;
  font-size: 24px;
`;

const Description = styled.p`
  font-size: 16px;
`;

const Slide = styled.div`
  display: flex;
  flex-flow: row;
  margin: 1.5em 0 3em 0;
  justify-content: space-between;
  max-width: 90%;
`;

const Nav = styled.div`
  margin: auto 0;
  width: 100px;
  height: 100px;
  padding: 0 16px;
  border-radius: 100rem;
  font-size: 72px;
  background: ${({ disabled, theme }) => (disabled ? theme.colors.grayPale : theme.colors.grayChip)};
  color: ${({ disabled, theme }) => (disabled ? theme.colors.grayChip : theme.colors.brandBlue)};
`;

const Image = styled.img`
  width: 640px;
  border-radius: 16px;
  height: 360px;
  max-width: 100%;
`;

export default withStyles(styles)(withTheme(AnnotatedSlideshow));
