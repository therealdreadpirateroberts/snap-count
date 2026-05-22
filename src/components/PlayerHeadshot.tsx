import React, { useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { getTeamLogoUrl } from '@/store/mockData';

// Map top player names to ESPN player IDs for premium headshots
const MAPPING: { [key: string]: string } = {
  // QBs
  'patrickmahomes': '3139477',
  'joshallen': '3918298',
  'lamarjackson': '3916387',
  'jalenhurts': '4040715',
  'cjstroud': '4432577',
  'joeburrow': '3915290',
  'anthonyrichardson': '4432573',
  'dakprescott': '2578570',
  'jordanlove': '4038941',
  'brockpurdy': '4361741',
  'kylermurray': '3917315',
  'calebwilliams': '4431611',
  'jaredgoff': '3122627',
  'tuatagovailoa': '4241479',
  'trevorlawrence': '4372247',
  'kirkcousins': '14880',
  'jaydendaniels': '4431612',
  'justinherbert': '4426303',

  // RBs
  'christianmccaffrey': '3117251',
  'breecehall': '4426361',
  'bijanrobinson': '4430807',
  'saquonbarkley': '3929630',
  'jonathantaylor': '4242335',
  'jahmyrgibbs': '4430737',
  'derrickhenry': '3043078',
  'kyrenwilliams': '4428800',
  'devonachane': '4430802',
  'travisetiennejr': '4239994',
  'isiahpacheco': '4361517',
  'jamescook': '4361420',
  'joshjacobs': '4047648',
  'alvinkamara': '3054850',
  'rachaadwhite': '4428340',
  'joemixon': '3116385',
  'kennethwalkeriii': '4426338',
  'davidmontgomery': '4035661',
  'jamesconner': '3045138',
  'dandreswift': '4259545',
  'zamirwhite': '4360310',
  'raheemmostert': '17458',
  'najeeharris': '4241457',
  'jaylenwarren': '4363066',
  'tonypollard': '3911229',
  'javontewilliams': '4426336',
  'brianrobinsonjr': '4241400',
  'jonathonbrooks': '4431527',
  'tychandler': '4241398',
  'devinsingletary': '4040774',
  'chubahubbard': '4241389',
  'gusedwards': '3046714',
  'zachcharbonnet': '4426348',
  'jeromeford': '4360216',
  'treybenson': '4431501',
  'ezekielelliott': '3051392',
  'blakecorum': '4426354',
  'ricodowdle': '4046554',

  // WRs
  'ceedeelamb': '4426377',
  'tyreekhill': '15818',
  'justinjefferson': '4262921',
  'jamarrchase': '4362629',
  'amonrastbrown': '4361370',
  'ajbrown': '4047646',
  'garrettwilson': '4426384',
  'pukanacua': '4403332',
  'marvinharrisonjr': '4432571',
  'davanteadams': '16800',
  'chrisolave': '4426390',
  'drakelondon': '4426387',
  'brandonaiyuk': '4241372',
  'mikeevans': '16737',
  'nicocollins': '4426372',
  'deebosamuelsr': '4047650',
  'deebosamuel': '4047650',
  'maliknabers': '4432242',
  'jaylenwaddle': '4361379',
  'dkmetcalf': '4047654',
  'djmoore': '3915416',
  'devontasmith': '4372074',
  'stefondiggs': '2976212',
  'cooperkupp': '2977599',
  'zayflowers': '4361738',
  'teehiggins': '4239993',
  'amaricooper': '2976499',
  'georgepickens': '4431615',
  'tankdell': '4372023',
  'terrymclaurin': '3121422',
  'christiankirk': '3895856',
  'chrisgodwin': '3116157',
  'keenanallen': '15804',
  'jaydenreed': '4361405',
  'calvinridley': '3925347',
  'rasheerice': '4428807',
  'romeodunze': '4432535',
  'diontaejohnson': '3915377',
  'hollywoodbrown': '4040726',
  'courtlandsutton': '3121424',
  'jaxonsmithnjigba': '4430869',
  'laddmcconkey': '4432738',
  'brianthomasjr': '4432179',
  'keoncoleman': '4432585',
  'xavierworthy': '4431614',
  'curtissamuel': '3116155',
  'tylerlockett': '2578384',
  'jakobimeyers': '4038965',
  'romeodoubs': '4361376',

  // TEs
  'samlaporta': '4430856',
  'traviskelce': '15847',
  'treymcbride': '4430752',
  'markandrews': '3116162',
  'daltonkincaid': '4372087',
  'georgekittle': '3041344',
  'kylepitts': '4361369',
  'evanengram': '3116154',
  'jakeferguson': '4242493',
  'davidnjoku': '3123075',
  'brockbowers': '4432569',
  'dallasgoedert': '3121545',
  'patfreiermuth': '4361551',
  'taysomhill': '2974858',
  'colekmet': '4242540',
  'hunterhenry': '3045136',

  // Kickers
  'brandonaubrey': '4682498',
  'harrisonbutker': '3054840',
  'justintucker': '15683',
  'kaimifairbairn': '2971383',
  'jakeelliott': '3051390',
  'younghoekoo': '2985659',
  'jasonsanders': '3917300',
  'evanmcpherson': '4240030',
};

const getPlayerHeadshotUrl = (name: string, position: string, team?: string, espnId?: number | null) => {
  if (position === 'DST' && team) {
    return getTeamLogoUrl(team);
  }
  
  if (espnId) {
    return `https://a.espncdn.com/i/headshots/nfl/players/full/${espnId}.png`;
  }

  const cleanName = name.toLowerCase().replace(/['.-]/g, '').replace(/\s+/g, '').trim();
  const id = MAPPING[cleanName];
  if (id) {
    return `https://a.espncdn.com/i/headshots/nfl/players/full/${id}.png`;
  }
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/default.png&w=350&h=254`;
};

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

  if (hasError) {
    return (
      <Image
        source={getLocalImageForPosition(position)}
        style={style}
        resizeMode="cover"
      />
    );
  }

  return (
    <Image
      source={{ uri: getPlayerHeadshotUrl(name, position, team, espnId) }}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};
