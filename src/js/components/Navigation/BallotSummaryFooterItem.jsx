import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';

class BallotSummaryFooterItem extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
    classes: PropTypes.object,
    setActiveRaceItem: PropTypes.func,
  };

  constructor (props) {
    super(props);

    this.state = {

    };
  }

  jumpToNewSection = (activeRaceItem) => {
    if (this.props.setActiveRaceItem) {
      this.props.setActiveRaceItem(activeRaceItem);
    }
    window.scrollTo(0, 0);
  }

  render () {
    renderLog('BallotSummaryFooterItem'); // Set LOG_RENDER_EVENTS to log all renders
    const { classes, children } = this.props;

    if (!children) {
      return null;
    }

    return (
      <>
        {children.map((child) => {
          if (child && child.props && child.props.label) {
            return (
              <Column className="col col-12 col-md-4" key={child.props.label}>
                <Card>
                  <Title onClick={() => this.jumpToNewSection(child.props.label)}>{child.props.label}</Title>
                  <Body onClick={() => this.props.setActiveRaceItem(child.props.label)}>{child.props.children}</Body>
                  <Button onClick={() => this.jumpToNewSection(child.props.label)} variant="outlined" classes={{ root: classes.button }}>
                    Show all
                    {' '}
                    {child.props.label}
                    {' '}
                    Items
                  </Button>
                </Card>
              </Column>
            );
          } else {
            return null;
          }
        })
        }
      </>
    );
  }
}

const styles = () => ({
  button: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: 0,
    border: '1px solid #ddd',
    borderRadius: '3px !important',
    borderBottom: 'none !important',
    borderRight: 'none !important',
    borderLeft: 'none !important',
    borderTopRightRadius: '0 !important',
    borderTopLeftRadius: '0 !important',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

const Column = styled.div`
  padding: 0 8px !important;
  margin-bottom: 12px;
`;

const Card = styled.div`
  border-radius: 3px;
  border: 1px solid #ddd;
  padding: 16px;
  position: relative;
  padding-bottom: 52px;
  height: 100%;
`;

const Title = styled.div`
  cursor: pointer;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
`;

const Body = styled.div`
  width: 100%;
`;

export default withStyles(styles)(BallotSummaryFooterItem);
