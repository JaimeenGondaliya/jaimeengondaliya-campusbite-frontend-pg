import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import Registration from '../screens/Registration';
import Display from '../screens/Display';
import {StudentData} from '../types/Student';

export type RootStackParamList = {
  Registration: undefined;
  Display: {student: StudentData};
};

export type RegistrationProps = NativeStackScreenProps<RootStackParamList, 'Registration'>;
export type DisplayProps = NativeStackScreenProps<RootStackParamList, 'Display'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Display" component={Display} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
