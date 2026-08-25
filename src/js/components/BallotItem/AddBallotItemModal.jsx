import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import { 
    FormControl, FormControlLabel, FormGroup, FormLabel, 
    Radio, RadioGroup,TextField, ToggleButton, ToggleButtonGroup,  
    Button,
    Box, 
} from '@mui/material';
import { Check, DoNotDisturb } from '@mui/icons-material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ModalDisplayTemplateA, { templateAStyles, TextFieldWrapper } from '../Widgets/ModalDisplayTemplateA';
import { renderLog } from '../../common/utils/logging';


class AddBallotItemModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            itemName: '',
            itemRadioSelection: null,
            candidateOfficeName: '',
            candidatePartySelection: '',
            otherPartyText: '',
            chooseOpposeSelection: null,
            opinionText: '',
        };
    }

    handleItemRadioSelection = (event) => {
        this.setState({ itemRadioSelection: event.target.value });
    };

    handleCandidatePartySelection = (event) => {
        this.setState({ candidatePartySelection: event.target.value });
    };

    handleOtherTextChange = (event) => {
        this.setState({ otherPartyText: event.target.value });
    };

    handlechooseOpposeSelection = (event, newSelection) => {
        this.setState({ chooseOpposeSelection: newSelection });
    };

    handleSubmit = () => {
        let submissionData = {
            itemName: this.state.itemName,
            itemRadioSelection: this.state.itemRadioSelection,
            chooseOpposeSelection: this.state.chooseOpposeSelection,
            opinionText: this.state.opinionText,
        }

        if (this.state.itemRadioSelection === 'candidate') {
            submissionData.candidateOfficeName ??= this.state.candidateOfficeName;
            submissionData.candidatePartySelection ??= this.state.candidatePartySelection;
            if (this.state.candidatePartySelection === 'other') {
                submissionData.otherPartyText = this.state.otherPartyText;
            }
        }

        console.log('AddBallotItemModal handleSubmit called with values:', submissionData);
    }


    render () {
        renderLog('AddBallotItemModal');  // Set LOG_RENDER_EVENTS to log all renders
        
        const { itemName, itemRadioSelection, candidateOfficeName, candidatePartySelection, otherPartyText, opinionText } = this.state;
        const { show } = this.props;
       
        if (!show) {
            return null;
        }

        const dialogTitleText = 'Add an item to your ballot';
        const textFieldJSX = (
            <TextFieldWrapper>
                <div>
                    <UnorderedList>
                        <li>
                            Initially, this added item will only be visible to your 
                            friends in ballot locations within 25 miles of you.
                        </li>
                        <li>
                            Once your friends like this item and add their opinions, 
                            it will become visible to everyone else. 
                        </li>
                    {/* </ul> */}
                    </UnorderedList>
                    <TextField
                        id="addBallotItemInput"
                        label="Item name"
                        required
                        value={itemName}
                        onChange={(e) => this.setState({ itemName: e.target.value })}
                        placeholder="Name of candidate, proposition, measure, or referendum"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderRadius: '10px',
                                },
                            },
                        }}
                    />
                </div>

                <HorizontalRule />

                <div style={{ marginBottom: '20px' }}>
                    <FormGroup>
                        <FormControl>
                            <FormLabel id="item-type-label">Item type (optional)</FormLabel>
                            <RadioGroup
                                aria-labelledby="item-type-label"
                                name="item-type-radio-group"
                                value={itemRadioSelection}
                                onChange={this.handleItemRadioSelection}
                            >
                                <FormControlLabel value="candidate" control={<Radio />} label="Candidate" />

                                {itemRadioSelection === 'candidate' &&
                                    <Box>
                                        <TextField
                                            id="outlined-candidateDetailsInput"
                                            label="Office name"
                                            value={candidateOfficeName}
                                            onChange={(e) => this.setState({ candidateOfficeName: e.target.value })}
                                            variant="outlined"
                                            disabled={itemRadioSelection !== 'candidate'}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderRadius: '10px',
                                                    },
                                                },
                                            }}
                                        />
                                        <RadioGroup
                                            aria-labelledby="candidate-party-label"
                                            name="candidate-party-radio-group"
                                            value={candidatePartySelection}
                                            onChange={this.handleCandidatePartySelection}
                                        >
                                            <FormControlLabel value="democrat" control={<Radio />} label="Democrat" />
                                            <FormControlLabel value="republican" control={<Radio />} label="Republican" />
                                            <FormControlLabel value="independent" control={<Radio />} label="Independent" />
                                            <FormControlLabel
                                                value="other"
                                                control={<Radio />}
                                                label={
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder="Other (please specify)"
                                                        value={otherPartyText}
                                                        onChange={this.handleOtherTextChange}
                                                        // Prevents the radio button from losing focus or toggling unexpectedly
                                                        onClick={() => this.setState({ candidatePartySelection: 'other' })}
                                                        disabled={itemRadioSelection !== 'candidate' || (candidatePartySelection !== 'other' && otherPartyText === '')}
                                                        sx={{ 
                                                            minWidth: 200,

                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderRadius: '10px',
                                                                },
                                                            },

                                                        }}
                                                    />
                                                }
                                            />
                                        </RadioGroup>
                                    </Box>
                                }
                                <FormControlLabel value="proposition" control={<Radio />} label="Proposition / Measure / Referendum" />
                            </RadioGroup>
                        </FormControl>
                    </FormGroup>
                </div>
                
                <HorizontalRule />

                <div style={{ marginTop: '20px' }}>
                    <ToggleButtonGroup
                        value={this.state.chooseOpposeSelection}
                        onChange={this.handlechooseOpposeSelection}
                        color={this.state.chooseOpposeSelection === 'choose' ? 'success' : this.state.chooseOpposeSelection === 'oppose' ? 'error' : 'primary'}
                        size="large"
                        exclusive
                        aria-label="choose-oppose-toggle"
                    >
                        <ToggleButton value="choose" aria-label="choose">
                            <Check fontSize="small" sx={{ mr: 1 }} />
                            Choose
                        </ToggleButton>
                        <ToggleButton value="oppose" aria-label="oppose">
                            <DoNotDisturb fontSize="small" sx={{ mr: 1 }} />
                            Oppose
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <TextField
                        label="What's your opinion on this ballot item?"
                        value={opinionText}
                        onChange={(e) => this.setState({ opinionText: e.target.value })}
                        multiline
                        minRows={3}
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderRadius: '10px',
                                },
                            },
                        }}
                    />
                </div>

                <SubmitActionsWrapper>
                    <CancelButton
                        variant="outlined"
                        color="secondary"
                        sx={{ mt: 2, mr: 2 }}
                        onClick={this.props.toggleFunction}
                    >
                        Cancel
                    </CancelButton>
                    <SubmitButton
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => {this.handleSubmit();}}
                    >
                        Add Ballot Item
                    </SubmitButton>
                </SubmitActionsWrapper>
            </TextFieldWrapper>
        );
        
        return (
            <ModalDisplayTemplateA
                show={show}
                dialogTitleJSX={<>{dialogTitleText}</>}
                toggleModal={this.props.toggleFunction}
                textFieldJSX={textFieldJSX}
                tallMode
            />
        );
    }
}

AddBallotItemModal.propTypes = {
  show: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
};


const UnorderedList = styled('ul')`
    margin: 20px 0px; 
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: rgb(230, 243, 255);
    border: 1px solid rgb(174, 178, 190);
    border-radius: 10px;
`;

const HorizontalRule = styled('hr')`
    width: 90%;
`;

const SubmitActionsWrapper = styled('div')`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

const CancelButton = styled(Button)`
    border-radius: 50px;
    background-color: #f5f5f5;
    color: #555;
    flex: 1;
    &:hover {
        background-color: #e0e0e0;
    }
`;

const SubmitButton = styled(Button)`
    border-radius: 50px;
    background-color: #1976d2;
    color: white;
    flex: 2;
    &:hover {
        background-color: #115293;
    }
`;


export default withTheme(withStyles(templateAStyles)(AddBallotItemModal));
// export default AddBallotItemModal;
