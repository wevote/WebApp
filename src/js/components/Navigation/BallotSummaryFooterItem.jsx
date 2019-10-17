import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, withStyles } from '@material-ui/core';

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

  componentDidMount () {
    const { children } = this.props;
    this.setState({
      children,
    });
  }

  componentWillReceiveProps (nextProps) {
    const { children } = nextProps;
    this.setState({
      children,
    });
  }

  render () {
    // console.log('BallotSummaryFooterItem render');
    const { classes } = this.props;
    const { children } = this.state;

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
                  <Title>{child.props.label}</Title>
                  <Body>{child.props.children}</Body>
                  <Button onClick={() => this.props.setActiveRaceItem(child.props.label)} variant="outlined" classes={{ root: classes.button }}>
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
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
`;

const Body = styled.div`
  width: 100%;
`;

export default withStyles(styles)(BallotSummaryFooterItem);
