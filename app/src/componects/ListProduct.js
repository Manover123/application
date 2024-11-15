import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  IconButton,
  Colors,
  Button,
  Card,
  Portal,
  Provider,
  Modal,
} from 'react-native-paper';
import Confirm from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native-gesture-handler';
import IoniconsBack from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {clearCart, removeFromCart} from '../redux/authSlice';
import {format} from 'date-fns';
import axios from 'axios';
import {url} from './../../ngrok';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

const Listproduct = ({navigation}) => {
  const dispatch = useDispatch();
  const memberData = useSelector(state => state.auth.member);
  const id_mk = useSelector(state => state.auth.memberSal);
  const id_usale = useSelector(state => state.auth.user);
  const itemProduct = useSelector(state => state.auth.itemPd);
  const [sumAmounts, setSumAmount] = useState(0);

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [visibleupimg, setVisibleupimg] = useState(false);
  const showModalupimg = () => setVisibleupimg(true);
  const hideModalupimg = () => setVisibleupimg(false);

  const containerStyle = {
    backgroundColor: 'white',
    height: 400,
    padding: 20,
  };

  const handleRemoveFromCart = item => {
    dispatch(removeFromCart(item));
    sumamonts();
  };
  const deleteItem = () => {
    dispatch(clearCart());
    navigation.goBack();
    sumamonts();
  };
  const sumamonts = async () => {
    const totalprice = Object.values(itemProduct.map(val => val.itemPd.amout));
    if (totalprice == '') {
      setSumAmount(0);
    } else {
      let sum = 0;
      for (const value of Object.values(
        itemProduct.map(val => val.itemPd.amout),
      )) {
        sum += value;
        setSumAmount(sum);
      }
    }
  };
  const insertOrder = async () => {
    if (photo.name == undefined) {
      alert('กรุณอัพโหลดรูป สลิปโอนเงิน');
    } else {
      const update1 = itemProduct.map(item => item.itemPd.updatenum);
      const update2 = itemProduct.map(item => item.itemPd.id_product);
      const formdata = new FormData();
      formdata.append('id_sal', id_mk[0].id_sal);
      formdata.append('id_lock', id_mk[0].id_lock);
      formdata.append('id_us', memberData[0].id_us);
      formdata.append('date_order', format(new Date(), 'yyyy-mm-dd'));
      formdata.append(
        'itemProduct',
        JSON.stringify(itemProduct.map(item => item.itemPd)),
      );
      formdata.append('update1', JSON.stringify(update1));
      formdata.append('update2', JSON.stringify(update2));
      formdata.append('photo', {
        name: photo.name,
        type: photo.type,
        uri: photo.uri,
      });
      axios.post(`${url}/insertOrder`, formdata, {}).then((res, err) => {
        if (res) {
          alert('บันทึกสำเร็จ');
          dispatch(clearCart());
          navigation.navigate('ตะกร้า');
        } else {
          console.log(err);
        }
      });
    }
  };

  const insertOrderNoslip = async () => {
    const update1 = itemProduct.map(item => item.itemPd.updatenum);
    const update2 = itemProduct.map(item => item.itemPd.id_product);

    axios
      .post(`${url}/insertOrderNoslip`, {
        id_sal: id_mk[0].id_sal,
        id_lock: id_mk[0].id_lock,
        id_us: memberData[0].id_us,
        itemProduct: JSON.stringify(itemProduct.map(item => item.itemPd)),
        update1: JSON.stringify(update1),
        update2: JSON.stringify(update2),
      })
      .then((res, err) => {
        if (res) {
          alert('บันทึกสำเร็จ');
          dispatch(clearCart());
          navigation.navigate('ตะกร้า');
        } else {
          console.log(err);
        }
      });
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
        hideModalupimg();
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
      hideModalupimg();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled from single doc picker');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const checkamount = () => {
    if (sumAmounts === 0) {
      Alert.alert('มีข้อผิดพลาด', 'กรุราเลือกสินค้า', [{text: 'ตกลง'}]);
    } else {
      showModal();
    }
  };

  useEffect(() => {
    console.log(itemProduct);
    sumamonts();
  }, [itemProduct, sumAmounts]);
  return (
    <Provider>
      <View style={{flex: 5}}>
        <View
          style={{
            backgroundColor: '#00cc99',
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
            height: '15%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('DetailMarket')}>
            <IoniconsBack name="chevron-back-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <Text style={stypes.Texttitle}>ตะกร้าสินค้า</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 30}}>
            {id_usale[0].nameMarket_sal}
          </Text>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 20}}>
              เวลาปัจุบัน {format(new Date(), 'dd/MM/yyyy')}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', fontSize: 30}}></Text>
          </View>
        </View>
        <ScrollView>
          {itemProduct.map(item => {
            return (
              <View
                style={{
                  marginBottom: 10,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 5,
                }}>
                <Card
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: 350,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{
                        uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/product%2F${item.itemPd.image_Product}?alt=media&token=03451e25-c6b6-4882-bd71-fec66364fff1`,
                      }}
                      style={{
                        width: 130,
                        height: 100,
                        marginLeft: 5,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        flex: 1,
                        marginLeft: 10,
                      }}>
                      <Text style={{fontSize: 20, fontWeight: '800'}}>
                        {item.itemPd.name_product}
                      </Text>
                      <Text style={{fontSize: 15}}>
                        {'จำนวน' +
                          item.itemPd.num +
                          ' ' +
                          item.itemPd.unit_product}
                      </Text>
                      <View style={{}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text style={{fontSize: 15}}>ราคารวม</Text>
                          <Text
                            style={{
                              marginLeft: 10,
                              color: 'red',
                              fontSize: 20,
                              fontWeight: '500',
                            }}>
                            {item.itemPd.amout + '฿'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveFromCart(item)}>
                      <View
                        style={{
                          width: 50,
                          height: 100,
                          backgroundColor: '#ff6666',
                          borderRadius: 5,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: 20,
                            fontWeight: '600',
                          }}>
                          <Confirm name="trash-2" size={40} />
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Card>
              </View>
            );
          })}
        </ScrollView>
        <View
          style={{
            width: '100%',
            height: 100,
            marginBottom: 130,
          }}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 30}}>
                รวมเป็นเงิน{' '}
              </Text>
              <Text style={{fontWeight: 'bold', fontSize: 30, color: 'red'}}>
                {'   ' + sumAmounts}฿
              </Text>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => checkamount()}
              style={stypes.loginBtn}>
              <Text style={stypes.loginText}>ชำระเงิน</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteItem()}
              style={stypes.loginBtn2}>
              <Text style={stypes.loginText2}>ยกเลิก</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('ตะกร้า')}
              style={stypes.loginBtn2}>
              <Text style={stypes.loginText2}>Test</Text>
            </TouchableOpacity> */}
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
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 40,
                  color: '#000',
                }}>
                ชำระเงิน
              </Text>
              <View
                style={{
                  alignItems: 'flex-start',
                  width: '100%',
                  marginBottom: 20,
                }}>
                <Text>{'ธนาคาร           ' + id_mk[0].bank_sal}</Text>
                <Text>{'เลขที่บัญชี      ' + id_mk[0].accountnumber_sal}</Text>
              </View>
              <Text>จำนวนเงินที่ต้องชำระ {'   ' + sumAmounts}฿</Text>

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
                    onPress={() => showModalupimg()}
                  />
                  <Text style={{fontWeight: 'bold'}}>อัพโหลดสลิปโอนเงิน</Text>
                </View>

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
              </View>
              <Button
                mode="contained"
                color="green"
                onPress={() => insertOrder()}>
                ชำระตอนนี้
              </Button>
              <Button
                mode="contained"
                color="#ffcc66"
                style={{marginTop: 10}}
                onPress={() => insertOrderNoslip()}>
                ชำระทีหลัง
              </Button>
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={visibleupimg}
            onDismiss={hideModalupimg}
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

const stypes = StyleSheet.create({
  Texttitle: {
    marginBottom: 0,
    alignItems: 'center',

    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 40,
  },
  fonText: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  fonText2: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
    marginRight: 49,
  },
  loginBtn: {
    width: '50%',
    borderRadius: 25,
    height: 50,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#008B8B',
    marginBottom: 20,
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 25,
  },
  loginBtn2: {
    width: '50%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    backgroundColor: '#ff6666',
    marginBottom: 20,
  },
  loginText2: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 25,
  },
});

export default Listproduct;
