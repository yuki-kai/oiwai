import { CelebrationDto } from "../types/celebration";
// import {
//   addDoc,
//   collection,
//   CollectionReference,
//   deleteDoc,
//   doc,
//   DocumentData,
//   FirestoreDataConverter,
//   getDoc,
//   getDocs,
//   orderBy,
//   query,
//   QueryDocumentSnapshot,
//   serverTimestamp,
//   setDoc,
//   SnapshotOptions,
// } from "firebase/firestore";
// import { db } from "@/firebaseConfig";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const celebrationConverter = {
  fromFirestore(snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot): CelebrationDto {
    console.log("===== fromFirestore =====")
    const data = snapshot.data();
    if (!data) {
      throw new Error("Document not found");
    }
    return {
      docId: snapshot.id,
      dayName: data.dayName,
      date: data.date,
      reminds: data.reminds,
      memo: data.memo,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
  toFirestore(celebration: CelebrationDto): FirebaseFirestoreTypes.DocumentData {
    console.log("===== toFirestore =====")
    return {
      dayName: celebration.dayName,
      date: celebration.date,
      reminds: celebration.reminds,
      memo: celebration.memo || "",
      createdAt: celebration.createdAt ? celebration.createdAt : firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(), // TODO: 更新されないがシミュレータだから？
    };
  },
};

export class CelebrationRepository {
  private path: string;
  private collectionRef: FirebaseFirestoreTypes.CollectionReference;

  constructor(userId: string) {
    console.log("CelebrationRepository: " + userId);
    this.path = `users/${userId}/celebrations`;
    this.collectionRef = firestore().collection(this.path)
      // .withConverter(celebrationConverter);
  }

  public async getCelebrationList(): Promise<CelebrationDto[]> {
    const celebrations = await this.collectionRef.get();
    console.log('==========');
    console.log(celebrations.size);
    return celebrations.docs.map((celebration) => {
      return {
        ...celebration.data(),
        docId: celebration.id,
      } as CelebrationDto;
    });
  };

  public async getCelebration(docId: string): Promise<CelebrationDto> {
    const celebration = await this.collectionRef.doc(docId).get();
    return {
      ...celebration.data() as CelebrationDto,
      docId: celebration.id,
    }


    // const docSnap = await getDoc(doc(db, this.path, docId).withConverter(celebrationConverter));
    // const celebration = docSnap.data();
    // if (!celebration) {
    //   throw new Error("Document not found");
    // }
    // return {
    //   docId: docSnap.id,
    //   dayName: celebration.dayName,
    //   date: celebration.date,
    //   reminds: celebration.reminds,
    //   memo: celebration.memo,
    // };
    return {} as CelebrationDto;
  }

  public async createCelebration(celebration: CelebrationDto): Promise<void> {
    console.log("===== createCelebration =====")
    console.log(celebration)
    await this.collectionRef.add({
      dayName: celebration.dayName,
      date: celebration.date,
      reminds: celebration.reminds,
      memo: celebration.memo,
    });
    // await addDoc(this.collectionRef, {
    //   dayName: celebration.dayName,
    //   date: celebration.date,
    //   reminds: celebration.reminds,
    //   memo: celebration.memo,
    // });
    // TODO: エラーハンドリング
  }

  public async editCelebration(celebration: CelebrationDto): Promise<void> {
    console.log("===== editCelebration =====")
    console.log(celebration)
    await this.collectionRef.doc(celebration.docId!).set({
      dayName: celebration.dayName,
      date: celebration.date,
      reminds: celebration.reminds,
      memo: celebration.memo,
    });
    // const docRef = doc(db, this.path, celebration.docId!).withConverter(celebrationConverter);
    // await setDoc(docRef, {
    //   dayName: celebration.dayName,
    //   date: celebration.date,
    //   reminds: celebration.reminds,
    //   memo: celebration.memo,
    // });
    // // TODO: エラーハンドリング
  }

  public async deleteCelebration(docId: string): Promise<void> {
    await this.collectionRef.doc(docId).delete();
    // await deleteDoc(doc(db, this.path, docId));
    // // TODO: エラーハンドリング
  }
}
