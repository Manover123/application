import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
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
import {useSelector, useDispatch} from 'react-redux';
import Foundation from 'react-native-vector-icons/FontAwesome5';
import {clearIdmemberSal, itemProduct} from '../redux/authSlice';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {url} from './../../ngrok';
import IoniconsBack from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

const Information = ({navigation}) => {
  const PrfileImg = useSelector(state => state.auth.memberSal);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [visibleImg, setVisibleImg] = useState(false);
  const showModalImg = () => setVisibleImg(true);
  const hideModalImg = () => setVisibleImg(false);

  const [namesale, setNamesale] = useState('');
  const [typeProduct, setTypeProduct] = useState('');
  const [nameMarket, setNameMarket] = useState('');
  const [newsale, setNewsale] = useState([]);
  const [newPassword, setNewPassword] = useState('');

  const [dataType, setType] = useState([]);

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
    dispatch(clearIdmemberSal());
    navigation.navigate('Login');
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
    console.log(newPassword);

    if (photo.name != null) {
      const formdata = new FormData();
      formdata.append('nameSale', namesale);
      formdata.append('password_sal', newPassword);
      formdata.append('nameMarket', nameMarket);
      formdata.append('typeProduct', typeProduct);
      formdata.append('id_sal', PrfileImg[0].id_sal);
      formdata.append('photo', {
        name: photo.name,
        type: photo.type,
        uri: photo.uri,
      });
      axios.put(`${url}/updateUserSale`, formdata, {}).then(res => {
        Alert.alert('แก้ไขเสร็จเรียบร้อย');
        setPhoto({
          name: null,
          type: null,
          uri: null,
        });
        loaduserNew(PrfileImg[0].id_sal);
        hideModal();
      });
    } else {
      axios
        .put(`${url}/updateUserSale_Nofile`, {
          namesale: namesale,
          password_sal: newPassword,
          nameMarket: nameMarket,
          typeProduct: typeProduct,
          id_sal: PrfileImg[0].id_sal,
        })
        .then(res => {
          Alert.alert('แก้ไขเสร็จเรียบร้อย');
          loaduserNew(PrfileImg[0].id_sal);
          hideModal();
        });
    }
  };
  const loaduserNew = id_sal => {
    axios.get(`${url}/loadSaler/${id_sal}`).then(res => {
      setNewsale(res.data);
      setNamesale(res.data[0].name_sal);
      setNameMarket(res.data[0].nameMarket_sal);
      setNewPassword(res.data[0].password_sal);
      setTypeProduct(res.data[0].typeProduct_sal);
    });
  };
  const loadTypeproduct = () => {
    axios.get(`${url}/loadType`).then(res => {
      setType(res.data);
    });
  };

  useEffect(() => {
    loadTypeproduct();
    loaduserNew(PrfileImg[0].id_sal);
  }, []);
  return (
    <Provider>
      <View style={{flex: 1, backgroundColor: '#FCDFEB'}}>
        <View>
          {newsale.map(val => {
            return (
              <View>
                <View style={styles.headerContent}>
                  <View style={{alignItems: 'flex-start', width: '100%'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <IoniconsBack
                        name="chevron-back-outline"
                        size={40}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>

                  <Image
                    style={styles.avatar}
                    source={{
                      uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profile%2F${val.profile_sal}?alt=media&token=689c880e-a865-4f6a-883a-d578a4e330cb`,
                    }}
                  />

                  <TouchableOpacity onPress={showModal}>
                    <View style={{alignItems: 'flex-end'}}>
                      <Foundation name="edit" size={25} color={'#fff'} />
                      <Text style={{color: '#fff', fontWeight: 'bold'}}>
                        แก้ไข
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.body}>
                  <View style={styles.item}>
                    <View style={styles.iconContent}>
                      <Ionicons name="person" size={40} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.info}>{val.name_sal}</Text>
                    </View>
                  </View>
                  <View style={styles.item}>
                    <View style={styles.iconContent}>
                      <Ionicons name="home-outline" size={40} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.info}>{val.address_sal}</Text>
                    </View>
                  </View>

                  <View style={styles.item}>
                    <View style={styles.iconContent}>
                      <Ionicons name="call-outline" size={40} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.info}>{val.zipcode_sal}</Text>
                    </View>
                  </View>

                  <View style={styles.item}>
                    <View style={styles.iconContent}>
                      <Ionicons name="mail" size={40} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.info}>{val.email_sal}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#cccccc',
                      height: 1.5,
                      marginTop: 40,
                    }}></View>
                  <TouchableOpacity onPress={() => logout()}>
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
              </View>
            );
          })}
        </View>

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
                  defaultValue={namesale}
                  onChangeText={setNamesale}
                />
                <TextInput
                  placeholder="ชื่อร้าน"
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 20,
                    width: 250,
                    marginTop: 10,
                  }}
                  defaultValue={nameMarket}
                  onChangeText={setNameMarket}
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
                    {newsale.map(val => {
                      if (photo.uri === null) {
                        return (
                          <Image
                            source={{
                              uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profile%2F${val.profile_sal}?alt=media&token=689c880e-a865-4f6a-883a-d578a4e330cb`,
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

                <TextInput
                  placeholder="แก้ไขรหัสผ่าน"
                  secureTextEntry={true}
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 20,
                    width: 250,
                    marginTop: 10,
                  }}
                  onChangeText={setNewPassword}
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

export default Information;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#00cc99',
  },
  headerContent: {
    backgroundColor: '#ff3385',
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
