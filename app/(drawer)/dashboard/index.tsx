import useUserStore from '@/store/user.store';
import React from 'react';
import { Text, View } from 'react-native';

export default function FirstPage() {
    const {user} = useUserStore()
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text> dashbaord </Text>
      <Text>name: {user?.fullname || "no user"} </Text>
      <Text>name: {user?.branch || "no user"} </Text>
      <Text>name: {user?.role || "no user"} </Text>
    </View>
  );
}
