import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Appbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import Navigation, { LogoContainer, Divider, NavLink, MobileNavigationMenu, MobileNavDivider, NavRow } from './Navigation';
import HeaderBarLogo from '../Navigation/HeaderBarLogo';

class WelcomeAppbar extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      showMobileNavigationMenu: false,
    };
  }

  handleShowMobileNavigation = (show) => {
    this.setState({ showMobileNavigationMenu: show });
    if (show) {
      document.querySelector('body').style.overflow = 'hidden';
      return;
    }
    document.querySelector('body').style.overflow = '';
  }

  render () {
    const { classes } = this.props;
    const { showMobileNavigationMenu } = this.state;
    return (
      <Appbar position="relative" classes={{ root: classes.appBarRoot }}>
        <Toolbar classes={{ root: classes.toolbar }} disableGutters>
          <LogoContainer>
            <HeaderBarLogo light />
          </LogoContainer>
          <Navigation>
            <NavLink>For Campaigns</NavLink>
            <DesktopView>
              <Divider />
              <NavLink>How It Works</NavLink>
              <Divider />
              <NavLink href="/ballot">Get Started</NavLink>
              <Divider />
              <NavLink href="/settings/account">Sign In</NavLink>
            </DesktopView>
            <MobileTabletView>
              <IconButton
                classes={{ root: classes.iconButton }}
                onClick={() => this.handleShowMobileNavigation(true)}
              >
                <MenuIcon />
              </IconButton>
              {
                showMobileNavigationMenu && (
                  <MobileNavigationMenu>
                    <NavRow>
                      <CloseIcon
                        classes={{ root: classes.navClose }}
                        onClick={() => this.handleShowMobileNavigation(false)}
                      />
                    </NavRow>
                    <MobileNavDivider />
                    <NavRow>
                      <NavLink>For Campaigns</NavLink>
                    </NavRow>
                    <MobileNavDivider />
                    <NavRow>
                      <NavLink>How It Works</NavLink>
                    </NavRow>
                    <MobileNavDivider />
                    <NavRow>
                      <Button
                        variant="outlined"
                        classes={{ root: classes.navButtonOutlined }}
                        onClick={() => this.handleToPageFromMobileNav('/ballot')}
                      >
                        Get Started
                      </Button>
                      <Button
                        variant="outlined"
                        classes={{ root: classes.navButtonOutlined }}
                        onClick={() => this.handleToPageFromMobileNav('/settings/account')}
                      >
                        Sign In
                      </Button>
                    </NavRow>
                  </MobileNavigationMenu>
                )
              }
            </MobileTabletView>
          </Navigation>
        </Toolbar>
      </Appbar>
    );
  }
}

const styles = ({
  appBarRoot: {
    background: 'transparent',
    alignItems: 'center',
    boxShadow: 'none',
  },
  toolbar: {
    width: 960,
    maxWidth: '95%',
    justifyContent: 'space-between',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  },
  iconButton: {
    color: 'white',
  },
  navButtonOutlined: {
    height: 32,
    borderRadius: 32,
    color: 'white',
    border: '1px solid white',
    marginBottom: '1em',
    fontWeight: '300',
    width: '47%',
    fontSize: 12,
    padding: '5px 0',
    marginTop: 8,
  },
  navClose: {
    position: 'fixed',
    right: 16,
    cursor: 'pointer',
  },
});

const DesktopView = styled.div`
  display: inherit;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileTabletView = styled.div`
  display: inherit;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export default withStyles(styles)(WelcomeAppbar);
