import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
// import closeIcon from '../../../img/global/icons/cross.svg';
// import searchIcon from '../../../img/global/icons/search.svg';
import colors from '../../common/components/Style/Colors';

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const StyledInput = styled.input`
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }

  border: none;
  height: 38px;
  width: 100%;
  border: 1px solid rgb(206, 212, 218);
  border-radius: 0.25rem;
  padding-right: 40px;
  padding-left: 12px;


  &:focus-visible {
    border: none;
    outline: ${colors.primary} solid 2px !important;
  }
`;

class BaseInput extends React.Component {
  constructor (props) {
    super(props);
    this.state = { searchText: '' };
  }

  handleInputChange = (event) => {
    this.setState({ searchText: event.target.value }, () => {
      if (this.props.onChange) {
        this.props.onChange(event);
      }
      if (this.props.onKeyDown) {
        this.props.onKeyDown(event);
      }
      if (this.props.onFocus) {
        this.props.onFocus(event);
      }
    });
  }

  handleClear = () => {
    this.setState({ searchText: '' }, () => {
      if (this.props.onClear) {
        this.props.onClear();
      }
    });
  }

  render () {
    return (
      <InputWrapper>
        {/* {!this.state.searchText && <SearchIcon />} */}
        <StyledInput
            type="search"
            placeholder={this.props.placeholder}
            value={this.state.searchText}
            onChange={this.handleInputChange}
            // onClear={this.handleClear} // 2/26/23 temporarily removed, there is no onClear for an HTML input, but using a listener action is possible
            maxLength={50}
        />
      </InputWrapper>
    );
  }
}

BaseInput.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClear: PropTypes.func,
};

export default BaseInput;
