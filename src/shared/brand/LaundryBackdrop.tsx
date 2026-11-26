import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

const background = require('../../../assets/brand/laundry-backdrop.webp');

export function LaundryBackdrop() {
  return (
    <Image
      source={background}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      accessible={false}
      pointerEvents="none"
    />
  );
}
