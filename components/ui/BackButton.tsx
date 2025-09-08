import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { colors, radius } from '@/constants/theme';
import { BackButtonProps } from '@/types/common';
import { useRouter } from 'expo-router';
// import { CaretLeftIcon } from 'phosphor-react-native';
import { AntDesign } from '@expo/vector-icons';

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style]}
    >
      {/* <CaretLeftIcon
        size={verticalScale(iconSize)}
        color={colors.white}
        weight="bold"
      /> */}
      <AntDesign name="left" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral600,
    alignSelf: 'flex-start',
    borderRadius: radius._12,
    borderCurve: 'continuous',
    padding: 5,
  },
});
