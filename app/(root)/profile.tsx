import { useState, useEffect } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { AntDesign, Feather } from "@expo/vector-icons";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    if (isLoaded && user) {
      setForm({
        name: user?.fullName || "",
        email: user?.emailAddresses[0]?.emailAddress || "",
      });
    }
  }, [isLoaded, user]);

  const onUpdatePress = async () => {
    try {
      await fetchAPI("/(api)/user", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          clerkId: user?.id,
        }),
      });

      setShowSuccessModal(true);
    } catch (err: any) {
      Alert.alert("Error", "Unable to update profile. Please try again.");
      console.error("Error updating profile: ", err);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <ScrollView className="flex-1 bg-white p-5">
      <View className="flex flex-row items-center justify-between mb-6 w-full">
        <Link href={`/(root)/(tabs)/delivery`} asChild>
          <Pressable>
              <View className="flex flex-row items-center space-x-2">
                  <AntDesign name="left" size={20} color="black" />
                  <Text>Go Back</Text>
              </View>
          </Pressable>
        </Link>
        <View className="flex flex-row items-center space-x-2">
        </View>
      </View>

      <View className="flex-1 bg-white shadow-sm shadow-gray-400 border border-gray-300 rounded-xl overflow-hidden">
        <View className="flex flex-row items-center gap-4 px-2 py-4">
          <View
            className="flex justify-center items-center w-16 h-16 rounded-full bg-blue-100"
          >
            <Text className="text-blue-600 text-2xl font-semibold leading-none w-fit h-fit">
              P
            </Text>
          </View>
          <View>
            <Text className="text-2xl text-black font-bold">
              {form.name}
            </Text>
            <Text className="text-md text-black">
              {form.email}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center bg-white rounded-lg">
          
          <CustomButton
            title="Join Zomato Gold"
            className="mt-2 bg-black !text-yellow-300 rounded-none w-full"
          />
          {/* <Text className="text-2xl text-black font-JakartaSemiBold">
            Your Profile
          </Text> */}
          {/* <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value: any) => setForm({ ...form, name: value })}
            />
            <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value: any) => setForm({ ...form, email: value })}
            />
            <CustomButton
            title="Update Profile"
            onPress={onUpdatePress}
            className="mt-6"
          /> */}
          
        </View>
      </View>
        
        {/* <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
            source={images.check}
            className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
            Profile Updated
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
            Your profile has been updated successfully.
            </Text>
            <CustomButton
            title="Go Home"
              onPress={() => router.push(`/(root)/(tabs)/delivery`)}
              className="mt-5"
              />
          </View>
          </ReactNativeModal> */}

      <View className="bg-white h-12 flex-row items-center justify-center border border-gray-300 rounded-xl mt-5">
        <Link href={`/(root)/myorders`} className="flex flex-row items-center justify-center">
          <Text className="text-base font-semibold flex-row items-center">My Orders <Feather name="arrow-right-circle" size={20} className="text-[#e23744]" color="#e23744" /></Text>
        </Link>
      </View>

      <View>
        <CustomButton
          title="Sign Out"
          onPress={handleSignOut}
          className="mt-5 bg-[#e23744] rounded-xl"
        />
      </View>
    </ScrollView>
  );
};

export default Profile;
