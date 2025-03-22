import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { User } from "@/types/auth";

// TODO: withConverter 的なものあれば使用するか自作する

export class AuthRepository {
  private userId: string;
  private path: string;
  private collectionRef: FirebaseFirestoreTypes.CollectionReference;

  constructor(userId: string) {
    console.log("CelebrationRepository: " + userId);
    this.userId = userId;
    this.path = `users`;
    this.collectionRef = firestore().collection(this.path)
  }

  public async getCurrentUser(): Promise<User | undefined> {
    const userDocument = await this.collectionRef.doc(this.userId).get();
    if (!userDocument.exists) {
      return undefined;
    }
    return userDocument.data() as User;
  };

  public async setUser(): Promise<void> {
    const currentDate = new Date();
    await this.collectionRef.doc(this.userId).set({
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  };
};
