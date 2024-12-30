import { db } from "@/firebaseConfig";
import { Link } from "expo-router";
import { collection, getDocs, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "@/utils/authContext";

export default function TabIndexScreen() {
  const { currentUser } = useContext(AuthContext);
  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    const collectionRef = collection(db, "users");
    getDocs(query(collectionRef)).then((docs) => {
      setTests(docs.docs.map((doc) => doc.data()));
    })
  }, []);

  return (
    <View>
      <Link href='/details/hoge'>detail</Link>
      <Text>{ currentUser?.uid ?? "ユーザ情報なし" }</Text>
      <FlatList
        data={tests}
        renderItem={({ item }: { item: any }) => (
          CelebrationCard({ celebration: item })
        )}
        ListEmptyComponent={ ListEmptyCard }
      />
    </View>
  );
}

function CelebrationCard({ celebration }: { celebration: any }) {
  return (
    <TouchableOpacity
			style={styles.celebrationCard}
			onPress={() => {}}
		>
			<View>
      	<Text style={styles.celebrationTitle}>{ celebration.createdAt.toString() }</Text>
			</View>
    </TouchableOpacity>
  );
}

function ListEmptyCard() {
  return (
		<View>
			<Text style={styles.listEmptyCard}>表示するお祝いがありません。</Text>
			<Text style={styles.listEmptyCard}>記念日を追加してみましょう！</Text>
		</View>
  );
}

const styles = StyleSheet.create({
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
