import { Close } from '@mui/icons-material'; // Info
import { Drawer, IconButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import { hasIPhoneNotch, isIPadSmallerThan13 } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { cordovaDrawerTopMargin } from '../../utils/cordovaOffsets';
import { DrawerHeaderAnimateDownInnerContainer, DrawerHeaderAnimateDownOuterContainer, DrawerHeaderWrapper, DrawerTitle } from '../Style/drawerLayoutStyles';

const DrawerTemplateHeaderProfile = (props) => {
  const { classes, drawerId, drawerOpenGlobalVariableName, headerFixedJsx, headerTitleJsx, mainContentJsx, onDrawerClose } = props;
  renderLog(`DrawerTemplateHeaderProfile (${drawerId})`);  // Set LOG_RENDER_EVENTS to log all renders

  // const campaignXWeVoteIdRef = useRef('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [scrolledDown, setScrolledDown] = useState(false);
  // const drawerOpen = getAppContextValue(drawerOpenGlobalVariableName) || false;

  const handleScrolledDownDrawer = (evt) => {
    const { scrollTop } = evt.target;
    if (scrollTop > 200 && !AppObservableStore.getScrolledDownDrawer()) {
      setScrolledDown(true);
      AppObservableStore.setScrolledDownDrawer(true);
    }
    if (scrollTop < 200 && AppObservableStore.getScrolledDownDrawer()) {
      setScrolledDown(false);
      AppObservableStore.setScrolledDownDrawer(false);
    }
  };

  const onAppObservableStoreChange = useCallback(() => {
    const set = AppObservableStore.getDrawerOpen(drawerOpenGlobalVariableName);
    if (set) {
      setDrawerOpen(true);
      setTimeout(() => {
        if (isIPadSmallerThan13() && props?.drawerId === 'headerProfileDrawer') {
          const elements = document.querySelectorAll('[class*="DrawerTemplateHeaderProfile-drawer"]');
          if (elements.length) {
            // Profile drawer layout for smaller iPads, makes desktop width assumptions
            // so just make them 100% for now (October 2025).
            elements[0].style.width = '100%';
          }
        }
      }, 100);
    }
  }, [setDrawerOpen]);

  const onDrawerCloseLocal = () => {
    AppObservableStore.setDrawerOpen(drawerOpenGlobalVariableName, false);
    setDrawerOpen(false);
    if (onDrawerClose) {
      onDrawerClose();
    }
  };

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      appStateSubscription.unsubscribe();
    };
  }, [onAppObservableStoreChange]);

  React.useEffect(() => {
    setTimeout(() => {
      const drawer = document.querySelector('.MuiDrawer-paper');
      if (drawer) {
        drawer.addEventListener('scroll', handleScrolledDownDrawer);
      } else {
        // console.log('Drawer element NOT found make timeout longer.');
      }
    }, 100);
  }, []);

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      direction="left"
      id={drawerId}
      onClose={onDrawerCloseLocal}
      open={drawerOpen}
    >
      <DrawerHeaderWrapper
          className={classes.profileHeader}
      >
        <DrawerTitle
            className={classes.profileTitle}
        >
          {headerTitleJsx}
        </DrawerTitle>
        <CloseDrawerIconWrapper>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            id={`${drawerId}Close`}
            onClick={onDrawerCloseLocal}
            size="large"
          >
            <span className="u-cursor--pointer">
              <Close classes={{ root: classes.closeIcon }} />
            </span>
          </IconButton>
        </CloseDrawerIconWrapper>
      </DrawerHeaderWrapper>
      <DrawerHeaderAnimateDownOuterContainer id={`${drawerId}AnimateDownId`} $scrolledDown={scrolledDown}>
        <DrawerHeaderAnimateDownInnerContainer>
          {headerFixedJsx}
        </DrawerHeaderAnimateDownInnerContainer>
      </DrawerHeaderAnimateDownOuterContainer>
      <DrawerTemplateHeaderProfileWrapper>
        {mainContentJsx}
      </DrawerTemplateHeaderProfileWrapper>
    </Drawer>
  );
};
DrawerTemplateHeaderProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  drawerId: PropTypes.string,
  drawerOpenGlobalVariableName: PropTypes.string,
  mainContentJsx: PropTypes.object,
  headerTitleJsx: PropTypes.object,
  headerFixedJsx: PropTypes.object,
  onDrawerClose: PropTypes.func,
};

const styles = () => ({
  drawer: {
    marginTop: cordovaDrawerTopMargin(),
    width: '80%',
  },
  dialogPaper: {
    display: 'block',
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 auto',
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 577px)': {
      maxWidth: '550px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      // transitionDuration: '.25s',
    },
    '@media (max-width: 576px)': {
      maxWidth: '360px',
    },
  },
  dialogContent: {
    padding: '24px 24px 36px 24px',
    background: 'white',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '@media(max-width: 576px)': {
      justifyContent: 'flex-start !important',
    },
  },
  backButton: {
    // marginBottom: 6,
    // marginLeft: -8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginRight: 'auto',
    padding: 6,
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  closeIcon: {
    color: DesignTokenColors.whiteUI,
    width: 24,
    height: 24,
  },
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
  profileHeader: {
    backgroundColor: DesignTokenColors.neutral500,
    minHeight: 'auto',
    position: 'fixed',
    width: '-webkit-fill-available',
    zIndex: 1000,
  },
  profileTitle: {
    alignItems: 'center',
    color: DesignTokenColors.whiteUI,
    display: 'flex',
    fontSize: '24px',
    fontWeight: 400,
    height: '66px',
    justifyContent: 'space-between',
    margin: 0,
  },
});

const DrawerTemplateHeaderProfileWrapper = styled('div')`
  margin: 0 15px;
  min-width: 300px;
`;

const CloseDrawerIconWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
`;

export default withStyles(styles)(DrawerTemplateHeaderProfile);
