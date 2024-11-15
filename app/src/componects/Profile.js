import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  IconButton,
  Colors,
  Portal,
  Provider,
  Modal,
  Button,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/FontAwesome5';
import {useSelector, useDispatch} from 'react-redux';
import {clearIduser} from '../redux/authSlice';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {url} from './../../ngrok';
import IoniconsBack from 'react-native-vector-icons/Ionicons';

const Profile = ({navigation}) => {
  const memberData = useSelector(state => state.auth.member);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [visibleImg, setVisibleImg] = useState(false);
  const showModalImg = () => setVisibleImg(true);
  const hideModalImg = () => setVisibleImg(false);

  const [nameuser, setNameuser] = useState('');
  const [address, setaddress] = useState('');
  const [postalcode, setpostalcode] = useState('');
  const [email, setemail] = useState('');
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [newUser, seetNewuser] = useState([]);

  const loaduserNew = id_us => {
    axios.get(`${url}/loadNewuser/${id_us}`).then(res => {
      seetNewuser(res.data);
      setNameuser(res.data[0].name_us);
      setaddress(res.data[0].address_us);
      setpostalcode(res.data[0].postalcode_us);
      setemail(res.data[0].email_us);
      setusername(res.data[0].username_us);
      setpassword(res.data[0].password_us);
    });
  };

  const logout = () => {
    Alert.alert('คุณต้องการออกจากระบบหรือไม่', 'ใช่ให้กด ตกลง ไม่ให้กด ไม่', [
      {
        text: 'ไม่',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'ตกลง', onPress: () => onlogout()},
    ]);
  };
  const onlogout = () => {
    dispatch(clearIduser());
    navigation.navigate('HomeTest');
  };
  const containerStyle = {
    backgroundColor: '#d9d9d9',
    height: 400,
    padding: 20,
  };

  const [photo, setPhoto] = useState({
    name: null,
    type: null,
    uri: null,
  });
  const handleChoosePhoto = () => {
    ImagePicker.launchImageLibrary({noData: true}, response => {
      if (response !== undefined) {
        setPhoto({
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        });
        hideModalImg();
      } else {
        alert('exit');
      }
    });
  };
  const selectOneFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setPhoto({name: res[0].name, type: res[0].type, uri: res[0].uri});
      hideModalImg();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled from single doc picker');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  const updateInformation = event => {
    event.preventDefault();
    if (photo.name != null) {
      const formdata = new FormData();
      formdata.append('nameuser', nameuser);
      formdata.append('address', address);
      formdata.append('postalcode', postalcode);
      formdata.append('email', email);
      formdata.append('username', username);
      formdata.append('password', password);
      formdata.append('old_image', newUser[0].profile_us);
      formdata.append('id_us', newUser[0].id_us);
      formdata.append('photo', {
        name: photo.name,
        type: photo.type,
        uri: photo.uri,
      });
      axios.put(`${url}/updateUser`, formdata, {}).then(res => {
        Alert.alert('แก้ไขเสร็จเรียบร้อย');
        setPhoto({
          name: null,
          type: null,
          uri: null,
        });
        loaduserNew(memberData[0].id_us);
        hideModal();
      });
    } else {
      axios
        .put(`${url}/updateUser_Nofile`, {
          nameuser: nameuser,
          address: address,
          postalcode: postalcode,
          email: email,
          username: username,
          password: password,
          id_us: memberData[0].id_us,
        })
        .then(res => {
          Alert.alert('แก้ไขเสร็จเรียบร้อย');
          loaduserNew(memberData[0].id_us);
          hideModal();
        });
    }
  };

  useEffect(() => {
    loaduserNew(memberData[0].id_us);
  }, []);

  return (
    <Provider>
      <View>
        <ScrollView>
          {newUser.map(val => {
            if (val != null) {
              return (
                <View>
                  <View style={styles.headerContent}>
                    <View
                      style={{alignItems: 'flex-start', width: '100%'}}></View>

                    <Image
                      style={styles.avatar}
                      source={{
                        uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profileUser%2F${val.profile_us}?alt=media&token=f342a587-f2a1-4c7a-9e6f-279bd7972053`,
                      }}
                    />
                    <TouchableOpacity onPress={() => showModal()}>
                      <View style={{alignItems: 'flex-end'}}>
                        <Foundation name="edit" size={25} color={'#fff'} />
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>
                          แก้ไข
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.item}>
                    <View style={styles.iconContent}>
                      <Ionicons name="person" size={40} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.info}>{val.name_us}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      marginLeft: 13,
                    }}>
                    <View style={styles.iconContent}>
                      <Ionicons name="home-outline" size={40} />
                    </View>
                    <View
                      style={{
                        alignItems: 'flex-start',
                        paddingLeft: 5,
                        width: 300,
                      }}>
                      <Text
                        style={{
                          flexDirection: 'column',
                          fontSize: 18,
                          marginTop: 12,
                          marginLeft: 7,
                          color: '#778899',
                        }}>
                        {val.address_us}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.item}>
                    <View style={styles.iconContent}>
                      <Ionicons name="call-outline" size={40} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.info}>{val.postalcode_us}</Text>
                    </View>
                  </View>
                  <View style={styles.item}>
                    <View style={styles.iconContent}>
                      <Ionicons name="mail" size={40} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.info}>{val.email_us}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#cccccc',
                      height: 1.5,
                      marginTop: 40,
                    }}></View>
                  <TouchableOpacity
                    onPress={() => {
                      logout();
                    }}>
                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        marginLeft: 12,
                      }}>
                      <View style={styles.iconContent}>
                        <Ionicons name="log-out-outline" size={40} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infologout}>Logout</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            } else {
            }
          })}
        </ScrollView>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}>
            <ScrollView>
              <View style={{padding: 20}}>
                <Text
                  style={{fontSize: 20, fontWeight: '700', marginBottom: 10}}>
                  แก้ไขข้อมูลส่วนตัว
                </Text>
                <TextInput
                  placeholder="ชื่อ-นามสกุล"
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 20,
                    width: 250,
                  }}
                  defaultValue={nameuser}
                  onChangeText={setNameuser}
                />
                <TextInput
                  placeholder="ที่อยู่"
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 20,
                    width: 250,
                    marginTop: 10,
                  }}
                  defaultValue={address}
                  onChangeText={setaddress}
                />
                <TextInput
                  placeholder="เบอร์โทร"
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 20,
                    width: 250,
                    marginTop: 10,
                  }}
                  defaultValue={postalcode}
                  onChangeText={setpostalcode}
                />
                <TextInput
                  placeholder="อีเมล"
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 20,
                    width: 250,
                    marginTop: 10,
                  }}
                  defaultValue={email}
                  onChangeText={setemail}
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
                        onPress={() => showModalImg()}
                      />
                      <Text style={{fontWeight: 'bold'}}>อัพโหลดรูป</Text>
                    </View>
                    {newUser.map(val => {
                      if (photo.uri === null) {
                        return (
                          <Image
                            source={{
                              uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profileUser%2F${val.profile_us}?alt=media&token=f342a587-f2a1-4c7a-9e6f-279bd7972053`,
                            }}
                            style={{
                              width: 150,
                              height: 110,
                              marginTop: 10,
                              marginLeft: 20,
                              borderRadius: 20,

                              backgroundColor: '#e0ebeb',
                            }}
                          />
                        );
                      } else {
                        return (
                          <Image
                            source={{uri: photo.uri}}
                            style={{
                              width: 150,
                              height: 110,
                              marginTop: 10,
                              marginLeft: 20,
                              borderRadius: 20,
                              backgroundColor: '#e0ebeb',
                            }}
                          />
                        );
                      }
                    })}
                  </View>
                </View>
                {/* <TextInput
                  placeholder="ชื่อผู้ใช้"
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 20,
                    width: 250,
                    marginTop: 10,
                  }}
                  defaultValue={username}
                  onChangeText={setusername}
                /> */}
                <TextInput
                  placeholder="รหัสผ่าน"
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 20,
                    width: 250,
                    marginTop: 10,
                  }}
                  secureTextEntry={true}
                  defaultValue={password}
                  onChangeText={setpassword}
                />
                <View style={{alignItems: 'center', width: '100%'}}>
                  <Button
                    style={{
                      backgroundColor: 'green',
                      borderRadius: 10,
                      width: 100,
                      marginTop: 10,
                    }}
                    onPress={updateInformation}>
                    <Text
                      style={{color: '#fff', fontSize: 20, fontWeight: '700'}}>
                      แก้ไข
                    </Text>
                  </Button>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={visibleImg}
            onDismiss={hideModalImg}
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
export default Profile;
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#00cc99',
  },
  headerContent: {
    backgroundColor: '#00cc99',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: 'white',
    fontWeight: '800',
  },
  userInfo: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  body: {
    height: 700,
  },
  item: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 13,
  },
  infoContent: {
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  iconContent: {
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  info: {
    fontSize: 18,
    marginTop: 12,
    marginLeft: 7,
    color: '#778899',
  },
  infologout: {
    fontSize: 18,
    marginTop: 12,
    marginLeft: 7,
    color: 'red',
  },
});
