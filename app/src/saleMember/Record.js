import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Ioniconscan from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import {Searchbar, Provider, Modal, Portal} from 'react-native-paper';
import axios from 'axios';
import {url} from './../../ngrok';
import {Card} from 'react-native-shadow-cards';
import {ScrollView} from 'react-native-gesture-handler';
import {Table, Row, Rows} from 'react-native-table-component';
import {format} from 'date-fns';

const Record = () => {
  const [userOrder, setUserorder] = useState([]);
  const PrfileImg = useSelector(state => state.auth.memberSal);
  const showModal = () => setVisibleEdit(true);
  const hideModal = () => setVisibleEdit(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [statuss, setstatuss] = useState('');
  const [amont, setSumAmount] = useState(0);
  const [row, setrow] = useState([]);
  const [onChangeSearch, setonChangeSearch] = useState('');
  const loadDataUserOrder = id_sal => {
    setRefreshing(true);
    axios.get(`${url}/loadUserOrderHistory/${id_sal}`).then(item => {
      setUserorder(item.data);

      setRefreshing(false);
    });
  };
  const containerStyle = {
    backgroundColor: 'white',
    height: 'auto',
    padding: 20,
  };
  const [head, sethead] = useState([
    'ชื้อสินค้า',
    'จำนวน',
    'ราคา',
    'หน่วย',
    'เป็นเงิน',
  ]);
  const loadhistoryDeteil = (id_order, statusname) => {
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
      console.log(statusname);

      setrow(value);
      setstatuss(statusname);
      showModal();
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

  return (
    <Provider>
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
          }}>
          <Text style={stypes.Texttitle}>ประวัติการขาย</Text>
          <Ioniconscan
            name="filetext1"
            size={40}
            color="#fff"
            style={{marginTop: 25, marginLeft: 20}}
          />
        </View>
        <View style={{alignItems: 'center', marginBottom: '5%'}}>
          <Searchbar
            placeholder="ค้นหา"
            onChangeText={setonChangeSearch}
            style={{marginTop: 20, width: 300, borderRadius: 20}}
          />
        </View>
        <ScrollView
          style={{marginBottom: '4%'}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {userOrder
            .filter(val => {
              if (onChangeSearch == '') {
                return val;
              } else if (
                val.name_us.toLowerCase().includes(onChangeSearch.toLowerCase())
              ) {
                return val;
              }
            })
            .map(item => (
              <View
                style={{
                  alignItems: 'center',
                  padding: 5,
                  borderRadius: 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    loadhistoryDeteil(item.id_order, item.statusname);
                  }}>
                  <View>
                    <Card
                      style={{
                        padding: 10,
                      }}>
                      <Text>
                        {'วันที่ ' +
                          format(new Date(item.date_order), 'dd-MM-yyyy')}
                      </Text>
                      <Text>{item.name_us}</Text>
                      <Text>{'เลขใบสั่งชื้อ ' + item.id_order}</Text>
                      <Text
                        style={
                          item.statusname == 'ยืนยันเเล้ว'
                            ? stypes.statusorder
                            : stypes.statusorder2
                        }>
                        {item.statusname}
                      </Text>
                    </Card>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
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
                <Text style={{textAlign: 'right'}}>
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
      </View>
    </Provider>
  );
};

export default Record;
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
  texttitel: {margin: 0, textAlign: 'center', fontSize: 13, fontWeight: '700'},
  text: {margin: 0, fontSize: 12},

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
