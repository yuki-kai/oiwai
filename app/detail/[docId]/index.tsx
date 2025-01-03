import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AuthContext } from "@/utils/authContext";
import { CelebrationRepository } from "@/repositories/celebration.repository";
import { CelebrationDto } from "@/types/celebration";
import { useLocalSearchParams } from "expo-router";

export default function DetailScreen() {
  // TODO: read数増えるなら props で渡す
  const { currentUser } = useContext(AuthContext);
  const { docId }: { docId: string } = useLocalSearchParams();
  const [celebration, setCelebration] = useState<CelebrationDto | null>(null);

  useEffect(() => {
    if (!currentUser || !docId) return;
    const celebrationRepository = new CelebrationRepository(currentUser.uid);
    celebrationRepository.getCelebration(docId).then((celebration) => {
      setCelebration(celebration);
    });
  }, []);

  return (
    <View style={styles.container}>
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
