import { Button, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import AppObservableStore from '../../stores/AppObservableStore';
import { cordovaDot } from '../../utils/cordovaUtils';


class SettingsProfilePicture extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: 'custom',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (e) {
    console.log(e.target.value);

    this.setState({ value: e.target.value });
  }

  render () {
    const { value } = this.state;
    const { classes } = this.props;

    return (
      <Wrapper value={value} onChange={this.handleChange} name="profile-option">
        <div className="row">
          <CustomColumns className="col">
            <ProfilePictureOption>
              <FormControlLabel value="custom"
                                control={<Radio color="primary" />}
                                label="Custom picture"
              />
              <Seperator />
              <ProfilePicture src={cordovaDot('../../../img/global/photos/Aaron_Travis-200x200.jpg')} />
              {value === 'custom' && (
                <>
                  <Button
                    onClick={() => AppObservableStore.setShowImageUploadModal(true)}
                    classes={{ root: classes.button }}
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    Upload
                  </Button>
                  <Button color="primary"
                          variant="outlined"
                          fullWidth
                  >
                    Remove
                  </Button>
                </>
              )}
            </ProfilePictureOption>
          </CustomColumns>
          <CustomColumns className="col">
            <ProfilePictureOption>
              <FormControlLabel value="facebook"
                                control={<Radio color="primary" />}
                                label="Facebook picture"
              />
              <Seperator />
              <ProfilePicture src={cordovaDot('../../../img/global/photos/Aaron_Travis-200x200.jpg')} />
            </ProfilePictureOption>
          </CustomColumns>
          <CustomColumns className="col">
            <ProfilePictureOption>
              <FormControlLabel value="twitter"
                                control={<Radio color="primary" />}
                                label="Twitter picture"
              />
              <Seperator />
              <ProfilePicture src={cordovaDot('../../../img/global/photos/Aaron_Travis-200x200.jpg')} />
            </ProfilePictureOption>
          </CustomColumns>
        </div>
      </Wrapper>
    );
  }
}
SettingsProfilePicture.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  button: {
    marginTop: 12,
    marginBottom: 8,
  },
});

const Wrapper = styled(RadioGroup)`

`;

const CustomColumns = styled.div`
  width: 100% !important;
  @media(min-width: 576px) {
    width: 50% !important;
  }
  @media(min-width: 740px) {
    width: 33% !important;
  }
  @media(min-width: 767px) {
    width: 50% !important;
  }
`;

const ProfilePictureOption = styled.div`
  border: 2px solid #e8e8e8;
  border-radius: 3px;
  padding: 4px 12px 12px 12px;
  display: flex !important;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 30px;
`;

const Seperator = styled.div`
  width: 100%;
  margin: 12px 0;
  background: #e8e8e8;
  height: 1px;
`;

const ProfilePicture = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 2px;
  margin: 0 auto;
`;

// const SectionTitle = styled.h2`
//   width: fit-content;
//   font-weight: bold;
//   font-size: 22px;
//   margin-bottom: 16px;
//   margin-top: 32px;
// `;

export default withStyles(styles)(SettingsProfilePicture);
