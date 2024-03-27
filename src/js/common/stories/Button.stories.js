import React from 'react';
import styled from 'styled-components';
import Button from '../../components/Buttons/BaseButton';

export default {
  title: 'Design System',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    primary: true,
  },
};

export const AllButtons = () => (
  <ButtonContainer>
    <Button
      primary
      size="large"
      label="Primary Large Disabled Button"
      aria-label="Primary Large Disabled Button"
    />
    <Button
      primary={false}
      size="large"
      label="PrimaryLarge Disabled Button"
      aria-label="PrimaryLarge Disabled Button"
    />
    <Button
      primary
      label="Primary Medium Button"
      aria-label="Primary Medium Button"
    />
    <Button
      primary={false}
      label="Primary Medium Disabled Button"
      aria-label="Primary Medium Disabled Button"
    />
    <Button
      primary
      size="small"
      label="Primary Small Button"
      aria-label="Primary Small Button"
    />
    <Button
      primary={false}
      size="small"
      label="Primary Small Disabled"
      aria-label="Primary Small Disabled"
    />
    <Button
      secondary
      label="Secondary Button"
      aria-label="Secondary Button"
    />
  </ButtonContainer>
);

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const PrimaryDisabled = {
  args: {
    primary: false,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    secondary: true,
    label: 'Button',
  },
};

export const Large = {
  args: {
    primary: true,
    size: 'large',
    label: 'Button',
  },
};

export const Medium = {
  args: {
    primary: true,
    size: 'medium',
    label: 'Button',
  },
};

export const Small = {
  args: {
    primary: true,
    size: 'small',
    label: 'Button',
  },
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 34px;
  flex-direction: column;
`;
