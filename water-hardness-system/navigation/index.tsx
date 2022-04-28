/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, View, Text, Image } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { AuthScreen } from '../screens/AuthScreen';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import SensorView from '../screens/SensorView';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { user } = useContext(AuthContext)
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {user ?
       <RootNavigator />
       :
       <AuthScreen />
      }
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(route) {
  return (
    <Stack.Navigator>

      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
      <Stack.Screen name="Sensor" component={SensorView} />

    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { logout } = useContext(AuthContext)
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Overview',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerLeft: () => (
            <Pressable
              onPress={() => { }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1
              })}>
              <Image style={{
                height: 45,
                width: 50,
                left: 25,
                resizeMode: 'cover',
                marginBottom: 10
              }} source={require("../assets/images/water-logo.png")} />
            </Pressable>
          ),
          // headerRight: () => (
          //   <Pressable
          //     onPress={() => navigation.navigate('Modal')}
          //     style={({ pressed }) => ({
          //       opacity: pressed ? 0.5 : 1,
          //     })}>
          //     {/* <FontAwesome
          //       name="info-circle"
          //       size={25}
          //       color={Colors[colorScheme].text}
          //       style={{ marginRight: 15 }}
          //     /> */}
          //     <Text
          //     style={{
          //       right: 15
          //     }}>Profile</Text>
          //   </Pressable>
          // ),
          headerRight: () => (
            <Pressable
              onPress={() => logout()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              {/* <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              /> */}
              <Text
                style={{
                  right: 15
                }}>Logout</Text>
            </Pressable>
          ),
        })}

      />
      <BottomTab.Screen
        name="Map"
        component={TabTwoScreen}
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerLeft: () => (
            <Pressable
              onPress={() => { }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1
              })}>
              <Image style={{
                height: 45,
                width: 50,
                left: 25,
                resizeMode: 'cover',
                marginBottom: 10
              }} source={require("../assets/images/water-logo.png")} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => logout()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              {/* <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              /> */}
              <Text
                style={{
                  right: 15
                }}>Logout</Text>
            </Pressable>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
