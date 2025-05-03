import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import { useLogoutMutation } from "@/redux/appData";
import { TouchableOpacity } from "react-native";
import styles from "@/assets/styles/create.styles";


const Profile = () => {
  const [logout] = useLogoutMutation();

  return (
    <View className=' flex-1 px-10'>
      <View className='flex justify-center items-center flex-1 flex-col gap-5'>
        <Image source={icons.person} tintColor={"#fff"} className='size-10' />
        <Text className='text-gray-500 text-base'>Profile</Text>
        <TouchableOpacity
          style={styles.button}
          className=''
          onPress={() => logout(undefined)}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
