import React, {useState, useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  TextInput,
  IconButton,
  Colors,
  Button,
  Portal,
  Provider,
  Modal,
  HelperText,
} from 'react-native-paper';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import IoniconsBack from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {url} from '../../ngrok';

const Register = ({navigation}) => {
  const [text, setText] = React.useState('');
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [nameUser, setNameuser] = useState('');
  const [address, setAddress] = useState('');
  const [postalcode, setPostalcode] = useState('');
  const [email, setEmail] = useState('');
  const [usermane, setusermane] = useState('');
  const [password, setpassword] = useState('');
  const [loaduser, setloaduser] = useState('');
  const containerStyle = {
    backgroundColor: 'white',
    height: 300,
    padding: 20,
  };
  const [photo, setPhoto] = useState({
    name: null,
    type: null,
    uri: null,
  });
  const handleChoosePhoto = () => {
    ImagePicker.launchImageLibrary({noData: true}, response => {
      console.log(response);
      if (!response) {
        setPhoto({
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        });
        hideModal();
      } else {
        console.log('exit');
      }
    });
  };
  const selectOneFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setPhoto({name: res[0].name, type: res[0].type, uri: res[0].uri});
      hideModal();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled from single doc picker');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  const loadUsermember = async () => {
    var response = fetch(`${url}/usermember`)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setloaduser(myJson);
      });
  };

  const Insert = event => {
    event.preventDefault();
    if (
      photo.name != null &&
      nameUser != '' &&
      address != '' &&
      postalcode != '' &&
      usermane != '' &&
      password != '' &&
      email != ''
    ) {
      const check = loaduser.filter(val => val.username_us === usermane);
      if (check.length === 0) {
        const formdata = new FormData();
        formdata.append('nameUser', nameUser);
        formdata.append('address', address);
        formdata.append('postalcode', postalcode);
        formdata.append('email', email);
        formdata.append('usermane', usermane);
        formdata.append('password', password);
        formdata.append('photo', {
          name: photo.name,
          type: photo.type,
          uri: photo.uri,
        });
        axios.post(`${url}/insertUserApp`, formdata, {}).then(res => {
          Alert.alert('สร้างผู้ใช้เรียบร้อย');
          setPhoto({
            name: null,
            type: null,
            uri: null,
          });
          navigation.goBack();
        });
      } else {
        Alert.alert('ชื่อผู้ใช่นี้มีอยู่เเล้ว');
      }
    } else {
      Alert.alert('กรุณากรอกข้อมูลให้ครบ');
    }
  };

  useEffect(() => {
    loadUsermember();
  }, []);
  return (
    <Provider>
      <View style={{backgroundColor: '#00cc99', flex: 1}}>
        <View
          style={{
            alignItems: 'center',
            height: 100,
            justifyContent: 'center',
          }}>
          <View
            style={{
              justifyContent: 'flex-start',
              width: '100%',
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IoniconsBack
                name="chevron-back-outline"
                size={40}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: '#fff',
              fontSize: 40,
              fontWeight: '800',
              fontFamily: 'Cochin',
            }}>
            สมัครสมาชิกผู้ชื้อ
          </Text>
        </View>
        <ScrollView>
          <View
            style={{
              padding: 20,
              flexDirection: 'column',
              alignItems: 'flex-start',
              margin: 5,
            }}>
            <TextInput
              mode="outlined"
              label="ชื่อ-นามสกุล"
              style={{
                width: 200,

                borderRadius: 20,
              }}
              onChangeText={setNameuser}
            />

            <TextInput
              mode="outlined"
              label="ที่อยู่"
              style={{
                backgroundColor: '#fff',
                width: 300,

                borderRadius: 15,
              }}
              onChangeText={setAddress}
            />
            <TextInput
              mode="outlined"
              label="เบอร์โทร"
              style={{
                backgroundColor: '#fff',
                width: 200,

                borderRadius: 15,
              }}
              onChangeText={setPostalcode}
            />
            <TextInput
              mode="outlined"
              label="อีเมล"
              style={{
                backgroundColor: '#fff',
                width: 200,

                borderRadius: 15,
              }}
              onChangeText={setEmail}
            />
            <View
              style={{
                width: '100%',
                backgroundColor: '#fff',
                alignItems: 'flex-start',
                borderRadius: 20,
                marginTop: 10,
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                  padding: 10,
                  borderRadius: 20,
                  alignItems: 'center',
                }}>
                <View style={{alignItems: 'center'}}>
                  <IconButton
                    icon="image"
                    color={Colors.grey500}
                    size={50}
                    onPress={() => showModal()}
                  />
                  <Text style={{fontWeight: 'bold'}}>อัพโหลดรูป</Text>
                </View>

                <Image
                  source={{uri: photo.uri}}
                  style={{
                    width: 150,
                    height: 110,

                    marginLeft: 20,
                    borderRadius: 20,

                    backgroundColor: '#e0ebeb',
                  }}
                />
              </View>
            </View>
            <TextInput
              mode="outlined"
              label="ชื่อผู้เข้าใช้"
              style={{
                backgroundColor: '#fff',
                width: 200,
                borderRadius: 15,
              }}
              onChangeText={setusermane}
            />
            <TextInput
              mode="outlined"
              label="รหัสผ่าน"
              style={{
                backgroundColor: '#fff',
                width: 200,

                borderRadius: 15,
              }}
              secureTextEntry={true}
              onChangeText={setpassword}
            />
            <View style={{alignItems: 'center', width: '100%', marginTop: 10}}>
              <Button
                style={{
                  backgroundColor: '#006666',
                  borderRadius: 10,
                  width: 200,
                }}
                onPress={Insert}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: '700'}}>
                  ยืนยัน
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 40,
                  color: '#000',
                }}>
                เลือกโหมดหมู่
              </Text>
              <TouchableOpacity
                style={{
                  width: '80%',
                  borderRadius: 25,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 0,
                  backgroundColor: '#008B8B',
                  marginBottom: 20,
                }}
                onPress={handleChoosePhoto}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  จาก Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '80%',
                  borderRadius: 25,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 0,
                  backgroundColor: '#008B8B',
                  marginBottom: 20,
                }}
                onPress={selectOneFile}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  จาก File
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

export default Register;
