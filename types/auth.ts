import { FirebaseAuthTypes }  from '@react-native-firebase/auth';

export type AuthContextType = {
	currentUser: FirebaseAuthTypes.User | null | undefined;
};

export type User = {
  docId: string;
	createdAt: Date;
	updatedAt: Date;
};
