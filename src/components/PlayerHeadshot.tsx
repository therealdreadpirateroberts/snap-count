import React, { useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { getPlayerHeadshotUrl } from '@/store/mockData';

const getLocalImageForPosition = (position: string) => {
  const pos = (position || '').toLowerCase();
  if (pos === 'qb') return require('../../assets/images/studio_qb.png');
  if (pos === 'rb') return require('../../assets/images/studio_rb.png');
  if (pos === 'wr') return require('../../assets/images/studio_wr.png');
  if (pos === 'te') return require('../../assets/images/studio_te.png');
  return require('../../assets/images/studio_wr.png'); // default fallback
};

interface PlayerHeadshotProps {
  name: string;
  position: string;
  team?: string;
  espnId?: number | null;
  style?: StyleProp<ImageStyle>;
}

export const PlayerHeadshot: React.FC<PlayerHeadshotProps> = ({
  name,
  position,
  team,
  espnId,
  style,
}) => {
  const [hasError, setHasError] = useState(false);

  const localFallback = getLocalImageForPosition(position);

  if (hasError) {
    return (
      <Image
        source={localFallback}
        style={style}
      />
    );
  }

  const url = getPlayerHeadshotUrl(name, position, team, espnId);
  if (!url) {
    return (
      <Image
        source={localFallback}
        style={style}
      />
    );
  }

  return (
    <Image
      source={{ uri: url }}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};
