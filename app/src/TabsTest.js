import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BottomNavigation, Text} from 'react-native-paper';
import HomeScreenUser from './componects/HomeScreenUser';
import Carts from './componects/Carts';
import PurchaseHistory from './componects/PurchaseHistory';
import Profile from './componects/Profile';

const TabsTest = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'HomeUser', title: 'หน้าหลัก', icon: 'queue-music'},
    {key: 'carts', title: 'ตะกร้า', icon: 'album'},
    {key: 'purchaseHistory', title: 'ประวัติการชื้อ', icon: 'history'},
    {key: 'profile', title: 'ข้อมูลส่วนตัว', icon: 'history'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    HomeUser: HomeScreenUser,
    carts: Carts,
    purchaseHistory: PurchaseHistory,
    profile: Profile,
  });
  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

const styles = StyleSheet.create({});

export default TabsTest;
