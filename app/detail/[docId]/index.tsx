import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { CelebrationDto } from "@/types/celebration";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { IconButton, Menu } from "react-native-paper";
import { CelebrationContext } from "@/utils/CelebrationContext";
import { useCelebration } from "@/hooks/useCelebration";
import { AuthContext } from "@/utils/authContext";

export default function DetailScreen() {
  // TODO: read数増えるなら props で渡す
  const { currentUser } = useContext(AuthContext);
  const { celebrations, setCelebrations, getCelebration } = useContext(CelebrationContext);

  const [celebration, setCelebration] = useState<CelebrationDto | undefined >(undefined);

  const { docId }: { docId: string } = useLocalSearchParams();
  // const [celebration, setCelebration] = useState<CelebrationDto | null>(
  //   Celebration.create({ docId, dayName, date, reminds: JSON.parse(reminds), memo })

  useEffect(() => {
    console.log("=== DetailScreen useEffect ===");
    const celebration = getCelebration(docId);
    console.log(celebration);
    setCelebration(celebration);
  }, [docId, celebrations]);
  // );
  // console.log(date);
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { deleteCelebration } = useCelebration(currentUser);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  // const isFocused = useIsFocused();

  const showAlert = () => {
    Alert.alert("このお祝いを削除しますか？", "この操作は取り消せません", [
      { text: "やめる", style: "cancel" },
      {
        text: "削除する",
        onPress: async () => {
          await deleteCelebration(docId);
          setCelebrations(celebrations.filter(celebration => celebration.docId !== docId));
          router.back();
        },
      },
    ]);
  };

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
                      // dayName: celebration?.dayName,
                      // date: celebration?.date,
                      // reminds: JSON.stringify(celebration?.reminds),
                      // memo: celebration?.memo,
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
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value}>{ docId }</Text>
      </View>
      <View style={styles.textConfirmWrapper}>
        <Text style={styles.label}>お祝いする日</Text>
        <Text style={styles.value}>{ celebration?.dayName }</Text>
      </View>

      <View style={styles.textConfirmWrapper}>
        <Text style={styles.label}>年月日</Text>
        <Text style={styles.value}>{ celebration?.date.toLocaleDateString() }</Text>
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
