import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Card, Button, Colors} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Fontisto';
import Confirm from 'react-native-vector-icons/Fontisto';
import IoniconsBack from 'react-native-vector-icons/Ionicons';
import NumericInput from 'react-native-numeric-input';
import {useSelector} from 'react-redux';

const DetailMarket = ({navigation}) => {
  const id_usale = useSelector(state => state.auth.user);
  const id_mk = useSelector(state => state.auth.memberSal);
  useEffect(() => {}, []);
  const loadDataMarket = () =>
    Alert.alert('คุณยังไม่ได้เข้าสู่ระบบ', 'คุณต้องการเข้าสู่ระบบหรือไม่', [
      {
        text: 'ไม่',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'ตกลง', onPress: () => navigation.navigate('Login')},
    ]);

  useEffect(() => {}, [id_usale, id_mk]);

  return (
    <View style={{flex: 5, backgroundColor: '#E7F3EF'}}>
      {id_mk.map(val => {
        if (val === null) {
          console.log('กำลังโหลด');
        } else {
          return (
            <View
              style={{
                backgroundColor: '#00cc99',
                borderBottomRightRadius: 30,
                borderBottomLeftRadius: 30,
                height: '28%',
              }}>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
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
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: 30,
                      marginLeft: 20,
                    }}
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
                  email{'    ' + val.email_sal}
                </Text>
                <Text style={stypes.subTexttitle}>
                  เบอร์โทร{'    ' + val.zipcode_sal}
                </Text>
              </View>
            </View>
          );
        }
      })}
      <ScrollView
        style={{
          width: '100%',
          height: '65%',
          marginTop: 20,
        }}>
        {id_usale.map(item => {
          if (item === null) {
            console.log('ไม่มีข้อมูล');
          } else {
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
                      height: 460,
                    }}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 25,
                          fontWeight: 'bold',
                          marginLeft: 10,
                          marginTop: 10,
                        }}>
                        {item.name_product}
                      </Text>
                      <Text
                        style={{
                          color: '#093426',
                          fontWeight: 'bold',
                          fontSize: 20,
                          marginLeft: 10,
                          marginTop: 10,
                          textDecorationLine: 'underline',
                        }}>
                        ราคา {item.price_product} บาท ต่อ
                        {'  ' + item.unit_product}
                      </Text>
                    </View>
                    <Image
                      source={{
                        uri: `https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/product%2F${item.image_Product}?alt=media&token=03451e25-c6b6-4882-bd71-fec66364fff1`,
                      }}
                      style={{
                        width: '90%',
                        height: '66%',
                        borderRadius: 1,
                        marginTop: 10,
                        marginLeft: 10,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 20,
                        marginLeft: 20,
                      }}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: 'bold',
                          marginTop: 12,
                        }}>
                        จำนวน
                      </Text>
                      <View style={{marginLeft: 10}}>
                        <NumericInput
                          onChange={num => {
                            console.log(num);
                          }}
                          totalWidth={110}
                          totalHeight={40}
                          inputStyle={{
                            fontSize: 18,
                            color: '#434A5E',
                            fontWeight: 'bold',
                          }}
                          step={1}
                          minValue={0}
                          valueType="real"
                          rounded
                          textColor="#B0228C"
                          iconStyle={{color: '#001a13'}}
                          rightButtonBackgroundColor="#00e6a8"
                          leftButtonBackgroundColor="#00e6a8"
                        />
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
                    </View>
                  </View>
                </Card>
                <Button
                  mode="contained"
                  color="#23483C"
                  labelStyle={{fontSize: 30, fontWeight: 'bold', color: '#fff'}}
                  style={{
                    height: 60,
                    width: '100%',
                  }}
                  onPress={loadDataMarket}>
                  สั่งจอง
                  <Ionicons name="shopping-basket" size={30} color="#fff" />
                </Button>
              </View>
            );
          }
        })}
      </ScrollView>
    </View>
  );
};

export default DetailMarket;
const stypes = StyleSheet.create({
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
