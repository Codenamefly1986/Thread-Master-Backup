import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { LogBox, Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prewarm the vector icon font so Android/Expo Go doesn't render blank glyphs
// after cold start. Do not remove.
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { ErrorBoundary } from "@/src/components/error-boundary";
import { queryClient } from "@/src/query-client";
import { ThemeProvider, useTheme, isLightColor } from "@/src/theme";

LogBox.ignoreAllLogs(true);
SplashScreen.preventAutoHideAsync().catch(() => {});

// Trigger font load once (side effect) - native only, method missing on web.
if (Platform.OS !== "web") {
  void MaterialDesignIcons.getImageSource("cog", 24);
}

function ThemedStack() {
  const { colors } = useTheme();
  return (
    <>
      <StatusBar style={isLightColor(colors.bg) ? "dark" : "light"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: "slide_from_right",
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BarlowCondensed: require("../assets/fonts/BarlowCondensed-SemiBold.ttf"),
    "BarlowCondensed-Bold": require("../assets/fonts/BarlowCondensed-Bold.ttf"),
    IBMPlexMono: require("../assets/fonts/IBMPlexMono-Regular.ttf"),
    "IBMPlexMono-Bold": require("../assets/fonts/IBMPlexMono-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <ThemeProvider>
              <ThemedStack />
            </ThemeProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </View>
  );
}
