import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

const HomeScreenUser = ({navigation}) => {
  const memberData = useSelector(state => state.auth.member);
  const dispatch = useDispatch();
  const [country, setCountry] = useState(null);
  const [people, setPeople] = useState([]);
  const [marketPoular, setMarketPoular] = useState([]);
  const [search, setsearch] = useState('');
  const [typpeProduct, setTyppeProduct] = useState([]);

  const loadMarket = () => {
    setRefreshing(true);
    axios
      .get(url + '/loadMarket')
      .then(myJson => {
        setPeople(myJson.data);
        setRefreshing(false);
      })
      .catch(err => {
        console.warn(err);
      });
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
  const loadDataId = (id_lock, statusname) => {
    if (statusname == 'เปิดร้าน') {
      axios.get(`${url}/product/${id_lock}`).then(res => {
        dispatch(setUser({user: res.data}));
      });
      axios.get(`${url}/memberSal/${id_lock}`).then(res => {
        dispatch(setMemberSalr({memberSal: res.data}));
        navigation.navigate('DetailMarket');
      });
    } else {
      Alert.alert('เกิดข้อผิดพลาด', 'ร้านนี้ปิดชั่วคราว', [{text: 'ตกลง'}]);
    }
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
        setPeople(res.data);
        setRefreshing(false);
      });
    }
  };
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    Chenktyping();
    loadMarket();
    loadMarketPopular();
    loadtyp1eProduct();
    CheckTypeonpress();
    setCountry('ทั้งหมด');
  }, [people, marketPoular]);
  useEffect(() => {
    onRefresh();
  }, [memberData]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });

    return unsubscribe;
  }, [navigation]);

  const CheckTypeonpress = () => {
    if (country == 'ทั้งหมด') {
      return (
        <View
          style={{
            padding: 10,
            height: '100%',
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
                          // backgroundColor: '#9400D3',
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

  const Chenktyping = () => {
    if (search == '') {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{flex: 1}}>
            <CheckTypeonpress />
          </View>
          <Text style={{fontSize: 18, fontWeight: '700', padding: 20}}>
            ร้านทั้งหมด
          </Text>
          <View
            style={{
              flex: 2,
              alignItems: 'center',
              padding: 10,
            }}>
            <ScrollView>
              {people
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
            {people
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
        {memberData.map(val => {
          if (val == null) {
            console.log('กำลังโหลด');
          } else {
            return (
              <View
                style={{
                  padding: 15,
                  alignItems: 'flex-end',
                  height: 50,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ข้อมูลส่วนตัว')}>
                  <Image
                    source={{
                      uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profileUser%2F${val.profile_us}?alt=media&token=f342a587-f2a1-4c7a-9e6f-279bd7972053`,
                    }}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 30,
                      marginRight: 5,
                    }}
                  />
                </TouchableOpacity>
                <Text style={{fontWeight: '600'}}>
                  {val.name_us.substring(0, 8)}
                </Text>
              </View>
            );
          }
        })}
        <Text style={stypes.Texttitle}>ตลาดค้าส่ง</Text>
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
            mode="dropdown"
            dropdownIconColor={'#fff'}
            // onValueChange={item => loaddatatype(item)}
            onValueChange={(value, index) => loaddatatype(value)}
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
      <Chenktyping />
    </View>
  );
};
export default HomeScreenUser;
const stypes = StyleSheet.create({
  icons: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  container: {
    flex: 1,
    // backgroundColor: '#DCDCDC',
  },
  Texttitle: {
    marginBottom: 0,
    marginTop: 0,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 60,
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
    // justifyContent: 'center',
    // alignItems: 'center',
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
