import { Image } from 'expo-image';

const icon = require('../../../assets/brand/laundly-icon.webp');

export function BrandLogo({ markSize }: { markSize: number }) {
  return (
    <Image
      source={icon}
      contentFit="contain"
      accessibilityLabel="Laundly"
      accessible
      style={{ width: markSize, height: markSize }}
    />
  );
}
