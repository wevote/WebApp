import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import VoterPositionEntryAndDisplay from '../components/PositionItem/VoterPositionEntryAndDisplay';
import muiTheme from '../components/Style/muiTheme';



export default {
  title: 'Components/PositionItem/VoterPositionEntryAndDisplay',
  component: VoterPositionEntryAndDisplay,
};

export const Default = () => (
  <ThemeProvider theme={muiTheme}>
    <VoterPositionEntryAndDisplay />
  </ThemeProvider>
);
