import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "@/constants/colors";

export default function SafeScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className='flex-1'
      style={{
        paddingTop: insets.top,
        backgroundColor: COLORS.cardBackground,
      }}
    >
      {children}
    </View>
  );
}
