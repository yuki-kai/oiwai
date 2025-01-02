import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "@/utils/authContext";
import { CelebrationRepository } from "@/repositories/celebration.repository";
import { CelebrationDto } from "../types/celebration";

const useAddCelebration = () => {
  const { currentUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const addCelebration = (celebration: CelebrationDto) => {
    console.log("useAddCelebration: " + celebration);
    const celebrationRepository = new CelebrationRepository(currentUser!.uid!);
    celebrationRepository.createCelebration(celebration)
      .then((docRef) => {
        navigation.goBack();
      })
      .catch((error) => {
        console.log("失敗" + error);
      })
      .finally(() => {
        console.log("終了");
      });
  };

  return { addCelebration };
};

export default useAddCelebration;
