import { Close } from '@mui/icons-material';
import { FormControl, FormControlLabel, IconButton, Radio } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { isAndroidSizeMD } from '../../common/utils/cordovaUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';

// import { getApplicationViewBooleans } from '../../utils/applicationUtils';

class ShareModalTitleArea extends PureComponent {
  render () {
    renderLog('ShareModalTitleArea');
    const { classes, firstSlide, shareModalTitle, handleShareAllOpinionsToggle, handleCloseShareButtonDrawer } = this.props;
    // const { location: { pathname } } = window;
    // const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    // const { showFooterBar } = getApplicationViewBooleans(pathname);

    return (
      <ModalTitleArea firstSlide={firstSlide}>
        <div>
          <ShareButtonFooterTitle>
            {shareModalTitle}
          </ShareButtonFooterTitle>
          <FormControl classes={{ root: classes.formControl }}>
            <RadioGroup
              onChange={handleShareAllOpinionsToggle}
              style={isCordova() ? { display: 'none' } : {}}
            >
              <RadioItem>
                <FormControlLabel
                  classes={{ label: classes.radioLabel }}
                  // disabled={!voterIsSignedIn}
                  disabled
                  id="shareModalAllOpinionsRadioButton"
                  value="AllOpinions"
                  // label={voterIsSignedIn ? 'Share my voter guide' : 'Sign in to share my voter guide'}
                  label="Share my voter guide (coming in 2023)"
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        // checked={voterIsSignedIn} // && stringContains('AllOpinions', shareFooterStep)}
                      />
                    )
                  }
                  style={{ marginRight: `${isAndroidSizeMD() ? '10px' : ''}` }}
                />
              </RadioItem>
              <RadioItem>
                <FormControlLabel
                  id="shareModalBallotOnlyRadioButton"
                  classes={{ label: classes.radioLabel }}
                  value="BallotOnly"
                  label="Ballot only"
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked // and ={!voterIsSignedIn || !stringContains('AllOpinions', shareFooterStep)}
                      />
                    )
                  }
                />
              </RadioItem>
            </RadioGroup>
          </FormControl>
        </div>
        <IconButton
          aria-label="Close"
          className={classes.closeButtonAbsolute}
          onClick={handleCloseShareButtonDrawer}
          id="closeShareModal"
          size="large"
        >
          <Close />
        </IconButton>
      </ModalTitleArea>
    );
  }
}
ShareModalTitleArea.propTypes = {
  classes: PropTypes.object,
  firstSlide: PropTypes.bool,
  handleCloseShareButtonDrawer: PropTypes.func,
  handleShareAllOpinionsToggle: PropTypes.func,
  // shareFooterStep: PropTypes.string,
  shareModalTitle: PropTypes.string,
};

const styles = () => ({
  buttonDefault: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '45px !important',
  },
  buttonDefaultCordova: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '35px !important',
  },
  backButton: {
    marginBottom: 6,
    marginLeft: -8,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 12,
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  informationIcon: {
    color: '#999',
    width: 20,
    height: 20,
    marginTop: '-3px',
    marginRight: 3,
  },
  informationIconInButton: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginLeft: 3,
  },
  menuItem: {
    zIndex: '9 !important',
    padding: '0 !important',
    marginBottom: '-2px !important',
    paddingBottom: '1px !important',
    '&:last-child': {
      paddingBottom: '0 !important',
      paddingTop: '1px !important',
    },
    '&:hover': {
      background: '#efefef',
    },
  },
  previewButton: {
    marginTop: 0,
  },
  shareIcon: {
    transform: 'scaleX(-1)',
    position: 'relative',
    top: -1,
  },
});

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled('div', {
  shouldForwardProp: (prop) => !['firstSlide', 'onSignInSlide', 'noBoxShadowMode'].includes(prop),
})(({ firstSlide, onSignInSlide, noBoxShadowMode }) => (`
  text-align: left;
  width: 100%;
  // padding: 0;

  padding: ${firstSlide ? '24px 24px 12px 24px' : (onSignInSlide ? '20px 14px 10px' : '10px 14px')};
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  ${noBoxShadowMode ? '@media (max-width: 376px) {\n    padding: 8px 6px;\n  }' : ''}
  display: ${onSignInSlide ? 'block' : 'flex'};
  text-align: ${onSignInSlide ? 'center' : 'left'};
`));

const ShareButtonFooterTitle = styled('h3')(({ theme }) => (`
  font-weight: bold;
  font-size: 28px;
  color: black;
  margin-top: 0;
  margin-bottom: 4px;
  ${theme.breakpoints.down('xs')} {
    font-size: 17px;
    margin-bottom: 8px;
  }
`));

const RadioGroup = styled('div', {
  shouldForwardProp: (prop) => !['preventStackedButtons'].includes(prop),
})(({ preventStackedButtons, theme }) => (`
  display: flex;
  flex-flow: column;
  width: 100%;
  ${theme.breakpoints.down('md')} {
    margin-bottom: -10px;
  }
  ${theme.breakpoints.down('xs')} {
    ${preventStackedButtons ? '' : 'flex-flow: row wrap;'}
    margin-bottom: 0;
  }
`));

const RadioItem = styled('div', {
  shouldForwardProp: (prop) => !['preventStackedButtons'].includes(prop),
})(({ preventStackedButtons, theme }) => (`
  ${!preventStackedButtons && theme.breakpoints.down('xs') ? (`
      // width: 100% !important;
      // min-width: 100% !important;
      // margin-bottom: -6px;
  `) : ''}
`));


// const SubTitle = styled('div', {
//   shouldForwardProp: (prop) => !['larger', 'left'].includes(prop),
// })(({ larger, left }) => (`
//   margin-top: 0;
//   font-size: ${larger ? '18px' : '14px'};
//   width: 100%;
//   text-align: ${left && 'left'};
//   @media(min-width: 420px) {
//     // width: 80%;
//   }
// `));


export default withStyles(styles)(ShareModalTitleArea);
