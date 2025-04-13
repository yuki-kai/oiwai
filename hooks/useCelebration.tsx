import { useContext, useEffect, useState } from "react";
import { CelebrationRepository } from "@/repositories/celebration.repository";
import { CelebrationDto } from "../types/celebration";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "@/utils/authContext";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { scheduleRemindNotification } from "../utils/pushNotification";


export const useCelebration = (currentUser: FirebaseAuthTypes.User | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | undefined>(undefined);
  const [celebration, setCelebration] = useState<CelebrationDto | undefined>(undefined);
  const [celebrationList, setCelebrationList] = useState<CelebrationDto[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    setUser(currentUser);
    console.log("--- useCelebration useEffect ---");
    // console.log(user);
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

  const fetchCelebration = async (docId: string): Promise<CelebrationDto | undefined> => {
    if (!user) return;
    // console.log(currentUser?.uid!);
    // const celebrationRepository = new CelebrationRepository(uid);
    const celebrationRepository = new CelebrationRepository(user.uid);
    try {
      setLoading(true);
      const celebration = await celebrationRepository.getCelebration(docId);
      return celebration;
    } catch (error) {
      console.error(error);
      return undefined;
    }finally {
      setLoading(false);
    }
  };

  const addCelebration = async (celebration: CelebrationDto): Promise<void> => {
    if (!user) return;
    const celebrationRepository = new CelebrationRepository(user.uid);
    try {
      // プッシュ通知をスケジュールする
      // TODO: プッシュ通知の識別子を保存してcancelScheduledNotificationAsyncで削除できるようにする
      await scheduleRemindNotification(celebration);
      await celebrationRepository.createCelebration(celebration);
    } catch (error) {
      console.error(error);
    }
  };

  const editCelebration = async (celebration: CelebrationDto): Promise<void> => {
    if (!user) return;
    const celebrationRepository = new CelebrationRepository(user.uid);
    try {
      // プッシュ通知をリスケジュールする
      await scheduleRemindNotification(celebration);
      await celebrationRepository.editCelebration(celebration);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCelebration = async (docId: string): Promise<void> => {
    if (!user) return;
    const celebrationRepository = new CelebrationRepository(user.uid);
    try {
      await celebrationRepository.deleteCelebration(docId);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    loading,
    celebration,
    celebrationList,
    fetchCelebrationList,
    fetchCelebration,
    addCelebration,
    editCelebration,
    deleteCelebration,
  };
};
