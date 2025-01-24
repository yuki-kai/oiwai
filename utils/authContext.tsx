import React, { createContext, PropsWithChildren, useEffect, useState } from "react";
// import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
// import { auth } from "@/firebaseConfig";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthContextType } from "@/types/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// const auth = FirebaseAuth();
const AuthContext = createContext<AuthContextType>({ currentUser: undefined });

const AuthProvider = (props: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null | undefined>(undefined);

  useEffect(() => {
    console.log("=== AuthProvider useEffect ===");
    const unsubscribe = auth().onAuthStateChanged(async (authUser: FirebaseAuthTypes.User | null) => {
    // const unsubscribe = onAuthStateChanged(auth, async (authUser: User | null) => {

      // 匿名ユーザの uid を users コレクションのドキュメントとして利用する
      if (authUser) {
        // const userDoc = await getDoc(doc(db, `users/${authUser.uid}`));
        // if (!userDoc.exists()) {
          const currentDate = new Date();
          // FirebaseAuth にアカウントはあるが Firestore にドキュメントがない場合は作成
          // await setDoc(doc(db, `users/${authUser.uid}`), {
          //   createdAt: currentDate,
          //   updatedAt: currentDate,
          // });
        // }
        setCurrentUser(authUser);
      } else {
        // 匿名ログインで onAuthStateChanged 発火
        // await signInAnonymously(auth);
        await auth().signInAnonymously();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
