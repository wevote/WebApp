import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { renderLog } from '../../utils/logging';
import FriendsShareListItem from './FriendsShareListItem';

class FriendShareList extends Component {
  static propTypes = {
    list: PropTypes.array,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);

    this.state = {
      friendsToShareWith: [],
    };
  }

  componentDidMount () {
    for (let i = 0; i < this.props.list.length; i++) {
      if (!this.state[i]) {
        this.setState({ [i]: false });
      }
    }
  }

  render () {
    renderLog('FriendShareList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      classes,
    } = this.props;

    const handleChange = (index, item) => (event) => {
      let newFriendsToShareWith = [];

      if (!event.target.checked) {
        newFriendsToShareWith = this.state.friendsToShareWith.filter(newItem => newItem.voter_we_vote_id !== item.voter_we_vote_id);
      } else {
        newFriendsToShareWith = [...this.state.friendsToShareWith, item];
      }

      this.setState({ friendsToShareWith: newFriendsToShareWith, [index]: event.target.checked });
    };

    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup className={classes.formGroup}>
          {this.props.list.map((item, index) => { // eslint-disable-line arrow-body-style
            return (
              <FormControlLabel
                control={<Checkbox color="primary" checked={this.state[index]} onChange={handleChange(index, item)} value={index} />}
                classes={{ label: classes.label, root: classes.label }}
                label={<FriendsShareListItem {...item} />}
              />
            );
          })}
        </FormGroup>
        <br />
        <br />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="message"><strong>Add Personal Message</strong></label>
        <textarea name="message" id="message" className="full-width" rows="5" />
        <br />
        <Button fullWidth variant="contained" color="primary">
          Send
        </Button>
      </FormControl>
    );
  }
}

const styles = () => ({
  formControl: {
    width: '100%',
    textAlign: 'left',
    marginBottom: '0 !important',
  },
  formGroup: {
    width: '100%',
    textAlign: 'left',
  },
  label: {
    width: '100%',
    marginBottom: '0 !important',
  },
});

export default withStyles(styles)(FriendShareList);
