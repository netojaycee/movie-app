import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import styles from "@/assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { bookSchema } from "@/lib/zodSchema";
import { z } from "zod";
import { useAddBookMutation } from "@/redux/appData";

const Add = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: { title: "", caption: "", rating: 3, image: "" },
  });

  const [addBook, { isLoading, isSuccess, isError, error }] =
    useAddBookMutation(); // RTK Mutation

  const image = watch("image");

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "We need access to your gallery!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (result.canceled) return;

      setValue(
        "image",
        result.assets[0].base64 ||
          (await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          }))
      );
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error selecting image");
    }
  };

  const onSubmit = async (data: z.infer<typeof bookSchema>) => {
    try {
      const formattedImage =
        data.image && data.image.startsWith("data:image")
          ? data.image
          : `data:image/png;base64,${data.image}`;

      await addBook({ ...data, image: formattedImage }).unwrap();
    } catch (error) {
      // console.log("Error submitting book:", error);
      // Alert.alert("Error", "Something went wrong.");
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      Alert.alert("Success", "Book recommendation added!");
      reset();
      // Alert("Registration successful!");
    } else if (isError) {
      if ("data" in error && typeof error.data === "object") {
        const errorMessage = (error.data as { message?: string })?.message;
        Alert.alert(errorMessage || "Something went wrong.");
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    }
  }, [isSuccess, isError, error]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your favorite reads with others
            </Text>
          </View>

          <View style={styles.form}>
            {/* Book Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name='book-outline'
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <Controller
                  control={control}
                  name='title'
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder='Enter book title'
                      placeholderTextColor={COLORS.placeholderText}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              {errors.title && (
                <Text style={styles.errorText}>{errors.title.message}</Text>
              )}
            </View>

            {/* Rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setValue("rating", i)}
                    style={styles.starButton}
                  >
                    <Ionicons
                      name={i <= watch("rating") ? "star" : "star-outline"}
                      size={32}
                      color={
                        i <= watch("rating") ? "#f4b400" : COLORS.textSecondary
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Image Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${image}` }}
                    style={styles.previewImage}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name='image-outline'
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to select an image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <Controller
                control={control}
                name='caption'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.textArea}
                    placeholder='Write your review or thoughts about this book...'
                    placeholderTextColor={COLORS.placeholderText}
                    onChangeText={onChange}
                    value={value}
                    multiline
                  />
                )}
              />

              {errors.caption && (
                <Text style={styles.errorText}>{errors.caption.message}</Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size='small' color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name='cloud-upload-outline'
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Add;
