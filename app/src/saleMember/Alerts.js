import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import {Card, Searchbar} from 'react-native-paper';
import Ioniconscan from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {url} from './../../ngrok';
import {
  setidOrder_membersal,
  setMarketproduct_membersal,
} from '../redux/productSlice';
import {format} from 'date-fns';

const AlertsData = ({navigation}) => {
  const PrfileImg = useSelector(state => state.auth.memberSal);
  const dispatch = useDispatch();
  const [userOrder, setUserorder] = useState([]);
  const [onChangeSearch, setonChangeSearch] = useState('');

  const loadDataUserOrder = id_sal => {
    setRefreshing(true);
    axios.get(`${url}/loadUserOrder/${id_sal}`).then(item => {
      setUserorder(item.data);
      setRefreshing(false);
    });
  };

  const loadDatadetailUser = (id_order, item) => {
    console.log(id_order);
    dispatch(setMarketproduct_membersal({dataId_membersal: item}));
    axios.get(`${url}/loadUserbyid/${id_order}`).then(res => {
      console.log(res.data);
      dispatch(setidOrder_membersal({idOrder_membersal: res.data}));
      navigation.navigate('confirm');
    });
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    loadDataUserOrder(PrfileImg[0].id_sal);
    console.log(userOrder);
  }, [PrfileImg]);
  useEffect(() => {
    onRefresh();
  }, [PrfileImg]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 5, backgroundColor: '#FCDFEB'}}>
      <View
        style={{
          backgroundColor: '#ff3385',
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
          height: '15%',
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: '5%',
        }}>
        <Text style={stypes.Texttitle}>เเจ้งเตือน</Text>
        <Ioniconscan
          name="notifications-sharp"
          size={40}
          color="#fff"
          style={{marginTop: 25, marginLeft: 20}}
        />
      </View>

      <View style={{alignItems: 'center', marginBottom: '5%'}}>
        <Searchbar
          placeholder="ค้นหา"
          onChangeText={setonChangeSearch}
          style={{marginTop: 0, width: 300, borderRadius: 20}}
        />
      </View>

      <ScrollView
        style={{marginBottom: '0%'}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flex: 1}}>
          {userOrder
            .filter(val => {
              if (onChangeSearch == '') {
                return val;
              } else if (
                val.nameStatus
                  .toLowerCase()
                  .includes(onChangeSearch.toLowerCase())
              ) {
                return val;
              } else if (
                val.name_us.toLowerCase().includes(onChangeSearch.toLowerCase())
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
                    marginTop: 0,
                  }}>
                  <TouchableOpacity
                    style={{width: '90%'}}
                    onPress={() => loadDatadetailUser(item.id_order, item)}>
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
                        padding: 5,
                      }}
                      key={item.key}>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 100,
                          alignItems: 'center',
                        }}>
                        <Image
                          source={{
                            uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profileUser%2F${item.profile_us}?alt=media&token=f342a587-f2a1-4c7a-9e6f-279bd7972053`,
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
                            flexDirection: 'row',
                            marginLeft: 10,
                            width: 100,
                          }}>
                          <View style={{width: 180}}>
                            <Text style={{fontSize: 15}}>
                              {format(new Date(item.date_order), 'dd-MM-yyyy')}
                            </Text>
                            <Text style={{fontSize: 15}}>{item.name_us}</Text>
                            <Text style={{fontSize: 15}}>
                              {'เลขใบสั่งชื้อ ' + item.id_order}
                            </Text>
                            <Text style={{fontSize: 15}}>
                              {'รวมเป็นเงิน ' + item.sumPrice + 'บาท'}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: '100%',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={
                                item.nameStatus == 'รอการยืนยัน'
                                  ? stypes.TextHaveSlip
                                  : item.nameStatus == 'ยังไม่ได้อัพสลิป'
                                  ? stypes.TextNoslip
                                  : stypes.TextConfirm
                              }>
                              {item.nameStatus}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};
export default AlertsData;
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
    padding: 0,
    fontWeight: '800',
  },
  TextHaveSlip: {
    color: '#FF9F29',
    padding: 0,
    fontWeight: '800',
  },
  TextConfirm: {
    color: 'green',
    padding: 10,
    fontWeight: '800',
  },
});
