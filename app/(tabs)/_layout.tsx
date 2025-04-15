import { useTheme } from '@/hooks/useTheme';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.Text.secondary,
        tabBarInactiveTintColor: theme.Text.sub,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'インデックス',
          headerTintColor: theme.Text.primary,
          headerStyle: {
            backgroundColor: theme.Backgroud.primary,
          },
        }}
      />
    </Tabs>
  );
}
