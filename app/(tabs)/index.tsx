import { useRouter } from "expo-router";
import React,{ useContext, useEffect, useState } from "react";
import { Button, FlatList, Pressable, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "@/utils/authContext";
import { BottomSheetModalContext } from "@/utils/BottomSheetModalContext";
import AddButton from "@/components/AddButton";
import { CelebrationDto } from "@/types/celebration";
import { useCelebration } from "@/hooks/useCelebration";
import AddScreen from "@/components/AddScreen";
import { CelebrationContext } from "@/utils/CelebrationContext";
import { countDownCelebrateDay } from "@/utils/dateFormat";
import { themes } from '@/constants/ColorTheme';

// import { db } from "@/firebaseConfig";
// import { useRouter } from "expo-router";

export default function TabIndexScreen() {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const { fetchCelebrationList } = useCelebration(currentUser);
  // const  bottomSheetContext  = useContext(BottomSheetModalContext);
  const { celebrations, setCelebrations } = useContext(CelebrationContext);
  const { toggleBottomSheetModal } = useContext(BottomSheetModalContext);
  // const { fetchCelebrationList } = useCelebration(currentUser?.uid);
  const [celebrationList, setCelebrationList] = useState<CelebrationDto[]>([]);

  useEffect(() => {
    console.log("=== index useEffect ===");
    console.log(celebrations);
    setCelebrationList(celebrations);
  }, [celebrations]);

  const handleAddCelebration = async (): Promise<void> => {
    toggleBottomSheetModal(
      <AddScreen onAddCelebration={handleCelebrationAdded} />
    );
  };

  const handleCelebrationAdded = async (newCelebration: CelebrationDto) => {
    console.log("=== handleCelebrationAdded ===");
    console.log(newCelebration);
    const celebrationList = await fetchCelebrationList();
    console.log(celebrationList);
    setCelebrations(celebrationList);
    setCelebrationList(celebrationList); // これ不要では？ => 多分レンダリング無限ループ避けるため
  };

  const CelebrationCard = ({ celebration }: { celebration: CelebrationDto }) => {
    return (
      <TouchableOpacity
        style={styles.celebrationCard}
        onPress={() => router.push(`/detail/${celebration.docId}`)}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.celebrationDate}>{ celebration.date.toLocaleDateString() }</Text>
            <Text style={styles.celebrationTitle}>{ celebration.dayName }</Text>
          </View>
          <Text>{ countDownCelebrateDay(celebration.date) }</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={celebrationList.reduce((acc, celebration) => {
          const yearMonth = celebration.date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
          const existingSection = acc.find(section => section.title === yearMonth);
          if (existingSection) {
            existingSection.data.push(celebration);
          } else {
            acc.push({
              title: yearMonth,
              data: [celebration]
            });
          }
          return acc;
        }, [] as { title: string; data: CelebrationDto[] }[])}
        renderItem={({ item }: { item: CelebrationDto }) => (
          <CelebrationCard celebration={item} />
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.listEmptyCard}>表示するお祝いがありません。</Text>
            <Text style={styles.listEmptyCard}>記念日を追加してみましょう！</Text>
          </View>
        )}
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
  sectionHeader: {
    backgroundColor: themes.default.Text.secondary,
    fontWeight: "bold",
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
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
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
  emptyContainer: {
    paddingVertical: '50%',
  },
	listEmptyCard: {
		textAlign: "center",
		fontSize: 16,
		lineHeight: 32,
	},
});
