import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import Cart from "./src/screens/Cart";
import Orders from "./src/screens/Orders";
import OrderDetail from "./src/screens/OrderDetail";
import OrderSummary from "./src/screens/OrderSummary";
import { colors } from "./src/theme";

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  animationEnabled: true,
  cardStyle: { backgroundColor: colors.background },
};

export default function App() {
  return (
    <>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={screenOptions}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Orders" component={Orders} />
          <Stack.Screen name="OrderDetail" component={OrderDetail} />
          <Stack.Screen name="OrderSummary" component={OrderSummary} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
