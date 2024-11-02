import { icons } from '@/constants';
import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

const TabIcon = ({
  source,
  focused,
  title,
}: {
  source: ImageSourcePropType;
  focused: boolean;
  title: string;
}) => (
  <View
    className={`h-16 flex flex-row justify-center items-center ${focused ? "" : ""}`}
  >
    <View
      className={`w-16 h-full flex flex-col items-center justify-center ${focused ? "border-t-4 border-t-[#e23744]" : ""}`}
    >
      <Image
        source={source}
        tintColor={`${focused ? "#e23744" : "black"}`}
        resizeMode="contain"
        className="w-6 h-6 border border-black"
      />
      <Text className={`text-xs mt-1 ${focused ? "font-bold" : ""}`}>{title}</Text>
    </View>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          paddingBottom: 0, // ios only
          overflow: "hidden",
          height: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        },
      }}
    >
      <Tabs.Screen name="delivery" options={{
        title: "Home",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon source={icons.delivery} focused={focused} title="Delivery" />
        ),
      }} />
      <Tabs.Screen name="dine-in" options={{
        title: "Dine in",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon source={icons.dineIn} focused={focused} title="Dine in" />
        ),
      }} />
      <Tabs.Screen name="live" options={{
        title: "Live",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon source={icons.live} focused={focused} title="LIve" />
        ),
      }} />
    </Tabs>
  );
}
