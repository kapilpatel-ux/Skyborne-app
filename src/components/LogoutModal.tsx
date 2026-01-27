import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface LogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const LogoutModal = ({ visible, onConfirm, onClose }: LogoutModalProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>

          {/* ICON (SweetAlert-style) */}
          <View style={styles.iconCircle}>
            <AlertTriangle size={26} color="#F57C00" />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>Are you sure?</Text>

          {/* TEXT */}
          <Text style={styles.text}>You will be logged out!</Text>

          {/* ACTIONS */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmBtn}>
              <Text style={styles.confirmText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },

  /* ICON */
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF3CD',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },

  /* TITLE */
  title: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
    color: '#111',
  },

  /* TEXT */
  text: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: 'Satoshi-Regular',
    textAlign: 'center',
    color: '#545454',
  },

  /* BUTTON ROW */
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 28,
    paddingRight: 60,
  },

  /* CANCEL */
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#a7a1a1',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    color: '#000',
  },

  /* CONFIRM */
  confirmBtn: {
    backgroundColor: '#B95E82',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 4,
  },
  confirmText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    color: '#fff',
  },
});
