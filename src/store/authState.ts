import { atom } from 'recoil';
import firebase from 'firebase';

export const currentUserState = atom<firebase.User | null>({
  key: 'auth/currentUser',
  default: null,
  dangerouslyAllowMutability: true,
});
