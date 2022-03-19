import { Check } from '@mui/icons-material';
import { Box, Tab, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import styled from '@mui/material/styles/styled';
import PropTypes from 'prop-types';
import * as React from 'react';
import Table from 'react-bootstrap/Table';
import { renderLog } from '../../common/utils/logging';
// import { donationTheme } from '../../common/components/Style/donationTheme';


// TODO: December 8, 2021:  This is **super** rough, just a stub to show the data
// We should implement it as MUI V5 DataGrid

function TabPanel (props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box id="ContactsTableMenuBox" sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function createData (name, email, state) {
  return { name, email, state };
}

function getDataRows (data)  {
  const dataOut = [];
  if (data) {
    const hackUntilWeGetMuiDataGrid = Math.min(data.length, 100);
    for (let i = 0; i < hackUntilWeGetMuiDataGrid; i++) {
      const { display_name: displayName, email_address_text: email, state } = data[i];
      dataOut.push(createData(displayName, email, state));
    }
  }
  return dataOut;
}

export default function ContactsTable (props) {
  const [value, setValue] = React.useState(0);
  const { contacts, displayState } = props;

  if (!contacts || contacts.length === 0 || displayState !== 3) {
    return '';
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // contacts.push({
  //   apple_contact_id: 'AB697297-1F39-44D1-8B56-3DC2FEFB29DE',
  //   apple_contacts_api: true,
  //   display_name: 'Chris and Betsy and Bob Oxenburgh',
  //   email_address_text: 'crazedmomwith3boys@gmail.com',
  //   family_name: 'Oxenburgh',
  //   given_name: 'Bob',
  //   google_people_api: false,
  //   state: 'CA',
  // });

  const rows = getDataRows(contacts);
  renderLog('ConnectToFriends functional component');
  return (
    <Box sx={{ maxWidth: '100%', position: 'relative', display: 'inherit' }}>
      <div align="left"
          style={{
            margin: '26px 0 15px 14px',
            paddingTop: '12px !important',
            height: '20px',
          }}
      >
        <h4>
          Connect To Friends
        </h4>
      </div>
      {/* <ThemeProvider theme={donationTheme(false, 40)}> */}
      <Box
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderBottom: 1,
          borderColor: 'divider',
          paddingLeft: '16px',
        }}
        id="BoxAroundTabs"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '70%',
          }}
        >
          <Tab label="Found" {...a11yProps(0)} />
          <Tab label="Invite" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div style={{ width: '100%' }}>
          <StyledTableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">State</TableCell>
                  <TableCell><Check /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>
                      <div>
                        <ShortenedDiv align="left" style={{ fontWeight: '600' }}>{row.name}</ShortenedDiv>
                        <ShortenedDiv align="left">{row.email}</ShortenedDiv>
                      </div>
                    </TableCell>
                    <TableCell align="right">{row.state}</TableCell>
                    <TableCell><StyledCheckbox /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      {/* </ThemeProvider> */}
    </Box>
  );
}
ContactsTable.propTypes = {
  contacts: PropTypes.array.isRequired,
  displayState: PropTypes.number.isRequired,
};

const ShortenedDiv = styled('div')`
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;



const StyledCheckbox = styled('div')`
width: 20px;
height: 20px;
background: transparent;
border-radius: 40px;
margin: 0;
margin-right: 12px;
border: 1.5px solid #ddd;
@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-right: 8px;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  overflow-y: auto;
  height: 300px;
`;
