// import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '@/utils/authContext';
import { ThemeProvider } from '@/utils/themeContext';
import { themes } from '@/constants/ColorTheme';
import { useTheme } from '@/hooks/useTheme';
import 'react-native-reanimated';
import 'expo-dev-client';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync(); // TODO: これあるとsプラッシュから次に進まない

export default function RootLayout() {
  const { theme } = useTheme();

  return (
    <ThemeProvider initialTheme={themes.default}>
      <AuthProvider>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{
              headerShown: false,
              headerTitle: "ホーム"
            }} />
            <Stack.Screen name="add" options={{
              headerShown: true,
              headerTitle: "追加画面",
              headerTintColor: theme.Text.primary,
              headerStyle: {
                backgroundColor: theme.Backgroud.primary,
              },
            }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </PaperProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
