import { useContext, useEffect, useState } from "react";
import { CelebrationRepository } from "@/repositories/celebration.repository";
import { CelebrationDto } from "../types/celebration";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "@/utils/authContext";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
// import { scheduleRemindNotification } from "../utils/pushNotification";


export const useCelebration = (currentUser: FirebaseAuthTypes.User | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | undefined>(undefined);
  const [celebration, setCelebration] = useState<CelebrationDto | undefined>(undefined);
  const [celebrationList, setCelebrationList] = useState<CelebrationDto[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    setUser(currentUser);
    console.log("--- useCelebration useEffect ---");
    console.log(user);
  }, [currentUser]);


  const fetchCelebrationList = async (): Promise<CelebrationDto[]> => {
    if (!user) return [];
    // console.log(currentUser?.uid!);
    // const celebrationRepository = new CelebrationRepository(uid);
    const celebrationRepository = new CelebrationRepository(user.uid);
    try {
      setLoading(true);
      const celebrationList = await celebrationRepository.getCelebrationList();
      return celebrationList;
    } catch (error) {
      console.error(error);
      return [];
    }finally {
      setLoading(false);
    }
  };

  const addCelebration = async (celebration: CelebrationDto): Promise<void> => {
    if (!user) return;
    const celebrationRepository = new CelebrationRepository(user.uid);
    try {
      await celebrationRepository.createCelebration(celebration);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    loading,
    celebration,
    celebrationList,
    fetchCelebrationList,
    addCelebration,
  };
};


// const useAddCelebration = () => {
//   const { currentUser } = useContext(AuthContext);
//   const navigation = useNavigation();
//   const addCelebration = (celebration: CelebrationDto) => {
//     console.log("useAddCelebration: " + celebration);
//     const celebrationRepository = new CelebrationRepository(currentUser!.uid!);
//     celebrationRepository.createCelebration(celebration)
//       .then((docRef) => {
//         // scheduleRemindNotification(celebration.date, celebration.reminds);
//         navigation.goBack();
//       })
//       .catch((error) => {
//         console.log("失敗" + error);
//       })
//       .finally(() => {
//         console.log("終了");
//       });
//   };

//   return { addCelebration };
// };

// export default useAddCelebration;

// export const useGetCelebration = async(uid: string): Promise<CelebrationDto[]> => {
//   const celebrationRepository = new CelebrationRepository(uid);
//   return await celebrationRepository.getCelebrationList();
// };
