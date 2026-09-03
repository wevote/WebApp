import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton, Tab, Tabs } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { templateAStyles } from './ModalDisplayTemplateA';


class ModalDisplayTemplateA2 extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isContentScrolled: false,
      activeTab: 0,
    };
    this.handleContentScroll = this.handleContentScroll.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // When modal opens, set activeTab to initialTab if provided
    if (nextProps.show && !this.props.show && nextProps.initialTab !== undefined) {
      this.setState({ activeTab: nextProps.initialTab });
    }
  }

  handleContentScroll (e) {
    const scrolled = e.target.scrollTop > 0;
    if (scrolled !== this.state.isContentScrolled) {
      this.setState({ isContentScrolled: scrolled });
    }
  }

  handleTabChange (e, newValue) {
    this.setState({ activeTab: newValue });
    if (this.props.onTabChange) {
      this.props.onTabChange(newValue);
    }
  }

  render () {
    renderLog('ModalDisplayTemplateA2');
    const {
      classes, dialogTitleJSX, externalUniqueId, show, tallMode, tabs, tabContentJSX,
    } = this.props;
    const { isContentScrolled, activeTab } = this.state;

    let dialogPaperCombined;
    if (tallMode) {
      dialogPaperCombined = `${classes.dialogPaper} ${classes.dialogPaperAdditionTall}`;
    } else {
      dialogPaperCombined = classes.dialogPaper;
    }

    // When tabs are present, always show the inset tab-rail divider.
    // When scrolled, also show the full-width sticky divider on top of it.
    const hasTabs = tabs && tabs.length > 0;

    return (
      <Dialog
        classes={{ paper: dialogPaperCombined }}
        onClose={() => this.props.toggleModal()}
        open={Boolean(show)}
        style={{ paddingTop: `${isCordova() ? '75px' : 'undefined'}` }}
      >
        <DialogTitle
          classes={{ root: classes.dialogTitle }}
          style={{ zIndex: 1, paddingBottom: 0 }}
        >
          <DialogTitleInnerWrapper>
            {hasTabs ? (
              <Tabs
                value={activeTab}
                onChange={this.handleTabChange}
                classes={{
                  root: classes.tabsRoot,
                  indicator: classes.tabsIndicator,
                }}
              >
                {tabs.map((tab, idx) => (
                  <Tab
                    key={typeof tab.label === 'string' ? tab.label : idx}
                    label={tab.label}
                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                    disableRipple
                  />
                ))}
              </Tabs>
            ) : (
              <Title>{dialogTitleJSX || <>&nbsp;</>}</Title>
            )}
          </DialogTitleInnerWrapper>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => this.props.toggleModal()}
            id={`closeModalDisplayTemplateA2${externalUniqueId}`}
            size="large"
          >
            <Close />
          </IconButton>

          {hasTabs ? (
            <HeaderDivider $scrolled={isContentScrolled} />
          ) : (
            <HeaderDivider $scrolled={false} />
          )}
        </DialogTitle>

        <DialogContent
          classes={{ root: classes.dialogContent }}
          onScroll={this.handleContentScroll}
        >
          <DialogContentInnerWrapper>
            {/* Render the content for the active tab, or a render-prop/array */}
            {Array.isArray(tabContentJSX) ?
              (tabContentJSX[activeTab] || null) :
              tabContentJSX}
          </DialogContentInnerWrapper>
        </DialogContent>
        {/* No footer / save buttons */}
      </Dialog>
    );
  }
}

ModalDisplayTemplateA2.propTypes = {
  classes: PropTypes.object,
  /** JSX to render in the header area (above divider) when no tabs are present */
  dialogTitleJSX: PropTypes.object,
  externalUniqueId: PropTypes.string,
  /** Initial tab index to show when modal opens */
  initialTab: PropTypes.number,
  /** Array of { label: string|node } objects defining the tabs */
  tabs: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.node })),
  /** Either an array of JSX (one per tab) or a single JSX node */
  tabContentJSX: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  /** Called with the new tab index whenever the active tab changes */
  onTabChange: PropTypes.func,
  show: PropTypes.bool,
  tallMode: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
};

export const templateA2Styles = (theme) => ({
  ...templateAStyles(theme),
  // A2-specific overrides
  dialogTitle: {
    padding: '8px 8px 0 24px',
    position: 'relative',
  },
  dialogPaper: {
    ...templateAStyles(theme).dialogPaper,
    borderRadius: '20px',
    minHeight: '400px',
    maxHeight: 'calc(100vh - 32px)',
    marginTop: 16,
    transform: 'none',
    [theme.breakpoints.down('xs')]: {
      ...templateAStyles(theme).dialogPaper[theme.breakpoints.down('xs')],
      maxHeight: 'calc(100vh - 32px)',
      height: 'auto',
      margin: '16px auto',
      transform: 'none',
    },
  },
  dialogPaperAdditionTall: {
    minHeight: '600px',
    maxHeight: 'calc(100vh - 32px)',
    [theme.breakpoints.down('xs')]: {
      maxHeight: 'calc(100vh - 32px)',
      minHeight: 'auto',
    },
  },
  dialogContent: {
    padding: '0 8px 0 24px',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    padding: 6,
  },
  // A2-only: tab styles (not in Template A)
  tabsRoot: {
    minHeight: 40,
  },
  tabsIndicator: {
    backgroundColor: '#2c5282',
    height: 2,
  },
  tabRoot: {
    minHeight: 40,
    minWidth: 'unset',
    padding: '6px 12px',
    fontSize: 15,
    fontWeight: 400,
    textTransform: 'none',
    color: '#555',
    '&:first-child': {
      paddingLeft: 4,
    },
  },
  tabSelected: {
    fontWeight: 700,
    color: '#2c5282',
  },
});

// Styles

const DialogContentInnerWrapper = styled('div')`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const DialogTitleInnerWrapper = styled('div')`
  display: flex;
  align-items: center;
  min-height: 40px;
  padding-right: 48px;
  padding-left: 0;
  padding-top: 8px;
  width: 100%;
`;

/* Inset when unscrolled, full-width when scrolled */
const HeaderDivider = styled('div')`
  height: 0;
  border-bottom: 1.5px solid #e8e8e8;
  transition: margin 0.2s ease;
  margin-left: ${({ $scrolled }) => ($scrolled ? '-24px' : '0px')};
  margin-right: ${({ $scrolled }) => ($scrolled ? '-8px' : '16px')};
`;

const Title = styled('div')`
  margin: 0;
  text-align: left;
  padding-left: 4px;
  width: 100%;
`;

export default withTheme(withStyles(templateA2Styles)(ModalDisplayTemplateA2));
