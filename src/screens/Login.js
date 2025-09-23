import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { login } from "../api/auth";
import Toast from "react-native-toast-message";
import { FontAwesome6 } from '@expo/vector-icons';


const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  // ----------- Token check for auto-login -----------
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.replace("Home"); // Already logged in
      }
    };
    checkToken();
  }, []);
  // ---------------------------------------------------

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      console.log("Login Response:", response);

      if (response.jwt) {
        await AsyncStorage.setItem("token", response.jwt);
        navigation.replace("Home");
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: response.message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: response.message || "Invalid credentials",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || error.message,
      });
    }
  };

  return (
<SafeAreaView style={styles.container}>
  <StatusBar barStyle="dark-content" backgroundColor="#fff" />

  <Text style={styles.title}>Login</Text>

  <TextInput
    style={styles.input}
    placeholder="Username or Email"
    placeholderTextColor="#555"
    value={username}
    onChangeText={setUsername}
    autoCapitalize="none"
  />

  {/* Password field with eye icon */}
  <View style={styles.passwordContainer}>
    <TextInput
      style={styles.passwordInput}
      placeholder="Password"
      placeholderTextColor="#555"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={!showPassword}
    />
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      <FontAwesome6 name={showPassword ? 'eye' : 'eye-slash'} size={18} style={styles.eyeIcon} />
    </TouchableOpacity>
  </View>

  <TouchableOpacity style={styles.button} onPress={handleLogin}>
    <Text style={styles.buttonText}>Sign In</Text>
  </TouchableOpacity>
</SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  button: {
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 25,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    fontSize: 14,
    color: "#000",
    textDecorationLine: "underline",
  },
  passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  borderWidth: 1,
  borderColor: '#000',
  borderRadius: 8,
  marginBottom: 20,
  paddingRight: 12, // sirf right me thoda space eye icon ke liye
},
passwordInput: {
  flex: 1,
  paddingVertical: 12,
  paddingLeft: 12, // left padding input ke liye
  fontSize: 16,
  color: '#000',
},
eyeIcon: {
  marginLeft: 8,
  color: '#000',
}

});

export default Login;
