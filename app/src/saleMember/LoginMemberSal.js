import React, {useState, useEffect, useCallback} from 'react';
import {url} from '../../ngrok';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setMembersal_login} from '../redux/authSlice';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';

const Loginmembersal = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [status, setSatatus] = useState('');

  const loginMember = () => {
    axios
      .post(`${url}/loginMemberSal`, {
        username: username,
        password: password,
      })
      .then(response => {
        if (response.data.message) {
          Alert.alert('รหัสผ่านไม่ถูกต้อง..');
        } else {
          dispatch(setMembersal_login({memberSal: response.data}));
          navigation.navigate('TabSaler');
          setSatatus('');
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texttitle}>เข้าสู่ระบบผู้ขาย</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="ชื่อผู้ใช้."
          placeholderTextColor="#003f5c"
          onChangeText={username => setUsername(username)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="รหัสผ่าน."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
        />
      </View>

      <Text
        style={{
          color: '#341109',
          fontSize: 16,
          fontWeight: '700',
          textAlign: 'center',
        }}>
        {status}
      </Text>

      <TouchableOpacity onPress={loginMember} style={styles.loginBtn}>
        <Text style={styles.loginText}>ยืนยัน</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Loginmembersal;

const styles = StyleSheet.create({
  texttitle: {
    color: '#fff',
    fontSize: 35,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#ff3385',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    marginBottom: 40,
  },

  inputView: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 40,
    marginBottom: 10,

    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
  },
  forgot_button2: {
    color: '#ff6600',
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    backgroundColor: '#9A0794',
    marginBottom: 0,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
