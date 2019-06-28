import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BallotSummaryAccordionSection from './BallotSummaryAccordionSection';

class BallotSummaryAccordion extends Component {
  static propTypes = {
    allowMultipleOpen: PropTypes.bool,
    children: PropTypes.instanceOf(Object).isRequired,
  };

  constructor (props) {
    super(props);

    const openSections = {};

    // this.props.children.forEach(child => {
    //   if (child.props.isOpen) {
    //     openSections[child.props.label] = true;
    //   }
    // });

    this.state = { openSections };
  }

  onClick = (label) => {
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
    const { children } = this.props;
    const { openSections } = this.state;
    const { onClick } = this;

    return (
      <div>
        {children.map(child => (
          <BallotSummaryAccordionSection
            isOpen={!!openSections[child.props.label]}
            label={child.props.label}
            onClick={onClick}
          >
            {child.props.children}
          </BallotSummaryAccordionSection>
        ))}
      </div>
    );
  }
}

export default BallotSummaryAccordion;
