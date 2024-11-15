import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Ioniconscan from 'react-native-vector-icons/AntDesign';
import DateIcon from 'react-native-vector-icons/Fontisto';
import IconPDF from 'react-native-vector-icons/AntDesign';
import {Table, Row, Rows} from 'react-native-table-component';
import axios from 'axios';
import {url} from '../../ngrok';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {format, set} from 'date-fns';
import thai from 'date-fns/locale/th';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Report = () => {
  const PrfileImg = useSelector(state => state.auth.memberSal);
  const [state, setstate] = useState('');

  const [report, setReport] = useState([]);
  const [reportStr, setReportStr] = useState('');
  const [row, setrow] = useState([]);
  const [amont, setSumAmount] = useState(0);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] = useState(false);
  const [dates, setDate] = useState('');
  const [datesEnd, setDateEnd] = useState('');
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePickerEnd = () => {
    setDatePickerVisibilityEnd(true);
  };

  const hideDatePickerEnd = () => {
    setDatePickerVisibilityEnd(false);
  };

  const handleConfirm = date => {
    let year = JSON.stringify(date).slice(1, 5);
    let month = JSON.stringify(date).slice(6, 8);
    let day = JSON.stringify(date).slice(9, 11);
    setDate(year + '-' + month + '-' + day);
    hideDatePicker();
  };
  const handleConfirmEnd = date => {
    let year = JSON.stringify(date).slice(1, 5);
    let month = JSON.stringify(date).slice(6, 8);
    let day = JSON.stringify(date).slice(9, 11);
    setDateEnd(year + '-' + month + '-' + day);
    hideDatePickerEnd();
  };

  const confirmSaerch = () => {
    setSumAmount(0);
    // console.log(dates, datesEnd, PrfileImg[0].id_sal);
    axios
      .post(`${url}/reportMember`, {
        dateStart: dates,
        dateEnd: datesEnd,
        id_sal: PrfileImg[0].id_sal,
      })
      .then(res => {
        if (res) {
          setReport(res.data);
        }
      });
  };

  const [head, sethead] = useState([
    'วันที่',
    'เลขใบสั่งชื้อ',
    'จำนวนสินค้า',
    'ราคารวม',
  ]);

  const putData = () => {
    let value = [];
    for (let i = 0; i < report.length; i++) {
      value.push([
        format(new Date(report[i].date_order), 'dd-MM-yyyy'),
        report[i].id_order,
        report[i].sumIdorder,
        report[i].Totalsum,
      ]);
    }
    setrow(value);
  };
  const sumamont = () => {
    let sum = 0;
    for (const value of Object.values(report.map(val => val.Totalsum))) {
      sum += value;
      setSumAmount(sum);
    }
  };

  let mapObj = '';
  const createRow = () => {
    const RowDataReport = () => {
      report.map((v, i) => {
        mapObj =
          mapObj +
          `<tr>
             <td><span>${format(
               new Date(v.date_order),
               'dd-MM-yyyy',
             )}</span></td>
            <td><span>${v.id_order}</span></td>
            <td><span>${v.sumIdorder}</span></td>
            <td><span>${v.Totalsum}</span></td>
        
           
          </tr>`;
      });
    };
    RowDataReport();
  };

  const headReport = `<html>
          <head>
            <meta charset="utf-8">
            <title>รายงานยอดขาย</title>
            <style>
              ${htmlStyles}
            </style>
          </head>
          <body>
            <header>
              <h1>รายงานยอดขาย</h1>
              <address>
              </address>
            </header>
            <article>
              <h1>Recipient</h1>
              <address>
              </address>
              <table class="meta">
                <tr>
                  <th><span>วันที่</span></th>
                  <td><span>${format(new Date(), 'PPPP', {
                    locale: thai,
                  })}</span></td>
                </tr>
              </table>
              <table class="inventory">
                <thead>
                  <tr>
                    <th><span>วันที่</span></th>
                    <th><span>เลขที่ใบสั่งชื้อ</span></th>
                    <th><span>จำนวนสินค้า</span></th>
                    <th><span>ราคารวม</span></th>
               
                  </tr>
                </thead>
                <tbody>`;
  const footReport = `
              </tbody>
              </table>
              <table class="balance">
                <tr>
                  <th><span>รวมเป็นเงิน</span></th>
                  <td><span data-prefix>$</span><span>${amont}</span></td>
                </tr>  
              </table>
            </article>
          </body>
        </html>`;

  const createPDF = async () => {
    let options = {
      html: reportStr,
      fileName: 'report' + new Date(),
      directory: 'Downloads',
    };

    let file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);
    Alert.alert('ดาวโลหดเรียบร้อยเเล้ว', file.filePath, [{text: 'ตกลง'}]);
  };

  useEffect(() => {
    putData();
    sumamont();
    createRow();
    setReportStr(headReport + mapObj + footReport);
  }, [report, reportStr]);

  return (
    <View style={{flex: 1, backgroundColor: '#FCDFEB'}}>
      <View
        style={{
          backgroundColor: '#ff3385',
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
          height: '15%',
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: '#fff',
              }}>
              รายงาน
              {/* <Ioniconscan name="filetext1" size={30} color="#fff" /> */}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 0.5,
          alignItems: 'center',
          marginTop: '10%',
        }}>
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              width: '100%',
              height: '100%',
              flexDirection: 'row',
            }}>
            <View style={{flexDirection: 'row', padding: 5}}>
              <View
                style={{
                  width: 120,
                  height: 50,
                  backgroundColor: '#fff',
                  borderBottomLeftRadius: 20,
                  borderTopLeftRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 50,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <TextInput
                  placeholder="MM/YYYY"
                  defaultValue={dates}
                  onChangeText={setDate}
                  onKeyPress={hideDatePicker}
                  style={{padding: 10, marginLeft: 20}}></TextInput>
              </View>

              <Button
                mode="contained"
                onPress={showDatePicker}
                // onPress={() => confirmSaerch()}
                color="#FF7396"
                labelStyle={{fontSize: 18, fontWeight: '700'}}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomRightRadius: 20,
                  borderTopRightRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 50,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <DateIcon name="date" color={'#fff'} size={20} />
              </Button>
            </View>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>ถึง</Text>
            <View style={{flexDirection: 'row', padding: 10}}>
              <View
                style={{
                  width: 120,
                  height: 50,
                  backgroundColor: '#fff',
                  borderBottomLeftRadius: 20,
                  borderTopLeftRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 50,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <TextInput
                  placeholder="MM/YYYY"
                  defaultValue={datesEnd}
                  onChangeText={setDateEnd}
                  onKeyPress={hideDatePickerEnd}
                  style={{padding: 10, marginLeft: 20}}></TextInput>
              </View>

              <Button
                mode="contained"
                onPress={showDatePickerEnd}
                color="#FF7396"
                labelStyle={{fontSize: 18, fontWeight: '700'}}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomRightRadius: 20,
                  borderTopRightRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 50,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <DateIcon name="date" color={'#fff'} size={20} />
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '60%',
          marginTop: '50%',
        }}>
        <View style={{alignItems: 'center', marginBottom: '5%'}}>
          <Button
            onPress={confirmSaerch}
            style={{backgroundColor: '#F4E06D'}}
            icon="calendar-search"
            size={20}
            labelStyle={{fontSize: 18, fontWeight: '700'}}
            mode="contained">
            ค้นหา
          </Button>
        </View>
        <View style={stypes.container}>
          <ScrollView>
            <Table
              borderStyle={{
                borderWidth: 2,
                borderColor: '#c8e1ff',
              }}>
              <Row data={head} style={stypes.head} textStyle={stypes.text} />
              <Rows data={row} textStyle={stypes.text} />
            </Table>
          </ScrollView>
          <View
            style={{
              justifyContent: 'center',
              height: '20%',
            }}>
            <Text style={{textAlign: 'right', fontSize: 17}}>
              รวมเป็นเงิน {amont} บาท
            </Text>
          </View>
          <View style={{alignItems: 'flex-end', marginTop: 10}}>
            <TouchableOpacity onPress={() => createPDF()}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: '#0066ff',
                    textDecorationLine: 'underline',
                  }}>
                  ดาวโหลด
                </Text>
                <IconPDF color={'#0066ff'} name="pdffile1" size={17} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisibleEnd}
        mode="date"
        onConfirm={handleConfirmEnd}
        onCancel={hideDatePickerEnd}
      />
    </View>
  );
};

