import { StyleSheet } from 'react-native';

import { sizes } from '../../theme';

export default StyleSheet.create({
  button: {
    width: sizes.minimumTouchTarget,
    height: sizes.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
