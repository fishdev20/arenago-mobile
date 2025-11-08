import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';
import Typo from '../Typo';
export default function ToastHost() {
  const insets = useSafeAreaInsets();
  return (
    <ToastManager
      config={toastConfig}
      position={'bottom'}
      showProgressBar={true}
      showCloseIcon={true}
      animationStyle="fade"
    />
  );
}

// Custom toast configuration
const toastConfig = {
  customSuccess: (props) => (
    <View style={styles.customSuccessToast}>
      <Icons.CheckCircleIcon size={24} color="#fff" />
      <View style={styles.textContainer}>
        <Typo style={styles.customTitle}>{props.text1}</Typo>
        {props.text2 && <Typo style={styles.customMessage}>{props.text2}</Typo>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  settingsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  customSuccessToast: {
    width: '90%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customToast: {
    width: '90%',
    backgroundColor: '#673AB7',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  customTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  customMessage: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  customProgressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
});
