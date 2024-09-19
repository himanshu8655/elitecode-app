import React from 'react';
import { Modal, StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';

interface CustomDialogProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  type: 'success' | 'error';
  onRetry?: () => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ visible, onClose, message, type, onRetry }) => {
  const handleClose = () => {
    onClose();
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.overlay} onPress={handleClose} />
        <View style={styles.dialog}>
          <Image
            source={type === 'success' ? require('../assets/images/Confetti.gif') : null}
            style={styles.backgroundImage}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{type === 'success' ? 'Congratulations!' : 'Try Again!'}</Text>
            <Image
              source={type === 'success' ? require('../assets/images/icon _champion cup.png') : require('../assets/images/error.gif')}
              style={styles.iconImage}
            />
            <Text style={styles.subtitle}>{message}</Text>
            {type === 'success' && (
              <TouchableOpacity style={styles.button} onPress={handleClose}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            )}
            {type === 'error' && onRetry && (
              <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={handleRetry}>
                <Text style={styles.buttonText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    width: '90%',
    height: '40%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    padding: 20,
  },
  iconImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  button: {
    marginTop: 15,
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomDialog;
