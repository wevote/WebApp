import React from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const ActivityPostPublicDropdown = (props) => {
  const { visibilityIsPublic, onVisibilityChange, classes } = props;
  // console.log('ActivityPostPublicDropdown visibilityIsPublic:', visibilityIsPublic);

  const handleVisibilityChange = (event) => {
    const { value } = event.target;
    onVisibilityChange(value === 'SHOW_PUBLIC');
  };

  return (
    <FormControl className={classes.formControl} aria-labelledby="opinion-visibility-label">
      <div className={classes.container}>
        <Typography
          id="opinion-visibility-label"
          className={classes.label}
          component="label"
        >
          Opinion visible to:
        </Typography>
        <Select
          value={visibilityIsPublic ? 'SHOW_PUBLIC' : 'FRIENDS_ONLY'}
          onChange={handleVisibilityChange}
          className={classes.selectVisibility}
          // disableUnderline
          IconComponent={ArrowDropDownIcon}
          aria-label="Select visibility for your opinion"
          MenuProps={{
            classes: { paper: classes.menuPaper },
          }}
        >
          <MenuItem value="SHOW_PUBLIC" className={classes.menuItem}>
            Public
          </MenuItem>
          <MenuItem value="FRIENDS_ONLY" className={classes.menuItem}>
            My friends
          </MenuItem>
        </Select>
      </div>
    </FormControl>
  );
};

ActivityPostPublicDropdown.propTypes = {
  classes: PropTypes.object.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  visibilityIsPublic: PropTypes.bool,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  container: {
    alignItems: 'center',
    display: 'flex',
  },
  label: {
    color: DesignTokenColors.neutralUI900,
    fontFamily: 'Poppins',
    fontSize: '13px',
    fontWeight: '400',
    lineHeight: '19.5px',
    marginRight: '8px',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  selectVisibility: {
    border: 'none',
    boxShadow: 'none',
    color: DesignTokenColors.neutralUI900,
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '21.82px',
    outline: 'none',
    padding: 0,
    '&:focus': {
      outline: 'none',
      boxShadow: 'none',
    },
    '& .MuiSelect-select': {
      minHeight: 'unset',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiOutlinedInput-input': {
      padding: '0 32px 0 0',
      minHeight: 'unset',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiSelect-icon': {
      right: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
  },
});

export default withStyles(styles)(ActivityPostPublicDropdown);
