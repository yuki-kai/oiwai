import { useContext } from "react";
// import { AuthContext } from "@/utils/authContext";
import { CelebrationRepository } from "../repositories/celebration.repository";
import { CelebrationDto } from "../types/celebration";
import { useRouter } from "expo-router";
import { scheduleRemindNotification } from "../utils/pushNotification";

const useEditCelebration = () => {
  const router = useRouter();
  // const { currentUser } = useContext(AuthContext);
  const editCelebration = (celebration: CelebrationDto) => {
    // console.log("useAddCelebration: " + celebration);
    // const celebrationRepository = new CelebrationRepository(currentUser!.uid!);
    // celebrationRepository.editCelebration(celebration)
    //   .then((docRef) => {
    //     console.log("成功" + docRef);
    //     scheduleRemindNotification(celebration.date, celebration.reminds);
    //     router.back();
    //   })
    //   .catch((error) => {
    //     console.log("失敗" + error);
    //   })
    //   .finally(() => {
    //     console.log("終了");
    //   });
  };

  return { editCelebration };
};

export default useEditCelebration;
