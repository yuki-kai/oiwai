// import { User } from 'firebase/auth';
import { FirebaseAuthTypes }  from '@react-native-firebase/auth';

export type AuthContextType = {
	currentUser: FirebaseAuthTypes.User | null | undefined;
};
