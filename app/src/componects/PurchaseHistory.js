import {Searchbar, Provider, Modal, Portal} from 'react-native-paper';
import {Card} from 'react-native-shadow-cards';
import {useSelector, useDispatch} from 'react-redux';
import {Table, Row, Rows} from 'react-native-table-component';
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {url} from './../../ngrok';
import {format} from 'date-fns';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';

const PurchaseHistory = ({navigation}) => {
  const showModal = () => setVisibleEdit(true);
  const hideModal = () => setVisibleEdit(false);
  const [visibleEdit, setVisibleEdit] = useState(false);

  const [cartData, setcartData] = useState([]);
  const [lisitem, setlisitem] = useState('');
  const [amont, setSumAmount] = useState(0);
  const [statuss, setstatuss] = useState('');
  const [row, setrow] = useState([]);
  const id_us = useSelector(state => state.auth.member);
  const [onChangeSearch, setonChangeSearch] = useState('');

  const containerStyle = {
    backgroundColor: 'white',
    height: 'auto',
    padding: 20,
  };

  const loadpurchase = async id_us => {
    setRefreshing(true);
    axios.get(`${url}/loadPurchasHistory/${id_us}`).then(item => {
      setcartData(item.data);
      setRefreshing(false);
    });
  };
  const [head, sethead] = useState([
    'ชื้อสินค้า',
    'จำนวน',
    'ราคา',
    'หน่วย',
    'เป็นเงิน',
  ]);
  const loadhistoryDeteil = (id_order, item) => {
    console.log(id_order);
    axios.get(`${url}/loadlistItem/${id_order}`).then(res => {
      let value = [];
      for (let i = 0; i < res.data.length; i++) {
        value.push([
          res.data[i].name_product,
          res.data[i].qty,
          res.data[i].old_price,
          res.data[i].unit_product,
          res.data[i].totalPrice,
        ]);
      }
      let sum = 0;
      for (const totalPrice of Object.values(
        res.data.map(val => val.totalPrice),
      )) {
        sum += totalPrice;
        setSumAmount(sum);
      }
      setrow(value);
      setstatuss(item.namestatus);
      setlisitem(item);
      showModal();
    });
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // loadpurchase();
    loadpurchase(id_us[0].id_us);
    console.log(cartData);
  }, [id_us]);
  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Provider>
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
          <Text style={stypes.Texttitle}>ประวัติการชื้อ</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Searchbar
            placeholder="ค้นหา "
            onChangeText={setonChangeSearch}
            style={{marginTop: 20, width: 300, borderRadius: 20}}
          />
        </View>
        <ScrollView
          style={{marginTop: 20}}
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
                val.date_order
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
                    marginBottom: 5,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      loadhistoryDeteil(item.id_order, item);
                    }}>
                    <View style={{alignItems: 'center'}}>
                      <Card style={{padding: 10, marginTop: 10}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                          {'เลขที่ใบสั่งชื้อ ' + item.id_order}
                        </Text>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                          วันที่ชื้อ..
                          {format(new Date(item.date_order), 'dd-MM-yyyy')}
                        </Text>
                        <Text style={{fontSize: 17, fontWeight: '700'}}>
                          {' ร้าน ' + item.nameMarket_sal}
                        </Text>
                        <Text
                          style={
                            item.namestatus == 'ยืนยันเเล้ว'
                              ? stypes.statusorder
                              : stypes.statusorder2
                          }>
                          {item.namestatus}
                        </Text>
                      </Card>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
      </View>
      <Portal>
        <Modal
          visible={visibleEdit}
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
              รายละเอียด
            </Text>

            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                marginBottom: 15,
              }}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                {lisitem && format(new Date(lisitem.date_order), 'dd-MM-yyyy')}
              </Text>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                {'ร้าน ' + lisitem.nameMarket_sal}
              </Text>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                {lisitem.name_lock}
              </Text>
            </View>

            <Table borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
              <Row
                data={head}
                style={stypes.head}
                textStyle={stypes.texttitel}
              />
              <Rows data={row} textStyle={stypes.text} />
            </Table>
            <View
              style={{
                flexDirection: 'column',
                marginTop: 20,
                alignItems: 'flex-end',
                width: '100%',
              }}>
              <Text
                style={{textAlign: 'right', fontSize: 16, fontWeight: '700'}}>
                {'รวมเป็นเงิน ' + amont + '฿'}
              </Text>
            </View>
            <Text
              style={
                statuss == 'ยืนยันเเล้ว'
                  ? stypes.statusorder
                  : stypes.statusorder2
              }>
              {statuss}
            </Text>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};
export default PurchaseHistory;
const stypes = StyleSheet.create({
  Texttitle: {
    marginBottom: 0,
    alignItems: 'center',
    marginTop: 15,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  container: {flex: 1, padding: 5, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 35, backgroundColor: '#f1f8ff', width: 320},
  texttitel: {margin: 0, textAlign: 'center', fontSize: 15, fontWeight: '700'},
  text: {margin: 0, fontSize: 14, textAlign: 'center'},
  statusorder: {
    textAlign: 'center',
    color: 'green',
    fontWeight: '700',
    color: 'green',
    fontSize: 15,
  },
  statusorder2: {
    textAlign: 'center',
    color: 'green',
    fontWeight: '700',
    color: 'red',
    fontSize: 15,
  },
});
