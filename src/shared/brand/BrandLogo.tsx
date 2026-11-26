import { Image } from 'expo-image';
import { brandName } from './brand';

const icon = require('../../../assets/brand/laundly-icon.webp');

export function BrandLogo({ markSize }: { markSize: number }) {
  return (
    <Image
      source={icon}
      contentFit="contain"
      accessibilityLabel={brandName}
      accessible
      style={{ width: markSize, height: markSize }}
    />
  );
}
