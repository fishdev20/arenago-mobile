import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, spacingX } from '@/constants/theme';
import { InputProps } from '@/types/common';
import { verticalScale } from '@/utils/styling';
import Typo from './Typo';

const ERROR_COLOR =
  (colors as any).error || (colors as any).danger || '#EF4444';

const Input = (props: InputProps) => {
  const {
    icon,
    error,
    containerStyle,
    inputStyle,
    inputRef,
    ...textInputProps
  } = props as any;

  const hasError = Boolean(error);

  const iconEl = React.isValidElement(icon)
    ? React.cloneElement(icon as any, {
        color: hasError ? ERROR_COLOR : (icon as any).props?.color,
        style: [
          (icon as any).props?.style,
          hasError ? { tintColor: ERROR_COLOR } : null,
          styles.icon,
        ],
      })
    : null;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.inputRow, hasError && { borderColor: ERROR_COLOR }]}>
        {iconEl}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.neutral400}
          ref={inputRef}
          {...textInputProps}
        />
      </View>
      {hasError ? (
        <Typo color={ERROR_COLOR} size={12} style={styles.errorText}>
          {error}
        </Typo>
      ) : null}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    height: verticalScale(54),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: 'continuous',
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: verticalScale(14),
    color: colors.white,
  },
  errorText: {
    marginTop: 6,
  },
});
