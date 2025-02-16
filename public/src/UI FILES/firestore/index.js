import { firebaseApp } from "app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export interface UserProfile {
  role: "producer" | "agency";
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export async function getUserProfile(userId: string) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { profile: docSnap.data() as UserProfile, error: null };
    }
    
    return { profile: null, error: null };
  } catch (error: any) {
    return { profile: null, error: error.message };
  }
}

export async function updateUserProfile(userId: string, data: UserProfile) {
  try {
    await setDoc(doc(db, "users", userId), data, { merge: true });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createUserProfile(userId: string, data: UserProfile) {
  try {
    await setDoc(doc(db, "users", userId), {
      ...data,
      createdAt: new Date(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}
