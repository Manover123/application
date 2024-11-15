import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import {
  Modal,
  Portal,
  Provider,
  Card,
  IconButton,
  Colors,
  Button,
  Switch,
} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import Ioniconscan from 'react-native-vector-icons/MaterialCommunityIcons';
import IoniconEdit from 'react-native-vector-icons/Feather';
import IoniconDelete from 'react-native-vector-icons/AntDesign';
import Ioniconsplust from 'react-native-vector-icons/Ionicons';
import NumericInput from 'react-native-numeric-input';
import {useSelector, useDispatch} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {url} from './../../ngrok';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {setLock} from '../redux/productSlice';

const Homesale = ({navigation}) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const PrfileImg = useSelector(state => state.auth.memberSal);
  const [cartData, setcartData] = useState([]);
  const [locksal, setlocksal] = useState([]);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const showModalEdit = () => setVisibleEdit(true);
  const hideModalEdit = () => setVisibleEdit(false);
  const [productByid, setProductByid] = useState([]);
  const [nameProductEdit, setNameproductEdit] = useState('');
  const [numberProductEdit, setnumberProductEdit] = useState('');
  const [priceProductEdit, setpriceProductEdit] = useState('');
  const [unitProductEdit, setunitProductEdit] = useState('');
  const [detailProductEdit, setdetailProductEdit] = useState('');
  const [old_num, setOldnum] = useState(null);
  const [old_imgage, setold_imgage] = useState('');
  const [id_product, setid_product] = useState('');
  const [selectedValue, setSelectedValue] = useState();
  const [open, setOpen] = useState(null);
  const [nametypeProducts, setnametypeProducts] = useState([]);
  const [namelock, setnamelock] = useState([]);
  const [getlocks, setgetlock] = useState([]);
  const [photo, setPhoto] = useState({
    name: null,
    type: null,
    uri: null,
  });
  const [photoMK, setPhotoMK] = useState({
    name: null,
    type: null,
    uri: null,
  });
  const updateimageMarket = () => {
    const id_lock = namelock.map(val => {
      return val.id_lock;
    });
    const formdata = new FormData();
    formdata.append('id_lock', JSON.stringify(id_lock));
    formdata.append('photo', {
      name: photoMK.name,
      type: photoMK.type,
      uri: photoMK.uri,
    });
    axios.put(`${url}/updateProductImage`, formdata, {}).then(res => {
      Alert.alert('แก้ไขเสร็จเรียบร้อย');
      setPhotoMK({
        name: null,
        type: null,
        uri: null,
      });
    });
  };
  const containerStyle = {
    backgroundColor: 'white',
    height: 'auto',
    padding: 20,
  };
  const updateProduct = event => {
    event.preventDefault();
    if (photo.name != null) {
      const oldNum = old_num;
      const newNum = numberProductEdit;
      const sumnum = oldNum + newNum;
      console.log('รามม' + sumnum);
      const formdata = new FormData();
      formdata.append('name_product', nameProductEdit);
      formdata.append('number_product', sumnum.toString());
      formdata.append('price_product', priceProductEdit);
      formdata.append('unit_product', unitProductEdit);
      formdata.append('details_Product', detailProductEdit);
      formdata.append('id_product', id_product);
      formdata.append('old_image', old_imgage);
      formdata.append('photo', {
        name: photo.name,
        type: photo.type,
        uri: photo.uri,
      });
      axios.put(`${url}/updateProduct`, formdata, {}).then(res => {
        Alert.alert('แก้ไขเสร็จเรียบร้อย');
        setPhoto({
          name: null,
          type: null,
          uri: null,
        });
        hideModal();
      });
    } else {
      const oldNum = old_num;
      const newNum = numberProductEdit;
      const sumnum = oldNum + newNum;
      console.log('รามม' + sumnum);
      axios
        .put(`${url}/updateProduct_Nofile`, {
          name_product: nameProductEdit,
          number_product: sumnum.toString(),
          price_product: priceProductEdit,
          unit_product: unitProductEdit,
          details_Product: detailProductEdit,
          id_product: id_product,
        })
        .then(res => {
          Alert.alert('แก้ไขเสร็จเรียบร้อย');
          hideModal();
        });
    }
  };
  const getItemProductByid = async idlock => {
    setRefreshing(true);
    setSelectedValue(idlock);
    dispatch(setLock({idlock: idlock}));
    axios.get(`${url}/typeProductName/${idlock}`).then(res => {
      setnametypeProducts(res.data);
    });
    axios.get(`${url}/getnamelock/${idlock}`).then(res => {
      setnamelock(res.data);
      setOpen(res.data[0].status_open);
      setgetlock(res.data[0].id_lock);
      if (res.data[0].status_open == 1) {
        setIsSwitchOn(true);
      } else {
        setIsSwitchOn(false);
      }
    });
    axios.get(`${url}/product_sal/${idlock}`).then((res, err) => {
      if (res) {
        setcartData(res.data);
        setRefreshing(false);
      } else {
        console.log('55');
      }
    });
  };

  const getlock = async id_usale => {
    setRefreshing(true);
    axios.get(`${url}/getLock/${id_usale}`).then(res => {
      setlocksal(res.data);
      setRefreshing(false);
    });
  };
  const loadDataProduct = (id_product, id_image, oldnum) => {
    if (PrfileImg[0].status_ban == 1) {
      Alert.alert(
        'มีข้อผิดพลาด',
        'คุณถูกแบนอยู่กรุณาติดต่อ ผู้ดูเเลตลาด เบอร์โทร 0684521324',
        [{text: 'ตกลง'}],
      );
    } else {
      axios.get(`${url}/getProductByID/${id_product}`).then(res => {
        showModal();
        setProductByid(res.data);
        setNameproductEdit(res.data[0].name_product);
        setpriceProductEdit(res.data[0].price_product);
        setunitProductEdit(res.data[0].unit_product);
        setdetailProductEdit(res.data[0].details_Product);
        setold_imgage(id_image);
        setid_product(id_product);
        setOldnum(oldnum);
      });
    }
  };
  // const ButtonAlertDelete = (id_product, id) => {
  //   const idProduct = id_product;
  //   const idProduct_img = id;
  //   console.log(id);
  //   const deleteProduc = () => {
  //     axios.delete(`${url}/deleteByid/${idProduct}`).then(response => {});
  //   };
  //   const deletImage = id => {
  //     axios.get(`${url}/delete_product/${idProduct_img}`).then(() => {
  //       console.log(id);
  //     });
  //   };
  //   Alert.alert('ลบสินค้า', 'คุณต้องการที่จะลบสินค้าหรือไม่', [
  //     {
  //       text: 'cancel',
  //       onPress: () => console.log(idProduct),
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'ok',
  //       onPress: () => {
  //         deleteProduc();
  //         deletImage();
  //         onRefresh();
  //       },
  //     },
  //   ]);
  // };
  const handleChoosePhoto = () => {
    ImagePicker.launchImageLibrary({noData: true}, response => {
      if (response !== undefined) {
        setPhoto({
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        });
        hideModalEdit();
        console.log(photo);
      } else {
      }
    });
  };
  const selectOneFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setPhoto({name: res[0].name, type: res[0].type, uri: res[0].uri});
      hideModalEdit();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // alert('Canceled from single doc picker');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  const selectOneFile2 = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setPhotoMK({name: res[0].name, type: res[0].type, uri: res[0].uri});
      hideModalEdit();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // alert('Canceled from single doc picker');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  const openMarket = () => {
    const id_lock = getlocks;
    console.log(id_lock);
    axios.put(`${url}/open/${id_lock}`).then((res, err) => {
      if (err) {
        console.log(err);
      } else {
        setOpen(1);
      }
    });
  };
  const off_openMarket = () => {
    const id_lock = getlocks;
    axios.put(`${url}/off_openmak/${id_lock}`).then((res, err) => {
      if (err) {
        console.log(err);
      } else {
        setOpen(0);
      }
    });
  };
  const [isSwitchOn, setIsSwitchOn] = useState(null);
  const onToggleSwitch = () => {
    console.log(isSwitchOn);
    if (open == 1) {
      off_openMarket();
      setIsSwitchOn(false);
    } else {
      openMarket();
      setIsSwitchOn(true);
    }
  };
  const StatusMarket = () => {
    if (open === 1) {
      return (
        <Text style={{fontSize: 15, fontWeight: '500', color: 'green'}}>
          เปิดอยู่
        </Text>
      );
    } else {
      return (
        <Text style={{fontSize: 15, fontWeight: '500', color: 'red'}}>
          ปิดอยู่
        </Text>
      );
    }
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getlock(PrfileImg[0].id_sal);
    // console.log(open, cartData, namelock, nametypeProducts, isSwitchOn);
  }, [open, cartData, namelock, nametypeProducts, isSwitchOn]);
  useEffect(() => {
    onRefresh();
  }, []);
  // open, cartData, namelock, nametypeProducts, productByid, isSwitchOn;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <Provider>
      <View style={{flex: 1, backgroundColor: '#FCDFEB'}}>
        {PrfileImg.map(val => {
          return (
            <View
              style={{
                flex: 0.4,
                backgroundColor: '#ff3385',
                borderBottomRightRadius: 30,
                height: '50%',
              }}>
              <View style={{flexDirection: 'row', padding: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: '10%',
                  }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Information')}>
                    <Image
                      source={{
                        uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profile%2F${val.profile_sal}?alt=media&token=689c880e-a865-4f6a-883a-d578a4e330cb`,
                      }}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 40,
                      }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: '70%',
                      height: 50,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 26,
                        fontWeight: 'bold',
                        marginLeft: 16,
                      }}>
                      {val.nameMarket_sal}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FFF',
                    width: 150,
                    height: 50,
                    borderRadius: 15,
                    marginRight: 30,
                  }}>
                  <Picker
                    mode="dropdown"
                    dropdownIconColor={'#808080'}
                    style={{
                      color: '#808080',
                      marginVertical: 30,
                      width: 150,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: '#666',
                    }}
                    selectedValue={selectedValue}
                    onValueChange={itemValue => getItemProductByid(itemValue)}>
                    {locksal.map((item, index) => {
                      return (
                        <Picker.Item
                          value={item.id_lock}
                          label={item.name_lock}
                          key={index}
                        />
                      );
                    })}
                  </Picker>
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: 150,
                    height: 50,
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#999999',
                        fontWeight: '600',
                      }}>
                      ปิด
                    </Text>
                    <Switch
                      value={isSwitchOn}
                      color={'#ff3385'}
                      onValueChange={onToggleSwitch}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#999999',
                        fontWeight: '600',
                      }}>
                      เปิดร้าน
                    </Text>
                  </View>
                </View>
                <View></View>
              </View>
            </View>
          );
        })}
        <View
          style={{
            flex: 1,
            width: '100%',
            height: 10,
            padding: 10,
          }}>
          <View
            style={{
              padding: 15,
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 50,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <Text style={{fontSize: 22, fontWeight: '600', color: '#D6005D'}}>
              รายละเอียดร้าน
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '60%',
              }}>
              <View
                style={{
                  width: '100%',
                  marginLeft: 10,
                  flexDirection: 'column',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 15, fontWeight: '500'}}>
                    สถานะร้าน{' '}
                  </Text>
                  <StatusMarket />
                </View>
                {namelock.map(val => {
                  return <Text style={{fontSize: 15}}>{val.name_lock}</Text>;
                })}
                {nametypeProducts.map(val => {
                  return (
                    <Text style={{fontSize: 15}}>
                      {'ประเภทสินค้าที่ขาย ' + val.typeProduct}
                    </Text>
                  );
                })}
              </View>
              <View
                style={{
                  width: '65%',
                  marginTop: -20,
                }}>
                {nametypeProducts.map(val => {
                  if (photoMK.uri === null) {
                    return (
                      <TouchableOpacity onPress={selectOneFile2}>
                        <Image
                          source={{
                            uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/market%2F${val.img_mrk}?alt=media&token=9f674d24-7ddb-4485-8efa-0ff6fc1706fe`,
                          }}
                          style={{
                            width: 100,
                            height: 60,
                            borderRadius: 20,
                            backgroundColor: '#e0ebeb',
                          }}
                        />
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <TouchableOpacity onPress={selectOneFile2}>
                        <Image
                          source={{uri: photoMK.uri}}
                          style={{
                            width: 100,
                            height: 60,
                            borderRadius: 20,
                            backgroundColor: '#e0ebeb',
                          }}
                        />
                      </TouchableOpacity>
                    );
                  }
                })}

                <TouchableOpacity onPress={() => updateimageMarket()}>
                  <Text style={{textDecorationLine: 'underline'}}>
                    อัพโหลดรูปร้านค้า
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {cartData.map(item => {
              return (
                <View
                  style={{
                    marginBottom: 10,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      loadDataProduct(
                        item.id_product,
                        item.image_Product,
                        item.number_product,
                      );
                    }}>
                    <Card
                      style={{
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 50,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        borderTopEndRadius: 20,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 100,
                          width: '70%',
                          padding: 20,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: 'red',
                            width: '40%',
                            height: '120%',
                            borderRadius: 10,
                          }}>
                          <Image
                            source={{
                              uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/product%2F${item.image_Product}?alt=media&token=03451e25-c6b6-4882-bd71-fec66364fff1`,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 200,
                          }}>
                          <Text style={{alignItems: 'center', marginLeft: 0}}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontSize: 20,
                                color: '#340D09',
                              }}>
                              {item.name_product}{' '}
                            </Text>
                          </Text>
                          <Text
                            style={{
                              fontWeight: '400',
                              fontSize: 15,
                              color: '#000000',
                            }}>
                            จำนวนคงเหลือ {item.number_product + ' '}
                            {item.unit_product}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <Portal>
          {productByid.map(val => {
            return (
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
                    แก้ไขสต็อกสินค้า
                  </Text>
                  <View
                    style={{
                      flexDirection: 'column',
                      marginRight: 50,
                    }}>
                    <Text
                      style={{
                        width: 200,
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginTop: 5,
                      }}>
                      เพิ่มลดแก้ไขจำนวนสต็อก
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <NumericInput
                        onChange={num => {
                          setnumberProductEdit(num);
                        }}
                        totalWidth={110}
                        totalHeight={40}
                        inputStyle={{
                          fontSize: 18,
                          color: '#434A5E',
                          fontWeight: 'bold',
                        }}
                        step={1}
                        minValue={-100}
                        valueType="real"
                        rounded
                        textColor="#B0228C"
                        iconStyle={{color: '#001a13'}}
                        rightButtonBackgroundColor="#ff3385"
                        leftButtonBackgroundColor="#ff3385"
                        // value={val.number_product}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          marginTop: 10,
                          marginLeft: 20,
                        }}>
                        คงเหลือ
                      </Text>
                      <TextInput
                        style={{
                          backgroundColor: '#ffe6e6',
                          borderRadius: 20,
                          width: 100,
                          height: 40,
                          textAlign: 'center',
                          marginLeft: 5,
                        }}
                        defaultValue={val.number_product.toString()}
                      />
                    </View>
                  </View>
                  <View style={{flexDirection: 'column', marginTop: 20}}>
                    <Text>ชื่อสินค้า</Text>
                    <TextInput
                      placeholder="แก้ไขชื่อ"
                      style={{
                        backgroundColor: '#ffe6e6',
                        paddingLeft: 10,
                        borderRadius: 20,
                      }}
                      defaultValue={nameProductEdit}
                      onChangeText={setNameproductEdit}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignItems: 'center',
                      }}>
                      <Text style={{marginLeft: 4}}>ราคา</Text>
                      <Text style={{marginLeft: 135}}>ต่อหน่วย</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignItems: 'center',
                      }}>
                      <TextInput
                        placeholder="แก้ไขราคา"
                        style={{
                          backgroundColor: '#ffe6e6',
                          width: '40%',
                          borderRadius: 20,
                          paddingLeft: 10,
                        }}
                        defaultValue={priceProductEdit.toString()}
                        onChangeText={setpriceProductEdit}
                      />
                      <TextInput
                        placeholder="แก้ไขหน่วย"
                        style={{
                          backgroundColor: '#ffe6e6',
                          width: '40%',
                          marginLeft: 30,
                          borderRadius: 20,
                          paddingLeft: 10,
                        }}
                        defaultValue={unitProductEdit}
                        onChangeText={setunitProductEdit}
                      />
                    </View>
                    <Text style={{marginLeft: 4}}>รายละเอียด</Text>
                    <View>
                      <TextInput
                        mode="outlined"
                        multiline
                        placeholder="รายละเอียด"
                        style={{
                          backgroundColor: '#ffe6e6',
                          width: 330,
                          marginLeft: 0,
                          borderRadius: 20,
                          paddingLeft: 10,
                        }}
                        defaultValue={detailProductEdit}
                        onChangeText={setdetailProductEdit}
                      />
                    </View>
                    <Text>เปลี่ยนรูปสินค้า</Text>
                    <View style={{flexDirection: 'row'}}>
                      <IconButton
                        icon="image"
                        color={Colors.grey500}
                        size={40}
                        onPress={showModalEdit}
                      />
                      {productByid.map(val => {
                        if (photo.uri === null) {
                          return (
                            <Image
                              source={{
                                uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/product%2F${val.image_Product}?alt=media&token=03451e25-c6b6-4882-bd71-fec66364fff1`,
                              }}
                              style={{
                                width: 50,
                                height: 50,
                                marginTop: 10,
                                marginLeft: 20,
                                borderRadius: 50,
                              }}
                            />
                          );
                        } else {
                          return (
                            <Image
                              source={{uri: photo.uri}}
                              style={{
                                width: 50,
                                height: 50,
                                marginTop: 10,
                                marginLeft: 20,
                                borderRadius: 50,
                              }}
                            />
                          );
                        }
                      })}
                    </View>
                    <Button
                      color="#008B8B"
                      icon="content-save-edit"
                      mode="contained"
                      onPress={updateProduct}>
                      บันทึก
                    </Button>
                  </View>
                </View>
              </Modal>
            );
          })}
          <Modal
            visible={visibleEdit}
            onDismiss={hideModalEdit}
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

export default Homesale;
