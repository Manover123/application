import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Textarea,
  Image,
  Alert,
} from 'react-native';
import {url} from '../../ngrok';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import IoniconsBack from 'react-native-vector-icons/Ionicons';
import {
  IconButton,
  Colors,
  Button,
  Card,
  Modal,
  Portal,
  Provider,
} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

const Insertproduct = ({navigation}) => {
  const userMembersal = useSelector(state => state.auth.memberSal);
  const idLock = useSelector(state => state.product.idlock);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [photo, setPhoto] = useState({
    name: null,
    type: null,
    uri: null,
  });
  const [test, settest] = useState([]);
  const [dataProduct, setdataProduct] = useState('');
  const [nameProduct, setNameproduct] = useState('');
  const [numberProduct, setnumberProduct] = useState('');
  const [priceProduct, setpriceProduct] = useState('');
  const [unitProduct, setunitProduct] = useState('');
  const [detailProduct, setdetailProduct] = useState('');

  const [nameprosduct, setnameprosduct] = useState([]);
  const loadproduct = () => {
    axios.get(`${url}/getNameproduct/${idLock}`).then(res => {
      setnameprosduct(res.data);
    });
  };

  const handleChoosePhoto = () => {
    ImagePicker.launchImageLibrary({noData: true}, response => {
      if (response !== undefined) {
        setPhoto({
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        });
        hideModal();
      } else {
        console.log('exit' + photo);
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

  const Insert = event => {
    event.preventDefault();
    const checkname = nameprosduct.filter(
      val => val.name_product === nameProduct,
    );
    if (checkname.length === 0) {
      if (photo.name != null) {
        setdataProduct(userMembersal[0].id_sal);
        console.log(detailProduct);
        const formdata = new FormData();
        formdata.append('id_sal', userMembersal[0].id_sal);
        formdata.append('id_lock', idLock);
        formdata.append('name_product', nameProduct);
        formdata.append('number_product', numberProduct);
        formdata.append('price_product', priceProduct);
        formdata.append('unit_product', unitProduct);
        formdata.append('details_Product', detailProduct);
        formdata.append('photo', {
          name: photo.name,
          type: photo.type,
          uri: photo.uri,
        });
        axios.post(`${url}/insertProduct`, formdata, {}).then(res => {
          Alert.alert('บันทึกสำเร็จ');
          setPhoto({
            name: null,
            type: null,
            uri: null,
          });
          navigation.goBack();
        });
      } else {
        Alert.alert('กรุณาเลือกรูปภาพ');
      }
    } else {
      alert('ชื่อสินค้านี้มีอยู่เเล้ว');
    }
  };
  const containerStyle = {
    backgroundColor: 'white',
    height: 300,
    padding: 20,
  };
  useEffect(() => {
    loadproduct();
    console.log(nameprosduct);
    if (userMembersal[0].status_ban == 1) {
      Alert.alert(
        'มีข้อผิดพลาด',
        'คุณถูกแบนไม่สามารถเพิ่มหรือแก้ไขได้ กรุณาติดต่อ ผู้ดูเเลตลาด เบอร์โทร 0684521324',
        [{text: 'ตกลง', onPress: () => navigation.goBack()}],
      );
    }

    setdataProduct(userMembersal[0].id_sal);
  }, []);

  return (
    <Provider>
      <ScrollView style={{backgroundColor: '#ff3385'}}>
        <View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              height: 50,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IoniconsBack
                name="chevron-back-outline"
                size={40}
                color="#fff"
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#fff',
                marginLeft: 50,
              }}>
              ลงขายสินค้า {'ล็อคที่ ' + idLock}
            </Text>
          </View>
          <View style={{height: 600}}>
            <View
              style={{
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'left',
                  width: '100%',
                  marginLeft: '6%',
                }}>
                ชื่อสินค้า
              </Text>
              <TextInput
                placeholder="ชื่อสินค้า"
                style={{
                  width: '95%',
                  height: 50,
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  paddingLeft: 20,
                }}
                onChangeText={setNameproduct}
              />
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'left',

                    marginLeft: '3%',
                    marginTop: '2%',
                    marginBottom: -10,
                  }}>
                  ชื่อสินค้า
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'left',

                    marginLeft: '20%',
                    marginTop: '2%',
                    marginBottom: -10,
                  }}>
                  ราคาต่อชิน
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'left',
                    marginLeft: '17%',
                    marginTop: '2%',
                    marginBottom: -10,
                  }}>
                  หน่วย
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 10}}>
                <TextInput
                  placeholder="จำนวน"
                  style={{
                    width: '30%',
                    height: 50,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    paddingLeft: 20,
                  }}
                  onChangeText={setnumberProduct}
                />
                <TextInput
                  placeholder="ราคา"
                  style={{
                    width: '30%',
                    height: 50,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    paddingLeft: 20,
                    marginLeft: 10,
                  }}
                  onChangeText={setpriceProduct}
                />
                <TextInput
                  placeholder="หน่วย"
                  style={{
                    width: '30%',
                    height: 50,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    paddingLeft: 20,
                    marginLeft: 10,
                  }}
                  onChangeText={setunitProduct}
                />
              </View>
            </View>
            <View style={{height: 200}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff',
                  marginLeft: 10,
                  marginTop: 10,
                }}>
                รูปภาพประกอบ
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Card
                  style={{
                    marginTop: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    height: 110,
                    width: 150,
                    marginLeft: 20,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                    }}>
                    <IconButton
                      icon="file"
                      color={Colors.grey500}
                      size={50}
                      onPress={() => showModal()}
                    />
                    <Text style={{fontWeight: 'bold'}}>อัพโหลดรูป</Text>
                  </View>
                </Card>
                <Image
                  source={{uri: photo.uri}}
                  style={{
                    width: 200,
                    height: 110,
                    marginTop: 10,
                    marginLeft: 20,
                  }}
                />
              </View>

              <View
                style={{
                  height: 150,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'left',
                    width: '100%',
                    marginLeft: '6%',
                    marginTop: '3%',
                    marginBottom: -10,
                  }}>
                  รายละเอียด
                </Text>
                <TextInput
                  mode="outlined"
                  multiline
                  placeholder="รายละเอียด"
                  style={{
                    width: '95%',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                  onChangeText={setdetailProduct}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    width: '80%',
                    borderRadius: 25,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 0,
                    backgroundColor: '#008B8B',
                  }}
                  onPress={Insert}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    ยืนยัน
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
      </ScrollView>
    </Provider>
  );
};

export default Insertproduct;
