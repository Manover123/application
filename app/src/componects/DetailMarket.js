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
import {ScrollView} from 'react-native-gesture-handler';
import {Card, Button, Colors} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Fontisto';
import Confirm from 'react-native-vector-icons/FontAwesome';
import IoniconsBack from 'react-native-vector-icons/Ionicons';
import NumericInput from 'react-native-numeric-input';
import {useSelector, useDispatch} from 'react-redux';
import {itemProduct, clearCart} from '../redux/authSlice';

const DetailMarket = ({navigation}) => {
  const dispatch = useDispatch();
  const id_usale = useSelector(state => state.auth.user);
  const id_mk = useSelector(state => state.auth.memberSal);
  const id_us = useSelector(state => state.auth.member);
  const getitem = useSelector(state => state.auth.itemPd);
  const [numProduct, setNum] = useState(0);
  const [Item, setItem] = useState(0);

  const loadDataMarket = async (item, num) => {
    if (num > item.number_product) {
      alert('เกินจำนวนที่มีอยู่');
    } else {
      if (id_us[0].statusBan_us == 1) {
        Alert.alert(
          'มีข้อผิดพลาด',
          'คุณถูกแบนอยู่กรุณาติดต่อ ผู้ดูเเลตลาด เบอร์โทร 0684521324',
          [{text: 'ตกลง'}],
        );
      } else {
        if (item.number_product !== 0) {
          if (
            getitem.some(val => val.itemPd.image_Product === item.image_Product)
          ) {
            Alert.alert(
              'มีข้อผิดพลาด',
              'สินค้านี้มีอยู่เเล้ว ถ้าต้องการเพิ่ม "กรุณาลบอันเก่าก่อน"',
              [{text: 'ตกลง'}],
            );
          } else {
            if (num !== 0) {
              const updateNum = item.number_product - num;
              const sumPrice = num * item.price_product;
              const data = {
                image_Product: item.image_Product,
                nameMarket_sal: item.nameMarket_sal,
                name_product: item.name_product,
                name_sal: item.name_sal,
                number_product: item.number_product,
                price_product: item.price_product,
                profile_sal: item.profile_sal,
                typeProduct_sal: item.typeProduct_sal,
                unit_product: item.unit_product,
                amout: sumPrice,
                num: num,
                id_us: id_us[0].id_us,
                itemnum: 1,
                id_product: item.id_product,
                updatenum: updateNum,
              };
              dispatch(itemProduct({itemPd: data}));
              setNum(0);
            } else {
              alert('กรุณเพิ่มจำนวน');
            }
          }
        } else {
          alert('สินค้าหมดเเล้ว');
        }
      }
    }
  };
  const deleteItem = () => {
    dispatch(clearCart());
    navigation.goBack();
  };

  const itemsum = async () => {
    const item = Object.values(getitem.map(val => val.itemPd.itemnum));
    if (item == '') {
      setItem(0);
    } else {
      let sum = 0;
      for (const value of Object.values(
        getitem.map(val => val.itemPd.itemnum),
      )) {
        sum += value;
        setItem(sum);
      }
    }
  };

  const chackProduct = () => {
    if (id_usale == '') {
      Alert.alert('มีข้อผิดพลาด', 'ร้านนี้ไม่มีสินค้าไม่สามารถไปตะกร้าได้', [
        {text: 'ตกลง'},
      ]);
    } else {
      navigation.navigate('Listproduct');
    }
  };
  useEffect(() => {
    itemsum();
  }, [getitem, numProduct, id_usale, id_mk]);

  const CartsItem = () => {
    if (Item == 0) {
      return <View></View>;
    } else {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}>
          <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: 'flex-end',
            }}>
            <Button
              mode="contained"
              color="#ff6666"
              labelStyle={{fontSize: 30, fontWeight: 'bold', color: '#fff'}}
              style={{
                width: 100,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
              onPress={() => chackProduct()}>
              <Confirm name="shopping-basket" size={30} color="#fff" />
              <Text> {Item}</Text>
            </Button>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={{flex: 5, backgroundColor: '#E7F3EF'}}>
      {id_mk.map(val => {
        return (
          <View
            style={{
              backgroundColor: '#00cc99',
              borderBottomRightRadius: 30,
              borderBottomLeftRadius: 30,
              height: '28%',
            }}>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <TouchableOpacity onPress={() => deleteItem()}>
                <IoniconsBack
                  name="chevron-back-outline"
                  size={40}
                  color="#fff"
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'row', marginTop: 0}}>
                <Image
                  source={{
                    uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profile%2F${val.profile_sal}?alt=media&token=689c880e-a865-4f6a-883a-d578a4e330cb`,
                  }}
                  style={stypes.image}
                />
                <Text style={stypes.Texttitle}>{val.nameMarket_sal}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginLeft: 85,
                marginTop: 5,
              }}>
              <Text style={stypes.subTexttitle}>
                ประเภท {'    ' + val.typeProduct}
              </Text>
              <Text style={stypes.subTexttitle}>
                {'เบอร์โทร  ' + val.zipcode_sal}
              </Text>
              <Text style={stypes.subTexttitle}>
                {'อีเมล  ' + val.email_sal}
              </Text>
            </View>
          </View>
        );
      })}
      <ScrollView
        style={{
          width: '100%',
          height: '65%',
          marginTop: 20,
        }}>
        {id_usale.map(item => {
          return (
            <View
              style={{
                marginBottom: 20,
                marginLeft: 20,
                marginRight: 20,
              }}>
              <Card
                containerstype={{
                  flexDirection: 'column',
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                    }}>
                    <View
                      style={{
                        // flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRightWidth: 2,
                        borderColor: '#ede8e8',
                        marginRight: 10,
                      }}>
                      <Image
                        source={{
                          uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/product%2F${item.image_Product}?alt=media&token=03451e25-c6b6-4882-bd71-fec66364fff1`,
                        }}
                        style={{
                          width: 180,
                          height: 140,
                          borderRadius: 20,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        marginRight: 20,
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: 'bold',
                          marginLeft: 10,
                          marginTop: 10,
                        }}>
                        {item.name_product}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'red',
                            fontWeight: 'bold',
                            fontSize: 20,
                            marginLeft: 10,
                            marginTop: 10,
                          }}>
                          {item.price_product}฿
                        </Text>
                        <Text
                          style={{
                            color: '#093426',
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginLeft: 10,
                            marginTop: 10,
                          }}>
                          {'ต่อ' + item.unit_product}
                        </Text>
                      </View>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: 'bold',
                          marginTop: 12,
                        }}>
                        คงเหลือ {item.number_product} {item.unit_product}
                      </Text>
                      <NumericInput
                        onChange={num => setNum(num)}
                        totalWidth={110}
                        totalHeight={40}
                        inputStyle={{
                          fontSize: 18,
                          color: '#434A5E',
                          fontWeight: 'bold',
                        }}
                        step={1}
                        type="up-down"
                        minValue={0}
                        valueType="real"
                        borderColor="#d4d4d4"
                      />
                      <View style={{marginTop: 10, marginBottom: 8}}>
                        <Button
                          mode="contained"
                          color="#23483C"
                          labelStyle={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#fff',
                          }}
                          style={{
                            height: 40,
                            width: '100%',
                          }}
                          onPress={() => loadDataMarket(item, numProduct)}>
                          สั่งจอง
                          <Ionicons
                            name="shopping-basket"
                            size={20}
                            color="#fff"
                          />
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          );
        })}
      </ScrollView>
      <CartsItem />
    </View>
  );
};

export default DetailMarket;
const stypes = StyleSheet.create({
  image: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginLeft: 20,
  },
  Texttitle: {
    marginBottom: 0,
    alignItems: 'center',
    marginTop: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  subTexttitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
