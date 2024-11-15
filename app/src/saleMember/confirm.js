import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Table, Row, Rows} from 'react-native-table-component';
import {useSelector} from 'react-redux';
import IoniconsBack from 'react-native-vector-icons/Ionicons';
import IconExit from 'react-native-vector-icons/Entypo';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Portal, Provider, Modal} from 'react-native-paper';
import axios from 'axios';
import {url} from './../../ngrok';
const confirm = ({navigation}) => {
  const [idproduct, setidproduct] = useState([]);
  const [updateNum, setUpdateNum] = useState([]);
  const containerStyle = {
    backgroundColor: 'white',
    height: 600,
    padding: 20,
  };
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const itemList = useSelector(state => state.product.idOrder_membersal);
  const dataPurchase = useSelector(state => state.product.dataId_membersal);
  const [head, sethead] = useState([
    'ชื้อสินค้า',
    'จำนวน',
    'ราคา',
    'หน่วย',
    'เป็นเงิน',
  ]);
  const [row, setrow] = useState([]);
  const [amont, setSumAmount] = useState(0);
  const putData = () => {
    let value = [];
    for (let i = 0; i < itemList.length; i++) {
      value.push([
        itemList[i].name_product,
        itemList[i].qty,
        itemList[i].old_price,
        itemList[i].unit_product,
        itemList[i].totalPrice,
      ]);
    }
    setrow(value);
  };
  const updateStok = () => {
    let dataUpdate = [];
    const num = itemList.map(val => val.qty);
    const sumnum = itemList.map(val => val.number_product);
    for (let i = 0; i < sumnum.length; i++) {
      dataUpdate.push(sumnum[i] + num[i]);
    }
    setUpdateNum(dataUpdate);
  };
  const confirm = id_order => {
    console.log(idproduct, updateNum);
    Alert.alert('คุณต้องการยืนยันข้อมูลนี้หรือไม่', '', [
      {
        text: 'ตกลง',
        onPress: () =>
          axios
            .put(`${url}/comfirmorder/${id_order}`, {
              // idporDuct: idproduct,
              // itemUpdate: updateNum,
            })
            .then(res => {
              navigation.goBack();
            }),
      },
      {text: 'ไม่ตกลง', onPress: () => console.log('Cancel Pressed')},
    ]);
  };

  const Succeedorder = id_order => {
    Alert.alert('คุณต้องการยืนยันข้อมูลนี้หรือไม่', '', [
      {
        text: 'ตกลง',
        onPress: () =>
          axios.get(`${url}/succeedorder/${id_order}`).then(res => {
            navigation.goBack();
          }),
      },
      {text: 'ไม่ตกลง', onPress: () => console.log('Cancel Pressed')},
    ]);
  };
  const cancel = id_order => {
    Alert.alert('คุณต้องการยกเลิกออเด้อนี้หรือไม่', '', [
      {
        text: 'ตกลง',
        onPress: () =>
          axios
            .put(`${url}/cancelOrder/${id_order}`, {
              idporDuct: idproduct,
              itemUpdate: updateNum,
            })
            .then(res => {
              navigation.goBack();
            }),
      },
      {text: 'ไม่ตกลง', onPress: () => console.log('Cancel Pressed')},
    ]);
  };
  const sumamont = () => {
    let sum = 0;
    for (const value of Object.values(itemList.map(val => val.totalPrice))) {
      sum += value;
      setSumAmount(sum);
    }
  };

  useEffect(() => {
    sumamont();
    updateStok();
    CheckStatuslastTime();
    setidproduct(itemList.map(val => val.id_product));

    putData();
  }, [dataPurchase, itemList]);

  const CheckStatuslastTime = () => {
    if (dataPurchase.status_order == 3) {
      return (
        <View
          style={{
            alignItems: 'center',
            flex: 0.7,
            justifyContent: 'center',
          }}>
          <Button
            icon="checkbox-marked-circle"
            mode="contained"
            color="green"
            style={{width: 200}}
            labelStyle={{fontSize: 20, fontWeight: '800'}}
            onPress={() => Succeedorder(dataPurchase.id_order)}>
            รับของเเล้ว
          </Button>
          <Button
            icon="file-cancel-outline"
            mode="contained"
            color="red"
            style={{width: 200, marginTop: 20}}
            labelStyle={{fontSize: 20, fontWeight: '800'}}
            onPress={() => cancel(dataPurchase.id_order)}>
            ยกเลิก
          </Button>
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignItems: 'center',
            flex: 0.7,
            justifyContent: 'center',
          }}>
          <Button
            icon="checkbox-marked-circle"
            mode="contained"
            color="green"
            style={{width: 200}}
            labelStyle={{fontSize: 20, fontWeight: '800'}}
            onPress={() => confirm(dataPurchase.id_order)}>
            ยืนยัน
          </Button>
          <Button
            icon="file-cancel-outline"
            mode="contained"
            color="red"
            style={{width: 200, marginTop: 20}}
            labelStyle={{fontSize: 20, fontWeight: '800'}}
            onPress={() => cancel(dataPurchase.id_order)}>
            ยกเลิก
          </Button>
        </View>
      );
    }
  };
  return (
    <Provider>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IoniconsBack name="arrow-back" size={40} />
          </TouchableOpacity>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 25,
              fontWeight: '800',
              marginBottom: 20,
            }}>
            รายละเอียดสินค้า
          </Text>
          <View style={styles.bodytextTitel2}>
            <Text style={styles.textTitel2}>
              {'ชื่อ ' + dataPurchase.name_us}
            </Text>
            <Text style={styles.textTitel2}>
              {'วันที่ ' + dataPurchase.date_order.slice(0, 10)}
            </Text>
            <Text style={styles.textTitel2}>
              {' ' + dataPurchase.name_lock}
            </Text>
          </View>
          <ScrollView style={{flex: 1}}>
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
              <Row data={head} style={styles.head} textStyle={styles.text} />
              <Rows data={row} textStyle={styles.text} />
            </Table>
          </ScrollView>
          <View style={{height: 'auto', justifyContent: 'center'}}>
            <Text style={{textAlign: 'right', fontSize: 18}}>
              รวมเป็นเงิน {amont} บาท
            </Text>
          </View>
          <View style={{height: 'auto', marginTop: 20, marginBottom: '10%'}}>
            <TouchableOpacity onPress={showModal}>
              <Text
                style={{
                  color: '#0066ff',
                  fontSize: 17,
                  fontWeight: '600',
                  textDecorationLine: 'underline',
                }}>
                หลักฐานการโอนเงิน
              </Text>
            </TouchableOpacity>
          </View>
          <CheckStatuslastTime />
        </View>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <View style={{height: 60}}>
                <TouchableOpacity onPress={hideModal}>
                  <IconExit name="cross" size={40} />
                </TouchableOpacity>
              </View>

              <Image
                source={{
                  uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/slip%2F${itemList[0].image_slip}?alt=media&token=cded907c-4396-4748-aeda-6e1cdb49ac26`,
                }}
                style={{
                  width: '85%',
                  height: '85%',
                }}
              />
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

export default confirm;

const styles = StyleSheet.create({
  container: {flex: 0.8, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6},
  textTitel2: {fontSize: 16, fontWeight: '500'},
  bodytextTitel2: {
    flexDirection: 'column',
    flex: 0.2,
    justifyContent: 'center',
    marginBottom: 20,
  },
});
