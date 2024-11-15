import React from 'react';

import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

const Detailstore = ({navigation}) => {
  return (
    <View>
      <View style={{flex: 1, alignItems: 'center', }}>
        <Text> Detailstore</Text>
      </View>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};
export default Detailstore;
const stypes = StyleSheet.create({});
