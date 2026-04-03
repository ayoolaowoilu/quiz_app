import React from 'react';
import { Adsense } from '@ctrl/react-adsense';

interface AdsProps {
  className?: string;
  client: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  layout?: string;
  style?: React.CSSProperties;
}

export const AdBanner: React.FC<AdsProps> = ({ 
  className = '', 
  client, 
  slot,
  format = 'auto',
  style 
}) => {
  return (
    <div className={`ad-container ${className}`}>
      <Adsense
        client={client}
        slot={slot}
        style={style || { display: 'block', width: '100%', height: '90px' }}
        format={format}
      />
    </div>
  );
};

export const AdResponsive: React.FC<AdsProps> = ({ 
  className = '', 
  client, 
  slot 
}) => {
  return (
    <div className={`ad-container ${className}`}>
      <Adsense
        client={client}
        slot={slot}
        style={{ display: 'block' }}
        layout="responsive"
        format="auto"
        responsive="true"
      />
    </div>
  );
};