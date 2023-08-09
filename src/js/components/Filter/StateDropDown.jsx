import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import { renderLog } from '../../common/utils/logging';
import StateDropDownCore from './StateDropDownCore';


class StateDropDown extends Component {
  // This modal will show a users ballot guides from previous and current elections.
  constructor (props) {
    super(props);
    this.state = {
      selectedState: 'all',
    };

    this.handleChooseStateChange = this.handleChooseStateChange.bind(this);
  }

  componentDidMount () {
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.selectedState !== nextState.selectedState) {
      return true;
    }
    if (JSON.stringify(this.props.stateCodesToDisplay) !== JSON.stringify(nextProps.stateCodesToDisplay)) {
      return true;
    }
    return false;
  }

  handleChooseStateChange = (e) => {
    this.setState({ selectedState: e.target.value });
    if (this.props.onStateDropDownChange) {
      this.props.onStateDropDownChange(e.target.value);
    }
  }

  render () {
    renderLog('StateDropDown');  // Set LOG_RENDER_EVENTS to log all renders
    const { stateCodesToDisplay } = this.props;
    const { selectedState } = this.state;
    // console.log('StateDropDown render, selectedState:', selectedState);

    // console.log('StateDropDown render, stateCodesToDisplay: ', stateCodesToDisplay);
    const stateCodesHtml = stateCodesToDisplay.map((stateCode) => {
      const stateText = convertStateCodeToStateText(stateCode);
      return <option value={stateCode} key={`selectOption-${stateCode}`}>{stateText}</option>;
    });
    return (
      <StateDropDownWrapper>
        <StateDropDownCore
          stateCodesToDisplay={stateCodesToDisplay}
          handleChooseStateChange={this.handleChooseStateChange}
          stateCodesHtml={stateCodesHtml}
          selectedState={selectedState}
          dialogLabel=""
        />
      </StateDropDownWrapper>
    );
  }
}
StateDropDown.propTypes = {
  onStateDropDownChange: PropTypes.func,
  stateCodesToDisplay: PropTypes.array,
};

const StateDropDownWrapper = styled('div')`
  margin-right: 12px;
`;

export default withTheme(StateDropDown);