export default Report;
const stypes = StyleSheet.create({
  container: {flex: 1.5, padding: 15, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 2},
  textTitel2: {fontSize: 16, fontWeight: '500'},
  bodytextTitel2: {
    flexDirection: 'column',
    flex: 0.2,
    justifyContent: 'center',
    marginBottom: 20,
  },
});

const htmlStyles = `
*{
  border: 0;
  box-sizing: content-box;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}
h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }
/* table */
table { font-size: 75%; table-layout: fixed; width: 100%; }
table { border-collapse: separate; border-spacing: 2px; }
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
th, td { border-radius: 0.25em; border-style: solid; }
th { background: #EEE; border-color: #BBB; }
td { border-color: #DDD; }
/* page */
html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; }
html { background: #999; cursor: default; }
body { box-sizing: border-box;margin: 0 auto; overflow: hidden; padding: 0.25in; }
body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }
/* header */
header { margin: 0 0 3em; }
header:after { clear: both; content: ""; display: table; }
header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
header address p { margin: 0 0 0.25em; }
header span, header img { display: block; float: right; }
header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
header img { max-height: 100%; max-width: 100%; }
/* article */
article, article address, table.meta, table.inventory { margin: 0 0 3em; }
article:after { clear: both; content: ""; display: table; }
article h1 { clip: rect(0 0 0 0); position: absolute; }
article address { float: left; font-size: 125%; font-weight: bold; }
/* table meta & balance */
table.meta, table.balance { float: right; width: 36%; }
table.meta:after, table.balance:after { clear: both; content: ""; display: table; }
/* table meta */
table.meta th { width: 40%; }
table.meta td { width: 60%; }
/* table items */
table.inventory { clear: both; width: 100%; }
table.inventory th { font-weight: bold; text-align: center; }
table.inventory td:nth-child(1) { width: 26%; }
table.inventory td:nth-child(2) { width: 38%; }
table.inventory td:nth-child(3) { text-align: right; width: 12%; }
table.inventory td:nth-child(4) { text-align: right; width: 12%; }
table.inventory td:nth-child(5) { text-align: right; width: 12%; }
/* table balance */
table.balance th, table.balance td { width: 50%; }
table.balance td { text-align: right; }
/* aside */
aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
aside h1 { border-color: #999; border-bottom-style: solid; }
`;
