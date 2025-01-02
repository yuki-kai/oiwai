import { CelebrationDto } from "../types/celebration";
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  SnapshotOptions,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

const celebrationConverter: FirestoreDataConverter<CelebrationDto> = {
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): CelebrationDto {
    const data = snapshot.data(options);
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
  toFirestore(celebration: CelebrationDto): DocumentData {
    return {
      dayName: celebration.dayName,
      date: celebration.date,
      reminds: celebration.reminds,
      memo: celebration.memo || "",
      createdAt: celebration.createdAt ? celebration.createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(), // TODO: 更新されないがシミュレータだから？
    };
  },
};

export class CelebrationRepository {
  private path: string;
  private collectionRef: CollectionReference;

  constructor(userId: string) {
    console.log("CelebrationRepository: " + userId);
    this.path = `users/${userId}/celebrations`;
    this.collectionRef = collection(db, this.path).withConverter(
      celebrationConverter,
    );
  }

  public async getCelebrationList(): Promise<CelebrationDto[]> {
    // TODO: dateが文字列なのでソートがうまくいかない。Timestampで保存した方が良いかも
    const snapshot = await getDocs(query(this.collectionRef, orderBy("date")));
    return snapshot.docs.map((doc) => {
      const celebration = doc.data();
      return {
        docId: doc.id,
        dayName: celebration.dayName,
        date: celebration.date,
        reminds: celebration.reminds,
      };
    });
  }

  public async getCelebration(docId: string): Promise<CelebrationDto> {
    const docSnap = await getDoc(doc(db, this.path, docId).withConverter(celebrationConverter));
    const celebration = docSnap.data();
    if (!celebration) {
      throw new Error("Document not found");
    }
    return {
      docId: docSnap.id,
      dayName: celebration.dayName,
      date: celebration.date,
      reminds: celebration.reminds,
      memo: celebration.memo,
    };
  }

  public async createCelebration(celebration: CelebrationDto): Promise<void> {
    await addDoc(this.collectionRef, {
      dayName: celebration.dayName,
      date: celebration.date,
      reminds: celebration.reminds,
      memo: celebration.memo,
    });
    // TODO: エラーハンドリング
  }

  public async editCelebration(celebration: CelebrationDto): Promise<void> {
    const docRef = doc(db, this.path, celebration.docId!).withConverter(celebrationConverter);
    await setDoc(docRef, {
      dayName: celebration.dayName,
      date: celebration.date,
      reminds: celebration.reminds,
      memo: celebration.memo,
    });
    // TODO: エラーハンドリング
  }

  public async deleteCelebration(docId: string): Promise<void> {
    await deleteDoc(doc(db, this.path, docId));
    // TODO: エラーハンドリング
  }
}
