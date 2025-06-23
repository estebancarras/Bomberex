import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as fs from 'fs';

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK-yZF6KkVpTDIHLmnQUnDZUS-1-x8gy8",
  authDomain: "bomberex-70bb0.firebaseapp.com",
  projectId: "bomberex-70bb0",
  storageBucket: "bomberex-70bb0.firebasestorage.app",
  messagingSenderId: "409061707467",
  appId: "1:409061707467:web:441385fd843ed07ee4154e",
  measurementId: "G-Q0Y8NH1CXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Read data from firestoreData.json.json
const data = JSON.parse(fs.readFileSync('firestoreData.json', 'utf-8'));

async function clearCollection(collectionName: string) {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  const deletePromises = snapshot.docs.map(docSnapshot => deleteDoc(doc(db, collectionName, docSnapshot.id)));
  await Promise.all(deletePromises);
  console.log(`Cleared collection: ${collectionName}`);
}

async function uploadData() {
  const collectionName = 'vehiculos';
  await clearCollection(collectionName);
  const collectionRef = collection(db, collectionName);
  for (const item of data) {
    try {
      await addDoc(collectionRef, item);
      console.log(`Added vehicle: ${item.vehiculo}`);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
  console.log('Upload complete.');
}

uploadData();
