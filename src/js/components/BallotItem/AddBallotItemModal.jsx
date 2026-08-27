import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';

import { 
    Box, Button, FormControl, FormControlLabel, FormGroup, FormLabel, 
    Radio, RadioGroup, TextField, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

import styled, { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ModalDisplayTemplateA, { templateAStyles, TextFieldWrapper } from '../Widgets/ModalDisplayTemplateA';

import { renderLog } from '../../common/utils/logging';



function AddBallotItemModal ({ show, toggleFunction }) {
    renderLog('AddBallotItemModal');  // Set LOG_RENDER_EVENTS to log all renders

    const [itemName, setItemName] = useState('');
    const [itemRadioSelection, setItemRadioSelection] = useState(null);
    const [candidateOfficeName, setCandidateOfficeName] = useState('');
    const [candidatePartySelection, setCandidatePartySelection] = useState('');
    const [otherPartyText, setOtherPartyText] = useState('');
    const [stanceSelection, setStanceSelection] = useState(null);
    const [opinionText, setOpinionText] = useState('');

    const handleItemRadioSelection = (event) => {
        setItemRadioSelection(event.target.value);
    };

    const handleCandidatePartySelection = (event) => {
        setCandidatePartySelection(event.target.value);
    };

    const handleOtherTextChange = (event) => {
        setOtherPartyText(event.target.value);
    };

    const handleSubmit = () => {
        let submissionData = {
            itemName,
            itemRadioSelection,
            stanceSelection,
            opinionText,
            // only include these fields in submission data if user made relevant selections
            ...(itemRadioSelection === 'candidate' && {
                candidateOfficeName,
                candidatePartySelection,
                ...(candidatePartySelection === 'other' && { otherPartyText })
            })
            
            // ...(itemRadioSelection === 'candidate' && candidateOfficeName && { candidateOfficeName }),
            // ...(itemRadioSelection === 'candidate' && candidatePartySelection && { candidatePartySelection}),
            // ...(candidatePartySelection === 'other' && otherPartyText && { otherPartyText })

        };

        // TODO: replace with real submission call & desired data structure, 
        // then close modal once submission succeeds
        console.log('AddBallotItemModal handleSubmit called with values:', submissionData);
    };

    if (!show) {
        return null;
    }

    const dialogTitleText = 'Add an item to your ballot';
    const textFieldJSX = (
        <>
            <ModalFont />
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
                    </UnorderedList>

                    <TextField
                        id="addBallotItemInput"
                        label="Item name"
                        required
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Name of candidate, proposition, measure, or referendum"
                        variant="outlined"
                        fullWidth
                        // InputLabelProps={{ shrink: true }}
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
                                onChange={handleItemRadioSelection}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <FormControlLabel 
                                        value="candidate" 
                                        control={<Radio />} 
                                        label="Candidate"
                                        sx={{ flexShrink: 0, alignSelf: 'flex-start' }}
                                    />

                                    {itemRadioSelection === 'candidate' &&
                                        <Box
                                            sx={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                minWidth: 0
                                            }}
                                        >
                                            <TextField
                                                id="outlined-candidateDetailsInput"
                                                label="Office name"
                                                value={candidateOfficeName}
                                                onChange={(e) => setCandidateOfficeName(e.target.value)}
                                                variant="outlined"
                                                fullWidth
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
                                                onChange={handleCandidatePartySelection}
                                                sx={{ gap: 1, minWidth: 0 }}
                                            >
                                                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', minWidth: 0 }}>
                                                {/* <Box sx={{ display: 'flex', flexDirection: 'row', minWidth: 0 }}> */}
                                                    <FormControlLabel value="democrat" control={<Radio />} label="Democrat" />
                                                    <FormControlLabel value="republican" control={<Radio />} label="Republican" />
                                                    <FormControlLabel value="independent" control={<Radio />} label="Independent" />
                                                </Box>
                                            
                                                <Box sx= {{ display: 'flex', alignItems: 'center', ml: '-11px' }}>
                                                    <Radio
                                                        checked={candidatePartySelection === 'other'}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            setCandidatePartySelection('other');
                                                        }}
                                                        value="other"
                                                        name="candidate-party-radio-group"
                                                        disabled={itemRadioSelection !== 'candidate'}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder="Other (please specify)"
                                                        value={otherPartyText}
                                                        onChange={handleOtherTextChange}
                                                        onFocus={() => setCandidatePartySelection('other')}                                                     
                                                        disabled={itemRadioSelection !== 'candidate'}
                                                        sx={{ 
                                                            minWidth: 200,
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderRadius: '10px',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </RadioGroup>
                                        </Box>
                                    }
                                </Box>

                                <FormControlLabel 
                                    value="proposition" 
                                    control={<Radio />} 
                                    label="Proposition / Measure / Referendum"
                                />
                            </RadioGroup>
                        </FormControl>
                    </FormGroup>
                </div>

                <HorizontalRule />

                <div style={{ marginTop: '20px' }}>  
                    <StanceToggleRow>

                        <StanceToggleButton
                            type="button"
                            selected={stanceSelection === 'support'}
                            stanceType="support"
                            onClick={() => setStanceSelection("support")}
                        >
                            <CheckIcon style={{ fontSize: 18, marginRight: 4 }} />
                            Choose
                        </StanceToggleButton>

                        <StanceToggleButton
                            type="button"
                            selected={stanceSelection === 'oppose'}
                            stanceType="oppose"
                            onClick={() => setStanceSelection('oppose')}
                            >
                            <BlockIcon style={{ fontSize: 18, marginRight: 4 }} />
                            Oppose
                        </StanceToggleButton>

                        <StanceToggleButton
                            type="button"
                            selected={stanceSelection === 'undecided'}
                            stanceType="undecided"
                            onClick={() => setStanceSelection('undecided')}
                        >
                            Undecided
                        </StanceToggleButton>
                    </StanceToggleRow>

                    <TextField
                        label="What's your opinion on this ballot item?"
                        value={opinionText}
                        onChange={(e) => setOpinionText(e.target.value)}
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
                        onClick={toggleFunction}
                    >
                        Cancel
                    </CancelButton>
                    <SubmitButton
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => { handleSubmit(); }}
                    >
                        Add Ballot Item
                    </SubmitButton>
                </SubmitActionsWrapper>

            </TextFieldWrapper>
        </>
    );

    return (
        <ModalDisplayTemplateA 
            show={show}
            toggleModal={toggleFunction}
            dialogTitleJSX={<>{dialogTitleText}</>}
            toggleModal={toggleFunction}
            textFieldJSX={textFieldJSX}
            tallMode
        />
    );
}

AddBallotItemModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleFunction: PropTypes.func.isRequired,
};

// override existing font-family rules which uniquely impact MUI Typography elements 
// so that font is consistent throughout modal
const ModalFont = createGlobalStyle`
  .MuiDialog-paper:has(#addBallotItemInput) .MuiTypography-root,
  .MuiDialog-paper:has(#addBallotItemInput) .MuiFormLabel-root {
    font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
  }
`;

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


const StanceToggleRow = styled('div')`
    display: flex;
    margin-bottom: 6px;
`;

// map both button background color when selected & text/icon color when hovered
// to match currently active stanceType
const stanceColor = (stanceType) => {
    if (stanceType === 'support') return DesignTokenColors.confirmation800;
    if (stanceType === 'oppose') return DesignTokenColors.alert800;
    return DesignTokenColors.info800; // undecided
}

const StanceToggleButton = styled('button')`
    align-items: center;
    background-color: ${(props) => (props.selected ? stanceColor(props.stanceType) : DesignTokenColors.whiteUI)};
    border: 2px solid ${(props) => (props.selected ? DesignTokenColors.info800 : DesignTokenColors.neutralUI300)};
    border-radius: 20px;
    color: ${(props) => (props.selected ? DesignTokenColors.whiteUI : DesignTokenColors.neutral900)};
    cursor: pointer;
    display: flex;
    font-size: 14px;
    font-weight: ${(props) => (props.selected ? '600' : '400')};
    margin-right: 8px;
    padding: 4px 16px;

    &:hover,
    &:focus-visible {
        border-color: ${DesignTokenColors.info800};
        color: ${(props) => (props.selected ? DesignTokenColors.whiteUI : stanceColor(props.stanceType))};
    }
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
