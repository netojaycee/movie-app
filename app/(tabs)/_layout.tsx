import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className='flex flex-col w-full flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden'
      >
        <Image source={icon} tintColor={"#151312"} className='size-5' />
        <Text className='text-secondary text-base font-semibold ml-2'>
          {title}
        </Text>
      </ImageBackground>
    );
  }
  return (
    <View className='size-full justify-center items-center mt-4 rounded-full'>
      <Image source={icon} tintColor={"A8B5DB"} className='size-5' />
    </View>
  );
};

const _TabLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        headerTitleStyle: {
          color: COLORS.textPrimary,
          fontWeight: "600",
        },
        headerShadowVisible: false,
        // tabBarShowLabel: false,
        // tabBarItemStyle: {
        //   width: "100%",
        //   height: "100%",
        //   justifyContent: "center",
        //   alignItems: "center",
        // },
        tabBarStyle: {
          backgroundColor: COLORS.cardBackground,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 5,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          // marginHorizontal: 20,
          // borderRadius: 50,
          // marginBottom: 36,
          // position: "absolute",
          // overflow: "hidden",
          // borderWidth: 1,
          // borderColor: "#0f0D23",
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Movies",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='film-outline' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='books'
        options={{
          title: "Books",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='book-outline' size={size} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name='search'
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' size={size} color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name='add'
        options={{
          title: "Add Book",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='add-circle-outline' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='saved'
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='bookmark-outline' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _TabLayout;
