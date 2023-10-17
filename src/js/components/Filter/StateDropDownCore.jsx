import { FormControl, InputLabel, Select } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { convertStateTextToStateCode, stateCodeMap } from '../../common/utils/addressFunctions';
import { renderLog } from '../../common/utils/logging';

class StateDropDownCore extends Component {
  noNotch = {
    '& .MuiOutlinedInput-notchedOutline legend': {
      display: 'none',
    },
  };

  render () {
    renderLog('StateDropDownCore');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      classes,
      stateCodesToDisplay,
      stateCodesHtml,
      onStateDropDownChange,
      selectedState,
      dialogLabel,
    } = this.props;

    let stateCodeTemp;
    const stateNameList = Object.values(stateCodeMap).sort();

    return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-native-simple" aria-label="Select State" />
        <Select
          classes={{ select: classes.select }}
          native
          value={selectedState}
          onChange={onStateDropDownChange}
          label={dialogLabel}
          inputProps={{
            name: 'age',
            id: 'outlined-age-native-simple',
          }}
          sx={this.noNotch}
        >
          {(stateCodesToDisplay && stateCodesToDisplay.length) ? (
            <>
              <option aria-label="-- show all states --" value="">
                -- show all states --
              </option>
              {stateCodesHtml}
            </>
          ) : (
            <>
              <option aria-label="-- any state --" value="all">-- any state --</option>
              {stateNameList.map((stateName) => {
                if (stateName === 'National') {
                  return null;
                } else {
                  stateCodeTemp = convertStateTextToStateCode(stateName);
                  return (
                    <option key={`${stateCodeTemp}-option`} value={stateCodeTemp}>{stateName}</option>
                  );
                }
              })}
            </>
          )}
        </Select>
      </FormControl>
    );
  }
}
StateDropDownCore.propTypes = {
  classes: PropTypes.object,
  onStateDropDownChange: PropTypes.func,
  stateCodesToDisplay: PropTypes.array,
  stateCodesHtml: PropTypes.string,
  selectedState: PropTypes.any,
  dialogLabel: PropTypes.string,
};

const styles = ({
  formControl: {
    marginTop: 6,
    padding: '0px 4px',
    width: 200,
  },
  select: {
    padding: '2px 12px',
    margin: '0px 1px 3px 1px',
  },
  iconButton: {
    padding: 8,
  },
});

export default withTheme(withStyles(styles)(StateDropDownCore));
