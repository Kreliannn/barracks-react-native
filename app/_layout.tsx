import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

export default function RootLayout() {
    useEffect(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);      
      NavigationBar.setVisibilityAsync("hidden");
    }, []);
  return (
       <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ title: "index" }} />
              <Stack.Screen name="(drawer)" />
            </Stack>
            <Toast />
       </QueryClientProvider>
  );
}
