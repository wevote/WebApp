import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BallotSummaryAccordionSection from './BallotSummaryAccordionSection';

class Accordion extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
  };

  constructor (props) {
    super(props);

    const openSections = {};

    this.state = { openSections };
  }

  onClick = (label) => {
    const {
      state: { openSections },
    } = this;

    const isOpen = !!openSections[label];

    this.setState({
      openSections: {
        [label]: !isOpen,
      },
    });
  };

  render () {
    const {
      onClick,
      props: { children },
      state: { openSections },
    } = this;

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

export default Accordion;
