import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth, db, googleProvider } from "./firebase";

async function saveUserProfile(user, username = "") {
  const { uid, displayName, email, photoURL } = user;
  await setDoc(doc(db, "users", uid), {
    displayName: displayName || "Smart Fridge member",
    email: email || "",
    photoURL: photoURL || "",
    username: username || "",
    lastSignInAt: serverTimestamp(),
  }, { merge: true });
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await saveUserProfile(result.user);
}

export async function registerWithEmail({ name, email, password }) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await saveUserProfile(result.user, name);
}

export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await saveUserProfile(result.user);
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export function signOutUser() {
  return signOut(auth);
}
