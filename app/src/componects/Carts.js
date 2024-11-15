import React, {useState, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import {Card, Searchbar} from 'react-native-paper';
import axios from 'axios';
import {url} from './../../ngrok';
import {useSelector, useDispatch} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {setidOrder, setMarketproduct} from '../redux/productSlice';
import {format} from 'date-fns';

const Carts = ({navigation}) => {
  const dispatch = useDispatch();

  const [onChangeSearch, setonChangeSearch] = useState('');
  const id_us = useSelector(state => state.auth.member);
  const [cartData, setcartData] = useState([]);
  const [status, setStatus] = useState('');

  const loadpurchase = id_us => {
    setRefreshing(true);
    axios.get(`${url}/loadPurchase/${id_us}`).then(item => {
      setcartData(item.data);
      setRefreshing(false);
    });
  };
  const todetaill = (id_order, item) => {
    dispatch(setMarketproduct({dataId_sal: item}));
    axios.get(`${url}/loadlistItem/${id_order}`).then(res => {
      dispatch(setidOrder({idOrder: res.data}));
      navigation.navigate('Detailpurchase');
    });
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadpurchase(id_us[0].id_us);
    console.log(cartData);
  }, [id_us, cartData]);
  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: '#00cc99',
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
          height: '15%',
          width: '100%',
          alignItems: 'center',
        }}>
        <Text style={stypes.Texttitle}>รายการรอยืนยัน</Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <Searchbar
          placeholder="ค้นหา"
          onChangeText={setonChangeSearch}
          style={{marginTop: 20, width: 300, borderRadius: 20}}
        />
      </View>

      <ScrollView
        style={{
          width: '85%',
          height: '65%',
          marginLeft: 30,
          marginRight: 30,
          marginTop: 15,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {cartData
          .filter(val => {
            if (onChangeSearch == '') {
              return val;
            } else if (
              val.nameMarket_sal
                .toLowerCase()
                .includes(onChangeSearch.toLowerCase())
            ) {
              return val;
            } else if (
              val.nameStatus
                .toLowerCase()
                .includes(onChangeSearch.toLowerCase())
            ) {
              return val;
            }
          })
          .map(item => {
            return (
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() => todetaill(item.id_order, item)}>
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
                      // backgroundColor: '#f2f2f2',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        height: 110,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{
                          uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profile%2F${item.profile_sal}?alt=media&token=689c880e-a865-4f6a-883a-d578a4e330cb`,
                        }}
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: 30,
                          marginLeft: 10,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'column-reverse',
                          marginLeft: 10,
                          width: 150,
                          padding: 10,
                        }}>
                        <Text style={{alignItems: 'center', marginLeft: 0}}>
                          {'เลขที่ใบสั่งชื้อ ' + item.id_order}
                        </Text>
                        <Text style={{alignItems: 'center', marginLeft: 0}}>
                          {'วันที่สั่ง ' +
                            format(new Date(item.date_order), 'dd-MM-yyyy')}
                        </Text>
                        <Text style={{alignItems: 'center', marginLeft: 0}}>
                          {'ร้าน ' + item.nameMarket_sal}
                        </Text>
                        <Text style={{alignItems: 'center', marginLeft: 0}}>
                          {'เป็นเงิน ' + item.sumPrice + 'บาท'}
                        </Text>
                        <Text style={{alignItems: 'center', marginLeft: 0}}>
                          {item.name_lock}
                        </Text>
                      </View>
                      <View style={{width: '40%'}}>
                        <Text
                          style={
                            item.nameStatus == 'รอการยืนยัน'
                              ? stypes.TextHaveSlip
                              : item.nameStatus == 'กรุณาอัพโหลดสลิป'
                              ? stypes.TextNoslip
                              : stypes.TextConfirm
                          }>
                          {item.nameStatus}
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
};
export default Carts;
const stypes = StyleSheet.create({
  Texttitle: {
    marginBottom: 0,
    alignItems: 'center',
    marginTop: 15,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  TextNoslip: {
    color: 'red',
    padding: 10,
    fontWeight: '800',
  },
  TextHaveSlip: {
    color: '#FF9F29',
    padding: 10,
    fontWeight: '800',
  },
  TextConfirm: {
    color: 'green',
    padding: 10,
    fontWeight: '800',
  },
});
