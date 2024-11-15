import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carts from './componects/Carts';
import Profile from './componects/Profile';
import HomeScreenUser from './componects/HomeScreenUser';
import PurchaseHistory from './componects/PurchaseHistory';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailMarket from './componects/DetailMarket';
import Listproduct from './componects/ListProduct';
import Detailpurchase from './componects/Detailpurchase';
import ReportUser from './componects/ReportUser';

const HomeTabs = createNativeStackNavigator();
const HomeTABS = () => {
  return (
    <HomeTabs.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="HomeScreenUser">
      <HomeTabs.Screen name="HomeScreenUser" component={HomeScreenUser} />
      <HomeTabs.Screen name="DetailMarket" component={DetailMarket} />
      <HomeTabs.Screen name="Listproduct" component={Listproduct} />
      <HomeTabs.Screen name="Profile" component={Profile} />
    </HomeTabs.Navigator>
  );
};

const CartStack = createNativeStackNavigator();
const CartTABS = () => {
  return (
    <CartStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Carts">
      <CartStack.Screen name="Carts" component={Carts} />
      <CartStack.Screen name="Detailpurchase" component={Detailpurchase} />
    </CartStack.Navigator>
  );
};

const PurchaseHistoryStack = createNativeStackNavigator();
const PurchaseHistoryTABS = () => {
  return (
    <PurchaseHistoryStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="PurchaseHistory">
      <PurchaseHistoryStack.Screen
        name="PurchaseHistory"
        component={PurchaseHistory}
      />
      <PurchaseHistoryStack.Screen
        name="Detailpurchase"
        component={Detailpurchase}
      />
    </PurchaseHistoryStack.Navigator>
  );
};
const Tab = createBottomTabNavigator();
const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'หน้าหลัก') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ตะกร้า') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ประวัติการชื้อ') {
            iconName = focused ? 'ios-newspaper' : 'ios-newspaper-outline';
          } else if (route.name === 'รายงาน') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'ข้อมูลส่วนตัว') {
            iconName = focused
              ? 'person-circle-outline'
              : 'person-circle-sharp';
          }
          return <Ionicons name={iconName} size={40} color={color} />;
        },
        tabBarActiveTintColor: '#23483C',
        tabBarInactiveTintColor: '#52A78D',
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
        component={HomeTABS}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name="ตะกร้า"
        component={CartTABS}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name="ประวัติการชื้อ"
        component={PurchaseHistory}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name="รายงาน"
        component={ReportUser}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name="ข้อมูลส่วนตัว"
        component={Profile}
        options={{unmountOnBlur: true}}
      />
    </Tab.Navigator>
  );
};
export default Tabs;
