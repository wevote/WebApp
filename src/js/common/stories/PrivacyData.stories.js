import * as React from 'react';
import { SecurityRounded } from '@mui/icons-material';
import styled from 'styled-components';
import DefaultVisibility from '../../components/Settings/DefaultVisibility';

const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const ShieldIcon = styled(SecurityRounded)`
  color: black;
  height: 23px;
  width: 23px;
  margin: 5px 8px 0 -3px;
`;

const DataSettingSection = styled('div')`
  margin-top: 24px;
`;

function PrivacyDataComponent () {
  return (
    <div>
      <div className="u-stack--md">
        <HeaderContainer>
          <ShieldIcon />
          <h1 className="h2">
            Privacy &amp; Data
          </h1>
        </HeaderContainer>
        <DataSettingSection>
          <DefaultVisibility />
        </DataSettingSection>
      </div>
    </div>
  );
}

export default {
  title: 'Design System/Privacy Data',
  component: PrivacyDataComponent,
  parameters: {
    layout: 'centered',
  },
};

export function ButtonsTest () {
  return <PrivacyDataComponent />;
}
