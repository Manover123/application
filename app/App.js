import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/componects/Login';
import Register from './src/componects/Register';
import Detailstore from './src/componects/Detailstore';
import DetailMarket from './src/componects/DetailMarket';
import Listproduct from './src/componects/ListProduct';
import Tab from './src/Tabs';
import TabSaler from './src/TabSaler';
import Insertproduct from './src/saleMember/InsertProduct';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
import Loginmembersal from './src/saleMember/LoginMemberSal';
import HomeTest from './src/componects/Home';
import DetailTest from './src/componects/DetailMarket_Nouser';
import Detailpurchase from './src/componects/Detailpurchase';
import confirm from './src/saleMember/confirm';
import Profile from './src/componects/Profile';
import TabsTest from './src/TabsTest';
import Information from './src/saleMember/Information';

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="HomeTest">
      <HomeStack.Screen name="HomeTest" component={HomeTest} />
      <HomeStack.Screen name="confirm" component={confirm} />
      <HomeStack.Screen name="Information" component={Information} />
      <HomeStack.Screen name="Detailpurchase" component={Detailpurchase} />
      <HomeStack.Screen name="DetailTest" component={DetailTest} />
      <HomeStack.Screen name="Login" component={Login} />
      {/* <HomeStack.Screen name="Loginmembersal" component={Loginmembersal} /> */}
      <HomeStack.Screen name="Register" component={Register} />
      <HomeStack.Screen name="Home" component={Tab} />
      {/* <HomeStack.Screen name="Detailstore" component={Detailstore} />
      <HomeStack.Screen name="DetailMarket" component={DetailMarket} />
      <HomeStack.Screen name="Listproduct" component={Listproduct} /> */}
      <HomeStack.Screen name="TabSaler" component={TabSaler} />
      <HomeStack.Screen name="Insertproduct" component={Insertproduct} />
      {/* <HomeStack.Screen name="Profile" component={Profile} /> */}
    </HomeStack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <HomeStackScreen />
      </Provider>
    </NavigationContainer>
  );
}
