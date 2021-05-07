import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import Testimonial from '../Widgets/Testimonial';
import cookies from '../../utils/cookies';

class FriendsPromoBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.setFriendSectionBoxClosed = this.setFriendSectionBoxClosed.bind(this);
  }

  componentDidMount () {
    this.setState({
      friendSectionBoxClosed: !!cookies.getItem('friend_section_box_closed') || false,
    });
  }

  setFriendSectionBoxClosed () {
    const oneMonthExpires = 86400 * 31;
    cookies.setItem('friend_section_box_closed', '1', oneMonthExpires, '/');
    this.setState({
      friendSectionBoxClosed: true,
    });
  }

  render () {
    renderLog('FriendsPromoBox');  // Set LOG_RENDER_EVENTS to log all renders
    const { testimonialAuthor, imageUrl, testimonial, isMobile, classes } = this.props;

    return (
      <>
        { isMobile ?
          !this.state.friendSectionBoxClosed && (
            <div className={classes.mobile}>
              <div className={classes.testimonialMobile}>
                <Testimonial
                  imageUrl={imageUrl}
                  testimonialAuthor={testimonialAuthor}
                  testimonial={testimonial}
                  textStyle={{ paddingRight: 15 }}
                />
              </div>
              <div
                className={classes.closeButton}
                onClick={this.setFriendSectionBoxClosed}
              >
                &times;
              </div>
            </div>
          ) :
          (
            <div>
              <div className="card">
                <div className="card-main">
                  <Testimonial
                    imageUrl={imageUrl}
                    testimonialAuthor={testimonialAuthor}
                    testimonial={testimonial}
                  />
                </div>
              </div>
            </div>
          )}
      </>
    );
  }
}
FriendsPromoBox.propTypes = {
  classes: PropTypes.object,
  testimonialAuthor: PropTypes.string,
  testimonial: PropTypes.string,
  imageUrl: PropTypes.string,
  isMobile: PropTypes.bool,
};

const styles = (theme) => ({
  closeButton: {
    fontSize: '25px',
    position: 'absolute',
    alignSelf: 'center',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#000',
    top: '50%',
    transform: 'translate(0, -50%)',
    right: '15px',

  },
  mobile: {
    position: 'relative',
    display: 'flex',
    marginBottom: `${theme.spacing(1)}px`,
    fontSize: '14px',
    backgroundClip: 'border-box',
    border: '2px solid #999',
    backgroundColor: 'white',
  },
  testimonialMobile: {
    paddingLeft: '15px',
    paddingRight: '15px',
  },
});

export default withTheme(withStyles(styles)(FriendsPromoBox));
