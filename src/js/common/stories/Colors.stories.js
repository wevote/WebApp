import React from 'react';
import colors from '../components/Style/Colors';

export default {
  title: 'Design System/Colors',
};

const ColorBox = ({ color, label, subtitle }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}>
      <div
      style={{
        backgroundColor: color,
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        strokeWidth: '2px',
        stroke: '#EFEFEF',
        boxShadow: '3px 9px 6px 0px rgba(0, 0, 0, 0.25) inset, 10px 14px 11px 0px rgba(0, 0, 0, 0.16) inset',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
      />
      <div style={{ marginTop: '14px', color: colors.darkGrey, textAlign: 'center', fontFamily: 'Roboto', fontSize: '18px', fontStyle: 'normal', fontWeight: 400 }}>{label}</div>
      <div style={{ marginBottom: '14px', color: colors.grey, textAlign: 'center', fontFamily: 'Roboto', fontSize: '20px', fontStyle: 'normal', fontWeight: 400, lineHeight: '120.4%', textTransform: 'lowercase' }}>{subtitle}</div>
    </div>
);

export const Colors = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <ColorBox color={colors.primary} label="Primary Color" subtitle="#0834CD" />
    <ColorBox color={colors.primaryHover} label="Primary Hover Color" subtitle="#09288A" />
    <ColorBox color={colors.darkGrey} label="Dark Grey" subtitle="#454F69" />
    <ColorBox color={colors.middleGrey} label="Middle Grey" subtitle="#8C92A2" />
  </div>
);

