import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, writeBatch } from "firebase/firestore";
import { db, firebaseConfigured } from "./firebase";

const itemsCollection = (userId) => collection(db, "users", userId, "items");

function ensureDatabase() {
  if (!firebaseConfigured || !db) throw new Error("Firebase is not configured. Add your VITE_FIREBASE values to .env.");
}

export function subscribeToItems(userId, onItems, onError) {
  ensureDatabase();
  return onSnapshot(query(itemsCollection(userId), orderBy("addedAt", "desc")), (snapshot) => {
    onItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  }, onError);
}

export async function saveItem(userId, item) {
  ensureDatabase();
  await addDoc(itemsCollection(userId), { ...item, addedAt: serverTimestamp() });
}

export async function clearItems(userId, items) {
  ensureDatabase();
  const batch = writeBatch(db);
  items.forEach((item) => batch.delete(doc(db, "users", userId, "items", item.id)));
  await batch.commit();
}

export async function removeItem(userId, id) {
  ensureDatabase();
  await deleteDoc(doc(db, "users", userId, "items", id));
}
