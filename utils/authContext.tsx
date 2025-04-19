import { createContext, PropsWithChildren, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthContextType } from "@/types/auth";
import { AuthRepository } from "@/repositories/auth.repository";

const AuthContext = createContext<AuthContextType>({ currentUser: undefined });

const AuthProvider = (props: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (authUser: FirebaseAuthTypes.User | null) => {
      if (authUser) {
        const authRepository = new AuthRepository(authUser.uid)
        // FirebaseAuth にアカウントはあるが Firestore にドキュメントがない場合は作成
        const user = await authRepository.getCurrentUser();
        if (!user) {
          await authRepository.setUser();
        }
        setCurrentUser(authUser);
      } else {
        await auth().signInAnonymously();
      }
    });
    return unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
