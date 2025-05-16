import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const UpdatePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangePassword = () => {
    // Xử lý đổi mật khẩu ở đây
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <LinearGradient
        colors={['#FF914D', '#ED2A46']}
        style={styles.linearGradient}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu cũ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu cũ"
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholderTextColor="#000"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="#000"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <View style={styles.confirmInputWrapper}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Nhập lại mật khẩu mới"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#000"
            />
            <TouchableOpacity
              onPress={handleToggleConfirmPassword}
              style={{ paddingHorizontal: 8 }}
            >
              <Icon
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 0.5,

    // flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    height: 500,
    marginTop: 70,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#1A191A',
  },
  confirmInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FF914D',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#ED2A46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: 250,
    alignSelf: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UpdatePasswordScreen;
