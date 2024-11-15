import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Table, Row, Rows} from 'react-native-table-component';
import {
  Button,
  Portal,
  Provider,
  Modal,
  IconButton,
  Colors,
} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import IoniconsBack from 'react-native-vector-icons/Ionicons';
import IconExit from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import {url} from './../../ngrok';
import DocumentPicker from 'react-native-document-picker';
import {format} from 'date-fns';

const Detailpurchase = ({navigation}) => {
  const containerStyle = {
    backgroundColor: 'white',
    height: 600,
    padding: 20,
  };
  const containerStyle2 = {
    backgroundColor: 'white',
    height: 300,
    padding: 20,
  };
  const [visible2, setVisible2] = useState(false);
  const showModal2 = () => setVisible2(true);
  const hideModal2 = () => setVisible2(false);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const itemList = useSelector(state => state.product.idOrder);
  const dataPurchase = useSelector(state => state.product.dataId_sal);
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
  const sumamont = () => {
    let sum = 0;
    for (const value of Object.values(itemList.map(val => val.totalPrice))) {
      sum += value;
      setSumAmount(sum);
    }
  };
  const [photo, setPhoto] = useState({
    name: null,
    type: null,
    uri: null,
  });

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
        // alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const updateSlip = () => {
    if (photo.name == undefined) {
      alert('กรุณาเพิ่มรูป');
    } else {
      const formdata = new FormData();
      formdata.append('id_order', dataPurchase.id_order);
      formdata.append('photo', {
        name: photo.name,
        type: photo.type,
        uri: photo.uri,
      });
      axios.put(`${url}/updateSlip`, formdata, {}).then(res => {
        if (res) {
          alert('อัพโหลดสำเร็จ');
          navigation.goBack();
        }
      });
    }
  };
  useEffect(() => {
    CheckTextConfirm();
    console.log(dataPurchase.status_order);
    sumamont();
    putData();
  }, [dataPurchase, itemList]);

  const CheckSlip = () => {
    if (itemList[0].image_slip == '') {
      return (
        <TouchableOpacity onPress={showModal2}>
          <Text
            style={{
              color: '#ff6600',
              fontSize: 17,
              fontWeight: '600',
              textDecorationLine: 'underline',
            }}>
            กรุณาอัพโหลด สลิป
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
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
      );
    }
  };
  const CheckTextConfirm = () => {
    if (dataPurchase.status_order == 2) {
      return (
        <View
          style={{
            alignItems: 'center',
            flex: 0.5,
            justifyContent: 'center',
          }}>
          <Text style={{color: 'red', fontSize: 20}}>รอการยืนยัน</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignItems: 'center',
            flex: 0.5,
            justifyContent: 'center',
          }}>
          <Text style={{color: 'red', fontSize: 20}}>กรุณามารับสินค้า</Text>
          <Text>กรุณมารับของภายใน2 วัน</Text>
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

          <Text style={{textAlign: 'center', fontSize: 25, fontWeight: '800'}}>
            รายละเอียดสินค้า
          </Text>

          <View style={styles.bodytextTitel2}>
            <Text style={styles.textTitel2}>{dataPurchase.name_lock}</Text>
            <Text style={styles.textTitel2}>
              {'ร้าน ' + dataPurchase.nameMarket_sal}
            </Text>
            <Text style={styles.textTitel2}>
              {'วันที่ ' +
                format(new Date(dataPurchase.date_order), 'dd-MM-yyyy')}
            </Text>
            <Text style={styles.textTitel2}>
              {'เบอร์โทรติดต่อ ' + dataPurchase.zipcode_sal}
            </Text>
          </View>

          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Row data={head} style={styles.head} textStyle={styles.text} />
            <Rows data={row} textStyle={styles.text} />
          </Table>
          <Text style={{textAlign: 'right', fontSize: 15}}>
            รวมเป็นเงิน {amont}
          </Text>
          <View style={{height: 'auto'}}>
            <CheckSlip />
          </View>
          {/* <View
            style={{
              alignItems: 'center',
              flex: 0.5,
              justifyContent: 'center',
            }}>
            <Text style={{color: 'red', fontSize: 20}}>รอการยืนยัน</Text>
            <Text>กรุณมารับของภายใน2 วัน</Text>
          </View> */}
          <CheckTextConfirm />
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
        <Portal>
          <Modal
            visible={visible2}
            onDismiss={hideModal2}
            contentContainerStyle={containerStyle2}>
            <View style={{alignItems: 'center'}}>
              <View>
                <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                  {'ธนาคาร ' + dataPurchase.bank_sal}
                </Text>
                <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                  {'เลขบัญชี ' + dataPurchase.accountnumber_sal}
                </Text>
              </View>

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
                    onPress={() => selectOneFile()}
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
                onPress={() => updateSlip()}>
                ยืนยัน
              </Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

export default Detailpurchase;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6},
  textTitel2: {fontSize: 15, fontWeight: '500'},
  bodytextTitel2: {
    flexDirection: 'column',
    flex: 0.2,
    justifyContent: 'center',
    marginBottom: 20,
  },
});
