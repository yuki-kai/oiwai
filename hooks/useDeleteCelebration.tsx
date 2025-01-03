import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "@/utils/authContext";
import { CelebrationRepository } from "../repositories/celebration.repository";

const useDeleteCelebration = () => {
  const { currentUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const deleteCelebration = (docId: string) => {
    console.log("useDeleteCelebration: " + docId);
    const celebrationRepository = new CelebrationRepository(currentUser!.uid!);
    celebrationRepository.deleteCelebration(docId)
      .then((docRef) => {
        console.log("成功" + docRef);
        navigation.goBack();
      })
      .catch((error) => {
        console.log("失敗" + error);
      })
      .finally(() => {
        console.log("終了");
      });
  };

  return { deleteCelebration };
};

export default useDeleteCelebration;
