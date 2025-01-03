import React from "react";
import useDeleteCelebration from "@/hooks/useDeleteCelebration";
import { useTheme } from "@/hooks/useTheme";
import { Slot, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { IconButton, Menu } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { deleteCelebration } = useDeleteCelebration();
  const insets = useSafeAreaInsets();
  const { docId }: { docId: string } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const showAlert = () => {
    Alert.alert("このお祝いを削除しますか？", "この操作は取り消せません", [
      { text: "やめる", style: "cancel" },
      {
        text: "削除する",
        onPress: () => deleteCelebration(docId),
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "詳細画面",
          headerTintColor: theme.Text.primary,
          headerStyle: {
            backgroundColor: theme.Backgroud.primary,
          },
          headerRight: () => (
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="dots-horizontal"
                  iconColor="white"
                  size={24}
                  onPress={openMenu}
                />
              }
              style={{
                position: "absolute",
                right: 10,
                top: insets.top + 44,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Menu.Item
                onPress={() => {
                  router.push({
                    pathname: "/edit/[docId]",
                    params: { docId },
                  });
                  closeMenu();
                }}
                title="更新"
              />
              <Menu.Item
                onPress={() => {
                  showAlert();
                  closeMenu();
                }}
                title="削除"
              />
            </Menu>
          ),
        }}
      />
      <Slot />
    </>
  );
}
