import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import webAppConfig from '../../config';
import VisibilityExplainer from './VisibilityExplainer';
import VisibilityToggleBar from './VisibilityToggleBar';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


/* ---------- Component ---------- */

function PrivacyData () {
  const [alignment, setAlignment] = React.useState('public');
  const [animKey, setAnimKey] = React.useState(0);

  const handleAlignment = (newAlignment) => {
    setAlignment(newAlignment);
    // Trigger checkmark animation after saving
    setAnimKey((k) => k + 1);
  };

  if (!nextReleaseFeaturesEnabled) {
    return null;
  }

  return (
    <div className="u-stack--md">
      <h4 className="h4" id="defaultVisibilityText">
        Default visibility for your future ballot choices &amp; opinions
      </h4>

      <PrivacyToggleButtonGroupContainer>
        <VisibilityToggleBar value={alignment} onChange={handleAlignment} />

        {animKey > 0 && (
          <CheckmarkContainer key={animKey}>
            ✓ SAVED
          </CheckmarkContainer>
        )}
      </PrivacyToggleButtonGroupContainer>

      <DataSettingText>
        <ItalicNote>
          Changing your default visibility won&apos;t affect past choices or opinions.
          You can still adjust the visibility for each new choice or opinion individually.
        </ItalicNote>
        <VisibilityExplainer fontSize={14} />
      </DataSettingText>
    </div>
  );
}

/* ---------- Styled Components ---------- */

const DataSettingText = styled('div')`
  color: ${DesignTokenColors.neutralUI500};
  margin-bottom: 30px;
`;

const ItalicNote = styled('div')`
  font-size: 14px;
  font-style: italic;
  margin-bottom: 4px;
  margin-top: 4px;
`;

const PrivacyToggleButtonGroupContainer = styled('div')`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: left;
  vertical-align: middle;
`;

const checkmarkFade = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  30% {
    opacity: 1;
    transform: scale(1.2);
  }
  50% {
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`;

const CheckmarkContainer = styled.div`
  font-size: 16px;
  color: ${DesignTokenColors.confirmation500};
  animation: ${checkmarkFade} 1.5s ease-in-out forwards;
`;

export default PrivacyData;
