import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import COLORS from "@/constants/colors";
import styles from "@/assets/styles/login.styles";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useLoginMutation } from "@/redux/appData";
import { loginSchema } from "@/lib/zodSchema";

export default function Index() {
  const router = useRouter();
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values).unwrap();
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Alert("Registration successful!");
      router.push("/(tabs)");
    } else if (isError) {
      if ("data" in error && typeof error.data === "object") {
        const errorMessage = (error.data as { message?: string })?.message;
        Alert.alert(errorMessage || "Login failed.");
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
        <View style={styles.topIllustration}>
          <Image
            source={require("@/assets/images/login.png")}
            style={styles.illustrationImage}
            resizeMode='contain'
          />
        </View>

        <View style={styles.card}>
          <View style={styles.formContainer}>
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
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      autoCapitalize='none'
                    />
                  )}
                />
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.button}
              disabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            >
              {isLoading ? (
                <ActivityIndicator size='small' color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link asChild href='/(auth)/register'>
                <TouchableOpacity>
                  <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
