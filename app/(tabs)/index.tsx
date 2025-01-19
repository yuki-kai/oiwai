import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { AuthContext } from "@/utils/authContext";
import AddButton from "@/components/AddButton";
import { CelebrationRepository } from "@/repositories/celebration.repository";
import { CelebrationDto } from "@/types/celebration";
import { useIsFocused } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
// import { useRouter } from "expo-router";

export default function TabIndexScreen() {
  // const { currentUser } = useContext(AuthContext);
  const [test, setTest] = useState<string>("なし");
  const [celebrations, setCelebrations] = useState<CelebrationDto[]>([]);
  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    // awaitでforestoreからデータを取得する
    (async() => {
      const docSnap = await getDoc(doc(db, "tests/test"));
      setTest(docSnap!.data()!.test ?? "hoge");
    })();


    // if (!currentUser) return;
    // const celebrationRepository = new CelebrationRepository(currentUser.uid);
    // celebrationRepository.getCelebrationList().then((celebrationList) => {
    //   setCelebrations(celebrationList);
    // });
  }, []);

  const handleAddCelebration = (): void => {
    router.push("/add");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.celebrationDate}>{ test }</Text>
      <FlatList
        data={celebrations}
        renderItem={({ item }: { item: CelebrationDto }) => (
          <TouchableOpacity
            style={styles.celebrationCard}
            onPress={() => router.push({
              pathname: "/detail/[docId]",
              params: {
                docId: item.docId!,
                dayName: item.dayName,
                date: item.date,
                reminds: JSON.stringify(item.reminds),
                memo: item.memo,
              }
            })}
          >
            <View>
              <Text style={styles.celebrationTitle}>{ item.dayName }</Text>
              <Text style={styles.celebrationDate}>{ item.date }</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View>
            <Text style={styles.listEmptyCard}>表示するお祝いがありません。</Text>
            <Text style={styles.listEmptyCard}>記念日を追加してみましょう！</Text>
          </View>
        }
      />
      <AddButton
        label="記念日を追加"
        handleButtonPress={handleAddCelebration}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  celebrationCard: {
    backgroundColor: "#ffffff",
		flexDirection: "row",
    justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 19,
    alignItems: "center",
		borderBottomWidth: 1,
		borderColor: "rgba(0,0,0,0.15)",
  },
	celebrationTitle: {
		fontSize: 16,
		lineHeight: 32,
	},
	celebrationDate: {
		fontSize: 12,
		lineHeight: 16,
		color: "#848484",
	},
	listEmptyCard: {
		textAlign: "center",
		fontSize: 16,
		lineHeight: 32,
	},
});
