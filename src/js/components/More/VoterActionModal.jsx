import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { Button, FormControl, TextField } from '@mui/material';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';

class VoterActionModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTab: props.initialTab || 'details',
      formData: {
        name: props.voter?.name || '',
        email: props.voter?.email || '',
        phone: props.voter?.phone || '',
      },
    };
  }

  componentDidUpdate (prevProps) {
    if (prevProps.voter !== this.props.voter) {
      this.setState({
        formData: {
          name: this.props.voter?.name || '',
          email: this.props.voter?.email || '',
          phone: this.props.voter?.phone || '',
        },
      });
    }
    if (prevProps.initialTab !== this.props.initialTab) {
      this.setState({
        activeTab: this.props.initialTab || 'details',
      });
    }
  }

  handleInputChange = (field) => (event) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [field]: event.target.value,
      },
    }));
  };

  handleSave = () => {
    const { onSave, voter } = this.props;
    const { formData } = this.state;
    // TODO: Pls implement save functionality here when possible
    console.log('Saving voter data:', { ...voter, ...formData });
    if (onSave) {
      onSave({ ...voter, ...formData });
    }
    this.props.toggleModal();
  };

  handleCancel = () => {
    this.setState({
      formData: {
        name: this.props.voter?.name || '',
        email: this.props.voter?.email || '',
        phone: this.props.voter?.phone || '',
      },
    });
    this.props.toggleModal();
  };

  renderDetailsTab = () => {
    const { formData } = this.state;

    return (
      <FormContainer>
        <FormGroup>
          <Label>First and last name</Label>
          <TextField
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={this.handleInputChange('name')}
            placeholder="First and last name"
            size="small"
          />
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <TextField
            fullWidth
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={this.handleInputChange('email')}
            placeholder="Email"
            size="small"
          />
        </FormGroup>

        <FormGroup>
          <Label>Mobile phone</Label>
          <TextField
            fullWidth
            variant="outlined"
            type="tel"
            value={formData.phone}
            onChange={this.handleInputChange('phone')}
            placeholder="Mobile phone"
            size="small"
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton onClick={this.handleCancel}>
            Cancel
          </CancelButton>
          <SaveButton
            variant="contained"
            onClick={this.handleSave}
          >
            Save
          </SaveButton>
        </ButtonGroup>
      </FormContainer>
    );
  };

  renderHistoryTab = () => {
    const { voter } = this.props;

    return (
      <HistoryContainer>
        <HistoryRow>
          <HistoryLabel>Email</HistoryLabel>
          <HistoryValue>{voter?.email || '—'}</HistoryValue>
        </HistoryRow>

        <HistoryRow>
          <HistoryLabel>Phone</HistoryLabel>
          <HistoryValue>{voter?.phone || '—'}</HistoryValue>
        </HistoryRow>

        <HistoryRow>
          <HistoryLabel>Added via</HistoryLabel>
          <HistoryValue>{voter?.source || 'Manual entry'}</HistoryValue>
        </HistoryRow>

        <HistoryRow>
          <HistoryLabel>Added by</HistoryLabel>
          <HistoryValue>{voter?.addedBy || 'You'}</HistoryValue>
        </HistoryRow>

        <HistoryRow>
          <HistoryLabel>Added on</HistoryLabel>
          <HistoryValue>
            {voter?.addedAt ? new Date(voter.addedAt).toLocaleString() : '—'}
          </HistoryValue>
        </HistoryRow>
      </HistoryContainer>
    );
  };

  render () {
    renderLog('VoterActionModal');
    const { show, toggleModal, voter } = this.props;
    const { activeTab } = this.state;

    const dialogTitleJSX = (
      <TitleWrapper>
        <VoterName>{voter?.name || 'Voter'}</VoterName>
      </TitleWrapper>
    );

    const textFieldJSX = (
      <ContentWrapper>
        <TabContainer>
          <Tab
            active={activeTab === 'details'}
            onClick={() => this.setState({ activeTab: 'details' })}
          >
            Details
          </Tab>
          <Tab
            active={activeTab === 'history'}
            onClick={() => this.setState({ activeTab: 'history' })}
          >
            History
          </Tab>
        </TabContainer>

        <TabContent>
          {activeTab === 'details' ? this.renderDetailsTab() : this.renderHistoryTab()}
        </TabContent>
      </ContentWrapper>
    );

    return (
      <>
        <ChangeTitleFont />
        <HideTemplateADivider />
        <SoftenCorners />
        <ModalDisplayTemplateA
          show={show}
          toggleModal={toggleModal}
          dialogTitleJSX={dialogTitleJSX}
          textFieldJSX={textFieldJSX}
          tallMode
          externalUniqueId="voterAction"
        />
      </>
    );
  }
}

VoterActionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  voter: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    source: PropTypes.string,
    addedBy: PropTypes.string,
    addedAt: PropTypes.string,
  }),
  initialTab: PropTypes.oneOf(['details', 'history']),
  onSave: PropTypes.func,
};

export default VoterActionModal;

// Global Styles

const ChangeTitleFont = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAvoterAction) * {
    font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
  }
`;

const HideTemplateADivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAvoterAction) > hr {
    display: none !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAvoterAction) {
    border-radius: 14px !important;
  }
`;

// Styles

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto;
  padding-top: 20px;
`;

const CancelButton = styled(Button)`
  && {
    background: ${DesignTokenColors.whiteUI};
    border: none;
    border-radius: 9999px;
    color: ${DesignTokenColors.neutralUI800};
    text-transform: none;
    font-weight: 500;
    padding: 4px 30px;

    &:hover {
      background-color: ${DesignTokenColors.neutralUI50};
    }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 18px 28px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const FormGroup = styled(FormControl)`
  && {
    width: 100%;
    margin: 0;

    .MuiOutlinedInput-root {
      border-radius: 8px;
    }
  }
`;

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HistoryLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${DesignTokenColors.neutralUI600};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HistoryRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HistoryValue = styled.div`
  font-size: 14px;
  color: ${DesignTokenColors.neutralUI900};
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${DesignTokenColors.neutralUI700};
  margin-bottom: 6px;
`;

const SaveButton = styled(Button)`
  && {
    background-color: ${DesignTokenColors.primary700};
    border: 1px solid ${DesignTokenColors.primary700};
    border-radius: 9999px;
    color: ${DesignTokenColors.whiteUI};
    text-transform: none;
    font-weight: 500;
    box-shadow: none;
    padding: 4px 30px;

    &:hover {
      background-color: ${DesignTokenColors.primary800};
      border-color: ${DesignTokenColors.primary800};
    }

    &:disabled {
      background-color: ${DesignTokenColors.neutralUI200};
      border-color: ${DesignTokenColors.neutralUI200};
      color: ${DesignTokenColors.neutralUI500};
      cursor: not-allowed;
    }
  }
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 12px 4px 4px 4px;
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => (props.active ? DesignTokenColors.primary700 : DesignTokenColors.neutralUI600)};
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  border-bottom: 2px solid transparent;

  &:hover {
    color: ${DesignTokenColors.primary700};
  }

  ${(props) => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: -8px;
      right: -8px;
      height: 2px;
      background-color: ${DesignTokenColors.primary700};
    }
  `}
`;

const TabContainer = styled.div`
  display: flex;
  gap: 48px;
  margin-bottom: 20px;
`;

const TabContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  width: 100%;
  padding-left: 8px;
`;

const VoterName = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: ${DesignTokenColors.neutralUI900};
`;
