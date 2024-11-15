import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lgin from 'react-native-vector-icons/AntDesign';
import {Card} from 'react-native-paper';
import {url} from '../../ngrok';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Avatar,
  Button,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, setMemberSalr} from '../redux/authSlice';
import axios from 'axios';

const Homes = ({navigation}) => {
  const dispatch = useDispatch();
  const [country, setCountry] = useState('Unknown');
  const [market, setMarket] = useState([]);
  const [search, setsearch] = useState('');
  const [marketPoular, setMarketPoular] = useState([]);
  const [typpeProduct, setTyppeProduct] = useState([]);

  const loadMarket = async () => {
    setRefreshing(true);
    axios.get(`${url}/loadMarket`).then(myJson => {
      setMarket(myJson.data);
      setRefreshing(false);
    });
  };
  const loadDataId = async (id_lock, statusname) => {
    if (statusname == 'เปิดร้าน') {
      axios.get(`${url}/product/${id_lock}`).then(res => {
        dispatch(setUser({user: res.data}));
      });
      axios.get(`${url}/memberSal/${id_lock}`).then(res => {
        dispatch(setMemberSalr({memberSal: res.data}));
        navigation.navigate('DetailTest');
      });
    } else {
      Alert.alert('เกิดข้อผิดพลาด', 'ร้านนี้ปิดชั่วคราว', [{text: 'ตกลง'}]);
    }
  };
  const loadMarketPopular = () => {
    setRefreshing(true);
    axios
      .get(url + '/loadMarketPopular')
      .then(myJson => {
        setMarketPoular(myJson.data);
        setRefreshing(false);
      })
      .catch(err => {
        console.warn(err);
      });
  };
  const loadtyp1eProduct = () => {
    axios.get(`${url}/loadtypeProducts`).then(res => {
      if (res) {
        setTyppeProduct(res.data);
      }
    });
  };
  const loaddatatype = item => {
    setCountry(item);
    if (item == 'ทั้งหมด') {
      loadMarket();
    } else {
      setRefreshing(true);
      axios.get(`${url}/loaddataMarketByname/${item}`, {}).then(res => {
        setMarket(res.data);
        setRefreshing(false);
      });
    }
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    loadMarket();
    Functionsearch();
    loadtyp1eProduct();
    loadMarketPopular();
    setCountry('ทั้งหมด');
  }, [market]);
  useEffect(() => {
    onRefresh();
  }, []);

  const CheckTypeonpress = () => {
    if (country == 'ทั้งหมด') {
      return (
        <View
          style={{
            padding: 10,
            height: 180,
          }}>
          <Text style={{fontSize: 18, fontWeight: '700', padding: 10}}>
            ร้านขายดี
          </Text>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              justifyContent: 'center',
            }}
            showsHorizontalScrollIndicator={false}>
            {marketPoular
              .filter(item => {
                if (search == '') {
                  return item;
                } else if (
                  item.name_lock.toLowerCase().includes(search.toLowerCase())
                ) {
                  return item;
                }
              })
              .map((item, key) => {
                let num = 2;
                return (
                  <View
                    style={{
                      marginLeft: 10,
                      justifyContent: 'center',
                    }}
                    key={key}>
                    <TouchableOpacity
                      onPress={() =>
                        loadDataId(item.id_lock, item.status_name)
                      }>
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
                          padding: 10,
                          height: 120,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Image
                            source={{
                              uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/market%2F${item.img_mrk}?alt=media&token=9f674d24-7ddb-4485-8efa-0ff6fc1706fe`,
                            }}
                            style={{
                              width: 80,
                              height: 95,
                              borderRadius: 15,
                              marginLeft: 10,
                            }}
                          />
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: 15,
                              alignItems: 'stretch',
                            }}>
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                fontFamily: 'SanamDeklen_chaya',
                              }}>
                              {item.nameMarket_sal}{' '}
                            </Text>
                            <Text>{item.name_lock} </Text>
                            <Text
                              style={{
                                alignItems: 'center',
                                marginLeft: 0,
                              }}>
                              ประเภทสินค้า {'  ' + item.typeProduct}
                            </Text>
                            <Text>
                              {'ขายไปเเล้ว ' + item.sumorder + ' ออเดอร์'}
                            </Text>
                            <Text
                              style={
                                item.status_name == 'เปิดร้าน'
                                  ? Pickers.textcoloropen
                                  : Pickers.textcoloroff_open
                              }>
                              สถานะ{item.status_name}
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
      );
    } else {
      return <View></View>;
    }
  };

  const Functionsearch = () => {
    if (search == '') {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{flex: 2}}>
            <CheckTypeonpress />
          </View>
          <Text style={{fontSize: 18, fontWeight: '700', padding: 20}}>
            ร้านค้าทั้งหมด
          </Text>
          <View
            style={{
              flex: 2,
              alignItems: 'center',
              padding: 10,
            }}>
            <ScrollView>
              {market
                .filter(item => {
                  if (search == '') {
                    return item;
                  } else if (
                    item.name_lock.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return item;
                  } else if (
                    item.nameMarket_sal
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return <Text>555555555</Text>;
                  } else if (
                    item.typeProduct
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return item;
                  }
                })
                .map((item, key) => {
                  return (
                    <View
                      style={{
                        justifyContent: 'center',
                        marginBottom: 10,
                      }}
                      key={key}>
                      <TouchableOpacity
                        onPress={() =>
                          loadDataId(item.id_lock, item.status_name)
                        }>
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
                            padding: 10,
                            width: 340,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              height: 60,
                            }}>
                            <Image
                              source={{
                                uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/market%2F${item.img_mrk}?alt=media&token=9f674d24-7ddb-4485-8efa-0ff6fc1706fe`,
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: 15,
                                marginLeft: 10,
                              }}
                            />
                            <View
                              style={{
                                flexDirection: 'column',
                                marginLeft: 10,

                                width: 130,
                              }}>
                              <Text style={{}}>{item.nameMarket_sal} </Text>
                              <Text>{item.name_lock} </Text>
                              <Text
                                style={{
                                  alignItems: 'center',
                                  marginLeft: 0,
                                }}>
                                ประเภทสินค้า {item.typeProduct}
                              </Text>
                            </View>
                            <View
                              style={{
                                justifyContent: 'center',
                                marginLeft: 10,
                                alignItems: 'center',

                                width: 100,
                              }}>
                              <Text
                                style={
                                  item.status_name == 'เปิดร้าน'
                                    ? Pickers.textcoloropen
                                    : Pickers.textcoloroff_open
                                }>
                                สถานะ{item.status_name}
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
        </ScrollView>
      );
    } else {
      return (
        <View
          style={{
            flex: 2,
            alignItems: 'center',
            padding: 10,
          }}>
          <ScrollView>
            {market
              .filter(item => {
                if (search == '') {
                  return item;
                } else if (
                  item.name_lock.toLowerCase().includes(search.toLowerCase())
                ) {
                  return item;
                } else if (
                  item.nameMarket_sal
                    .toLowerCase()
                    .includes(search.toLowerCase())
                ) {
                  return <Text>555555555</Text>;
                } else if (
                  item.typeProduct.toLowerCase().includes(search.toLowerCase())
                ) {
                  return item;
                }
              })
              .map((item, key) => {
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                    key={key}>
                    <TouchableOpacity
                      onPress={() =>
                        loadDataId(item.id_lock, item.status_name)
                      }>
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
                          padding: 10,
                          width: 340,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            height: 60,
                          }}>
                          <Image
                            source={{
                              uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/market%2F${item.img_mrk}?alt=media&token=9f674d24-7ddb-4485-8efa-0ff6fc1706fe`,
                            }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 15,
                              marginLeft: 10,
                            }}
                          />
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: 10,

                              width: 130,
                            }}>
                            <Text style={{}}>{item.nameMarket_sal} </Text>
                            <Text>{item.name_lock} </Text>
                            <Text
                              style={{
                                alignItems: 'center',
                                marginLeft: 0,
                              }}>
                              ประเภทสินค้า {item.typeProduct}
                            </Text>
                          </View>
                          <View
                            style={{
                              justifyContent: 'center',
                              marginLeft: 10,
                              alignItems: 'center',
                              width: 100,
                            }}>
                            <Text
                              style={
                                item.status_name == 'เปิดร้าน'
                                  ? Pickers.textcoloropen
                                  : Pickers.textcoloroff_open
                              }>
                              สถานะ{item.status_name}
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
      );
    }
  };
  return (
    <View style={stypes.container}>
      <View
        style={{
          backgroundColor: '#00cc99',
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
        }}>
        <View style={{alignItems: 'flex-end', padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 17,
                  fontWeight: '600',
                  textDecorationLine: 'underline',
                }}>
                เข้าสู่ระบบ/
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 17,
                  fontWeight: '600',
                  textDecorationLine: 'underline',
                }}>
                สมัคร
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            width: '100%',
            marginBottom: 10,
          }}>
          <Text style={stypes.Texttitle}>ตลาดค้าส่ง</Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#006666',
            width: 150,
            height: 50,
            marginLeft: 60,
            borderRadius: 20,
            marginBottom: 10,
          }}>
          <Picker
            selectedValue={country}
            onValueChange={(value, index) => loaddatatype(value)}
            mode="dropdown"
            dropdownIconColor={'#fff'}
            style={{
              color: '#ffffff',
              marginVertical: 30,
              width: 150,
              padding: 10,
              borderWidth: 1,
              borderColor: '#666',
              fontWeight: 'bold',
            }}>
            <Picker.Item label="ทั้งหมด" value="ทั้งหมด" />
            {typpeProduct.map((item, index) => {
              return (
                <Picker.Item
                  label={item.name_product}
                  value={item.name_product}
                  key={index}
                />
              );
            })}
          </Picker>
        </View>
        <View style={stypes.searchSection}>
          <TextInput
            style={stypes.input}
            placeholder="ค้นหาร้าน..."
            placeholderTextColor="#003f5c"
            onChangeText={setsearch}
          />
          <Ionicons
            style={stypes.searchIcon}
            name="ios-search"
            size={30}
            color="#fff"
          />
        </View>
      </View>
      <Functionsearch />
    </View>
  );
};
export default Homes;
const stypes = StyleSheet.create({
  icons: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  container: {
    flex: 1,
  },
  Texttitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputView: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 40,
    marginTop: 0,
    marginLeft: 60,
  },
  TextInput: {
    height: 50,
    padding: 10,
    marginLeft: 20,
  },

  title: {},

  titles2: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Buttonlogin: {
    marginLeft: 300,
    marginTop: 20,
    width: '25%',
    height: 40,
  },
  listdropdown: {
    marginVertical: 30,
    width: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: '#666',
  },

  searchSection: {
    flexDirection: 'row',
    backgroundColor: '#006666',
    borderRadius: 60,
    marginLeft: 70,
    width: 300,
    height: 48,
    marginBottom: 10,
  },
  searchIcon: {
    padding: 10,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    marginLeft: -9,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#fff',
    color: '#424242',
    fontWeight: 'bold',
  },
});
const Pickers = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006666',
    width: 150,
    height: 50,
    marginLeft: 60,
    borderRadius: 20,
    marginBottom: 10,
  },
  Text: {
    color: '#ffffff',
  },
  picker: {
    color: '#ffffff',
    marginVertical: 30,
    width: 150,
    padding: 10,
    borderWidth: 1,
    borderColor: '#666',
    fontWeight: 'bold',
  },
  textcoloropen: {
    color: '#339966',
    fontWeight: '700',
  },
  textcoloroff_open: {
    color: '#ff9933',
    fontWeight: '700',
  },
});
