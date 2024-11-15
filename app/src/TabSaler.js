import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Homesale from './saleMember/HomeSale';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Record from './saleMember/Record';
import Information from './saleMember/Information';
import Alerts from './saleMember/Alerts';
import InsertProduct from './saleMember/InsertProduct';
import Report from './saleMember/Report';

import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import plus from './img/plus.png';
const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator();

const DrawerSale = ({navigation}) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Drawer.Screen name="หน้าหลัก" component={TabsSale} />
      <Drawer.Screen name="ข้อมูลส่วนตัว" component={Information} />
    </Drawer.Navigator>
  );
};
const TabsSale = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'หน้าหลัก') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'รายงาน') {
            iconName = focused ? 'receipt-sharp' : 'receipt-outline';
          } else if (route.name === 'ประวัติการขาย') {
            iconName = focused ? 'ios-newspaper' : 'ios-newspaper-outline';
          } else if (route.name === 'เเจ้งเตือน') {
            iconName = focused
              ? 'ios-notifications-sharp'
              : 'ios-notifications-outline';
          } else if (route.name === 'ข้อมูลส่วนตัว') {
            iconName = focused
              ? 'person-circle-outline'
              : 'person-circle-sharp';
          }

          return <Ionicons name={iconName} size={40} color={color} />;
        },
        // headerShown: false,
        tabBarActiveTintColor: '#ff3385',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {height: 70, justifyContent: 'center', padding: 1},
      })}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        labelStyle: {
          fontSize: 14,
          fontWeight: '700',
          padding: 5,
        },
      }}>
      <Tab.Screen
        name="หน้าหลัก"
        component={Homesale}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name="เเจ้งเตือน"
        component={Alerts}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name={'เพิ่ม'}
        component={InsertProduct}
        options={{
          tabBarIcon: ({focused}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Insertproduct')}>
              <View
                style={{
                  width: 55,
                  height: 55,
                  backgroundColor: '#ff3385',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: Platform.OS == 'android' ? 50 : 30,
                }}>
                <Image
                  source={plus}
                  style={{
                    width: 22,
                    height: 22,
                    tintColor: 'white',
                  }}></Image>
              </View>
            </TouchableOpacity>
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="ประวัติการขาย"
        component={Record}
        options={{unmountOnBlur: true}}
      />
      {/* <Tab.Screen name="ข้อมูลส่วนตัว" component={Information} /> */}
      <Tab.Screen name="รายงาน" component={Report} />
    </Tab.Navigator>
  );
};
export default DrawerSale;
