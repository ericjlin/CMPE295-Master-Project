import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { Button, Text, TouchableOpacity, View,StyleSheet, Image} from "react-native";
import { AuthContext } from '../context/AuthContext';
import { AuthStackNavProps, AuthStackParamList } from '../types';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const Login = ({navigation}: AuthStackNavProps<'Login'>) =>{
    const {login,register} = useContext(AuthContext)
    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    return (
    <View style = {styles.container}>
    <Image style = {styles.logo} source={require("../assets/images/water-logo.png")} />
    <Text style={styles.logoName}>Water Hardness Quality</Text>
    <View style={styles.formContainer}>
    <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
            <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
      </View>
        <FormButton
        buttonTitle="Sign In"
        backgroundColor="#2e64e5"
        onPress={() => login(email, password)}
      />
    <FormButton buttonTitle="Sign Up" backgroundColor="#28a745"  onPress= {()=> {
        navigation.navigate("Register")
    }}/>
    </View>
    )
}

const Register = ({navigation}: AuthStackNavProps<'Register'>) =>{
    const {login,register} = useContext(AuthContext)

    const [firstName, setfName] = useState("");
    const [lastName, setlName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    return(
    <View style={styles.container}>
    <Text style={styles.signUpHeader}>Enter Account Information</Text>
   <View style={styles.formContainer}>
    <FormInput
    labelValue={firstName}
    onChangeText={(firstName) => setfName(firstName)}
    placeholderText="First Name"
    iconType="user"
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
  />
  <FormInput
    labelValue={lastName}
    onChangeText={(lastName) => setlName(lastName)}
    placeholderText="Last Name"
    iconType="user"
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
  />
   <FormInput
    labelValue={email}
    onChangeText={(userEmail) => setEmail(userEmail)}
    placeholderText="Email"
    iconType="user"
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
  />
    <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
       <FormInput
        labelValue={passwordCheck}
        onChangeText={(userPassword) => setPasswordCheck(userPassword)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />
      </View>
        <FormButton
        buttonTitle="Register"
        backgroundColor="#28a745"
        onPress={() => 
          register(firstName,lastName,email,password).then((response)=>{
              console.log(response.data)
              if(response.data.status=="SUCCESSED")
                navigation.goBack()
          }).catch((e)=>{
            console.log(e)
          })
        
        }
      />
  </View>
    )
}
export const AuthScreen: React.FC = () => {
  return <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name = "Login" component={Login}></AuthStack.Screen>
      <AuthStack.Screen name= "Register" component={Register}></AuthStack.Screen>
  </AuthStack.Navigator>;
}
 const styles = StyleSheet.create({
        container: {
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          paddingTop: 50,
        },
        logo: {
            height: 150,
            width: 150,
            resizeMode: 'cover',
            marginBottom: 30 
          },
          logoName: {
              fontSize: 24,
              color: "blue",
              fontWeight: "bold",
              marginBottom: 50
          },
          formContainer:
          {
              marginBottom:25
          },
          signUpHeader:{
              fontSize:20,
              marginBottom:35,
              fontWeight: "bold",

          }
 })