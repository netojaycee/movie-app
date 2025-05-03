import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
// import { useRegisterMutation } from "@/redux/appData";
import { Link, useRouter } from "expo-router";
import styles from "@/assets/styles/signup.style";
import COLORS from "@/constants/colors";
import { registerSchema } from "@/lib/zodSchema";
import { useSelector } from "react-redux";
import { useRegisterMutation } from "@/redux/appData";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();

  

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      await register(values).unwrap();
    } catch (error) {
      // Alert.alert("Error", error?.data?.message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Alert("Registration successful!");
      router.push("/(auth)");
    } else if (isError) {
      if ("data" in error && typeof error.data === "object") {
        const errorMessage = (error.data as { message?: string })?.message;
        Alert.alert(errorMessage || "Registration failed.");
      } else {
        Alert.alert("An unexpected error occurred.");
      }
    }
  }, [isSuccess, isError, error, router]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>StoryVerse✨</Text>
            <Text style={styles.subtitle}>
              Your One-Stop Shop for Procrastination.
            </Text>
          </View>
          <View style={styles.formContainer}>
            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name='person-outline'
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <Controller
                  control={control}
                  name='username'
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder='johnDoe'
                      autoCapitalize='none'
                      value={value}
                      onChangeText={onChange}
                      keyboardType='email-address'
                    />
                  )}
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name='mail-outline'
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <Controller
                  control={control}
                  name='email'
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder='Enter your email'
                      value={value}
                      onChangeText={onChange}
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  )}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name='lock-closed-outline'
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />

                <Controller
                  control={control}
                  name='password'
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder='Enter your password'
                      secureTextEntry={!showPassword}
                      autoCapitalize='none'
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name='lock-closed-outline'
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <Controller
                  control={control}
                  name='confirmPassword'
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder='Confirm your password'
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize='none'
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />

                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.button}
              disabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            >
              {isLoading ? (
                <ActivityIndicator size='small' color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Link asChild href={"/(auth)/login"}>
                <TouchableOpacity>
                  <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
