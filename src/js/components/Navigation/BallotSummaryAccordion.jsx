import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BallotSummaryAccordionSection from './BallotSummaryAccordionSection';
import { renderLog } from '../../utils/logging';

class BallotSummaryAccordion extends Component {
  constructor (props) {
    super(props);

    this.state = {
      openSections: {},
    };
  }

  componentDidMount () {
    const openSections = {};
    const { children } = this.props;
    if (children) {
      children.forEach((child) => {
        if (child && child.props && child.props.isOpen) {
          openSections[child.props.label] = true;
        }
      });
      this.setState({ openSections });
    }
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('BallotSummaryAccordion componentWillReceiveProps');
    const openSections = {};
    const { children } = nextProps;
    if (children) {
      nextProps.children.forEach((child) => {
        if (child && child.props && child.props.isOpen) {
          openSections[child.props.label] = true;
        }
      });
      this.setState({ openSections });
    }
  }

  onClick = (label) => {
    // console.log('BallotSummaryAccordion onClick');
    const {
      props: { allowMultipleOpen },
      state: { openSections },
    } = this;

    const isOpen = !!openSections[label];

    if (allowMultipleOpen) {
      this.setState({
        openSections: {
          ...openSections,
          [label]: !isOpen,
        },
      });
    } else {
      this.setState({
        openSections: {
          [label]: !isOpen,
        },
      });
    }
  };

  render () {
    renderLog('BallotSummaryAccordion');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      onClick,
      props: { children },
      state: { openSections },
    } = this;

    return (
      <>
        {children.map((child) => {
          if (child && child.props && child.props.label) {
            return (
              <BallotSummaryAccordionSection
                isOpen={!!openSections[child.props.label]}
                key={`accordionKey-${child.props.label}`}
                label={child.props.label}
                onClick={onClick}
              >
                {child.props.children}
              </BallotSummaryAccordionSection>
            );
          } else {
            return null;
          }
        })}
      </>
    );
  }
}
BallotSummaryAccordion.propTypes = {
  allowMultipleOpen: PropTypes.bool,
  children: PropTypes.instanceOf(Object).isRequired,
};

export default BallotSummaryAccordion;
