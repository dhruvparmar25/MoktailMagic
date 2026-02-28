import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api/auth";
import Toast from "react-native-toast-message";
import { PrimaryButton } from "../components";
import { colors, gradients, spacing, borderRadius, typography } from "../theme";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) navigation.replace("Home");
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Required",
        text2: "Enter username and password",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await login(username, password);
      if (response.jwt) {
        await AsyncStorage.setItem("token", response.jwt);
        await AsyncStorage.setItem("staffName", response.firstName ?? username.split("@")[0] ?? "Staff");
        navigation.replace("Home");
        Toast.show({
          type: "success",
          text1: "Welcome back",
          text2: response.message ?? "Login successful",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: response.message ?? "Invalid credentials",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message ?? error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.loginBg}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboard}
        >
          <Animated.View entering={FadeIn.duration(400)} style={styles.card}>
            <Text style={styles.logo}>Moktail</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor={colors.textTertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eye}
                hitSlop={12}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <View style={styles.buttonWrap}>
              <PrimaryButton
                label="Sign In"
                onPress={handleLogin}
                loading={loading}
                variant="primary"
                style={styles.button}
              />
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  keyboard: {
    width: "100%",
  },
  card: {
    backgroundColor: colors.glassBg,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
  },
  logo: {
    ...typography.display,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xxs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
    marginTop: spacing.sm,
  },
  input: {
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingRight: spacing.xs,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  eye: {
    padding: spacing.xs,
  },
  buttonWrap: {
    marginTop: spacing.lg,
  },
  button: {
    width: "100%",
  },
});
