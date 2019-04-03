import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { historyPush } from '../../utils/cordovaUtils';


class Footer extends Component {
  render () {
    const { classes } = this.props;
    return (
      <Wrapper>
        <Top>
          <LinksContainer>
            <Column>
              <ColumnTitle>How it Works</ColumnTitle>
              <Link className={classes.link}>For Voters</Link>
              <Link className={classes.link}>For Campaigns</Link>
            </Column>
            <Column>
              <ColumnTitle>Elections</ColumnTitle>
              <Link className={classes.link}>Supported Elections</Link>
              <Link className={classes.link}>Register to Vote</Link>
              <Link className={classes.link}>Get Your Absentee Ballot</Link>
              <Link className={classes.link}>See Your Ballot</Link>
              <Link className={classes.link}>Polling Place Locator</Link>
              <Link className={classes.link}>Free Online Tools</Link>
              <Link className={classes.link}>Premium Online Tools</Link>
            </Column>
            <Column>
              <ColumnTitle>About We Vote</ColumnTitle>
              <Link className={classes.link}>About &amp; Team</Link>
              <Link className={classes.link} to="/more/donate">Donate</Link>
              <Link className={classes.link}>Blog</Link>
              <Link className={classes.link}>Media Inquiries</Link>
              <Link className={classes.link}>Careers</Link>
              <Link className={classes.link}>Join Our Newsletter</Link>
              <Link className={classes.link}>Facebook</Link>
              <Link className={classes.link}>Twitter</Link>
            </Column>
            <Column>
              <ColumnTitle>Support</ColumnTitle>
              <Link className={classes.link}>We Vote Help</Link>
              <Link className={classes.link} to="/more/privacy">Privacy</Link>
              <Link className={classes.link} to="/more/terms">Terms of Use</Link>
              <Link className={classes.link}>Attributions</Link>
            </Column>
          </LinksContainer>
          <OptionsContainer>
            <Button
              color="default"
              variant="outlined"
              classes={{ root: classes.buttonOutlined }}
              onClick={() => historyPush('/ballot')}
            >
              Get Started
            </Button>
            <Button
              color="default"
              variant="outlined"
              classes={{ root: classes.buttonOutlined }}
            >
              Contact Sales
            </Button>
          </OptionsContainer>
        </Top>
        <Bottom>
          <Text>WeVote.US is brought to you by a partnership between two registered nonprofit organizations, one 501(c)(3) and one 501(c)(4). We do not support or oppose any political candidate or party.</Text>
          <Text>
            The software that powers We Vote is
            <Link className={classes.bottomLink} to="https://github.com/wevote"> open source.</Link>
          </Text>
        </Bottom>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  buttonOutlined: {
    height: 50,
    borderRadius: 32,
    color: 'white',
    border: '3px solid white',
    marginBottom: '1em',
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      width: '47%',
      fontSize: 12,
      padding: '8px 0',
    },
  },
  link: {
    color: 'rgb(255, 255, 255, .6)',
    fontSize: 13,
    marginBottom: '1em',
    '&:hover': {
      color: 'white',
    },
  },
  bottomLink: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    '&:hover': {
      color: 'white',
    },
  },
});

const Wrapper = styled.div`
  color: rgb(255, 255, 255, .6) !important;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  padding: 4em 1em 2em 1em;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Top = styled.div`
  width: 960px;
  max-width: 90vw;
  display: flex;
  flex-flow: row;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: column-reverse;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-flow: row;
  width: 75%;
  justify-content: space-between;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: column;
    width: 100%;
  }
`;

const Column = styled.div`
  width: 150px;
  display: flex;
  flex-flow: column nowrap;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const ColumnTitle = styled.h3`
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin: .8em 0;
`;

const OptionsContainer = styled.div`
  width: 25%;
  display: flex;
  flex-flow: column;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    flex-flow: row;
    justify-content: space-between;
  }
`;

const Bottom = styled.div`
  width: 750px;
  max-width: 90vw;
  display: flex;
  flex-flow: column;
  padding: 3em 0;
  text-align: center;
`;

const Text = styled.p`
  font-size: 12px;
`;

export default withStyles(styles)(Footer);
