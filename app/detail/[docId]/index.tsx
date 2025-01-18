import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
// import { AuthContext } from "@/utils/authContext";
import { CelebrationRepository } from "@/repositories/celebration.repository";
import { CelebrationDto } from "@/types/celebration";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import useDeleteCelebration from "@/hooks/useDeleteCelebration";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { IconButton, Menu } from "react-native-paper";
import { Celebration } from "@/models/Celebration";
import { useIsFocused } from "@react-navigation/native";

export default function DetailScreen() {
  // TODO: read数増えるなら props で渡す
  // const { currentUser } = useContext(AuthContext);
  const {
      docId,
      dayName,
      date,
      reminds,
      memo,
    }: {
      docId: string,
      dayName: string,
      date: string,
      reminds: string,
      memo?: string,
    } = useLocalSearchParams();
  const [celebration, setCelebration] = useState<CelebrationDto>(
    Celebration.create({ docId, dayName, date, reminds: JSON.parse(reminds), memo })
  );
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { deleteCelebration } = useDeleteCelebration();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  const isFocused = useIsFocused();

  const showAlert = () => {
    Alert.alert("このお祝いを削除しますか？", "この操作は取り消せません", [
      { text: "やめる", style: "cancel" },
      {
        text: "削除する",
        onPress: () => deleteCelebration(docId),
      },
    ]);
  };

  // useEffect(() => {
  //   console.log("=== DetailScreen useEffect ===");
  //   if (!currentUser || !docId) return;
  //   const celebrationRepository = new CelebrationRepository(currentUser.uid);
  //   celebrationRepository.getCelebration(docId).then((celebration) => {
  //     setCelebration(celebration);
  //   });
  // }, [isFocused]);

  return (
    <View style={styles.container}>
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
                    params: {
                      docId,
                      dayName: celebration?.dayName,
                      date: celebration?.date,
                      reminds: JSON.stringify(celebration?.reminds),
                      memo: celebration?.memo,
                    },
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
      <View style={styles.textConfirmWrapper}>
        <Text style={styles.label}>お祝いする日</Text>
        <Text style={styles.value}>{ celebration?.dayName }</Text>
      </View>

      <View style={styles.textConfirmWrapper}>
        <Text style={styles.label}>年月日</Text>
        <Text style={styles.value}>{ celebration?.date }</Text>
      </View>

      <View style={styles.remindsConfirmWrapper}>
        <Text style={styles.label}>リマインド</Text>
        <View style={styles.remindsWrapper}>
        {celebration?.reminds.filter(field => field.isChecked).map((remind, index) => (
          <View key={index} style={styles.remindBadge}>
            <Text>{remind.label}</Text>
          </View>
        ))}
        </View>
      </View>

      <View style={styles.textConfirmWrapper}>
        <Text style={styles.label}>メモ</Text>
        <Text style={styles.value}>{ celebration?.memo || "" }</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textConfirmWrapper: {
		backgroundColor: "#f8f8fa",
		paddingVertical: 8,
		paddingHorizontal: 20,
	},
	label: {
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
		backgroundColor: "#fff",
    borderColor: '#969696',
		paddingVertical: 12,
		paddingHorizontal: 8,
		textAlign: "left",
  },
  remindsConfirmWrapper: {
    backgroundColor: "#f8f8fa",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  remindsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  remindBadge: {
    backgroundColor: "#c9a333",
    marginBottom: 6,
    marginRight: 6,
    width: 60,
    height: 30,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
