import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";
import { v4 as uuidv4 } from "uuid";

// Function to fetch documents with filters
export async function getFilteredData(
  collectionName: string,
  field: string,
  operator: any,
  value: any
) {
  const q = query(
    collection(db, collectionName),
    where(field, operator, value)
  );
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc: any) => doc.data());
  return data;
}
export async function getData(collectionName: string) {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc: any) => doc.data());
  return data;
}

// Function to fetch all documents
export async function getAllData(collectionName: string) {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc: any) => doc.data());
  return data;
}

// Function to fetch a specific document
export async function getDocument(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    throw new Error("No such document!");
  }
}

// Function to add user data
export async function addData(collectionName: string, data: any) {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
}
export async function addUser(data: any) {
  await setDoc(doc(db, "users", data.uid), data);
}
export async function addRental(
  rentalUid: string,
  name: string,
  price: string,
  image: string[],
  model: string,
  year: string,
  make: string,
  seats: string,
  description: string,
  fuel: string,
  numberPlate: string
) {
  await setDoc(doc(db, "rentals", rentalUid), {
    name,
    price,
    image,
    model,
    year,
    make,
    seats,
    description,
    fuel,
    uid: rentalUid,
    numberPlate,
    availability: true,
  });
}

// Function to check if a document exists
export async function checkDocumentExists(
  collectionName: string,
  docId: string
) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
}
