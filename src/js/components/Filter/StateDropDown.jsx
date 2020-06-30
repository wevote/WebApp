import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { convertStateCodeToStateText } from '../../utils/address-functions';
import { renderLog } from '../../utils/logging';


class StateDropDown extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    classes: PropTypes.object,
    onStateDropDownChange: PropTypes.func,
    stateCodesToDisplay: PropTypes.array,
  };

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
    const { classes, stateCodesToDisplay } = this.props;
    const { selectedState } = this.state;
    // console.log('StateDropDown render, selectedState:', selectedState);

    // console.log('StateDropDown render, stateCodesToDisplay: ', stateCodesToDisplay);
    const stateCodesHtml = stateCodesToDisplay.map((stateCode) => {
      const stateText = convertStateCodeToStateText(stateCode);
      return <option value={stateCode} key={`selectOption-${stateCode}`}>{stateText}</option>;
    });
    return (
      <StateDropDownWrapper>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel htmlFor="outlined-age-native-simple" />
          <Select
            classes={{ select: classes.select }}
            native
            value={selectedState}
            onChange={this.handleChooseStateChange}
            label=""
            inputProps={{
              name: 'age',
              id: 'outlined-age-native-simple',
            }}
          >
            {(stateCodesToDisplay && stateCodesToDisplay.length) ? (
              <>
                <option aria-label="-- show all states --" value="">-- show all states --</option>
                {stateCodesHtml}
              </>
            ) : (
              <>
                <option aria-label="-- show all states --" value="">-- show all states --</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </>
            )}
          </Select>
        </FormControl>
      </StateDropDownWrapper>
    );
  }
}
const styles = ({
  formControl: {
    height: 26,
    width: '100%',
    marginTop: 0,
  },
  select: {
    padding: '3px 4px',
    margin: '0px 1px',
  },
});

const StateDropDownWrapper = styled.div`
  margin-right: 12px;
`;

export default withTheme(withStyles(styles)(StateDropDown));
