import { Image } from 'expo-image';

const logo = require('../../../assets/brand/laundly-logo.webp');
const icon = require('../../../assets/brand/laundly-icon.webp');

export function BrandLogo({ markSize }: { markSize?: number }) {
  return (
    <Image
      source={markSize ? icon : logo}
      contentFit="contain"
      accessibilityLabel="Laundly"
      accessible
      style={markSize
        ? { width: markSize, height: markSize, borderRadius: Math.round(markSize * 0.3) }
        : { width: 137, height: 34 }}
    />
  );
}
