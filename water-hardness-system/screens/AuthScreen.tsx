import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { Button, Text, View } from "react-native";
import { AuthContext } from '../context/AuthContext';
import { AuthStackNavProps, AuthStackParamList } from '../types';


const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const Login = ({navigation}: AuthStackNavProps<'Login'>) =>{
    const {login} = useContext(AuthContext)
    return (
    <View>
    <Button title="Login" onPress={()=>{login()}}>Login</Button>
    <Button title="Go To Register" onPress= {()=> {
        navigation.navigate("Register")
    }}>Go to Register</Button>
    </View>
    )
}
const Register = ({navigation}: AuthStackNavProps<'Register'>) =>{
    return <Text>Register Screen</Text>
}
export const AuthScreen: React.FC = () => {
  return <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name = "Login" component={Login}></AuthStack.Screen>
      <AuthStack.Screen name= "Register" component={Register}></AuthStack.Screen>
  </AuthStack.Navigator>;
}
