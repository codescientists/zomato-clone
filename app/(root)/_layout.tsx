import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, statusBarStyle: "dark" }} />
      <Stack.Screen name="restaurants/[restaurantId]" options={{ headerShown: false, statusBarStyle: "dark" }} />
      <Stack.Screen name="profile" options={{ headerShown: false, statusBarStyle: "dark" }} />
    </Stack>
  );
};

export default Layout;