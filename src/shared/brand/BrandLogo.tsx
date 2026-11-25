import { Image } from 'expo-image';

const logo = require('../../../assets/brand/laundly-logo.webp');
const icon = require('../../../assets/brand/laundly-icon.webp');

export function BrandLogo({ mark = false }: { mark?: boolean }) {
  return (
    <Image
      source={mark ? icon : logo}
      contentFit="contain"
      accessibilityLabel="Laundly"
      accessible
      style={mark ? { width: 44, height: 44, borderRadius: 15 } : { width: 137, height: 34 }}
    />
  );
}
