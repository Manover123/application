import React, {useState, useEffect, useCallback} from 'react';
import {url} from '../../ngrok';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
// import {setMember} from '../redux/authSlice';
import IoniconsBack from 'react-native-vector-icons/Ionicons';
import {setMembersal_login, setMember} from '../redux/authSlice';
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
const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setSatatus] = useState('');
  const [country, setCountry] = useState(null);

  const loginMember = () => {
    if (username.substring(0, 4) === 'sale') {
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
    } else {
      axios
        .post(`${url}/loginMember`, {
          username: username,
          password: password,
        })
        .then(response => {
          if (response.data.message) {
            Alert.alert('รหัสผ่านไม่ถูกต้อง');
          } else {
            dispatch(setMember({member: response.data}));
            navigation.navigate('Home');
            setSatatus('');
          }
        });
    }
  };
  useEffect(() => {}, []);
  return (
    <View style={{flex: 1, backgroundColor: '#00cc99'}}>
      <View style={{backgroundColor: '#00cc99'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IoniconsBack name="chevron-back-outline" size={40} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.texttitle}>เข้าสู่ระบบ</Text>
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
        <Text style={{color: 'red', fontSize: 16, fontWeight: '700'}}>
          {status}
        </Text>
        <TouchableOpacity onPress={loginMember} style={styles.loginBtn}>
          <Text style={styles.loginText}>ยืนยัน</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text
            onPress={() => navigation.navigate('Register')}
            style={styles.forgot_button}>
            ถ้าไม่มีสมาชิก?{' '}
            <Text style={styles.forgot_button2}>สมัครสมาชิก</Text>{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  texttitle: {
    color: '#FFFFFF',
    fontSize: 35,
    marginBottom: 20,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
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
    backgroundColor: '#008B8B',
    marginBottom: 20,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Login;
